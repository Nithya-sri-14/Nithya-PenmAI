// src/ai/flows/generate-fd-insights.ts
'use server';

/**
 * @fileOverview Generates personalized financial tips and insights related to Fixed Deposit (FD) investments based on user inputs.
 *
 * - generateFdInsights - A function that takes FD details as input and returns personalized insights.
 * - GenerateFdInsightsInput - The input type for the generateFdInsights function.
 * - GenerateFdInsightsOutput - The return type for the generateFdInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFdInsightsInputSchema = z.object({
  fdAmount: z
    .number()
    .describe('The amount invested in the fixed deposit (in Indian Rupees).'),
  interestRate: z.number().describe('The annual interest rate of the FD.'),
  period: z.number().describe('The period of the FD in years.'),
  compoundingFrequency: z
    .enum(['monthly', 'quarterly', 'annually'])
    .describe('The compounding frequency of the FD interest.'),
});
export type GenerateFdInsightsInput = z.infer<typeof GenerateFdInsightsInputSchema>;

const GenerateFdInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Personalized financial tips and insights related to the FD inputs, such as alternative FD schemes or tax implications.'
    ),
});
export type GenerateFdInsightsOutput = z.infer<typeof GenerateFdInsightsOutputSchema>;

export async function generateFdInsights(input: GenerateFdInsightsInput): Promise<GenerateFdInsightsOutput> {
  return generateFdInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFdInsightsPrompt',
  input: {schema: GenerateFdInsightsInputSchema},
  output: {schema: GenerateFdInsightsOutputSchema},
  prompt: `You are a financial advisor specializing in fixed deposit (FD) investments in India. Based on the user's FD details, provide personalized financial tips and insights.

Consider alternative FD schemes with potentially higher returns for the same principal, insights related to tax implications on the fixed deposit, and other relevant advice to help the user make informed decisions.

FD Amount: {{fdAmount}} INR
Interest Rate: {{interestRate}}%
Period: {{period}} years
Compounding Frequency: {{compoundingFrequency}}

Insights:`,
});

const generateFdInsightsFlow = ai.defineFlow(
  {
    name: 'generateFdInsightsFlow',
    inputSchema: GenerateFdInsightsInputSchema,
    outputSchema: GenerateFdInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
