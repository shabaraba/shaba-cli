import { Command } from 'commander';
import { execFileSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import chalk from 'chalk';

interface RepoInfo {
  owner: string;
  repo: string;
}

interface RepoInitOptions {
  version: string;
  branchProtection: boolean;
}

export const repoInit = new Command('repo-init')
  .description('Initialize repository with release-please and branch protection')
  .option('-v, --version <version>', 'Initial version', '0.1.0')
  .option('--no-branch-protection', 'Skip branch protection setup')
  .action(async (options: RepoInitOptions) => {
    try {
      const repoInfo = getRepoInfo();
      console.log(chalk.blue(`\nSetting up repository: ${repoInfo.owner}/${repoInfo.repo}\n`));

      createReleasePleaseWorkflow();
      createReleasePleaseConfig();
      createReleasePleaseManifest(options.version);

      // Always set these repository settings
      setupAutoDeleteBranch(repoInfo);
      setupActionsPermissions(repoInfo);

      if (options.branchProtection) {
        setupBranchProtection(repoInfo);
      }

      console.log(chalk.green('\n✓ Repository setup complete!\n'));
      console.log(chalk.yellow('Next steps:'));
      console.log('  1. Commit and push the created files');
      console.log('  2. Merge to main branch via PR');
      console.log('  3. release-please will create a release PR automatically\n');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Error: ${message}`));
      process.exit(1);
    }
  });

function getRepoInfo(): RepoInfo {
  const remoteUrl = execFileSync('git', ['remote', 'get-url', 'origin'], {
    encoding: 'utf-8'
  }).trim();

  const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
  if (!match) {
    throw new Error('Could not parse GitHub repository from git remote');
  }
  return { owner: match[1], repo: match[2] };
}

function createReleasePleaseWorkflow(): void {
  const workflowDir = '.github/workflows';
  const workflowPath = `${workflowDir}/release-please.yml`;

  if (!existsSync(workflowDir)) {
    mkdirSync(workflowDir, { recursive: true });
  }

  const content = `name: Release Please

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
`;

  writeFileSync(workflowPath, content);
  console.log(chalk.green(`✓ Created ${workflowPath}`));
}

function createReleasePleaseConfig(): void {
  const content = {
    "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
    "packages": {
      ".": {
        "release-type": "node",
        "bump-minor-pre-major": true,
        "bump-patch-for-minor-pre-major": true,
        "include-component-in-tag": false,
        "changelog-sections": [
          { "type": "feat", "section": "Features" },
          { "type": "fix", "section": "Bug Fixes" },
          { "type": "perf", "section": "Performance Improvements" },
          { "type": "refactor", "section": "Code Refactoring" },
          { "type": "docs", "section": "Documentation" },
          { "type": "chore", "section": "Miscellaneous" }
        ]
      }
    }
  };

  writeFileSync('release-please-config.json', JSON.stringify(content, null, 2) + '\n');
  console.log(chalk.green('✓ Created release-please-config.json'));
}

function createReleasePleaseManifest(version: string): void {
  const content = { ".": version };
  writeFileSync('.release-please-manifest.json', JSON.stringify(content, null, 2) + '\n');
  console.log(chalk.green(`✓ Created .release-please-manifest.json (v${version})`));
}

function setupBranchProtection(repoInfo: RepoInfo): void {
  const { owner, repo } = repoInfo;
  console.log(chalk.blue('Setting up branch protection...'));

  const payload = JSON.stringify({
    required_pull_request_reviews: {
      dismiss_stale_reviews: false,
      require_code_owner_reviews: false,
      required_approving_review_count: 0
    },
    enforce_admins: false,
    required_status_checks: null,
    restrictions: null,
    allow_force_pushes: false,
    allow_deletions: false
  });

  execFileSync('gh', [
    'api',
    `repos/${owner}/${repo}/branches/main/protection`,
    '--method', 'PUT',
    '--input', '-'
  ], { input: payload, stdio: ['pipe', 'pipe', 'pipe'] });

  console.log(chalk.green('✓ Branch protection enabled (PR-only merges)'));
}

function setupAutoDeleteBranch(repoInfo: RepoInfo): void {
  const { owner, repo } = repoInfo;

  execFileSync('gh', [
    'api',
    `repos/${owner}/${repo}`,
    '--method', 'PATCH',
    '--field', 'delete_branch_on_merge=true'
  ], { stdio: ['pipe', 'pipe', 'pipe'] });

  console.log(chalk.green('✓ Auto-delete merged branches enabled'));
}

function setupActionsPermissions(repoInfo: RepoInfo): void {
  const { owner, repo } = repoInfo;

  execFileSync('gh', [
    'api',
    `repos/${owner}/${repo}/actions/permissions/workflow`,
    '--method', 'PUT',
    '--field', 'default_workflow_permissions=write',
    '--field', 'can_approve_pull_request_reviews=true'
  ], { stdio: ['pipe', 'pipe', 'pipe'] });

  console.log(chalk.green('✓ GitHub Actions PR permissions enabled'));
}
