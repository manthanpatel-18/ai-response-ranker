import { Answer } from '@/types';
import { calculateConfidence, ConfidenceFactors } from './confidence';

/**
 * Ranking System
 * 
 * Ranks answers based on:
 * 1. Relevance Score: How well the answer addresses the question
 * 2. Confidence Score: Quality metrics (from confidence.ts)
 * 3. Hallucination Penalty: Detects and penalizes uncertain/vague answers
 * 
 * Final ranking ensures:
 * - Rank 1 has highest combined score
 * - Scores are meaningfully different (min 5 point gap)
 * - No ties in confidence scores
 */

export interface RankingResult {
  answer: Answer;
  relevanceScore: number;
  confidenceScore: number;
  hallucinationPenalty: number;
  finalScore: number;
  factors: ConfidenceFactors;
}

/**
 * Calculates relevance score (0-100)
 * Measures how directly the answer addresses the question
 */
function calculateRelevance(question: string, answer: string): number {
  const questionLower = question.toLowerCase();
  const answerLower = answer.toLowerCase();

  // Extract question words (excluding common words)
  const questionWords = questionLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  if (questionWords.length === 0) return 50;

  // Check how many question words appear in answer
  const matchedWords = questionWords.filter(word => answerLower.includes(word)).length;
  const matchRatio = matchedWords / questionWords.length;

  // Check for direct question answering patterns
  let directAnswerBonus = 0;
  if (questionLower.includes('what')) {
    if (answerLower.match(/^(it|this|that|the|a|an)\s+/i)) directAnswerBonus += 10;
  }
  if (questionLower.includes('how')) {
    if (answerLower.match(/(step|method|way|process|approach)/i)) directAnswerBonus += 10;
  }
  if (questionLower.includes('why')) {
    if (answerLower.match(/(because|reason|due to|since|as a result)/i)) directAnswerBonus += 10;
  }

  const baseScore = Math.min(100, matchRatio * 80);
  return Math.min(100, baseScore + directAnswerBonus);
}

/**
 * Calculates hallucination penalty (0-20 points to subtract)
 * Detects phrases that indicate uncertainty or lack of knowledge
 */
function calculateHallucinationPenalty(answer: string): number {
  let penalty = 0;
  const answerLower = answer.toLowerCase();

  // High uncertainty phrases
  const uncertaintyPhrases = [
    'i cannot', 'i don\'t know', 'i\'m not sure', 'i have no idea',
    'i\'m unable to', 'i cannot provide', 'i don\'t have access',
    'i cannot answer', 'i cannot determine', 'i cannot verify'
  ];

  const uncertaintyCount = uncertaintyPhrases.filter(phrase => answerLower.includes(phrase)).length;
  penalty += uncertaintyCount * 5;

  // Vague qualifiers
  const vagueQualifiers = [
    'might be', 'could be', 'possibly', 'perhaps', 'maybe',
    'i think', 'i believe', 'i guess', 'probably'
  ];
  const vagueCount = vagueQualifiers.filter(phrase => answerLower.includes(phrase)).length;
  penalty += Math.min(10, vagueCount * 2);

  return Math.min(20, penalty);
}

/**
 * Ensures confidence scores are meaningfully different
 * Adjusts scores to maintain minimum gap between ranks
 */
function ensureScoreDifferentiation(results: RankingResult[]): RankingResult[] {
  const sorted = [...results].sort((a, b) => b.finalScore - a.finalScore);
  const minGap = 5; // Minimum 5 point difference

  for (let i = 1; i < sorted.length; i++) {
    const prevScore = sorted[i - 1].finalScore;
    const currentScore = sorted[i].finalScore;

    if (prevScore - currentScore < minGap) {
      // Adjust current score down to maintain gap
      sorted[i].finalScore = Math.max(0, prevScore - minGap);
      // Recalculate confidence to match
      sorted[i].confidenceScore = Math.max(
        0,
        sorted[i].confidenceScore - (prevScore - currentScore) - minGap
      );
    }
  }

  return sorted;
}

/**
 * Main ranking function
 * Takes raw answers and returns ranked results with detailed scoring
 */
export function rankAnswers(question: string, answers: string[]): RankingResult[] {
  const results: RankingResult[] = answers.map((answer, index) => {
    // Calculate all scoring components
    const confidenceFactors = calculateConfidence(question, answer);
    const relevanceScore = calculateRelevance(question, answer);
    const hallucinationPenalty = calculateHallucinationPenalty(answer);

    // Final score formula:
    // - Relevance: 30% (answers the question)
    // - Confidence: 60% (quality metrics)
    // - Hallucination penalty: 10% (subtracted)
    const finalScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          relevanceScore * 0.3 +
          confidenceFactors.finalScore * 0.6 -
          hallucinationPenalty
        )
      )
    );

    return {
      answer: {
        id: `answer-${Date.now()}-${index}`,
        rank: 1 as 1 | 2 | 3, // Will be set after sorting
        content: answer.trim(),
        confidence: confidenceFactors.finalScore,
        source: 'OpenAI GPT-3.5 Turbo',
      },
      relevanceScore,
      confidenceScore: confidenceFactors.finalScore,
      hallucinationPenalty,
      finalScore,
      factors: confidenceFactors,
    };
  });

  // Sort by final score (highest first)
  const sorted = results.sort((a, b) => b.finalScore - a.finalScore);

  // Ensure meaningful score differences
  const differentiated = ensureScoreDifferentiation(sorted);

  // Assign ranks and update confidence scores
  return differentiated.map((result, index) => {
    const rank = (index + 1) as 1 | 2 | 3;
    return {
      ...result,
      answer: {
        ...result.answer,
        rank,
        confidence: result.confidenceScore, // Use the adjusted confidence
      },
    };
  });
}
