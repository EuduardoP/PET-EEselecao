import { type AuthorizedUser, fetchAuthorized } from "@/http/db"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export default async function ParticipantesLayout({
	children,
}: {
	children: ReactNode
}) {
	const session = await getServerSession()
	const { data: authorized } = await fetchAuthorized()

	if (!session) {
		redirect("/login")
	}

	if (session.user?.email && authorized) {
		const userAuthorized = authorized.some(
			(user: AuthorizedUser) => user.email === session.user?.email,
		)

		if (!userAuthorized) {
			redirect("/denied")
		}
	} else {
		redirect("/login")
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 p-6">{children}</main>
		</div>
	)
}
