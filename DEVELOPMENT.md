# Development Workflow

## Type Checking

To catch TypeScript errors before pushing code, run:

```bash
npm run type-check
```

This will check all TypeScript files without building, similar to what Vercel does during deployment.

## Pre-commit Hooks

We use Husky v9 to run type checking and linting before commits. To set it up:

```bash
# Husky is already installed, just initialize it
npx husky init

# This will create .husky/pre-commit file automatically
# Then add the pre-commit command:
echo "npm run pre-commit" > .husky/pre-commit
```

Or manually create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run pre-commit
```

Make sure it's executable:
```bash
chmod +x .husky/pre-commit
```

## Recommended Workflow

1. **Before committing:**
   ```bash
   npm run type-check
   npm run lint
   ```

2. **Before pushing:**
   ```bash
   npm run build  # This will catch all errors
   ```

3. **During development:**
   - `npm run dev` - Fast development server (limited type checking)
   - `npm run type-check` - Full type checking (run before committing)

## Why Errors Aren't Caught in `npm run dev`

- `next dev` only type-checks files that are actively being used
- It prioritizes speed over thoroughness
- Full type checking happens during `next build` (which Vercel runs)

## CI/CD Recommendations

Add to your GitHub Actions or CI pipeline:

```yaml
- name: Type Check
  run: npm run type-check

- name: Lint
  run: npm run lint

- name: Build
  run: npm run build
```

