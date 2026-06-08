import { UserPlus, Sprout, BarChart3 } from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up for free and set up your farm profile in minutes. Add your farm details and preferences.',
    icon: UserPlus,
  },
  {
    step: '02',
    title: 'Add Your Crops',
    description: 'Input your crops with planting dates, field locations, and expected yields. Track each crop lifecycle.',
    icon: Sprout,
  },
  {
    step: '03',
    title: 'Track & Analyze',
    description: 'Log expenses and income, view analytics, and get smart recommendations to optimize your farming.',
    icon: BarChart3,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-primary">
            How It Works
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get Started in Three Simple Steps
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Our platform is designed to be intuitive and easy to use, even if you&apos;re new to digital farming tools.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg">
                  <item.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <span className="mt-4 text-sm font-bold uppercase tracking-wider text-primary">
                  Step {item.step}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 max-w-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
