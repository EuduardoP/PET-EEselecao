import { Client } from "@notionhq/client"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type { RootSelecao } from "./types"

export interface Selecao {
	semestre: string
	data: {
		start: string
		end: string
	}
	edital: string
}

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

	if (!process.env.NOTION_SELECAO_DATABASE_ID) {
		throw new Error("NOTION_SELECAO_DATABASE_ID is not defined")
	}

	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})

	const selecaoID = process.env.NOTION_SELECAO_DATABASE_ID

	try {
		// Consulta ao Notion
		const response = await notion.databases.query({
			database_id: selecaoID,
		})

		const formatData = (inputData: RootSelecao[]): Selecao[] => {
			return inputData.map((item) => {
				const { properties } = item
				return {
					semestre: properties.semestre.title[0].plain_text,
					data: {
						start: properties.data.date.start,
						end: properties.data.date.end,
					},
					edital: properties.edital.url,
				}
			})
		}

		return NextResponse.json({
			data: formatData(response.results as unknown as RootSelecao[]),
			error: null,
		})
	} catch {
		console.error("Erro ao buscar dados do Notion")

		return NextResponse.json(
			{ data: null, error: "Failed to fetch selecao" },
			{ status: 500 },
		)
	}
}

export async function POST(req: Request) {
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
	if (!process.env.NOTION_SELECAO_DATABASE_ID) {
		throw new Error("NOTION_SELECAO_DATABASE_ID is not defined")
	}
	const notion = new Client({
		auth: process.env.NOTION_API_KEY,
	})

	const selecaoID = process.env.NOTION_SELECAO_DATABASE_ID
	try {
		const response = await notion.databases.query({
			database_id: selecaoID,
		})
		if (response.results.length > 0) {
			return NextResponse.json(
				{
					error: "Failed to create seleção",
					status: 409,
					statusText: "selecão already exists",
				},
				{ status: 409 },
			)
		}
		const { semestre, data, edital }: Selecao = await req.json()

		await notion.pages.create({
			parent: {
				database_id: selecaoID,
			},
			properties: {
				semestre: {
					title: [
						{
							text: {
								content: semestre,
							},
						},
					],
				},
				data: {
					date: {
						start: data.start,
						end: data.end,
					},
				},
				edital: {
					url: edital,
				},
			},
		})

		return NextResponse.json(
			{ error: null, status: 200, statusText: "selecão created" },
			{ status: 200 },
		)
	} catch {
		return NextResponse.json(
			{
				error: "Failed to create member",
				status: 500,
				statusText: "Internal Server Error",
			},
			{ status: 500 },
		)
	}
}
