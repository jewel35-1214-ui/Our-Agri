import { 
  Sprout, 
  BarChart3, 
  Wallet, 
  FlaskConical, 
  Calendar, 
  TrendingUp 
} from 'lucide-react'

const features = [
  {
    name: 'Crop Management',
    description: 'Track planting schedules, monitor growth stages, and record yields for all your crops in one place.',
    icon: Sprout,
  },
  {
    name: 'Expense Tracking',
    description: 'Log all farming expenses by category - seeds, fertilizers, labor, equipment, and more.',
    icon: Wallet,
  },
  {
    name: 'Income & Profit Analysis',
    description: 'Record sales, calculate profits per crop, and understand your farm financial health.',
    icon: TrendingUp,
  },
  {
    name: 'Smart Analytics',
    description: 'Visual dashboards showing crop performance, expense trends, and profitability insights.',
    icon: BarChart3,
  },
  {
    name: 'Fertilizer Recommendations',
    description: 'Get AI-powered fertilizer advice based on crop type, soil conditions, and growth stage.',
    icon: FlaskConical,
  },
  {
    name: 'Seasonal Planning',
    description: 'Plan your farming calendar with planting and harvest date tracking for optimal timing.',
    icon: Calendar,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-primary">
            Features
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Manage Your Farm
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Comprehensive tools designed specifically for modern farmers to increase productivity and profitability.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.name}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
