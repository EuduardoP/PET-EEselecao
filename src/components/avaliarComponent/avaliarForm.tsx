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

const FormSchema = z.object({
	emailInput: z.number().min(1).max(10),
	individualInput: z.number().min(1).max(10),
	grupoInput: z.number().min(1).max(10),
	entrevistaInput: z.number().min(1).max(10),
	membroInput: z.number().min(1).max(10),
})

type FormValues = z.infer<typeof FormSchema>

interface CustomCheckboxProps {
	field: ControllerRenderProps<FormValues, keyof FormValues>
	label: number
	value: number
	onChange: (value: number) => void
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
	field,
	label,
	value,
	onChange,
}) => (
	<Button
		className={`w-10 h-10 border-2 rounded-md flex items-center justify-center cursor-pointer mr-2 mb-2
                ${field.value === value ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
		onClick={() => onChange(value)}
		type="button"
	>
		{label}
	</Button>
)

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
			emailInput: 0,
			individualInput: 0,
			grupoInput: 0,
			entrevistaInput: 0,
			membroInput: 0,
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

	const handleCheckboxChange = (fieldName: keyof FormValues, value: number) => {
		const currentValue = form.getValues(fieldName)
		form.setValue(fieldName, currentValue === value ? 0 : value, {
			shouldValidate: true,
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
										<div className="flex flex-wrap">
											{[...Array(10)].map((_, index) => (
												<CustomCheckbox
													key={`${fieldName}`}
													field={field}
													label={index + 1}
													value={index + 1}
													onChange={(value) =>
														handleCheckboxChange(fieldName, value)
													}
												/>
											))}
										</div>
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
