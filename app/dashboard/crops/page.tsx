import { createClient } from "@/lib/supabase/server"
import { CropsClient } from "@/components/dashboard/crops/crops-client"

export default async function CropsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: crops } = await supabase
    .from("crops")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return <CropsClient initialCrops={crops || []} />
}
