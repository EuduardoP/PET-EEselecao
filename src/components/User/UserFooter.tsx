import { cn } from "@/lib/utils"
import { Separator } from "../ui/separator"

export function UserFooter({
	children,
	className, // Adicionando a opção de passar classes personalizadas
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div
			className={cn(
				"grid grid-cols-4 col-span-3 items-center space-y-2 gap-4",
				className,
			)}
		>
			<Separator className="col-span-4" />
			{children}
		</div>
	)
}
