export function parseSurveyAnswers(answersJson: unknown): any | null {
  if (!answersJson) return null;
  if (typeof answersJson === 'string') {
    try {
      return JSON.parse(answersJson);
    } catch {
      return null;
    }
  }
  if (typeof answersJson === 'object') return answersJson;
  return null;
}
