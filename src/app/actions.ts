
'use server';

import { generateFdInsights, type GenerateFdInsightsInput } from '@/ai/flows/generate-fd-insights';
import { z } from 'zod';

const GenerateFdInsightsInputSchema = z.object({
  fdAmount: z.number(),
  interestRate: z.number(),
  period: z.number(),
  compoundingFrequency: z.enum(['monthly', 'quarterly', 'annually']),
});


export async function getAiInsightsAction(input: GenerateFdInsightsInput): Promise<{ data: string | null; error: string | null; }> {
  const parsedInput = GenerateFdInsightsInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { data: null, error: 'Invalid input.' };
  }

  try {
    const result = await generateFdInsights(parsedInput.data);
    if (!result.insights) {
      return { data: null, error: 'Failed to generate insights. The AI model may be temporarily unavailable. Please try again later.' };
    }
    return { data: result.insights, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'An unexpected error occurred while generating insights. Please check your connection and try again.' };
  }
}
