"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
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
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const FormSchema = z.object({
	semester: z.string({
		required_error: "Semestre é obrigatório",
	}),
	year: z.date({
		required_error: "Data é obrigatório",
	}),
})

export default function FormInput() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		const yearValue = format(data.year, "yyyy")
		const semester = data.semester

		toast({
			title: "Avaliação criada com sucesso!",
			description: "Redirecionando para a avaliação...",
		})

		window.location.href = `/${semester}${yearValue}/avaliacao`
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-center w-full gap-2 p-2  rounded-xl border"
			>
				<div className="flex gap-2 flex-1">
					<FormField
						control={form.control}
						name="semester"
						render={({ field }) => (
							<FormItem>
								<Select onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="w-48">
											<SelectValue placeholder="Selecione o semestre" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Semestre</SelectLabel>
											<SelectItem value="01">1° Semestre</SelectItem>
											<SelectItem value="02">2° Semestre</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage className="absolute bottom-[300px]" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="year"
						render={({ field }) => (
							<FormItem>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-[240px] pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													format(field.value, "PPP", { locale: ptBR })
												) : (
													<span>Qual o dia da seleção?</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											locale={ptBR}
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) => {
												const today = new Date()

												const firstDayCurrentMonth = new Date(
													today.getFullYear(),
													today.getMonth(),
													1,
												)

												const lastDayNextMonth = new Date(
													today.getFullYear(),
													today.getMonth() + 2,
													0,
												)

												return (
													date < firstDayCurrentMonth || date > lastDayNextMonth
												)
											}}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage className="absolute bottom-[300px]" />
							</FormItem>
						)}
					/>
				</div>
				<Button
					type="submit"
					className="flex items-center px-3 py-1.5 gap-1.5 rounded-lg font-medium text-sm"
				>
					Criar seleção
				</Button>
			</form>
		</Form>
	)
}
