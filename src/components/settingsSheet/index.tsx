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
import { toast } from "@/hooks/use-toast"
import { deleteAuthorized, getAuthorized } from "@/http/api"
import { queryClient } from "@/lib/reactQueryProvider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PlusCircle, Settings2, Trash2 } from "lucide-react"
import { getServerSession } from "next-auth"
import { useState } from "react"
import { AddForm } from "./addForm"

export function SettingsSheet() {
	const [isOpen, setIsOpen] = useState(false)
	const { data } = useQuery({
		queryKey: ["autorizados"],
		queryFn: () => getAuthorized(),
	})
	const { mutateAsync: deleteAuthorizedEmails } = useMutation({
		mutationFn: deleteAuthorized,
		mutationKey: ["autorizados"],
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["autorizados"],
			})
		},
	})

	function handleClick() {
		if (isOpen) {
			setIsOpen(false)
		} else {
			setIsOpen(true)
		}
	}

	async function handleDelete(value: string) {
		try {
			await deleteAuthorizedEmails(value)
		} catch (error) {
			toast({
				title: "Erro ao remover autorizado",
				description: "O email não pode ser removido da lista de autorizados.",
				variant: "destructive",
			})
		}
		toast({
			title: "Autorizado removido com sucesso",
			description: `O email ${value} foi removido da lista de autorizados.`,
			variant: "destructive",
		})
	}
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">
					<Settings2 size={18} />
					Configurações
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>Configurações da Seleção</SheetTitle>
					<SheetDescription>
						Faça mudanças nas configurações da seleção
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<Card>
						<CardHeader>
							<CardTitle>Emails cadastrados</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							{data?.map((autorizado) => (
								<div
									key={autorizado.email}
									className="flex flex-row justify-between items-center"
								>
									<Label htmlFor={`email-${autorizado.email}`}>
										{autorizado.email}
									</Label>
									<Label htmlFor={`email-${autorizado.role}`}>
										{autorizado.role}
									</Label>
									{autorizado.email !== "petee.dados@gmail.com" &&
										autorizado.email !== "petengenhariaeletrica@ufsm.com" && (
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleDelete(autorizado.email)}
											>
												<Trash2 size={18} />
											</Button>
										)}
								</div>
							))}
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
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
