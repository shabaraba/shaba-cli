# shaba-cli

Personal CLI toolkit by shabaraba.

## Installation

```bash
npm install -g @shabaraba/shaba-cli
```

Or run directly with npx:

```bash
npx @shabaraba/shaba-cli <command>
```

## Setup

### Required GitHub Secret

For automated Homebrew tap updates, create a Personal Access Token (PAT) and add it to repository secrets:

1. Go to https://github.com/settings/tokens/new
2. Generate token with scope: `repo` (Full control of private repositories)
3. Copy the token
4. Go to https://github.com/shabaraba/shaba-cli/settings/secrets/actions
5. Click "New repository secret"
6. Name: `TAP_UPDATE_TOKEN`
7. Value: (paste your token)

## Commands

### `shaba-cli gh repo-init`

Initialize a GitHub repository with release-please automation and branch protection.

```bash
shaba-cli gh repo-init [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-v, --version <version>` | Initial version | `0.1.0` |
| `--no-branch-protection` | Skip branch protection setup | - |

**What it does:**

1. Creates `.github/workflows/release-please.yml` - Automates release PR creation
2. Creates `release-please-config.json` - Configures semantic versioning
3. Creates `.release-please-manifest.json` - Tracks current version
4. Sets up branch protection on `main` (PR-only merges)
5. Enables auto-delete for merged branches
6. Grants GitHub Actions permission to create PRs

**Prerequisites:**

- `gh` CLI must be installed and authenticated
- Must be run from a git repository with a GitHub remote

**Example:**

```bash
# Basic usage (in a git repo)
shaba-cli gh repo-init

# With custom initial version
shaba-cli gh repo-init -v 1.0.0

# Skip branch protection (files only)
shaba-cli gh repo-init --no-branch-protection
```

## License

MIT
