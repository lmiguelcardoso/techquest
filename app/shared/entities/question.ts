export interface Question {
  id: string;
  text: string;
  topic_id: string;
}

export interface Answer {
  id: string;
  is_correct: boolean;
  text: string;
  question_id: string;
}
