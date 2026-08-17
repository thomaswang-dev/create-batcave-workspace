#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const name = process.argv[2] ?? 'batcave-workspace'
const targetDir = path.resolve(process.cwd(), name)
const templateDir = fileURLToPath(new URL('./template', import.meta.url))

if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
  console.error(`Error: "${name}" already exists and is not empty.`)
  process.exit(1)
}

fs.cpSync(templateDir, targetDir, { recursive: true })

// npm never ships files named ".gitignore" and even applies their rules
// while packing (which would exclude repos/ from the tarball), so the
// template carries it as "gitignore" (no dot) and we restore the dot here.
// Guarded so a packing mishap degrades gracefully instead of crashing.
const gitignoreSrc = path.join(targetDir, 'gitignore')
if (fs.existsSync(gitignoreSrc)) {
  fs.renameSync(gitignoreSrc, path.join(targetDir, '.gitignore'))
}

try {
  try {
    execSync('git init -b main', { cwd: targetDir, stdio: 'ignore' })
  } catch {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' })
  }
  execSync('git add -A', { cwd: targetDir, stdio: 'ignore' })
  execSync('git commit -m "Initial commit"', { cwd: targetDir, stdio: 'ignore' })
} catch {
  console.warn('Warning: could not initialize git (is git installed and configured?).')
}

console.log(`Created ${name}`)
console.log('\nNext steps:')
console.log(`  cd ${name}`)
