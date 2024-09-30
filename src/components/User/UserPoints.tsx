import { Badge } from "../ui/badge"

export function UserPoints({ value }: { value: number }) {
	return (
		<Badge className="text-xs md:text-base flex items-center justify-center">
			{value.toFixed(2)}
		</Badge>
	)
}
