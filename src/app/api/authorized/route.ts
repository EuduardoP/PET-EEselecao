import { Client } from "@notionhq/client"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type { RootAuthorizedUser } from "./types"

export type AuthorizedUser = {
	id: string
	email: string
	role: "Admin" | "User"
}

export async function GET() {
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
		})
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
		const data = formatData(response.results as unknown as RootAuthorizedUser[])
		return NextResponse.json({
			data: data,
			error: null,
		})
	} catch (error) {
		return NextResponse.json(
			{ data: null, error: `Failed to fetch AuthorizedUsers ${error}` },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
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

	const AuthorizedUsersID = process.env.NOTION_AUTHORIZED_DATABASE_ID
	if (!AuthorizedUsersID) {
		throw new Error("NOTION_AUTHORIZED_DATABASE_ID is not defined")
	}
	try {
		const { email, role }: { email: string; role: string } =
			await request.json()

		const response = await notion.pages.create({
			parent: {
				database_id: AuthorizedUsersID,
			},
			properties: {
				Email: {
					email: email,
				},
				Cargo: {
					select: {
						name: role,
					},
				},
			},
		})
		const uuid = response.id
		await notion.pages.update({
			page_id: uuid,
			properties: {
				Id: {
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
		return NextResponse.json({
			error: null,
			status: 200,
			statusText: "OK",
		})
	} catch {
		return NextResponse.json(
			{
				error: "Failed to create authorized user",
				status: 500,
				statusText: "Internal Server Error",
			},
			{ status: 500 },
		)
	}
}
