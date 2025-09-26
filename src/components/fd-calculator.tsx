
"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  BrainCircuit,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAiInsightsAction } from "@/app/actions";
import TypewriterEffect from "./typewriter-effect";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  fdAmount: z.coerce.number().min(1000, {
    message: "Principal amount must be at least ₹1,000.",
  }),
  interestRate: z.coerce
    .number()
    .min(0.1, { message: "Interest rate must be positive." })
    .max(25, { message: "Interest rate seems too high." }),
  period: z.coerce
    .number()
    .min(1, { message: "Period must be at least 1 year." })
    .max(50, { message: "Period cannot exceed 50 years." }),
  compoundingFrequency: z.enum(["monthly", "quarterly", "annually"]),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  maturityAmount: number;
  totalInterest: number;
};

export default function FdCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fdAmount: 50000,
      interestRate: 6.5,
      period: 5,
      compoundingFrequency: "quarterly",
    },
  });

  const onCalculate = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    setAiInsights(null);

    const { fdAmount, interestRate, period, compoundingFrequency } = values;
    const P = fdAmount;
    const r = interestRate / 100;
    const t = period;
    const n = { monthly: 12, quarterly: 4, annually: 1 }[
      compoundingFrequency
    ];

    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityAmount - P;

    setTimeout(() => {
      setResult({ maturityAmount, totalInterest });
      setIsCalculating(false);
    }, 500);
  };

  const onGetInsights = async () => {
    setIsGenerating(true);
    setAiInsights(null);
    const values = form.getValues();
    const result = await getAiInsightsAction(values);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error Generating Insights",
        description: result.error,
      });
    } else {
      setAiInsights(result.data);
    }
    setIsGenerating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">FD Calculator</CardTitle>
          <CardDescription>
            Enter your investment details to see it grow.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCalculate)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fdAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 6.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compoundingFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compounding Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select compounding frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isCalculating}>
                {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCalculating ? "Calculating..." : "Calculate"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {(isCalculating || result) && (
        <Card className="w-full shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="font-headline">Your Results</CardTitle>
            <CardDescription>
              Here is the projected growth of your investment.
            </CardDescription>
          </CardHeader>
          {isCalculating ? (
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-2/5" />
               </div>
               <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-2/5" />
               </div>
            </CardContent>
          ) : result && (
            <>
              <CardContent className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maturity Amount:</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(result.maturityAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button
                  onClick={onGetInsights}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BrainCircuit className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? "Generating Insights..." : "Get AI-Powered Insights"}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
      
      {(isGenerating || aiInsights) && (
         <Card className="w-full shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
               <CardTitle className="font-headline flex items-center gap-2">
                  <BrainCircuit className="text-accent"/>
                  Personalized Insights
               </CardTitle>
               <CardDescription>
                  Here are some AI-generated tips for your investment.
               </CardDescription>
            </CardHeader>
            <CardContent>
               {isGenerating ? (
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-3/4" />
                  </div>
               ) : (
                  aiInsights && <p className="text-sm leading-relaxed"><TypewriterEffect text={aiInsights} /></p>
               )}
            </CardContent>
         </Card>
      )}
    </div>
  );
}
