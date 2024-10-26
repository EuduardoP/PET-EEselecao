import { Avaliar } from "@/components/Avaliar"
import { useSearchParams } from "next/navigation"

export default function AvaliarForms() {
	const searchParams = useSearchParams()
	const page = searchParams.get("page")

	return (
		<>
			{(() => {
				switch (page) {
					case "1":
						return (
							<Avaliar.Root>
								<Avaliar.Title>Atividade por Email</Avaliar.Title>
								<Avaliar.Content criterio="Coerência textual" />
								<Avaliar.Content criterio="Objetividade" />
								<Avaliar.Content criterio="Ortografia" />
							</Avaliar.Root>
						)
					case "2":
						return (
							<Avaliar.Root>
								<Avaliar.Title>Atividade Indidivual</Avaliar.Title>
								<Avaliar.Content criterio="Senso crítico" />
								<Avaliar.Content criterio="Oratória" />
								<Avaliar.Content criterio="Criatividade" />
								<Avaliar.Content criterio="Comprometimento" />
								<Avaliar.Content criterio="Síntese de ideias" />
								<Avaliar.Content criterio="Postura" />
							</Avaliar.Root>
						)
					case "3":
						return (
							<Avaliar.Root>
								<Avaliar.Title>Atividade em Grupo</Avaliar.Title>
								<Avaliar.Content criterio="Liderança" />
								<Avaliar.Content criterio="Trabalho em Equipe" />
								<Avaliar.Content criterio="Saber ouvir" />
								<Avaliar.Content criterio="Senso crítico" />
								<Avaliar.Content criterio="Criatividade" />
								<Avaliar.Content criterio="Expressividade" />
								<Avaliar.Content criterio="Proatividade" />
							</Avaliar.Root>
						)
					case "4":
						return (
							<Avaliar.Root>
								<Avaliar.Title>Intrevista com os professores</Avaliar.Title>
								<Avaliar.Content criterio="Coerência textual" />
							</Avaliar.Root>
						)
					case "5":
						return (
							<Avaliar.Root>
								<Avaliar.Title>Avaliação como membro</Avaliar.Title>
								<Avaliar.Content criterio="Coerência textual" />
							</Avaliar.Root>
						)
					default:
						return null
				}
			})()}
		</>
	)
}
