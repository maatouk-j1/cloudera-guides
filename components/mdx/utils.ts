import fs from "fs";
import path from "path";

type Metadata = {
  title: string;
  publishedAt?: string;
  updatedAt?: string;
  summary?: string;
  topicTitle?: string;
  topicSlug?: string;
  prevTitle?: string;
  prevSlug?: string;
  nextTitle?: string;
  nextSlug?: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) {
    return { metadata: {} as Metadata, content: fileContent.trim() };
  }
  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFilesRecursive(dir: string, baseDir?: string): string[] {
  const base = baseDir || dir;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMDXFilesRecursive(fullPath, base));
    } else if (path.extname(entry.name) === ".mdx") {
      // Return relative path from base directory
      files.push(path.relative(base, fullPath));
    }
  }

  return files;
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFilesRecursive(dir);
  return mdxFiles.map((relativePath) => {
    const { metadata, content } = readMDXFile(path.join(dir, relativePath));
    // Generate slug from relative path without extension
    // e.g., "cdppvc/demo.mdx" -> "cdppvc/demo"
    const slug = relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/");
    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getDocPages() {
  return getMDXData(path.join(process.cwd(), "content/docs"));
}
