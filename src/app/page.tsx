import FdCalculator from '@/components/fd-calculator';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <header className="mb-8 flex flex-col items-center gap-4 text-center">
        <Logo />
        <h1 className="font-headline text-4xl font-bold text-foreground">
          FD Insights
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Calculate your Fixed Deposit returns and get personalized, AI-powered insights to maximize your investment.
        </p>
      </header>
      <main className="w-full max-w-2xl">
        <FdCalculator />
      </main>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FD Insights. All rights reserved.</p>
      </footer>
    </div>
  );
}
