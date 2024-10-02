"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/hooks/use-toast"
import { createFormulario, getInscritos, updateFormulario } from "@/http/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
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
	const { data: inscrito } = useQuery({
		queryKey: ["inscritos"],
		queryFn: () => getInscritos(params.id),
	})

	const form = useForm<z.infer<typeof usuarioFormSchema>>({
		resolver: zodResolver(usuarioFormSchema),
	})

	useEffect(() => {
		if (inscrito && inscrito.length > 0) {
			form.reset({
				email: inscrito[0].email,
				name: inscrito[0].name,
				matricula: inscrito[0].matricula.toString(),
			})
		}
	}, [inscrito, form])

	async function onSubmit(data: z.infer<typeof usuarioFormSchema>) {
		await updateFormulario(data, params.id)
		toast({
			title: "Formulário enviado com sucesso!",
			description: "Você receberá um e-mail com mais informações.",
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<Card className="flex flex-col gap-4 p-4 w-full container focus-within:ring-1 ring-blue-500 ring-offset-2 ring-offset-zinc-950">
					<FormField
						name="email"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-mail</FormLabel>
								<FormControl>
									<Input placeholder="Sua resposta" {...field} />
								</FormControl>
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
									<Input
										placeholder="Sua resposta"
										{...field} // Conecta o campo de entrada ao hook de formulário
									/>
								</FormControl>
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
									<Input
										placeholder="Sua resposta"
										{...field} // Conecta o campo de entrada ao hook de formulário
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</Card>
				<Button type="submit">Enviar</Button>
			</form>
		</Form>
	)
}
