import type { SubscriberData } from "@/components/User/UserRoot"
import ClientUserComponent from "./_client"

export default async function ParticipantePage({
	params,
}: { params: { id: string } }) {
	const inscrito: { data: SubscriberData[]; error: string | null } =
		await fetch(`${process.env.URL}/api/members/${params.id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.AUTHORIZED_KEY}`,
				accept: "application/json",
			},
		}).then((res) => res.json())

	return (
		<>
			<ClientUserComponent data={inscrito.data[0]} />
		</>
	)
}
