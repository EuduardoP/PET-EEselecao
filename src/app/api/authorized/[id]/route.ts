import { Client } from "@notionhq/client"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type { AuthorizedUser } from "../route"
import type { RootAuthorizedUser } from "../types"

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
	const AuthorizedUsersID = process.env.NOTION_AUTHORIZED_DATABASE_ID
	if (!AuthorizedUsersID) {
		throw new Error("NOTION_AUTHORIZED_DATABASE_ID is not defined")
	}
	try {
		const response = await notion.databases.query({
			database_id: AuthorizedUsersID,
			filter: {
				property: "Id",
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

		const formatData = (inputData: RootAuthorizedUser[]): AuthorizedUser[] => {
			return inputData.map((item) => {
				const { properties } = item
				return {
					id: properties.Id.title[0].plain_text,
					email: properties.Email.email,
					role: properties.Cargo.select.name as "Admin" | "User",
				}
			})
		}
		return NextResponse.json({
			data: formatData(response.results as unknown as RootAuthorizedUser[]),
			error: null,
		})
	} catch {
		return NextResponse.json(
			{ error: "Failed to get authorized user" },
			{ status: 500 },
		)
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
		const AuthorizedUsersID = process.env.NOTION_AUTHORIZED_DATABASE_ID
		if (!AuthorizedUsersID) {
			throw new Error("NOTION_AUTHORIZED_DATABASE_ID is not defined")
		}

		await notion.pages.update({
			page_id: params.id,
			archived: true,
		})

		return NextResponse.json(
			{ error: null, status: 200, statusText: "OK" },
			{ status: 200 },
		)
	} catch {
		return NextResponse.json(
			{
				error: "Failed to delete authorized user",
				status: 500,
				statusText: "Internal Server Error",
			},
			{ status: 500 },
		)
	}
}
