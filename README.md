# create-batcave-workspace

Scaffold a new Batcave workspace folder with a basic file and folder structure.

## Usage

```bash
npx create-batcave-workspace my-workspace
# or
npm create batcave-workspace my-workspace
```

Creates `my-workspace/` (default name: `batcave-workspace/`) containing:

```
├── README.md
├── .gitignore
├── repos/         # gitignored — for cloned repositories
├── plans/
└── researches/
```

Then runs `git init` and makes an initial commit, so the folder is a fresh repo ready to push.

## Releasing

1. Bump `version` in `package.json` and commit.
2. Tag it: `git tag vX.Y.Z && git push --tags`
3. The `publish.yml` workflow verifies the tag matches `package.json`, then publishes to npm via [trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC — no npm token needed).

### One-time setup

1. Publish v1.0.0 manually (the package must exist before a trusted publisher can be attached to it):
   ```bash
   npm login --registry https://registry.npmjs.org
   npm publish --registry https://registry.npmjs.org
   ```
2. On npmjs.com, go to the package → Settings → Trusted Publisher → GitHub Actions:
   - User: `thomaswang-dev`, Repository: `create-batcave-workspace`
   - Workflow filename: `publish.yml`
   - Allowed action: `npm publish`
