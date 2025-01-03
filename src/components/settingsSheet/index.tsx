"use client"

import type { AuthorizedUser } from "@/app/api/authorized/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { type ResponseData, deleteAuthorized, getAuthorized } from "@/http/api"
import { queryClient } from "@/lib/reactQueryProvider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2, PlusCircle, Settings2, Trash2 } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"
import { AddForm } from "./addForm"

export function SettingsSheet() {
	const [isOpen, setIsOpen] = useState(false)
	const { data: authorized, isLoading } = useQuery({
		queryKey: ["autorizados"],
		queryFn: async () => {
			return await getAuthorized()
		},
	})

	function handleClick() {
		if (isOpen) {
			setIsOpen(false)
		} else {
			setIsOpen(true)
		}
	}

	const { mutateAsync: deleteUserFn, isPending } = useMutation({
		mutationFn: async (params: { id: string }) => {
			await deleteAuthorized(params.id)
		},
		onSuccess(_, variables) {
			queryClient.setQueryData<ResponseData<AuthorizedUser>>(
				["autorizados"],
				(old) => {
					if (old) {
						return {
							...old,
							data: old.data.filter((item) => item.id !== variables.id),
						}
					}
					return old
				},
			)
		},
	})

	async function handleDelete(value: string) {
		deleteUserFn({ id: value })
	}
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">
					<Settings2 size={18} />
					Configurações
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[95vw] sm:w-[600px] md:w-[700px] lg:w-[800px] max-w-[900px] flex flex-col">
				<SheetHeader>
					<SheetTitle>Configurações da Seleção</SheetTitle>
					<SheetDescription>
						Faça mudanças nas configurações da seleção
					</SheetDescription>
				</SheetHeader>
				<ScrollArea className="flex-grow mt-4 pr-4">
					<Card className="mb-4">
						<CardContent className="flex flex-col gap-4">
							<CardHeader>
								<CardTitle>Emails cadastrados</CardTitle>
							</CardHeader>

							{isLoading ? (
								<div className="flex flex-col items-center justify-center gap-4">
									<Skeleton className="w-full h-5" />
									<Skeleton className="w-full h-5" />
									<Skeleton className="w-full h-5" />
								</div>
							) : authorized?.data ? (
								authorized?.data.map((autorizado) => (
									<div
										key={autorizado.email}
										className="flex flex-row justify-between items-center"
									>
										<Label
											htmlFor={`email-${autorizado.email}`}
											data-state={
												autorizado.email === "petee.dados@gmail.com" ||
												autorizado.email === "petengenhariaeletrica@ufsm.com"
													? "usar"
													: "admin"
											}
											className="truncate data-[state=admin]:w-1/2"
										>
											{autorizado.email}
										</Label>
										<Label htmlFor={`email-${autorizado.role}`}>
											{autorizado.role}
										</Label>
										{autorizado.email !== "petee.dados@gmail.com" &&
											autorizado.email !== "petengenhariaeletrica@ufsm.com" &&
											(isPending ? (
												<Button variant="outline" size="icon" disabled>
													<Loader2 className="animate-spin" size={18} />
												</Button>
											) : (
												<Button
													variant="outline"
													size="icon"
													onClick={() => handleDelete(autorizado.id)}
												>
													<Trash2 size={18} />
												</Button>
											))}
									</div>
								))
							) : null}
							<Separator />

							{isOpen && <AddForm handleClose={() => setIsOpen(false)} />}
							<Button
								data-state={isOpen ? "open" : "closed"}
								className="flex flex-row gap-2 w-full data-[state=open]:hidden"
								onClick={handleClick}
							>
								<PlusCircle size={18} />
								Adicionar email
							</Button>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<CardHeader>
								<CardTitle>Seleção</CardTitle>
							</CardHeader>
							<div className="flex flex-col gap-4">teste</div>
						</CardContent>
					</Card>
				</ScrollArea>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
