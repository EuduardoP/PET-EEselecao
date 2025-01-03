import type { SubscriberData } from "@/components/User/UserRoot"
import { Client } from "@notionhq/client"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type { RootMembers } from "./types"

export async function GET() {
	const headersList = headers()
	const authorization = headersList.get("Authorization")
	const validToken = `Bearer ${process.env.AUTHORIZED_KEY}`

	// Validação de autorização
	if (!authorization || authorization !== validToken) {
		return NextResponse.json(
			{ data: null, error: "Unauthorized" },
			{ status: 401 },
		)
	}

	// Verificação de variáveis de ambiente
	if (!process.env.NOTION_API_KEY) {
		throw new Error("NOTION_API_KEY is not defined")
	}

	if (!process.env.NOTION_MEMBERS_DATABASE_ID) {
		throw new Error("NOTION_MEMBERS_DATABASE_ID is not defined")
	}

	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})

	const membersID = process.env.NOTION_MEMBERS_DATABASE_ID

	try {
		const response = await notion.databases.query({
			database_id: membersID,
		})

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
		return NextResponse.json({
			data: formatData(response.results as unknown as RootMembers[]),
			error: null,
		})
	} catch {
		console.error("Erro ao buscar dados do Notion")

		return NextResponse.json(
			{ data: null, error: "Failed to fetch members" },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	const headersList = headers()
	const authorization = headersList.get("Authorization")
	const validToken = `Bearer ${process.env.AUTHORIZED_KEY}`

	// Validação de autorização
	if (!authorization || authorization !== validToken) {
		return NextResponse.json(
			{ error: "Unauthorized", status: 401, statusText: "Unauthorized" },
			{ status: 401 },
		)
	}

	// Verificação de variáveis de ambiente
	if (!process.env.NOTION_API_KEY) {
		throw new Error("NOTION_API_KEY is not defined")
	}
	if (!process.env.NOTION_MEMBERS_DATABASE_ID) {
		throw new Error("NOTION_MEMBERS_DATABASE_ID is not defined")
	}

	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})

	const membersID = process.env.NOTION_MEMBERS_DATABASE_ID
	if (!membersID) {
		throw new Error("NOTION_MEMBERS_DATABASE_ID is not defined")
	}

	try {
		const {
			name,
			email,
			matricula,
		}: { name: string; email: string; matricula: string } = await request.json()
		const response = await notion.pages.create({
			parent: {
				database_id: membersID,
			},
			properties: {
				name: {
					rich_text: [
						{
							text: {
								content: name,
							},
						},
					],
				},
				email: {
					email: email,
				},
				matricula: {
					rich_text: [
						{
							text: {
								content: matricula,
							},
						},
					],
				},
			},
		})
		const uuid = response.id
		await notion.pages.update({
			page_id: uuid,
			properties: {
				id: {
					title: [
						{
							text: {
								content: uuid,
							},
						},
					],
				},
			},
		})

		return NextResponse.json(
			{ uuid: uuid, error: null, status: 200, statusText: "OK" },
			{ status: 200 },
		)
	} catch {
		return NextResponse.json(
			{
				uuid: null,
				error: "Failed to create member",
				status: 500,
				statusText: "Internal Server Error",
			},
			{ status: 500 },
		)
	}
}
