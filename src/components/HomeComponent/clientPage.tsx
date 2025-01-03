"use client"

import type { Date as DateType } from "@/app/api/selecao/types"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ClientComponentProps {
	date: DateType | null
	error: string | null
}

export default function ClientComponent({ date, error }: ClientComponentProps) {
	if (error) {
		toast({
			title: "Erro ao buscar seleção",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
	}

	return (
		<div>
			{date && (
				<div className="text-center">
					<p>
						As inscrições começam no dia{" "}
						<strong>
							{format(new Date(`${date.start}T23:59:59Z`), "dd 'de' MMM yyyy", {
								locale: ptBR,
							})}
						</strong>{" "}
						e vão até{" "}
						<strong>
							{format(new Date(`${date.end}T23:59:59Z`), "dd 'de' MMM yyyy", {
								locale: ptBR,
							})}
						</strong>
					</p>
				</div>
			)}
		</div>
	)
}
