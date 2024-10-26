import type { SubscriberData } from "@/components/User/UserRoot"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { createSupabaseServer } from "@/utils/supabase/server"

export type SelecaoData = {
	semestre: string
	date_from: string
	date_to: string
	edital: string
}

export type AuthorizedUser = {
	id: string
	email: string
	role: "admin" | "user"
}

export type SupabaseResponse<dataType> = {
	error: null | string
	data: dataType | null
	count: null | number
	status: number
	statusText: string
}

export async function fetchSelecao(): Promise<SupabaseResponse<SelecaoData[]>> {
	const supabase = createSupabaseServer()

	const { data, error, status, statusText, count } = await supabase
		.from("selecao")
		.select()

	if (error) {
		console.error("Erro ao buscar seleção:", error)
		return {
			error: error.message,
			data: null,
			count: null,
			status,
			statusText,
		}
	}

	return {
		error: null,
		data,
		count,
		status,
		statusText,
	}
}

export async function fetchAuthorized(): Promise<
	SupabaseResponse<AuthorizedUser[]>
> {
	const supabase = createSupabaseServer()

	const { data, error, status, statusText, count } = await supabase
		.from("autorizados")
		.select()

	if (error) {
		console.error("Erro ao buscar seleção:", error)
		return {
			error: error.message,
			data: null,
			count: null,
			status,
			statusText,
		}
	}

	return {
		error: null,
		data,
		count,
		status,
		statusText,
	}
}

export async function fetchParticipantes(): Promise<
	SupabaseResponse<SubscriberData[]>
> {
	const supabase = createSupabaseServer()

	const { data, error, status, statusText, count } = await supabase
		.from("participantes")
		.select()

	if (error) {
		console.error("Erro ao buscar seleção:", error)
		return {
			error: error.message,
			data: null,
			count: null,
			status,
			statusText,
		}
	}

	return {
		error: null,
		data,
		count,
		status,
		statusText,
	}
}

export async function fetchUserById(
	userId: string,
): Promise<SupabaseResponse<SubscriberData>> {
	const supabase = createSupabaseServer()

	const { data, error, status, statusText } = await supabase
		.from("participantes")
		.select("*")
		.eq("id", userId)
		.single()

	if (error) {
		console.error("Erro ao buscar usuário:", error)
		return {
			error: error.message,
			data: null,
			count: null,
			status,
			statusText,
		}
	}

	return {
		error: null,
		data,
		count: null,
		status,
		statusText,
	}
}

export async function updateParticipanteStatus(
	id: string,
	newStatus: string,
): Promise<SupabaseResponse<null>> {
	const supabase = createSupabaseBrowser()

	const { error, status, statusText } = await supabase
		.from("participantes")
		.update({ status: newStatus })
		.eq("id", id)

	if (error) {
		console.error("Erro ao atualizar status do participante:", error)
		return {
			error: error.message,
			data: null,
			count: null,
			status,
			statusText,
		}
	}

	return {
		error: null,
		data: null,
		count: null,
		status,
		statusText,
	}
}
