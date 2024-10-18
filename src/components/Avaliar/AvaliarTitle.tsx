import { CardHeader, CardTitle } from "../ui/card"

export function AvaliarTitlee({ children }: { children: React.ReactNode }) {
	return (
		<CardHeader>
			<CardTitle>{children}</CardTitle>
		</CardHeader>
	)
}
