import { EXISTED_EXAMS_ID } from "../constants";

export const scrapper = async ({
  type,
  fn,
  examIds = EXISTED_EXAMS_ID,
}: {
  type: string;
  fn: (examId: number) => Promise<void>;
  examIds?: number[];
}) => {
  let failedIds = [];
  for (const examId of examIds) {
    try {
      console.log(`Starting scrapping ${type} exam ${examId}...`);
      await fn(examId);
      console.log(`Finished scrapping ${type} exam ${examId}`);
    } catch (error) {
      console.error(
        `Error occurred while scrapping ${type} data for exam ${examId}:`,
        error
      );
      failedIds.push(examId);
    }
  }
  if (failedIds.length === 0) {
    console.log(`All ${type} exams scrapped successfully!`);
  } else {
    console.log(`Failed ${type} exams ids: ${failedIds.join(", ")}`);
  }
};
