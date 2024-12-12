import { ExamType } from "./global";

const getReadingQuestionsUrlByExamId = (
  examId: number,
  withoutQuery = false
) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/reading/questions?exam=${examId}`;
  }
  return `https://api.testglider.com/v2/test/reading/questions?exam=${examId}&query={id,type,question_number,context,question_text,options,answer_type}`;
};

const getReadingContextUrl = (contextId: number, withoutQuery = false) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/reading/contexts/${contextId}`;
  }
  return `https://api.testglider.com/v2/test/reading/contexts/${contextId}?query={id,text}`;
};

const getWritingQuestionsUrlByExamId = (
  examId: number,
  withoutQuery = false
) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/writing/questions?exam=${examId}`;
  }
  return `https://api.testglider.com/v2/test/writing/questions?exam=${examId}&query={id,type,question_number,context,question_text,question_audio}`;
};

const getWritingContextUrl = (contextId: number, withoutQuery = false) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/writing/contexts/${contextId}`;
  }
  return `https://api.testglider.com/v2/test/writing/contexts/${contextId}?query={id,text,audio,image}`;
};

const getListeningQuestionsUrlByExamId = (
  examId: number,
  withoutQuery = false
) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/listening/questions?exam=${examId}`;
  }
  return `https://api.testglider.com/v2/test/listening/questions?exam=${examId}&query={id,type,question_number,context,question_text,question_audio,options,answer_type}`;
};

const getListeningContextUrl = (contextId: number, withoutQuery = false) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/listening/contexts/${contextId}`;
  }
  return `https://api.testglider.com/v2/test/listening/contexts/${contextId}?query={id,text,files,audio,image}`;
};

const getSpeakingQuestionsUrlByExamId = (
  examId: number,
  withoutQuery = false
) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/speaking/questions?exam=${examId}`;
  }
  return `https://api.testglider.com/v2/test/speaking/questions?exam=${examId}&query={id,type,question_number,context,question_text,question_audio,options,answer_type}`;
};

const getSpeakingContextUrl = (contextId: number, withoutQuery = false) => {
  if (withoutQuery) {
    return `https://api.testglider.com/v2/test/speaking/contexts/${contextId}`;
  }
  return `https://api.testglider.com/v2/test/speaking/contexts/${contextId}?query={id,text,audio,image}`;
};

export const getContextUrlFactoryByType = (type: ExamType) => {
  switch (type) {
    case "reading":
      return getReadingContextUrl;
    case "writing":
      return getWritingContextUrl;
    case "listening":
      return getListeningContextUrl;
    case "speaking":
      return getSpeakingContextUrl;
    default:
      throw new Error(
        `Unsupported exam type in getContextUrlFactoryByType: ${type}`
      );
  }
};

export const getQuestionsUrlFactoryByType = (type: ExamType) => {
  switch (type) {
    case "reading":
      return getReadingQuestionsUrlByExamId;
    case "writing":
      return getWritingQuestionsUrlByExamId;
    case "listening":
      return getListeningQuestionsUrlByExamId;
    case "speaking":
      return getSpeakingQuestionsUrlByExamId;
    default:
      throw new Error(
        `Unsupported exam type in getQuestionsUrlFactoryByType: ${type}`
      );
  }
};
