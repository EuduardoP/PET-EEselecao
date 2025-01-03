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
import { Input } from "@/components/ui/input"
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
import { format } from "date-fns"
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
	data: z.object({
		from: z.date(),
		to: z.date(),
	}),
	edital: z.string({
		required_error: "Edital é obrigatório",
	}),
})

export default function FormInput() {
	const [date, setDate] = useState<DateRange | undefined>()
	const [editalOpen, setEditalOpen] = useState<boolean>(false)
	const router = useRouter()
	const form = useForm<z.infer<typeof createFormSchema>>({
		resolver: zodResolver(createFormSchema),
	})

	async function onSubmit(data: z.infer<typeof createFormSchema>) {
		const response = await createSelecao(data)
		const yearValue = format(data.data.from, "yyyy")

		if (response.status === 409) {
			toast({
				title: "Seleção já existe",
				description:
					"Você deve arquivar a seleção atual antes de criar uma nova",
				variant: "destructive",
			})
			return
		}

		if (response.ok) {
			toast({
				title: "Seleção criada com sucesso!",
				description: "Redirecionando para a avaliação...",
			})
			router.push(`/${data.semestre}${yearValue}/participantes`)
			return
		}

		toast({
			title: "Erro ao criar seleção",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col w-full gap-2 p-2 rounded-xl border"
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
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="data"
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
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						disabled={
							typeof form.watch("semestre") === "undefined" ||
							typeof form.watch("data.from") === "undefined" ||
							typeof form.watch("data.to") === "undefined"
						}
						className="flex items-center px-3 py-1.5 gap-1.5 rounded-lg font-medium text-sm"
						onClick={() => setEditalOpen(true)}
					>
						Essa é a data
					</Button>{" "}
				</div>
				<div className="flex gap-2 items-center">
					{editalOpen && (
						<div className="flex flex-col items-center gap-2 w-full">
							<FormField
								control={form.control}
								name="edital"
								render={({ field }) => (
									<FormItem className="flex w-full flex-row gap-2 justify-center items-center flex-1">
										<FormControl>
											<Input
												type="text"
												placeholder="Link do edital"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="flex w-full items-center px-3 py-1.5 gap-1.5 rounded-lg font-medium text-sm"
							>
								Criar seleção
							</Button>
						</div>
					)}
				</div>
			</form>
		</Form>
	)
}
