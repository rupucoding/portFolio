/**
 * Starts today's learning-log entry from a template:
 *
 *   npm run log "Sliding window"
 *
 * creates src/content/learning/2026-10-20-sliding-window.md. It starts as a
 * draft (visible in `npm run dev` only); set `draft: false` to publish it.
 */
import fs from 'node:fs'
import path from 'node:path'

const title = process.argv.slice(2).join(' ').trim() || 'What I learned today'

const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 60)
  .replace(/-+$/, '')

const dir = path.resolve('src/content/learning')
const file = path.join(dir, `${slug ? `${date}-${slug}` : date}.md`)
const shown = path.relative(process.cwd(), file).split(path.sep).join('/')

if (fs.existsSync(file)) {
  console.error(`✗ ${shown} already exists. Open it, or use a different title.`)
  process.exit(1)
}

const quoted = title.includes('"') ? `'${title}'` : `"${title}"`

const template = `---
title: ${quoted}
date: ${date}
# DSA or System Design. For both: [DSA, System Design]
track: DSA
# One or two sentences. Shown on cards and in the LinkedIn preview.
description: ""
# For example: [Arrays, Sliding Window, Hash Map]
topics: []
# One line per problem you solved: - "Name | Easy, Medium or Hard | link"
problems:
  # - "Two Sum | Easy | https://leetcode.com/problems/two-sum/"
# Change to false when it's ready to go live.
draft: true
---

## What I worked on

## The key idea

## Where I got stuck

## What I'll remember
`

fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(file, template)

console.log(`✓ Created ${shown}`)
console.log('  Fill it in, then set draft: false to publish it.')
