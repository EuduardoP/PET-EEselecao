import { fetchUserById } from "@/http/db"
import ClientUserComponent from "./_client"

export default async function ParticipantePage({
	params,
}: { params: { id: string } }) {
	const { data: inscrito } = await fetchUserById(params.id)
	console.log(params.id)

	return (
		<>
			<ClientUserComponent data={inscrito} />
		</>
	)
}
