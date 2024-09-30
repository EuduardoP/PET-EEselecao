import { cn } from "@/lib/utils"

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
			<hr className="col-span-4 border-t border-gray-200 my-1" />
			{children}
		</div>
	)
}
