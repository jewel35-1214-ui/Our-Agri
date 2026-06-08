import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Sprout, Wallet } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sprout className="h-4 w-4" />
            Smart Farming Solutions
          </div>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Grow Smarter with{' '}
            <span className="text-primary">OurAgri</span>
          </h1>
          
          <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            Empowering farmers with digital tools to manage crops, track expenses, 
            analyze profits, and get AI-powered fertilizer recommendations. 
            Transform your farming operations today.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">5,000+</span>
              <span className="text-sm text-muted-foreground">Active Farmers</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">25%</span>
              <span className="text-sm text-muted-foreground">Avg. Yield Increase</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
              <Wallet className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">30%</span>
              <span className="text-sm text-muted-foreground">Cost Reduction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
