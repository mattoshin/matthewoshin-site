/**
 * posts.ts - the blog's content layer. Reads markdown files with frontmatter
 * from src/content/posts. Server-only (uses node:fs); imported by the /blog
 * server components. To publish a post, drop a `<slug>.md` file in that folder
 * with `title`, `date`, and `excerpt` frontmatter.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface Post extends PostMeta {
  content: string;
}

function readPost(file: string): Post {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readPost(f))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ slug, title, date, excerpt }) => ({ slug, title, date, excerpt }));
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

// Slugs are simple kebab/alphanumeric only. Reject anything else so a route
// param can never traverse outside the posts directory.
const SLUG_RE = /^[a-z0-9-]+$/i;

export function getPost(slug: string): Post | null {
  if (!SLUG_RE.test(slug)) return null;
  const file = `${slug}.md`;
  const resolved = path.resolve(POSTS_DIR, file);
  if (resolved !== path.join(POSTS_DIR, file)) return null;
  if (!resolved.startsWith(POSTS_DIR + path.sep)) return null;
  if (!fs.existsSync(resolved)) return null;
  return readPost(file);
}
