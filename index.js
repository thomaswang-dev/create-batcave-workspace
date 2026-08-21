#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const pkgRoot = fileURLToPath(new URL('.', import.meta.url))
const templateDir = path.join(pkgRoot, 'template')
const version = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8')).version

const name = process.argv[2] ?? 'batcave-workspace'
const targetDir = path.resolve(process.cwd(), name)

if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
  console.error(`Error: "${name}" already exists and is not empty.`)
  process.exit(1)
}

fs.cpSync(templateDir, targetDir, { recursive: true })
restoreGitignore(targetDir)
stampVersion(targetDir)
initGit(targetDir)

console.log(`Created ${name}`)
console.log('\nNext steps:')
console.log(`  cd ${name}`)
console.log('  npx batcave-skills install   # add the Batcave skills')

// npm never ships files named ".gitignore" and even applies their rules
// while packing (which would exclude repos/ from the tarball), so the
// template carries it as "gitignore" (no dot) and we restore the dot here.
// Guarded so a packing mishap degrades gracefully instead of crashing.
function restoreGitignore(dir) {
  const src = path.join(dir, 'gitignore')
  if (fs.existsSync(src)) {
    fs.renameSync(src, path.join(dir, '.gitignore'))
  }
}

// Marker that this folder is a Batcave workspace; checked by batcave-skills.
function stampVersion(dir) {
  const config = { version, skills: { autoMerge: false } }
  fs.writeFileSync(path.join(dir, '.batcave.json'), JSON.stringify(config, null, 2) + '\n')
}

function initGit(dir) {
  try {
    try {
      execSync('git init -b main', { cwd: dir, stdio: 'ignore' })
    } catch {
      execSync('git init', { cwd: dir, stdio: 'ignore' })
    }
    execSync('git add -A', { cwd: dir, stdio: 'ignore' })
    execSync('git commit -m "Initial commit"', { cwd: dir, stdio: 'ignore' })
  } catch {
    console.warn('Warning: could not initialize git (is git installed and configured?).')
  }
}
