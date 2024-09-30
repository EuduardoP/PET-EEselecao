import { Card, CardContent } from "../ui/card"
import type { SubscriberData } from "./UserRoot"

interface UserBordersProps {
	children: React.ReactNode
	subscriber?: SubscriberData
	colorBorders?: boolean
	onSubscriberClick?: (subscriberEmail: string) => void
}

export function UserBorders({
	children,
	subscriber,
	onSubscriberClick,
	colorBorders,
}: UserBordersProps) {
	if (!subscriber)
		return (
			<Card className="w-full md:w-auto">
				<CardContent className="grid grid-cols-3 items-center gap-4 p-4 md:p-6 sm:justify-center">
					{children}
				</CardContent>
			</Card>
		)
	return (
		<Card
			key={subscriber.email}
			onClick={() => onSubscriberClick?.(subscriber.email)}
			className={`w-full md:w-auto ${onSubscriberClick ? "cursor-pointer" : ""} ${
				colorBorders
					? subscriber.status.toLowerCase() === "reprovado"
						? "border-red-500 border-2"
						: subscriber.status.toLowerCase() === "aprovado"
							? "border-green-500 border-2"
							: ""
					: ""
			}`}
		>
			<CardContent className="grid grid-cols-3 items-center gap-4 p-4 md:p-6 sm:justify-center">
				{children}
			</CardContent>
		</Card>
	)
}
