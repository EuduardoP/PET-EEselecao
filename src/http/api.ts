"use server"

import type { usuarioFormSchema } from "@/app/[semestre]/formulario/[id]/formInput"
import type { AuthorizedUser } from "@/app/api/authorized/route"
import type { Selecao } from "@/app/api/selecao/route"
import type { createFormSchema } from "@/app/create/formInput"
import type { iniciarFormSchema } from "@/components/HomeComponent/formInput"
import type { SubscriberData } from "@/components/User/UserRoot"
import { format } from "date-fns"
import type { z } from "zod"

export interface ResponseData<T> {
	data: T[]
	error: string | null
}

export async function getMembers(): Promise<ResponseData<SubscriberData>> {
	try {
		const url = `${process.env.URL}/api/members`
		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
				cache: "no-store",
			},
		}).then((req) => req.json())

		return { data: response.data, error: response.error }
	} catch {
		return { data: [], error: "Erro ao deletar inscrito" }
	}
}

export async function getMembersById(
	id: string,
): Promise<ResponseData<SubscriberData>> {
	try {
		const url = `${process.env.URL}/api/members/${id}`
		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
				cache: "no-store",
			},
		}).then((req) => req.json())

		return { data: response.data, error: response.error }
	} catch {
		return { data: [], error: "Erro ao deletar inscrito" }
	}
}

export async function changeStatus(newStatus: string, id: string) {
	const response = await fetch(`${process.env.URL}/api/members/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
		},
		body: JSON.stringify({ newStatus }),
		cache: "no-store",
	})

	// Verifica se a resposta foi bem-sucedida
	if (!response.ok) {
		const errorData = await response.json()
		console.error(
			`Erro ao alterar status: ${response.status} ${response.statusText}`,
			errorData,
		)
		return {
			status: response.status,
			statusText: response.statusText,
			error: errorData.error,
		}
	}

	const data = await response.json()

	return { status: response.status, statusText: response.statusText, data }
}

export async function deleteUser(id: string) {
	const response = await fetch(`${process.env.URL}/api/members/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
			cache: "no-store",
		},
	})

	if (!response.ok) {
		const errorData = await response.json()
		console.error(
			`Erro ao deletar participante: ${response.status} ${response.statusText}`,
			errorData,
		)
		return {
			status: response.status,
			statusText: response.statusText,
			error: errorData.error,
		}
	}

	const data = await response.json()

	return { status: response.status, statusText: response.statusText, data }
}

export async function createSelecao(data: z.infer<typeof createFormSchema>) {
	const formattedData = {
		semestre: `${data.semestre}${format(data.data.from, "yyyy")}`,
		data: {
			start: format(data.data.from, "yyyy-MM-dd"),
			end: format(data.data.to, "yyyy-MM-dd"),
		},
		edital: data.edital,
	}

	const response = await fetch(`${process.env.URL}/api/selecao`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
			accept: "application/json",
			cache: "no-store",
		},
		body: JSON.stringify(formattedData),
	})

	return { status: response.status, ok: response.ok }
}

export async function getSelecao(): Promise<ResponseData<Selecao>> {
	const response = await fetch(`${process.env.URL}/api/selecao`, {
		headers: {
			Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
			accept: "application/json",
			cache: "no-store",
		},
	}).then((req) => req.json())
	if (!response) {
		return { data: [], error: response.error }
	}
	return { data: response.data, error: response.error }
}

export async function createMember(
	data: z.infer<typeof iniciarFormSchema>,
): Promise<{ uuid: string; error: string | null }> {
	return fetch(`${process.env.URL}/api/members`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
			accept: "application/json",
			cache: "no-cache",
		},
		body: JSON.stringify(data),
	}).then((res) => res.json())
}

export async function updateFormulario(
	id: string,
	values: z.infer<typeof usuarioFormSchema>,
): Promise<{ error: string | null }> {
	try {
		await fetch(`${process.env.URL}/api/members/${id}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
				accept: "application/json",
				cache: "no-store",
			},
			body: JSON.stringify({ ...values, status: "Pendente", pageId: id }),
		})

		return { error: null }
	} catch {
		return { error: "Erro ao criar formulário" }
	}
}

export async function getAuthorized(): Promise<ResponseData<AuthorizedUser>> {
	const response = await fetch(`${process.env.URL}/api/authorized`, {
		headers: {
			Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
			accept: "application/json",
			cache: "no-store",
		},
	}).then((req) => req.json())

	if (!response) {
		return { data: [], error: `Error-response: ${response.error}` }
	}
	return { data: response.data, error: `Error-ok: ${response.error}` }
}

export async function deleteAuthorized(
	id: string,
): Promise<{ success: boolean; error: string | null }> {
	const response = await fetch(`${process.env.URL}/api/authorized/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
			accept: "application/json",
			cache: "no-store",
		},
	})
	if (!response.ok) {
		return { success: false, error: "Failed to delete authorized user" }
	}
	return { success: true, error: null }
}
export async function addAuthorized({
	email,
	role,
}: { email: string; role: string }) {
	const authorized: { data: AuthorizedUser[]; error: string | null } =
		await fetch(`${process.env.URL}/api/authorized/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
				accept: "application/json",
				cache: "no-cache",
			},
			body: JSON.stringify({ email, role }),
		}).then((res) => res.json())
	return authorized.data
}
