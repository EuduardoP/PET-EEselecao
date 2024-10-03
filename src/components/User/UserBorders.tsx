"use client"

import { changeStatus, deleteUser } from "@/http/api"
import { CircleCheck, CircleX, Hourglass, Trash2 } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "../ui/context-menu"
import type { SubscriberData } from "./UserRoot"

interface UserBordersProps {
	children: React.ReactNode
	subscriber?: SubscriberData
	colorBorders?: boolean
	onSubscriberClick?: (subscriberEmail: string) => void
	disableChangeStatus?: boolean
}

export function UserBorders({
	children,
	subscriber,
	onSubscriberClick,
	disableChangeStatus,
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
		<ContextMenu>
			<ContextMenuTrigger asChild disabled={disableChangeStatus}>
				<Card
					key={subscriber.email}
					onClick={() => onSubscriberClick?.(subscriber.id)}
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
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => changeStatus("Aprovado", subscriber.id)}
					className="gap-2"
				>
					<CircleCheck size={20} />
					Aprovado
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => changeStatus("Pendente", subscriber.id)}
					className="gap-2"
				>
					<Hourglass size={20} />
					Pendente
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => changeStatus("Reprovado", subscriber.id)}
					className="gap-2"
				>
					<CircleX size={20} />
					Reprovado
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={() => deleteUser(subscriber.id)}
					className="gap-2"
				>
					<Trash2 size={20} />
					Remover
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	)
}
