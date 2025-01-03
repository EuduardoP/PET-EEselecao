import type { usuarioFormSchema } from "@/app/[semestre]/formulario/[id]/formInput"
import type { SubscriberData } from "@/components/User/UserRoot"
import { Client } from "@notionhq/client"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type { z } from "zod"
import type { RootMembers } from "../types"

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const headersList = headers()
	const authorization = headersList.get("Authorization")
	const validToken = `Bearer ${process.env.AUTHORIZED_KEY}`

	if (!authorization || authorization !== validToken) {
		return NextResponse.json(
			{ data: null, error: "Unauthorized" },
			{ status: 401 },
		)
	}

	if (!process.env.NOTION_API_KEY) {
		throw new Error("NOTION_API_KEY is not defined")
	}

	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})
	const MembersID = process.env.NOTION_MEMBERS_DATABASE_ID
	if (!MembersID) {
		throw new Error("NOTION_MEMBERS_DATABASE_ID is not defined")
	}
	try {
		const response = await notion.databases.query({
			database_id: MembersID,
			filter: {
				property: "id",
				rich_text: {
					equals: params.id,
				},
			},
		})
		if (response.results.length === 0) {
			return NextResponse.json(
				{ data: null, error: "Usuario não encontrado" },
				{ status: 404 },
			)
		}
		const formatData = (inputData: RootMembers[]): SubscriberData[] => {
			return inputData.map((item) => {
				const { properties } = item
				return {
					id: properties.id.title[0].plain_text,
					name: properties.name.rich_text[0].plain_text,
					email: properties.email.email,
					status: properties.status.select?.name ?? "",
					matricula: properties.matricula.rich_text[0].plain_text ?? "",
					mediaApresentacao: properties.mediaApresentacao.number ?? 0,
					mediaIndividual: properties.mediaIndividual.number ?? 0,
					mediaGrupo: properties.mediaGrupo.number ?? 0,
					mediaEntrevista: properties.mediaEntrevista.number ?? 0,
					mediaMembro: properties.mediaMembro.number ?? 0,
					mediaFinal: properties.mediaFinal.number ?? 0,
					semestre: properties.semestre.number?.toString() ?? "",
					identificacao: properties.identificacao.select?.name ?? "",
					conhecimentoPET:
						properties.conhecimentoPET.rich_text[0]?.plain_text ?? "",
					interessePET: properties.interessePET.rich_text[0]?.plain_text ?? "",
					competenciasDesejadas:
						properties.competenciasDesejadas.rich_text[0]?.plain_text ?? "",
					atividadesExtracurriculares:
						properties.atividadesExtracurriculares.rich_text[0]?.plain_text ??
						"",
					atividadesInteresse:
						properties.atividadesInteresse.rich_text[0]?.plain_text ?? "",
					cargaHoraria: properties.cargaHoraria.rich_text[0]?.plain_text ?? "",
				}
			})
		}
		const data = formatData(response.results as unknown as RootMembers[])
		return NextResponse.json({
			data: data,
			error: null,
		})
	} catch {
		return NextResponse.json({ error: "Failed to get member" }, { status: 500 })
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const headersList = headers()
	const authorization = headersList.get("Authorization")
	const validToken = `Bearer ${process.env.AUTHORIZED_KEY}`

	if (!authorization || authorization !== validToken) {
		return NextResponse.json(
			{ error: "Unauthorized", status: 401, statusText: "Unauthorized" },
			{ status: 401 },
		)
	}

	if (!process.env.NOTION_API_KEY) {
		throw new Error("NOTION_API_KEY is not defined")
	}

	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})

	try {
		await notion.pages.update({
			page_id: params.id,
			archived: true,
		})

		return NextResponse.json({
			error: null,
			status: 200,
			statusText: "Member deleted successfully",
		})
	} catch {
		return NextResponse.json(
			{
				error: "Failed to delete member",
				status: 500,
				statusText: "Internal Server Error",
			},
			{ status: 500 },
		)
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const headersList = headers()
	const authorization = headersList.get("Authorization")
	const validToken = `Bearer ${process.env.AUTHORIZED_KEY}`

	if (!authorization || authorization !== validToken) {
		return NextResponse.json(
			{ error: "Unauthorized", status: 401, statusText: "Unauthorized" },
			{ status: 401 },
		)
	}

	if (!process.env.NOTION_API_KEY) {
		throw new Error("NOTION_API_KEY is not defined")
	}

	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})

	const membersID = process.env.NOTION_MEMBERS_DATABASE_ID
	if (!membersID) {
		throw new Error("NOTION_MEMBERS_DATABASE_ID is not defined")
	}
	try {
		const data: z.infer<typeof usuarioFormSchema> & {
			status: "Pendente" | "Aprovado" | "Reprovado"
			pageId: string
		} = await request.json()
		await notion.pages.update({
			page_id: params.id,
			properties: {
				name: {
					rich_text: [
						{
							text: {
								content: data.name,
							},
						},
					],
				},
				email: {
					email: data.email,
				},
				matricula: {
					rich_text: [
						{
							text: {
								content: data.matricula,
							},
						},
					],
				},
				status: {
					select: {
						name: data.status,
					},
				},
				semestre: {
					number: Number(data.semestre),
				},
				identificacao: {
					select: {
						name: data.identificacao,
					},
				},
				conhecimentoPET: {
					rich_text: [
						{
							text: {
								content: data.conhecimentoPET,
							},
						},
					],
				},
				interessePET: {
					rich_text: [
						{
							text: {
								content: data.interessePET,
							},
						},
					],
				},
				competenciasDesejadas: {
					rich_text: [
						{
							text: {
								content: data.competenciasDesejadas,
							},
						},
					],
				},
				atividadesExtracurriculares: {
					rich_text: [
						{
							text: {
								content: data.atividadesExtracurriculares,
							},
						},
					],
				},
				atividadesInteresse: {
					rich_text: [
						{
							text: {
								content: data.atividadesInteresse,
							},
						},
					],
				},
				cargaHoraria: {
					rich_text: [
						{
							text: {
								content: data.cargaHoraria,
							},
						},
					],
				},
			},
		})
		return NextResponse.json({
			error: null,
			status: 200,
			statusText: "Member updated successfully",
		})
	} catch {
		return NextResponse.json(
			{
				error: "Failed to update member",
				status: 500,
				statusText: "Internal Server Error",
			},
			{ status: 500 },
		)
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const headersList = headers()
	const authorization = headersList.get("Authorization")
	const validToken = `Bearer ${process.env.AUTHORIZED_KEY}`

	if (!authorization || authorization !== validToken) {
		return NextResponse.json(
			{ error: "Unauthorized", status: 401, statusText: "Unauthorized" },
			{ status: 401 },
		)
	}
	if (!process.env.NOTION_API_KEY) {
		throw new Error("NOTION_API_KEY is not defined")
	}
	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})

	try {
		const { newStatus }: { newStatus: "Aprovado" | "Reprovado" | "Pendente" } =
			await request.json()
		await notion.pages.update({
			page_id: params.id,
			properties: {
				status: {
					select: {
						name: newStatus,
					},
				},
			},
		})
		return NextResponse.json({
			error: null,
			status: 200,
			statusText: "Status updated successfully",
		})
	} catch {
		return NextResponse.json(
			{
				error: "Failed to update status",
				status: 500,
				statusText: "Internal Server Error",
			},
			{ status: 500 },
		)
	}
}
