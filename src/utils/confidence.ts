/**
 * Confidence Scoring System
 * 
 * Calculates a deterministic confidence score (0-100) for an answer based on:
 * 1. Keyword Overlap: How well the answer addresses the question keywords
 * 2. Completeness: Answer length relative to ideal range
 * 3. Structural Quality: Use of formatting, lists, clear organization
 * 4. Clarity Penalties: Vague phrases, repetition, filler words
 */

export interface ConfidenceFactors {
  keywordOverlap: number;
  completeness: number;
  structuralQuality: number;
  clarityPenalty: number;
  finalScore: number;
}

/**
 * Extracts meaningful keywords from a question (filters out common words)
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'might', 'can', 'this', 'that', 'these', 'those', 'what', 'which', 'who',
    'whom', 'whose', 'where', 'when', 'why', 'how', 'if', 'then', 'than'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
}

/**
 * Calculates keyword overlap score (0-100)
 * Higher score = more question keywords appear in the answer
 */
function calculateKeywordOverlap(question: string, answer: string): number {
  const questionKeywords = extractKeywords(question);
  if (questionKeywords.length === 0) return 50; // Neutral if no keywords

  const answerLower = answer.toLowerCase();
  const matchedKeywords = questionKeywords.filter(keyword =>
    answerLower.includes(keyword)
  ).length;

  const overlapRatio = matchedKeywords / questionKeywords.length;
  
  // Scale to 0-100 with bonus for high overlap
  return Math.min(100, Math.round(overlapRatio * 100 + (overlapRatio > 0.8 ? 10 : 0)));
}

/**
 * Calculates completeness score (0-100)
 * Optimal length: 150-350 characters
 * Too short = incomplete, too long = verbose
 */
function calculateCompleteness(answer: string): number {
  const length = answer.length;
  
  if (length >= 150 && length <= 350) {
    // Optimal range
    return 100;
  } else if (length >= 100 && length < 150) {
    // Slightly short
    return 70 + Math.round((length - 100) / 50 * 30);
  } else if (length > 350 && length <= 500) {
    // Slightly long
    return 100 - Math.round((length - 350) / 150 * 20);
  } else if (length < 100) {
    // Too short
    return Math.max(30, Math.round(length / 100 * 70));
  } else {
    // Too long
    return Math.max(40, 100 - Math.round((length - 500) / 200 * 60));
  }
}

/**
 * Calculates structural quality score (0-100)
 * Rewards: bullet points, numbered lists, paragraphs, clear sentences
 */
function calculateStructuralQuality(answer: string): number {
  let score = 50; // Base score

  // Check for lists (bullet points or numbered)
  const hasBulletPoints = /^[\s]*[-•*]\s/m.test(answer) || /^[\s]*\d+[\.\)]\s/m.test(answer);
  if (hasBulletPoints) score += 20;

  // Check for numbered steps
  const hasNumberedSteps = /\d+[\.\)]\s/g.test(answer);
  if (hasNumberedSteps) score += 15;

  // Check for paragraph breaks (indicates organization)
  const paragraphCount = (answer.match(/\n\n/g) || []).length;
  if (paragraphCount >= 1 && paragraphCount <= 3) score += 10;

  // Check for sentence structure
  const sentenceCount = (answer.match(/[.!?]+/g) || []).length;
  if (sentenceCount >= 3 && sentenceCount <= 8) score += 10;

  // Check for question addressing (direct answers)
  const hasDirectAnswer = /^(yes|no|the|it|this|that|in|to|for|with)/i.test(answer.trim());
  if (hasDirectAnswer) score += 5;

  return Math.min(100, score);
}

/**
 * Calculates clarity penalty (0-30 points to subtract)
 * Penalizes: vague phrases, repetition, filler words
 */
function calculateClarityPenalty(answer: string): number {
  let penalty = 0;
  const answerLower = answer.toLowerCase();

  // Vague phrases that indicate uncertainty
  const vaguePhrases = [
    'i think', 'i believe', 'i guess', 'maybe', 'perhaps', 'might be',
    'could be', 'possibly', 'sort of', 'kind of', 'a bit', 'somewhat'
  ];
  const vagueCount = vaguePhrases.filter(phrase => answerLower.includes(phrase)).length;
  penalty += vagueCount * 3;

  // Repetition detection (repeated phrases)
  const words = answerLower.split(/\s+/);
  const wordFrequency = new Map<string, number>();
  words.forEach(word => {
    if (word.length > 4) { // Only check meaningful words
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    }
  });
  const repeatedWords = Array.from(wordFrequency.values()).filter(count => count > 3).length;
  penalty += repeatedWords * 2;

  // Filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally'];
  const fillerCount = fillerWords.filter(word => answerLower.includes(word)).length;
  penalty += fillerCount * 1;

  // Check for hallucination-like phrases
  const hallucinationPhrases = [
    'i cannot', 'i don\'t know', 'i\'m not sure', 'i have no idea',
    'i\'m unable to', 'i cannot provide'
  ];
  const hallucinationCount = hallucinationPhrases.filter(phrase => answerLower.includes(phrase)).length;
  penalty += hallucinationCount * 5;

  return Math.min(30, penalty);
}

/**
 * Main confidence scoring function
 * Returns a score between 0-100 with detailed breakdown
 */
export function calculateConfidence(question: string, answer: string): ConfidenceFactors {
  const keywordOverlap = calculateKeywordOverlap(question, answer);
  const completeness = calculateCompleteness(answer);
  const structuralQuality = calculateStructuralQuality(answer);
  const clarityPenalty = calculateClarityPenalty(answer);

  // Weighted formula:
  // - Keyword overlap: 40% (most important - answers the question)
  // - Completeness: 30% (has enough detail)
  // - Structural quality: 20% (well organized)
  // - Clarity penalty: 10% (subtracted)
  const weightedScore =
    keywordOverlap * 0.4 +
    completeness * 0.3 +
    structuralQuality * 0.2;

  const finalScore = Math.max(0, Math.min(100, Math.round(weightedScore - clarityPenalty)));

  return {
    keywordOverlap,
    completeness,
    structuralQuality,
    clarityPenalty,
    finalScore,
  };
}
