import fs from "fs/promises";
import path from "path";

const baseDir = "output";

async function downloadFile(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(buffer));
  console.log(`Downloaded: ${outputPath}`);
}

function findS3Links(obj: any): string[] {
  let links: string[] = [];

  if (typeof obj === "object" && obj !== null) {
    if (obj.files) {
      if (obj.files.audio) {
        links = links.concat(obj.files.audio);
      }
      if (obj.files.image) {
        links = links.concat(obj.files.image);
      }
    }

    // Recursively search in nested objects and arrays
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        links = links.concat(findS3Links(obj[key]));
      }
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      links = links.concat(findS3Links(item));
    }
  }

  return links;
}

async function processExamDirectory(examDir: string) {
  const files = await fs.readdir(examDir);
  const linkMap = new Map<string, { link: string; contexts: Set<string> }>();

  for (const file of files) {
    if (path.extname(file) !== ".json") continue;

    const filePath = path.join(examDir, file);
    const [type, contextOrQuestions] = path.basename(file, ".json").split("_");

    if (["listening", "speaking", "reading", "writing"].includes(type)) {
      const content = await fs.readFile(filePath, "utf-8");
      let data;
      try {
        data = JSON.parse(content);
      } catch (error) {
        console.error(`Error parsing JSON in file ${filePath}:`, error);
        continue;
      }

      const s3Links = findS3Links(data);

      // console.log(`Found ${s3Links.length} S3 links in ${filePath}`);

      for (const link of s3Links) {
        const url = new URL(link);
        const fileNameWithoutQuery = path.basename(url.pathname);
        const contextNumber =
          contextOrQuestions === "context"
            ? filePath.split("_")[filePath.split("_").length - 1].split(".")[0]
            : "questions";

        if (!linkMap.has(fileNameWithoutQuery)) {
          linkMap.set(fileNameWithoutQuery, {
            link,
            contexts: new Set([
              `${type}_${contextOrQuestions}_${contextNumber}`,
            ]),
          });
        } else {
          linkMap
            .get(fileNameWithoutQuery)!
            .contexts.add(`${type}_${contextOrQuestions}_${contextNumber}`);
        }
      }
    }
  }

  const allFilesToDownload = Array.from(linkMap.entries()).map(
    ([fileNameWithoutQuery, { link, contexts }]) => {
      const extension = path.extname(fileNameWithoutQuery);
      const fileType = extension === ".mp3" ? "audio" : "image";

      const contextInfo = Array.from(contexts)
        .sort((a, b) => a.localeCompare(b))
        .map((context) => {
          const [type, contextOrQuestions, number] = context.split("_");
          return `${type}_${
            contextOrQuestions === "context" ? number : contextOrQuestions
          }`;
        })
        .reduce((acc, curr) => {
          const [type, number] = curr.split("_");
          if (!acc[type]) {
            acc[type] = new Set();
          }
          acc[type].add(number);
          return acc;
        }, {} as Record<string, Set<string>>);

      const contextString = Object.entries(contextInfo)
        .map(
          ([type, numbers]) =>
            `${type}_${Array.from(numbers)
              .sort((a, b) => Number(a) - Number(b))
              .join(",")}`
        )
        .join(",");

      const fileName = `${fileType}_from_${contextString}${extension}`;
      return { s3Link: link, fileName };
    }
  );

  // console.log("Files to download:", allFilesToDownload);

  const examId = path.basename(examDir).split("_")[1];
  for (const { s3Link, fileName } of allFilesToDownload) {
    const outputPath = path.join(
      baseDir,
      `exam_${examId}`,
      "s3_files",
      fileName
    );

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await downloadFile(s3Link, outputPath);
  }
}

export async function downloadAssets() {
  const examDirs = await fs.readdir(baseDir);

  for (const dir of examDirs) {
    if (dir.startsWith("exam_")) {
      await processExamDirectory(path.join(baseDir, dir));
    }
  }
}
