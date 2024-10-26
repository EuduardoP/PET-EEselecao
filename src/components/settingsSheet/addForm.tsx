"use client"

import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { addAuthorized } from "@/http/api"
import { queryClient } from "@/lib/reactQueryProvider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "../ui/button"
import { Form, FormField } from "../ui/form"

export const authorizedformSchema = z.object({
	email: z.string().email(),
	role: z.string().min(1),
})

interface AddFormProps {
	handleClose: () => void
}

export function AddForm({ handleClose }: AddFormProps) {
	const form = useForm<z.infer<typeof authorizedformSchema>>({
		resolver: zodResolver(authorizedformSchema),
	})

	const { mutateAsync: addAuthorizedEmails } = useMutation({
		mutationFn: addAuthorized,
		mutationKey: ["autorizados"],
		onSuccess: (_, variables) => {
			queryClient.setQueryData<unknown[]>(["autorizados"], (oldData = []) => {
				return [...oldData, variables]
			})
			handleClose()
			toast({
				title: "Autorizado adicionado com sucesso",
				description: `O email ${variables.email} foi adicionado à lista de autorizados como ${variables.role}.`,
			})
		},
		onError: () => {
			toast({
				title: "Erro ao adicionar autorizado",
				description:
					"Houve um erro ao tentar adicionar o autorizado. Tente novamente.",
			})
		},
	})

	async function onSubmit(values: z.infer<typeof authorizedformSchema>) {
		try {
			await addAuthorizedEmails({
				email: values.email,
				role: values.role,
			})
		} catch (error) {
			console.error("Erro ao adicionar autorizado:", error)
		}
	}

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<Input {...field} placeholder="Email" className="col-span-3" />
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Cargo" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Cargo</SelectLabel>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="avaliador">Avaliador</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
				/>
				<Button
					className="flex flex-row gap-2 w-full bg-emerald-400 hover:bg-emerald-500"
					type="submit"
				>
					<PlusCircle size={18} />
					Adicionar email
				</Button>
			</form>
		</Form>
	)
}
