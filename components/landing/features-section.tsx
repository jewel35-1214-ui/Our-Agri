import Image from 'next/image'
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
    image: '/images/crops-management.png',
  },
  {
    name: 'Expense Tracking',
    description: 'Log all farming expenses by category - seeds, fertilizers, labor, equipment, and more.',
    icon: Wallet,
    image: '/images/crops-management.png',
  },
  {
    name: 'Income & Profit Analysis',
    description: 'Record sales, calculate profits per crop, and understand your farm financial health.',
    icon: TrendingUp,
    image: '/images/analytics-dashboard.png',
  },
  {
    name: 'Smart Analytics',
    description: 'Visual dashboards showing crop performance, expense trends, and profitability insights.',
    icon: BarChart3,
    image: '/images/analytics-dashboard.png',
  },
  {
    name: 'Fertilizer Recommendations',
    description: 'Get AI-powered fertilizer advice based on crop type, soil conditions, and growth stage.',
    icon: FlaskConical,
    image: '/images/fertilizer-guide.png',
  },
  {
    name: 'Seasonal Planning',
    description: 'Plan your farming calendar with planting and harvest date tracking for optimal timing.',
    icon: Calendar,
    image: '/images/crops-management.png',
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
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
            >
              {/* Feature Image */}
              <div className="relative h-40 w-full overflow-hidden bg-muted">
                <Image
                  src={feature.image}
                  alt={feature.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
              </div>
              
              {/* Feature Content */}
              <div className="p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
