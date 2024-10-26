"use client"

import type { SubscriberData } from "@/components/User/UserRoot"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/hooks/use-toast"
import { createSupabaseBrowser } from "@/utils/supabase/client"
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
	const { data: inscrito, isFetched } = useQuery<SubscriberData>({
		queryKey: ["inscrito"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser()
			const { data } = await supabase
				.from("participantes")
				.select("*")
				.eq("id", params.id)
				.single()
			return data
		},
	})

	const form = useForm<z.infer<typeof usuarioFormSchema>>({
		resolver: zodResolver(usuarioFormSchema),
		shouldFocusError: true,
	})

	useEffect(() => {
		if (isFetched && inscrito) {
			form.reset({
				email: inscrito.email,
				name: inscrito.name,
				matricula: inscrito.matricula.toString(),
				semestre: inscrito.semestre,
				identificacao: inscrito.identificacao,
				conhecimentoPET: inscrito.conhecimentoPET,
				interessePET: inscrito.interessePET,
				competenciasDesejadas: inscrito.competenciasDesejadas,
				atividadesExtracurriculares: inscrito.atividadesExtracurriculares,
				atividadesInteresse: inscrito.atividadesInteresse,
				cargaHoraria: inscrito.cargaHoraria,
			})
		}
	}, [isFetched, inscrito, form])

	async function onSubmit(data: z.infer<typeof usuarioFormSchema>) {
		try {
			const supabase = createSupabaseBrowser()
			await supabase
				.from("participantes")
				.update({ ...data, status: "Pendente" })
				.eq("id", params.id)
			toast({
				title: "Formulário enviado com sucesso!",
				description: "Você receberá um e-mail para informar de novas etapas",
			})

			router.push(`${params.id}/perfil`)
		} catch {
			toast({
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
										className="flex flex-col gap-2 items-start"
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
									<Input placeholder="Sua resposta" {...field} />
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
									<Input placeholder="Sua resposta" {...field} />
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
									<Input placeholder="Sua resposta" {...field} />
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
									<Input placeholder="Sua resposta" {...field} />
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
									<Input placeholder="Sua resposta" {...field} />
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
