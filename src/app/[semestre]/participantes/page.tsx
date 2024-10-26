import { fetchAuthorized, fetchParticipantes, fetchSelecao } from "@/http/db"
import { getServerSession } from "next-auth"
import { ClientComponent } from "./_client"

export default async function Participantes({
	params,
}: { params: { semestre: string } }) {
	const { data: selecao } = await fetchSelecao()
	const { data: authorized } = await fetchAuthorized()
	const session = await getServerSession()
	return (
		<div>
			<ClientComponent
				params={params}
				selecao={selecao}
				authorized={authorized}
				session={session}
			/>
		</div>
	)
}
