"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Pre-defined fertilizer guide data
export const fertilizerGuides = [
  {
    id: "rice-npk",
    cropName: "Rice",
    soilType: "Loamy Soil",
    nitrogenPercentage: 46,
    phosphorusPercentage: 26,
    potassiumPercentage: 13,
    fertilizerName: "NPK 16-16-16",
    applicationRate: "50-100 kg/hectare",
    applicationTiming: "Split into 3 doses: at planting, tillering, panicle initiation",
    bestPractices: [
      "Apply nitrogen in split doses for better absorption",
      "Avoid excess nitrogen to prevent lodging",
      "Apply phosphorus at transplanting",
      "Foliar spray with micronutrients if deficiency symptoms appear",
    ],
    season: "Wet season optimal",
  },
  {
    id: "corn-npk",
    cropName: "Corn",
    soilType: "Sandy Loam",
    nitrogenPercentage: 46,
    phosphorusPercentage: 20,
    potassiumPercentage: 20,
    fertilizerName: "NPK 14-14-14",
    applicationRate: "80-120 kg/hectare",
    applicationTiming: "60% at planting, 40% at V6 stage",
    bestPractices: [
      "Deep placement of fertilizer for better root access",
      "Side dress nitrogen at knee-high stage",
      "Ensure adequate moisture for nutrient availability",
      "Monitor for nitrogen deficiency symptoms",
    ],
    season: "Summer season preferred",
  },
  {
    id: "tomato-npk",
    cropName: "Tomato",
    soilType: "Clayey Loam",
    nitrogenPercentage: 16,
    phosphorusPercentage: 50,
    potassiumPercentage: 30,
    fertilizerName: "NPK 0-20-20 + Calcium",
    applicationRate: "5-10 kg/100m² bed area",
    applicationTiming: "Weekly fertigation during flowering and fruiting",
    bestPractices: [
      "Use balanced nitrogen to avoid excessive vegetative growth",
      "High phosphorus and potassium for fruit quality",
      "Apply calcium to prevent blossom end rot",
      "Organic mulch helps retain soil moisture",
    ],
    season: "Dry season for better quality",
  },
  {
    id: "cabbage-npk",
    cropName: "Cabbage",
    soilType: "Loamy Soil",
    nitrogenPercentage: 60,
    phosphorusPercentage: 20,
    potassiumPercentage: 20,
    fertilizerName: "NPK 16-16-16",
    applicationRate: "60-100 kg/hectare",
    applicationTiming: "Basal at 4 weeks, topdress at 6-8 weeks",
    bestPractices: [
      "Nitrogen-rich fertilizer for healthy leaf development",
      "Proper spacing prevents disease",
      "Mulching helps in moisture retention",
      "Regular watering essential for crispness",
    ],
    season: "Cool season (November-April)",
  },
  {
    id: "sugarcane-npk",
    cropName: "Sugarcane",
    soilType: "Deep Soil",
    nitrogenPercentage: 46,
    phosphorusPercentage: 23,
    potassiumPercentage: 20,
    fertilizerName: "NPK 10-10-20",
    applicationRate: "100-150 kg/hectare",
    applicationTiming: "At planting and 4-5 months after planting",
    bestPractices: [
      "Potassium-rich for better sugar content",
      "Adequate nitrogen for biomass development",
      "Organic matter incorporation improves soil structure",
      "Intercropping with legumes can reduce N requirement",
    ],
    season: "Requires well-spaced planting periods",
  },
  {
    id: "coconut-npk",
    cropName: "Coconut",
    soilType: "Sandy Loam",
    nitrogenPercentage: 35,
    phosphorusPercentage: 35,
    potassiumPercentage: 50,
    fertilizerName: "NPK 6-6-17-3Mg",
    applicationRate: "3-5 kg per tree per year",
    applicationTiming: "Split into 3-4 applications throughout the year",
    bestPractices: [
      "Potassium crucial for fruit development",
      "Apply in circular band around tree base",
      "Mulching conserves moisture",
      "Magnesium deficiency symptoms: orange-yellow discoloration on older leaves",
    ],
    season: "Year-round application",
  },
]

export async function getFertilizerGuides() {
  // For now, return the predefined guides
  // In future, this could fetch from database
  return fertilizerGuides
}

export async function getFertilizerGuideByCrop(cropName: string) {
  const guide = fertilizerGuides.find(
    (g) => g.cropName.toLowerCase() === cropName.toLowerCase()
  )
  return guide || null
}

export async function searchFertilizerGuides(searchTerm: string) {
  const term = searchTerm.toLowerCase()
  return fertilizerGuides.filter(
    (g) =>
      g.cropName.toLowerCase().includes(term) ||
      g.soilType.toLowerCase().includes(term) ||
      g.fertilizerName.toLowerCase().includes(term)
  )
}

// User's custom fertilizer records
export async function addCustomFertilizerRecord(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase.from("fertilizer_records").insert([
    {
      user_id: user.id,
      crop_id: data.crop_id || null,
      fertilizer_name: data.fertilizer_name,
      application_date: data.application_date,
      quantity_used: parseFloat(data.quantity_used),
      unit: data.unit,
      cost: parseFloat(data.cost) || 0,
      notes: data.notes || null,
    },
  ])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/fertilizer")
  return { success: true }
}

export async function deleteFertilizerRecord(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("fertilizer_records")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/fertilizer")
  return { success: true }
}
