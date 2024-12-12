import { IS_DEBUG } from "../config";
import { fetcher } from "../fetcher";
import { saveToJsonFile } from "../file-saver";
import { ExamType, Paginated } from "../global";
import {
  getContextUrlFactoryByType,
  getQuestionsUrlFactoryByType,
} from "../utils";

export const parser = async <T extends { context: number }>({
  examId,
  type,
}: {
  examId: number;
  type: ExamType;
}) => {
  const questionsUrl = getQuestionsUrlFactoryByType(type)(examId, IS_DEBUG);

  const response = await fetcher.getData<Paginated<T>>(questionsUrl);

  if (response.results.length === 0) {
    throw new Error(`No ${type} questions found for the exam.`);
  }

  await saveToJsonFile(examId, `${type}_questions_${examId}.json`, response);

  const items = response.results;

  if (items.length) {
    for (const item of items) {
      const contextUrl = getContextUrlFactoryByType(type)(
        item.context,
        IS_DEBUG
      );

      const context = await fetcher.getData(contextUrl);

      await saveToJsonFile(
        examId,
        `${type}_context_${item.context}.json`,
        context
      );
    }
  }
};
