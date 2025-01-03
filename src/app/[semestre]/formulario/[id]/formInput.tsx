"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/hooks/use-toast"
import { getMembersById, updateFormulario } from "@/http/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const usuarioFormSchema = z.object({
	email: z
		.string({
			required_error: "O e-mail é obrigatório.",
		})
		.email("Por favor, insira um e-mail válido."),
	name: z.string().min(1, "O nome completo é obrigatório."),
	matricula: z.string().min(1, "O número da matrícula é obrigatório."),
	semestre: z
		.string({
			required_error: "O semestre é obrigatório.",
		})
		.min(1),
	identificacao: z.string().min(1, "Você deve se identificar."),
	conhecimentoPET: z.string().min(1, "Por favor, informe como conheceu o PET."),
	interessePET: z.string().min(1, "Por favor, explique seu interesse no PET."),
	competenciasDesejadas: z
		.string()
		.min(1, "Informe as competências desejadas."),
	atividadesExtracurriculares: z
		.string()
		.min(1, "Liste suas atividades extracurriculares."),
	atividadesInteresse: z.string().min(1, "Informe as atividades de interesse."),
	cargaHoraria: z.string().min(1, "Informe sua carga horária."),
})

export function FormInput({ params }: { params: { id: string } }) {
	const router = useRouter()
	const { data: inscrito, isFetched } = useQuery({
		queryKey: ["inscrito", params.id],
		queryFn: async () => {
			return await getMembersById(params.id)
		},
	})

	const form = useForm<z.infer<typeof usuarioFormSchema>>({
		resolver: zodResolver(usuarioFormSchema),
		shouldFocusError: true,
	})

	useEffect(() => {
		if (isFetched && inscrito?.data[0]) {
			form.reset({
				email: inscrito.data[0].email ?? "",
				name: inscrito.data[0].name ?? "",
				matricula: inscrito.data[0].matricula.toString() ?? "",
				semestre: inscrito.data[0].semestre ?? "",
				identificacao: inscrito.data[0].identificacao ?? "",
				conhecimentoPET: inscrito.data[0].conhecimentoPET ?? "",
				interessePET: inscrito.data[0].interessePET ?? "",
				competenciasDesejadas: inscrito.data[0].competenciasDesejadas ?? "",
				atividadesExtracurriculares:
					inscrito.data[0].atividadesExtracurriculares ?? "",
				atividadesInteresse: inscrito.data[0].atividadesInteresse ?? "",
				cargaHoraria: inscrito.data[0].cargaHoraria ?? "",
			})
		}
	}, [isFetched, inscrito, form])

	async function onSubmit(data: z.infer<typeof usuarioFormSchema>) {
		try {
			const response = await updateFormulario(params.id, data)
			if (response.error === null) {
				toast({
					title: "Formulário enviado com sucesso!",
					description: "Você receberá um e-mail para informar de novas etapas",
				})

				router.push(`${params.id}/perfil`)
			} else {
				toast({
					variant: "destructive",
					title: "Erro ao atualizar o seu usuário",
					description: "Informe alguém do PET-EE",
				})
			}
		} catch {
			toast({
				variant: "destructive",
				title: "Erro ao atualizar o seu usuário",
				description: "Informe alguém do PET-EE",
			})
		}
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="email"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-mail</FormLabel>
								<FormControl>
									<Input placeholder="Sua resposta" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>
				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="name"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome Completo</FormLabel>
								<FormControl>
									<Input placeholder="Sua resposta" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="matricula"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número da matrícula</FormLabel>
								<FormControl>
									<Input placeholder="Sua resposta" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="semestre"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Qual semestre você se encontra cursando:*</FormLabel>
								<FormControl>
									<ToggleGroup
										type="single"
										variant="outline"
										className="flex flex-wrap gap-2"
										value={field.value}
										onValueChange={field.onChange}
										size={"lg"}
									>
										{Array.from({ length: 10 }, (_, point) => (
											<ToggleGroupItem
												key={(point + 1).toString()}
												value={(point + 1).toString()}
												aria-label={`Toggle item ${point + 1}`}
											>
												{point + 1}
											</ToggleGroupItem>
										))}
									</ToggleGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>
				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="identificacao"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Você se identifica como:</FormLabel>
								<FormControl>
									<ToggleGroup
										type="single"
										variant="outline"
										className="flex flex-wrap gap-2 items-start"
										value={field.value}
										onValueChange={field.onChange}
										size={"sm"}
									>
										<ToggleGroupItem
											className="w-20"
											value="Negro"
											aria-label="Negro"
										>
											Negro
										</ToggleGroupItem>
										<ToggleGroupItem
											className="w-20"
											value="Pardo"
											aria-label="Pardo"
										>
											Pardo
										</ToggleGroupItem>
										<ToggleGroupItem
											className="w-20"
											value="Indígena"
											aria-label="Indígena"
										>
											Indígena
										</ToggleGroupItem>
										<ToggleGroupItem
											className="w-20"
											value="Branco"
											aria-label="Branco"
										>
											Branco
										</ToggleGroupItem>
										<ToggleGroupItem
											className="w-20"
											value="Outro"
											aria-label="Outro"
										>
											Outro
										</ToggleGroupItem>
									</ToggleGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="conhecimentoPET"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Como você conheceu o PET?*</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Sua resposta"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="interessePET"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Por que você tem interesse em entrar no PET Engenharia
									Elétrica?*
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Sua resposta"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="competenciasDesejadas"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Quais as competências que você deseja adquirir ou melhorar
									fazendo parte do PET?*
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Sua resposta"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="atividadesExtracurriculares"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Quais atividades extracurriculares você já realizou/realiza?*
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Sua resposta"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="atividadesInteresse"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Qual(ais) tipo(s) de atividades você tem interesse em realizar
									no PET?*
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Sua resposta"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>

				<Card className="flex flex-col gap-4 p-4 w-full container">
					<FormField
						name="cargaHoraria"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Qual a carga horária que você terá disponível para atividades
									do PET durante a semana (incluindo sábados)?
								</FormLabel>
								<FormControl>
									<Input placeholder="Sua resposta" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>
				<div className="flex justify-start items-center gap-4">
					<Button type="submit">Enviar</Button>
					{form.formState.isSubmitted && !form.formState.isValid && (
						<h2 className="text-red-500">Campos não totalmente preenchidos</h2>
					)}
				</div>
			</form>
		</Form>
	)
}
