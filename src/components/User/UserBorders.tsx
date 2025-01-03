"use client"

import { toast } from "@/hooks/use-toast"
import { type ResponseData, changeStatus, deleteUser } from "@/http/api"
import { queryClient } from "@/lib/reactQueryProvider"
import { useMutation } from "@tanstack/react-query"
import {
	Check,
	CircleCheck,
	CircleX,
	Hourglass,
	Trash2,
	User2Icon,
} from "lucide-react"
import { useRouter } from "next/navigation"
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
	authorized?: boolean
	onSubscriberClick?: (subscriberEmail: string) => void
	disableChangeStatus?: boolean
}

export function UserBorders({
	children,
	subscriber,
	onSubscriberClick,
	disableChangeStatus,
	colorBorders,
	authorized,
}: UserBordersProps) {
	const router = useRouter()

	const { mutateAsync: changeStatusFn } = useMutation({
		mutationFn: async (params: { id: string; newStatus: string }) => {
			const { status, statusText, error } = await changeStatus(
				params.newStatus,
				params.id,
			)
			return { status, statusText, error }
		},
		onSuccess: (_, variables) => {
			queryClient.setQueryData<ResponseData<SubscriberData>>(
				["inscritos"],
				(old) => {
					if (!old) return old
					return {
						...old,
						data: old.data.map((item) =>
							item.id === variables.id
								? { ...item, status: variables.newStatus }
								: item,
						),
					}
				},
			)
		},
	})

	async function handleChangeStatus(subscriberId: string, newStatus: string) {
		try {
			await changeStatusFn({ id: subscriberId, newStatus })
			toast({
				title: "Status atualizado",
				description: "Status atualizado com sucesso.",
			})
		} catch {
			toast({
				title: "Erro ao atualizar status",
				description: "Tente novamente mais tarde.",
				variant: "destructive",
			})
		}
	}

	const { mutateAsync: deleteUserFn } = useMutation({
		mutationFn: async (params: { id: string }) => {
			const { status, statusText, error } = await deleteUser(params.id)
			return { status, statusText, error }
		},
		onSuccess: (_, variables) => {
			queryClient.setQueryData<ResponseData<SubscriberData>>(
				["inscritos"],
				(old) => {
					if (!old) return old
					return {
						...old,
						data: old.data.filter((item) => item.id !== variables.id),
					}
				},
			)
		},
	})

	function handleDeleteUser(subscriberId: string) {
		try {
			deleteUserFn({ id: subscriberId })
			toast({
				title: "Usuário deletado",
				description: "Usuário deletado com sucesso.",
			})
		} catch {
			toast({
				title: "Erro ao deletar usuário",
				description: "Tente novamente mais tarde.",
				variant: "destructive",
			})
		}
	}

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
					onClick={() => router.push(`formulario/${subscriber.id}/perfil`)}
					className="gap-2"
				>
					<User2Icon size={20} />
					Perfil
				</ContextMenuItem>
				{authorized ? (
					<>
						<ContextMenuItem
							onClick={() => {
								handleChangeStatus(subscriber.id, "Aprovado")
							}}
							className="gap-2"
						>
							<CircleCheck size={20} />
							Aprovado
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								handleChangeStatus(subscriber.id, "Pendente")
							}}
							className="gap-2"
						>
							<Hourglass size={20} />
							Pendente
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								handleChangeStatus(subscriber.id, "Reprovado")
							}}
							className="gap-2"
						>
							<CircleX size={20} />
							Reprovado
						</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem
							onClick={() => handleDeleteUser(subscriber.id)}
							className="gap-2"
						>
							<Trash2 size={20} />
							Remover
						</ContextMenuItem>
					</>
				) : (
					<ContextMenuItem
						onClick={() => router.push(`participantes/${subscriber.id}?page=1`)}
						className="gap-2"
					>
						<Check size={20} />
						Avaliar
					</ContextMenuItem>
				)}
			</ContextMenuContent>
		</ContextMenu>
	)
}
