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
import { createSelecao } from "@/http/api"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const createFormSchema = z.object({
	semestre: z.string({
		required_error: "Semestre é obrigatório",
	}),
	dateRange: z.object({
		from: z.date(),
		to: z.date(),
	}),
})

export default function FormInput() {
	const [date, setDate] = useState<DateRange | undefined>()
	const router = useRouter()
	const form = useForm<z.infer<typeof createFormSchema>>({
		resolver: zodResolver(createFormSchema),
	})

	function onSubmit(data: z.infer<typeof createFormSchema>) {
		const yearValue = format(data.dateRange.from, "yyyy")
		const semestre = data.semestre

		toast({
			title: "Seleção criada com sucesso!",
			description: "Redirecionando para a avaliação...",
			// description: (
			// 	<pre className="bg-muted p-4 rounded-md">
			// 		{JSON.stringify(data, null, 2)}
			// 	</pre>
			// ),
		})
		createSelecao(data)
		router.push(`/${semestre}${yearValue}/participantes`)
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
						name="semestre"
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
						name="dateRange"
						render={({ field }) => (
							<FormItem>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-[300px] justify-start text-left font-normal",
													!date && "text-muted-foreground",
												)}
											>
												{!date && <CalendarIcon className="mr-2 h-4 w-4" />}
												{date?.from ? (
													date.to ? (
														<>
															{format(date.from, "dd 'de' LLL 'de' y", {
																locale: ptBR,
															})}{" "}
															-{" "}
															{format(date.to, "dd 'de' LLL 'de' y", {
																locale: ptBR,
															})}
														</>
													) : (
														format(date.from, "dd 'de' LLL 'de' y", {
															locale: ptBR,
														})
													)
												) : (
													<span>Qual o período de inscrição?</span>
												)}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											locale={ptBR}
											mode="range"
											defaultMonth={date?.from}
											selected={date}
											onSelect={(newDate) => {
												setDate(newDate)
												field.onChange(newDate)
											}}
											numberOfMonths={2}
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
