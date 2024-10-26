const URL_API = process.env.SUPABASE_URL
const API_KEY = process.env.SUPABASE_ANON_KEY

import type { usuarioFormSchema } from "@/app/[semestre]/formulario/[id]/formInput"
import type { createFormSchema } from "@/app/create/formInput"
import type { iniciarFormSchema } from "@/components/HomeComponent/formInput"
import type { SubscriberData } from "@/components/User/UserRoot"
import { toast } from "@/hooks/use-toast"
import { queryClient } from "@/lib/reactQueryProvider"
import { format } from "date-fns"
import type { z } from "zod"

export interface SelecaoData {
	semestre: string
	date_from: string
	date_to: string
	edital: string
}

export async function getInscritos(id?: string): Promise<SubscriberData[]> {
	const url = id
		? `${URL_API}/participantes?id=eq.${id}`
		: `${URL_API}/participantes`
	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			apikey: `${API_KEY}`,
		},
	})

	if (!response.ok) {
		throw new Error("Erro ao buscar inscritos")
	}

	const data = await response.json()
	return id ? [data] : data
}

export async function changeStatus(status: string, id: string) {
	try {
		const response = await fetch(`${URL_API}/participantes?id=eq.${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				apikey: `${API_KEY}`,
			},
			body: JSON.stringify({
				status: `${status}`,
			}),
		})

		if (response.status === 200) {
			await queryClient.invalidateQueries({
				queryKey: ["inscritos"],
			})
		}
	} catch {
		toast({
			title: "Erro ao atualizar status",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
	}
}
export async function deleteUser(id: string) {
	try {
		const response = await fetch(`${URL_API}/participantes?id=eq.${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				apikey: `${API_KEY}`,
			},
		})

		if (response.status === 200) {
			await queryClient.invalidateQueries({
				queryKey: ["inscritos"],
			})
		}
	} catch (error) {
		toast({
			title: "Erro ao deletar usuário",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
	}
}

export async function createSelecao(data: z.infer<typeof createFormSchema>) {
	try {
		const formattedData = {
			...data,
			dateRange: {
				from: format(new Date(data.dateRange.from), "yyyy-MM-dd"),
				to: format(new Date(data.dateRange.to), "yyyy-MM-dd"),
			},
			semestre: `${data.semestre}${new Date(data.dateRange.from).getFullYear()}`,
		}

		await fetch(`${URL_API}/selecao`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				apikey: `${API_KEY}`,
			},
			body: JSON.stringify({
				data: formattedData,
			}),
		})
	} catch (error) {
		toast({
			title: "Erro ao criar seleção",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
	}
}

export async function getSelecao(): Promise<SelecaoData> {
	const response = await fetch(`${URL_API}/selecao`, {
		headers: {
			"Content-Type": "application/json",
			apikey: `${API_KEY}`,
		},
	})
	if (!response.ok) {
		throw new Error("Network response was not ok")
	}
	const data: SelecaoData = await response.json()
	if (!data) {
		throw new Error("No data found")
	}
	return data
}

export async function createFormulario(
	values: z.infer<typeof iniciarFormSchema>,
): Promise<{ error: boolean; id?: string }> {
	try {
		const response = await fetch(`${URL_API}/participantes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: `${API_KEY}`,
			},
			body: JSON.stringify({ ...values, status: "Pendente" }),
		})

		if (!response.ok) {
			toast({
				title: "Erro ao criar formulário",
				description: "Esse email já foi cadastrado",
			})
			return { error: true }
		}

		const data = await response.json()
		const id = data.id

		toast({
			title: "Formulário criado com sucesso",
			description: "Você será redirecionado para a página do formulário",
		})

		return { error: false, id }
	} catch (error) {
		toast({
			title: "Erro ao criar formulário",
			description:
				"Houve um erro ao tentar criar o formulário. Tente novamente.",
		})
		return { error: true }
	}
}

export async function updateFormulario(
	values: z.infer<typeof usuarioFormSchema>,
	id: string,
): Promise<{ error: boolean }> {
	try {
		const response = await fetch(`${URL_API}/participantes?id=eq.${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				apikey: `${API_KEY}`,
			},
			body: JSON.stringify({ ...values, status: "Pendente" }),
		})

		if (!response.ok) {
			toast({
				title: "Erro ao criar formulário",
				description: "Esse email já foi cadastrado",
			})
			return { error: true }
		}

		toast({
			title: "Formulário criado com sucesso",
			description: "Você será redirecionado para a página do formulário",
		})

		return { error: false }
	} catch (error) {
		toast({
			title: "Erro ao criar formulário",
			description:
				"Houve um erro ao tentar criar o formulário. Tente novamente.",
		})
		return { error: true }
	}
}

export async function addAuthorized(data: { email: string; role: string }) {
	try {
		const response = await fetch(`${URL_API}/autorizados`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: `${API_KEY}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			throw new Error("Erro ao adicionar autorizado")
		}

		return { error: false }
	} catch (error) {
		toast({
			title: "Erro ao adicionar autorizado",
			description:
				"Houve um erro ao tentar adicionar o autorizado. Tente novamente.",
		})
		return { error: true }
	}
}

export async function deleteAuthorized(email: string) {
	try {
		const getResponse = await fetch(
			`${URL_API}/autorizados?email=eq.${email}`,
			{
				headers: {
					"Content-Type": "application/json",
					apikey: `${API_KEY}`,
				},
			},
		)
		if (!getResponse.ok) {
			toast({
				title: "Erro ao buscar autorizado",
			})
		}
		const authorizedUsers = await getResponse.json()
		console.log(authorizedUsers)
		if (
			!authorizedUsers ||
			authorizedUsers.length === 0 ||
			!authorizedUsers[0].id
		) {
			toast({
				title: "Erro autorizado não encontrado",
			})
		}

		const response = await fetch(
			`${URL_API}/autorizados?id=eq.${authorizedUsers[0].id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					apikey: `${API_KEY}`,
				},
			},
		)
		if (!response.ok) {
			throw new Error("Erro ao deletar autorizado")
		}
		return { error: false }
	} catch (error) {
		toast({
			title: "Erro ao deletar autorizado",
			description: `Ocorreu o erro ${error}`,
		})
		return { error: true }
	}
}
