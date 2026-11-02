# Rupesh Singh · Portfolio

Personal site built with React, Vite, Tailwind CSS and Framer Motion. Blog posts and learning-log entries are Markdown files. Deploys to GitHub Pages on every push to `main`.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:5173/portfolio/
```

To check the production build exactly as it will be deployed:

```bash
npm run build
npm run preview      # http://localhost:4173/portfolio/
```

## Assets (photo and resume)

Put these two files in `public/` using these exact names:

| File | Used for |
| --- | --- |
| `public/photo.jpg` | Hero portrait. Square works best, about 600×600 px and under 200 KB, so the page stays fast. |
| `public/Rupesh Singh.pdf` | Every "Download Resume" button. Visitors get it as `Rupesh-Singh-Resume.pdf`. |

Until `photo.jpg` exists the hero shows an "RS" monogram. **Restart `npm run dev` after adding the photo.** The build prints a warning if either file is missing.

To use different file names, change `photo.src` / `resume.src` in `src/data/profile.js`.

## Edit your content: `src/data/profile.js`

Everything personal lives in this one file. Components read from it, so you never need to touch JSX to update text.

| Key | What it controls |
| --- | --- |
| `name`, `title`, `location`, `tagline`, `email` | Hero, footer, SEO tags |
| `social` | Icon links in the hero, contact section and footer (`icon`: `github`, `linkedin`, `mail`) |
| `site` | Meta description, keywords, site origin used for Open Graph and the sitemap |
| `about.paragraphs`, `about.stats` | About section text and the four stat cards |
| `experience` | Timeline entries. Each has `progression` (role steps) and `highlights` |
| `skills` | Skill groups. `icon`: `cloud`, `network`, `shield`, `code`, `sparkles`, `users` |
| `projects.featured` | Slider cards. Set `github` to the repo URL to show a "View on GitHub" button (`'#'` shows "GitHub link coming soon"). `visual`: `pipeline`, `rules` or `forecast` |
| `projects.other` | Small cards. Optional `link` (live site), `github`, `status` (e.g. "In progress") |
| `certifications`, `achievements`, `education` | Their sections. `issuer`/`date` are optional |
| `headings`, `blog.intro`, `learning.intro`, `contact` | Section titles and short intros |

To add a new icon name, import it from [lucide-react](https://lucide.dev/icons) in `src/components/icons.js` and add it to the map.

## Write a blog post

1. Create a file in `src/content/blog/`. The file name becomes the URL:
   `my-new-post.md` → `/blog/my-new-post`
2. Start it with frontmatter:

   ```markdown
   ---
   title: "My New Post"
   date: 2026-11-02
   description: "One or two sentences shown on cards and in search results."
   tags: [Azure, Networking]
   draft: false
   ---

   Your post in Markdown. Tables, code blocks and task lists are supported.
   ```

3. Commit and push. The home page shows the 3 newest posts automatically; `/blog` lists all of them.

Notes:
- `draft: true` posts appear while running `npm run dev` (with a Draft badge) but never in the deployed site.
- Reading time is calculated for you.
- Images: put them in `public/blog/` and reference them as `![Alt text](/blog/diagram.png)`. Links to other posts work the same way: `[see this post](/blog/nsg-subnet-vs-nic)`. The base path is added for you.

## Learning log (DSA and system design, day by day)

`/learning` is a day-by-day log with one Markdown file per day in `src/content/learning/`. The site works out the day numbers, streak, totals and activity heatmap for you, and shows the latest three entries on the home page.

1. Start today's entry:

   ```bash
   npm run log "Sliding window"
   ```

   This creates `src/content/learning/<today>-sliding-window.md` from a template.

2. Fill it in. A finished entry starts like this:

   ```markdown
   ---
   title: "Sliding window"
   date: 2026-10-21
   track: DSA
   description: "One or two sentences, shown on cards and in the LinkedIn preview."
   topics: [Arrays, Sliding Window, Hash Map]
   problems:
     - "Longest Substring Without Repeating Characters | Medium | https://leetcode.com/problems/longest-substring-without-repeating-characters/"
     - "Maximum Average Subarray I | Easy | https://leetcode.com/problems/maximum-average-subarray-i/"
   draft: false
   ---

   Your notes in Markdown: the key idea, your code, where you got stuck.
   ```

   - `track`: `DSA` or `System Design`. For a day with both, write `track: [DSA, System Design]`. Each track gets a filter button on `/learning`.
   - `problems`: one line per problem, `"Name | Easy, Medium or Hard | link"`. Leave it out on system design days. A problem logged on two different days counts once in "Problems solved".

3. New entries start as `draft: true`, so they only show while running `npm run dev`. When it's ready, change it to `draft: false`, then commit and push.

4. Open the entry on the live site and use the **LinkedIn** button at the bottom to share it. The preview shows "Day N: your title" and your description.

Notes:
- Day 1 is your first entry, and each later date you log counts up by one, so a skipped day doesn't leave a gap. Entries with the same date share a day number.
- The streak counts consecutive calendar days. It stays alive until a whole day passes with no entry; when it breaks, the page shows your longest streak instead.
- The "Learning" nav link only appears once at least one entry is published. The home page section shows your LeetCode stats either way, and adds your latest entries once there are some.

## Deploy to GitHub Pages

One-time setup:

1. On GitHub, create a new **public** repo named `portfolio` under `rupucoding` (leave it empty, no README).
2. Push this folder:

   ```bash
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/rupucoding/portfolio.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish (re-run it once if it started before step 3).

The site goes live at **https://rupucoding.github.io/portfolio/**.

After that, every push to `main` rebuilds and redeploys automatically.

**Using a different repo name?** The workflow detects it and sets the base path to `/<repo-name>/` for you. For local builds, change `DEFAULT_BASE` in `scripts/site.js` to match. Naming the repo `rupucoding.github.io` serves the site from the root, but that would replace what's currently at that address.

## What the build produces

`npm run build` runs Vite, then `scripts/postbuild.js`, which:

- writes a real HTML page for `/blog/`, `/learning/`, every post and every published log entry, each with its own title, description and Open Graph tags (so links preview properly when shared)
- writes `404.html` so any other URL still loads the app
- generates `sitemap.xml` and `robots.txt`

SEO tags in `index.html` are generated from `profile.js`. The Open Graph image is `public/og-image.png`.

## Project structure

```
.github/workflows/deploy.yml   Build + deploy on push to main
public/                        favicon, og-image, apple-touch-icon, photo, resume
scripts/
  site.js                      Base path, site URL and SEO tag helpers
  postbuild.js                 Route pages, 404, sitemap, robots
  new-log.js                   `npm run log`: starts today's learning-log entry
src/
  data/profile.js              ← all your content
  content/blog/*.md            ← blog posts
  content/learning/*.md        ← learning log, one file per day
  sections/                    One component per home page section
  components/                  Navbar, slider, cards, heatmap, theme toggle...
  pages/                       Home, Blog, BlogPost, Learning, LearningEntry, NotFound
  hooks/, lib/                 Theme, active section, frontmatter parser, helpers
  index.css                    Theme colours (CSS variables) + shared styles
```

Theme colours are defined once as CSS variables at the top of `src/index.css` (light under `:root`, dark under `.dark`).

## Requirements

Node 18.16 or newer works locally; Node 22 is recommended (it's what the deploy workflow uses, see `.nvmrc`).
