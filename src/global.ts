export type Paginated<T> = {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
};

export type ReadingQuestionItem = {
  id: number;
  type: string;
  question_number: number;
  context: number;
  question_text: string;
  options: string[];
  answer_type: string;
};

export type WritingQuestionItem = {
  context: number;
  id: number;
  question_audio: string;
  question_number: number;
  question_text: string;
  type: "integrated";
};

export type SpeakingQuestionItem = {
  context: number;
  id: number;
  question_audio: string;
  question_number: number;
  question_text: number;
  type: "independent";
};

export type Option = {
  id: number;
  key: string;
  text: string;
};

export type ListeningQuestionItem = {
  answer_type: "option";
  context: 822;
  id: 847;
  options: Option[];
  question_audio: string;
  question_number: number;
  question_text: string;
  type: string;
};

export type ExamType = "reading" | "writing" | "listening" | "speaking";
