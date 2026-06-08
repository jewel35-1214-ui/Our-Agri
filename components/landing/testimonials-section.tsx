import Image from 'next/image'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "OurAgri has transformed how I manage my rice paddies. The expense tracking alone has helped me identify where I was overspending.",
    author: "Maria Santos",
    role: "Rice Farmer, Nueva Ecija",
    image: "/images/farmer-1.png",
  },
  {
    quote: "The fertilizer recommendations are spot-on. My yields have increased by 20% since I started following the app suggestions.",
    author: "Juan dela Cruz",
    role: "Vegetable Farmer, Benguet",
    image: "/images/farmer-2.png",
  },
  {
    quote: "Finally, a farming app that understands Filipino farmers. Simple to use and incredibly helpful for tracking my coconut plantation.",
    author: "Pedro Reyes",
    role: "Coconut Farmer, Quezon",
    image: "/images/farmer-3.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Farmers Across the Philippines
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/30"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
              <blockquote className="relative">
                <p className="text-lg leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
