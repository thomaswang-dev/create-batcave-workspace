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
