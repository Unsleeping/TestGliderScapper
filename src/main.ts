import {
  DISABLE_WRITING_SCRAPING,
  DISABLE_READING_SCRAPING,
  DISABLE_LISTENING_SCRAPING,
  DISABLE_SPEAKING_SCRAPING,
} from "./config";
import {
  ListeningQuestionItem,
  ReadingQuestionItem,
  SpeakingQuestionItem,
  WritingQuestionItem,
} from "./global";
import { parser } from "./scrappers/base-parser";
import { scrapper } from "./scrappers/base-scrapper";

const scrapWritingExams = () => {
  if (DISABLE_WRITING_SCRAPING) {
    return Promise.resolve(0);
  }

  return scrapper({
    type: "writing",
    fn: (examId: number) =>
      parser<WritingQuestionItem>({ examId, type: "writing" }),
  });
};

const scrapReadingExams = () => {
  if (DISABLE_READING_SCRAPING) {
    return Promise.resolve(0);
  }

  return scrapper({
    type: "reading",
    fn: (examId: number) =>
      parser<ReadingQuestionItem>({ examId, type: "reading" }),
  });
};

const scrapListeningExams = () => {
  if (DISABLE_LISTENING_SCRAPING) {
    return Promise.resolve(0);
  }

  return scrapper({
    type: "listening",
    fn: (examId: number) =>
      parser<ListeningQuestionItem>({ examId, type: "listening" }),
  });
};

const scrapSpeakingExams = () => {
  if (DISABLE_SPEAKING_SCRAPING) {
    return Promise.resolve(0);
  }

  return scrapper({
    type: "speaking",
    fn: (examId: number) =>
      parser<SpeakingQuestionItem>({ examId, type: "speaking" }),
  });
};

const main = async () => {
  await Promise.all([
    scrapReadingExams(),
    scrapWritingExams(),
    scrapListeningExams(),
    scrapSpeakingExams(),
  ]);
};

main();
