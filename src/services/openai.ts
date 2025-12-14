import { Answer } from '@/types';
import { rankAnswers } from '@/utils/ranking';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Answer Style Definitions
 * Each answer uses a distinct style to ensure meaningful differences
 */

interface AnswerStyle {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  description: string;
}

const ANSWER_STYLES: AnswerStyle[] = [
  {
    // Answer 1: Concise, beginner-friendly
    systemPrompt: `You are a helpful teacher who explains complex topics in simple, easy-to-understand language. 
Your answers should be:
- Concise (2-4 sentences maximum)
- Beginner-friendly with no jargon
- Direct and to the point
- Use everyday language
- Focus on the core answer without extra details`,
    temperature: 0.7,
    maxTokens: 200,
    description: 'Concise & Beginner-Friendly',
  },
  {
    // Answer 2: Detailed, step-by-step, technical
    systemPrompt: `You are an expert technical advisor who provides comprehensive, detailed explanations.
Your answers should be:
- Detailed and thorough (4-8 sentences)
- Step-by-step when applicable
- Include technical context and reasoning
- Well-structured with clear organization
- Use precise terminology when helpful`,
    temperature: 0.8,
    maxTokens: 400,
    description: 'Detailed & Technical',
  },
  {
    // Answer 3: Practical, example-driven, real-world
    systemPrompt: `You are a practical consultant who provides actionable, real-world advice.
Your answers should be:
- Practical and actionable
- Include concrete examples or use cases
- Focus on real-world application
- Show how to implement or use the information
- Relatable and applicable`,
    temperature: 0.9,
    maxTokens: 350,
    description: 'Practical & Example-Driven',
  },
];

/**
 * Chat message format for OpenAI API
 */
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Generates a single answer using OpenAI API with a specific style and conversation history
 */
async function generateStyledAnswer(
  question: string,
  style: AnswerStyle,
  apiKey: string,
  conversationHistory: OpenAIMessage[] = []
): Promise<string> {
  // Build messages array with system prompt, history, and current question
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: style.systemPrompt,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: question,
    },
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: style.temperature,
      max_tokens: style.maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Converts chat messages to OpenAI format
 * Limits context to last 6 turns (12 messages) for safety
 */
function prepareConversationHistory(messages: Array<{ role: 'user' | 'assistant'; content: string }>): OpenAIMessage[] {
  // Take last 6 turns (12 messages max: 6 user + 6 assistant)
  const recentMessages = messages.slice(-12);
  
  return recentMessages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * Generates 3 distinctly different answers and ranks them intelligently
 * 
 * Strategy:
 * 1. Generate 3 answers with different styles (concise, detailed, practical)
 * 2. Use different temperatures and token limits to force variety
 * 3. Rank using intelligent scoring (relevance + confidence + penalties)
 * 4. Ensure meaningful score differences between ranks
 * 
 * @param question - Current user question
 * @param apiKey - OpenAI API key
 * @param conversationHistory - Previous messages for context (optional)
 */
export async function generateAndRankAnswers(
  question: string,
  apiKey: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<Answer[]> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('OpenAI API key is required. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  if (!question || !question.trim()) {
    throw new Error('Question cannot be empty');
  }

  try {
    // Prepare conversation history for context
    const history = prepareConversationHistory(conversationHistory);
    
    // Generate 3 answers with distinct styles in parallel
    const answerPromises = ANSWER_STYLES.map((style, index) =>
      generateStyledAnswer(question, style, apiKey, history).catch((error) => {
        console.error(`Failed to generate answer ${index + 1} (${style.description}):`, error);
        throw error;
      })
    );

    const rawAnswers = await Promise.all(answerPromises);

    // Filter out empty answers
    const validAnswers = rawAnswers.filter(answer => answer && answer.trim().length > 0);

    if (validAnswers.length === 0) {
      throw new Error('Failed to generate any valid answers. Please try again.');
    }

    // If we got fewer than 3 answers, pad with the best one (shouldn't happen, but safety)
    while (validAnswers.length < 3) {
      validAnswers.push(validAnswers[0]);
    }

    // Rank answers using intelligent scoring system
    const rankedResults = rankAnswers(question, validAnswers.slice(0, 3));

    // Convert to Answer format
    const rankedAnswers: Answer[] = rankedResults.map((result) => ({
      id: result.answer.id,
      rank: result.answer.rank,
      content: result.answer.content,
      confidence: result.answer.confidence,
      source: 'OpenAI GPT-3.5 Turbo',
    }));

    return rankedAnswers;
  } catch (error) {
    if (error instanceof Error) {
      // Provide user-friendly error messages
      if (error.message.includes('API key') || error.message.includes('401')) {
        throw new Error(
          'Invalid or missing OpenAI API key. Please check your .env file and ensure VITE_OPENAI_API_KEY is set correctly.'
        );
      }
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        throw new Error(
          'OpenAI API rate limit exceeded. Please wait a moment and try again.'
        );
      }
      if (error.message.includes('insufficient_quota') || error.message.includes('429')) {
        throw new Error(
          'OpenAI API quota exceeded. Please check your OpenAI account billing.'
        );
      }
      throw error;
    }
    throw new Error('Failed to generate answers. Please try again.');
  }
}
