"use client"

import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ClientComponentProps {
	selecao: Array<{ date_from: string; date_to: string }> | null
	error: string | null
}

export default function ClientComponent({
	selecao,
	error,
}: ClientComponentProps) {
	if (error) {
		toast({
			title: "Erro ao buscar seleção",
			description: "Tente novamente mais tarde",
			variant: "destructive",
		})
	}

	return (
		<div>
			{selecao && (
				<div className="text-center">
					<p>
						As inscrições começam no dia{" "}
						<strong>
							{format(
								new Date(`${selecao[0].date_from}T23:59:59Z`),
								"dd 'de' MMM yyyy",
								{ locale: ptBR },
							)}
						</strong>{" "}
						e vão até{" "}
						<strong>
							{format(
								new Date(`${selecao[0].date_to}T23:59:59Z`),
								"dd 'de' MMM yyyy",
								{ locale: ptBR },
							)}
						</strong>
					</p>
				</div>
			)}
		</div>
	)
}
