# Development Guide

## Repository Structure

This project consists of two repositories:

### shaba-cli
Main CLI tool repository: https://github.com/shabaraba/shaba-cli

- TypeScript source code
- Built with Bun
- Automated releases with release-please
- Multi-platform binary builds (macOS arm64, Linux x64)

### homebrew-tap
Homebrew tap repository: https://github.com/shabaraba/homebrew-tap

- Homebrew Formula for shaba-cli
- Auto-updated on new releases

## Release Flow

1. **Development**: Make changes on feature branches
2. **PR**: Create PR to `main` branch
3. **Merge**: Merge PR to `main`
4. **Release Please**: Automatically creates/updates release PR based on conventional commits
5. **Release**: Merge release PR
   - Creates git tag (e.g., `v0.1.0`)
   - Builds binaries for macOS (arm64) and Linux (x64)
   - Uploads binaries to GitHub Releases
   - Triggers Homebrew tap Formula update

## Setup for Development

### Required Secrets

For automated Homebrew tap updates, add `TAP_UPDATE_TOKEN` to repository secrets:

1. Go to https://github.com/settings/tokens/new
2. Generate token with scope: `repo`
3. Go to https://github.com/shabaraba/shaba-cli/settings/secrets/actions
4. Add secret:
   - Name: `TAP_UPDATE_TOKEN`
   - Value: (your token)

### Local Development

```bash
# Clone repository
git clone https://github.com/shabaraba/shaba-cli.git
cd shaba-cli

# Install dependencies
bun install

# Build
bun run build

# Test locally
node dist/index.js --help

# Build standalone binary
bun build src/index.ts --compile --outfile shaba-cli
./shaba-cli --help
```

## Conventional Commits

Use conventional commit format for release-please:

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation only
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `perf:` - Performance improvements

Example:
```
feat: add new command for repo initialization

Add gh repo-init command to automate repository setup.
```

## Architecture

### Build System

- **Development**: TypeScript → Bun bundler → Single JS file
- **Production**: TypeScript → Bun compile → Native executable

### CI/CD

- **Release Please**: Automates semantic versioning and changelog
- **Multi-platform builds**: GitHub Actions matrix builds for macOS and Linux
- **Homebrew tap**: Automatically updated via workflow dispatch

### Binary Distribution

Binaries are distributed via:
1. GitHub Releases (direct download)
2. Homebrew tap (recommended for macOS/Linux users)
3. npm registry (for Node.js users)
