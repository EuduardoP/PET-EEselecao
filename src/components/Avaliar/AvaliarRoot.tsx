import type { ReactNode } from "react"
import { Card } from "../ui/card"

interface AvaliarRootProps {
	children: ReactNode
}

export function AvaliarRoot({ children }: AvaliarRootProps) {
	return <Card>{children}</Card>
}
