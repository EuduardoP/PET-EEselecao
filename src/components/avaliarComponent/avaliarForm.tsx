"use client"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ControllerRenderProps, useForm } from "react-hook-form"
import * as z from "zod"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

const FormSchema = z.object({
	emailInput: z.string().min(1),
	individualInput: z.string().min(1),
	grupoInput: z.string().min(1),
	entrevistaInput: z.string().min(1),
	membroInput: z.string().min(1),
})

type FormValues = z.infer<typeof FormSchema>

const customLabels: Record<keyof FormValues, string> = {
	emailInput: "Atividade da apresentação",
	individualInput: "Atividade Individual",
	grupoInput: "Atividade em Grupo",
	entrevistaInput: "Avaliação por Entrevista",
	membroInput: "Avaliação como Membro",
}

export default function AvaliarForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			emailInput: "0",
			individualInput: "0",
			grupoInput: "0",
			entrevistaInput: "0",
			membroInput: "0",
		},
	})

	const onSubmit = (data: FormValues) => {
		toast({
			title: "Avaliação enviada com sucesso!",
			description: (
				<pre className="bg-muted p-4 rounded-md">
					{JSON.stringify(data, null, 2)}
				</pre>
			),
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				{(Object.keys(FormSchema.shape) as Array<keyof FormValues>).map(
					(fieldName) => (
						<FormField
							key={fieldName}
							control={form.control}
							name={fieldName}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{customLabels[fieldName]}</FormLabel>
									<FormControl>
										<ToggleGroup
											type="single"
											size={"lg"}
											variant="outline"
											className="flex flex-wrap gap-2"
											value={field.value.toString()}
											onValueChange={field.onChange}
										>
											{Array.from({ length: 10 }, (_, index) => (
												<ToggleGroupItem
													key={(index + 1).toString()}
													value={(index + 1).toString()}
													aria-label={`Toggle item ${index + 1}`}
												>
													{index + 1}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</FormControl>
								</FormItem>
							)}
						/>
					),
				)}
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}
