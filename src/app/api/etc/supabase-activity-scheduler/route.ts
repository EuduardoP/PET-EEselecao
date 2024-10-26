import { createSupabaseBrowser } from "@/utils/supabase/client"

const supabase = createSupabaseBrowser()

export async function GET() {
	try {
		// Fetch data to prevent Supabase project from pausing
		const { data, error } = await supabase.from("selecao").select()
		if (error) throw new Error(error.message)
		return Response.json(data)
	} catch (error) {
		const message = (error as Error).message ?? "An error occurred."
		return Response.json({ error: message }, { status: 400 })
	}
}
