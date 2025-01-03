import { getAuthorized, getSelecao } from "@/http/api"
import { getServerSession } from "next-auth"
import { ClientComponent } from "./_client"

export default async function Participantes({
	params,
}: { params: { semestre: string } }) {
	const session = await getServerSession()

	const selecao = await getSelecao()
	const authorized = await getAuthorized()

	function isAuthorized() {
		if (!session?.user?.email || !authorized) {
			return false
		}

		if (!authorized) {
			return false
		}

		const autorizado = authorized.data.find((authUser) => {
			return authUser.email === session.user?.email
		})

		return autorizado?.role === "Admin"
	}
	return (
		<div>
			<ClientComponent
				params={params}
				selecao={selecao.data}
				authorized={isAuthorized()}
				session={session}
			/>
		</div>
	)
}
