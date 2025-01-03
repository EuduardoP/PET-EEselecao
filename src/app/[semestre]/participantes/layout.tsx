import type { AuthorizedUser } from "@/app/api/authorized/route"
import { getAuthorized } from "@/http/api"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export default async function ParticipantesLayout({
	children,
}: {
	children: ReactNode
}) {
	const session = await getServerSession()
	const authorized = await getAuthorized()
	if (!session) {
		redirect("/login")
	}
	if (session.user?.email && authorized) {
		const userAuthorized = authorized.data.some(
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
