# shaba-cli

Personal CLI toolkit by shabaraba.

## Installation

### Homebrew (macOS / Linux)

```bash
# Add tap
brew tap shabaraba/tap

# Install
brew install shaba-cli
```

### npm

```bash
npm install -g @shabaraba/shaba-cli
```

### npx (no installation)

```bash
npx @shabaraba/shaba-cli <command>
```

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
4. Installs pre-commit hook - Prevents local commits to main branch
5. Sets up branch protection on `main` (PR-only merges on GitHub)
6. Enables auto-delete for merged branches
7. Grants GitHub Actions permission to create PRs

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

## Documentation

- [Development Guide](docs/DEVELOPMENT.md) - Repository structure, release flow, development setup

## License

MIT
