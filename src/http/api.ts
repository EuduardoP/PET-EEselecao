const URL_API = "http://localhost:3000"

import type { usuarioFormSchema } from "@/app/[semestre]/formulario/[id]/formInput"
import type { createFormSchema } from "@/app/create/formInput"
import type { iniciarFormSchema } from "@/components/HomeComponent/formInput"
import type { SubscriberData } from "@/components/User/UserRoot"
import { toast } from "@/hooks/use-toast"
import { queryClient } from "@/lib/reactQueryProvider"
import { format } from "date-fns"
import type { z } from "zod"

export interface SelecaoData {
	data: {
		semestre: string
		dateRange: {
			from: string
			to: string
		}
		edital: string
	}
}

export async function getInscritos(id?: string): Promise<SubscriberData[]> {
	const url = id ? `${URL_API}/participantes/${id}` : `${URL_API}/participantes`
	const response = await fetch(url)

	if (!response.ok) {
		throw new Error("Erro ao buscar inscritos")
	}

	const data = await response.json()
	return id ? [data] : data
}

export async function changeStatus(status: string, id: string) {
	try {
		const response = await fetch(`${URL_API}/participantes/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
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
	} catch (error) {
		toast({
			title: "Erro ao atualizar status",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
	}
}

export async function deleteUser(id: string) {
	try {
		const response = await fetch(`${URL_API}/participantes/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
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
	try {
		const response = await fetch(`${URL_API}/selecao`)
		if (!response.ok) {
			throw new Error("Network response was not ok")
		}
		const data: SelecaoData = await response.json()
		if (!data) {
			throw new Error("No data found")
		}
		return data
	} catch (error) {
		toast({
			title: "Erro ao buscar seleção",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
		throw error
	}
}

export async function createFormulario(
	values: z.infer<typeof iniciarFormSchema>,
): Promise<{ error: boolean; id?: string }> {
	try {
		const response = await fetch(`${URL_API}/participantes`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
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
		const response = await fetch(`${URL_API}/participantes/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
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
