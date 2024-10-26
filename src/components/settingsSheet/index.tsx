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
import { PlusCircle, Settings2, Trash2 } from "lucide-react"
import { useState } from "react"
import { AddForm } from "./addForm"

export function SettingsSheet() {
	const [isOpen, setIsOpen] = useState(false)
	const authorized = [
		{
			id: "1",
			email: "email@email.com",
			role: "admin",
		},
	]

	function handleClick() {
		if (isOpen) {
			setIsOpen(false)
		} else {
			setIsOpen(true)
		}
	}

	async function handleDelete(value: string) {}
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
							{authorized?.map((autorizado) => (
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
