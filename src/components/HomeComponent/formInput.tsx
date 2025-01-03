"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { createMember, getSelecao } from "@/http/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import type { SubscriberData } from "../User/UserRoot"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"

export const iniciarFormSchema = z.object({
	name: z.string().min(3, { message: "O nome deve ter pelo menos 3 letras" }),
	email: z
		.string({
			required_error: "O email é obrigatório",
		})
		.email({ message: "Digite um email válido" }),
	matricula: z
		.string({
			required_error: "A matrícula é obrigatória",
		})
		.min(9),
})

export function FormInput({ members }: { members: SubscriberData[] }) {
	const [isLoading, setLoading] = useState(false)
	const router = useRouter()
	const form = useForm<z.infer<typeof iniciarFormSchema>>({
		resolver: zodResolver(iniciarFormSchema),
	})

	const checkEmailExists = async (email: string): Promise<boolean> => {
		try {
			const emailFound = members.some((inscrito) => inscrito.email === email)
			return emailFound
		} catch {
			return false
		}
	}

	async function onSubmit(data: z.infer<typeof iniciarFormSchema>) {
		setLoading(true)
		const emailExists = await checkEmailExists(data.email)

		if (emailExists) {
			toast({
				title: "Email já cadastrado",
				description: "Tente novamente com outro email",
				variant: "destructive",
			})
			return
		}

		const { uuid, error } = await createMember(data)

		if (error) {
			toast({
				title: "Erro ao cadastrar participante",
				description: "Tente novamente mais tarde",
				variant: "destructive",
			})
			return { error }
		}

		const selecao = await getSelecao()

		if (selecao && !error) {
			toast({
				title: "Cadastro realizado com sucesso!",
				description: "Você será redirecionado para o formulário em instantes",
			})
			router.push(`${selecao.data[0].semestre}/formulario/${uuid}`)
		} else {
			toast({
				title: "Erro",
				description: "Não foi possível criar o formulário ou obter a seleção",
				variant: "destructive",
			})
		}
		setLoading(false)
	}
	return (
		<Form {...form}>
			<form className="flex items-center gap-2 bg-transparent p-2 rounded-xl border border-zinc-800 focus-within:ring-1 ring-blue-500 ring-offset-2 ring-offset-zinc-950">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									className="flex-1 border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
									placeholder="Como você se chama?"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Dialog>
					<DialogTrigger asChild>
						{isLoading ? (
							<Button disabled className="flex items-center gap-2">
								<LoaderCircle className="animate-spin" />
								Aguarde
							</Button>
						) : (
							<Button
								type="button"
								disabled={!form.watch("name") || form.watch("name").length < 3}
							>
								Quero participar
							</Button>
						)}
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Olá {form.watch("name")}</DialogTitle>
							<DialogDescription>
								Que bom que quer participar!
							</DialogDescription>
						</DialogHeader>
						<p>
							É o seu email que será usado para te identificar durante o
							processo de seleção.
						</p>
						<div className="flex flex-col gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Seu melhor email</FormLabel>
										<FormControl>
											<Input placeholder="m@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="matricula"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Qual a sua matrícula UFSM</FormLabel>
										<FormControl>
											<Input placeholder="Sua matrícula" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								onClick={(e) => {
									e.preventDefault()
									form.handleSubmit((data) => {
										onSubmit(data)
										document
											.querySelector('[data-state="open"]')
											?.dispatchEvent(
												new KeyboardEvent("keydown", { key: "Escape" }),
											)
									})()
								}}
							>
								Enviar
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</form>
		</Form>
	)
}
