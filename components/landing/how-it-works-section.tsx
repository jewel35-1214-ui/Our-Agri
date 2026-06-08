import Image from 'next/image'
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

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-8 md:grid-cols-1">
            {steps.map((item, index) => (
              <div key={item.step} className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-3 border-primary bg-primary/10 text-primary shadow-md">
                    <item.icon className="h-8 w-8" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mt-2 h-12 w-0.5 bg-border" />
                  )}
                </div>
                
                <div className="pb-8 pt-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Side Image */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="relative h-[450px] w-full overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/hero-farm.png"
                alt="How OurAgri works"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
