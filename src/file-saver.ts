import * as fs from "fs/promises";
import * as path from "path";

export async function saveToJsonFile(
  examId: number,
  filename: string,
  data: any
) {
  const outputDir = path.join(__dirname, "..", "output", `exam_${examId}`);
  const filePath = path.join(outputDir, filename);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}
