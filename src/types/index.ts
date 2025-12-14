export interface Answer {
  id: string;
  rank: 1 | 2 | 3;
  content: string;
  confidence: number;
  source?: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
