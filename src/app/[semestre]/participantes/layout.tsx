import { Button } from "@/components/ui/button"
import { type AuthorizedUser, getAuthorized } from "@/http/api"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import GoBackButton from "./goBackButton"

export default async function ParticipantesLayout({
	children,
}: {
	children: ReactNode
}) {
	const session = await getServerSession()
	const authorized = await getAuthorized()

	let isAuthorized = false

	if (!session) {
		redirect("/login")
	}

	if (session.user?.email) {
		const userAuthorized = authorized.some(
			(user: AuthorizedUser) => user.email === session.user?.email,
		)

		if (!userAuthorized) {
			return (
				<div className="flex flex-col justify-center items-center min-h-screen text-red-800 p-6 rounded-lg shadow-lg">
					<h1 className="text-5xl font-bold mb-4">Acesso não autorizado</h1>
					<sub className="text-lg mb-2">
						Você não tem permissão para acessar esta página
					</sub>
					<GoBackButton />
				</div>
			)
		}
		isAuthorized = true
	} else {
		redirect("/login")
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 p-6">{children}</main>
		</div>
	)
}
