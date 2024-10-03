import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getInscritos, getSelecao } from "@/http/api"
import Link from "next/link"
import { use } from "react"
import { FormInput } from "./formInput"

interface FormularioPageProps {
	params: { semestre: string; id: string }
}
export default function FormularioPage({ params }: FormularioPageProps) {
	const selecao = use(getSelecao())
	console.log(selecao.data.semestre)
	const semestreText = `${params.semestre.slice(2)}/${Number.parseInt(params.semestre.slice(0, 2))}`
	return (
		<main className="flex flex-col items-center justify-center w-full h-full p-5 lg:px-[20rem] gap-4">
			<Card className="flex flex-col gap-4 p-4 w-full container">
				<CardHeader>
					<CardTitle>
						Inscrição para o processo seletivo {semestreText}
					</CardTitle>
				</CardHeader>
				<Separator />
				<p>
					O PET (Programa de Educação Tutorial) é um grupo que estimula seus
					participantes a buscar formação ampla, de forma a desenvolver pessoas
					com senso crítico, que sejam conscientes de suas capacidades e
					potencialidades de melhorar o meio no qual estão inseridos. A fim de
					desenvolver estas habilidades, utiliza-se uma metodologia de Educação
					Tutorial, em que os participantes tem a oportunidade de compartilhar
					suas experiências com intuito de se desenvolver interagindo com o
					grupo e com o tutor em atividades de Ensino, Pesquisa e Extensão.
				</p>
				<strong>
					Edital:
					<Button variant="link" asChild>
						<Link
							href={selecao.data.edital}
							target="_blank"
							rel="noopeener noreferrer"
						>
							Seleção {semestreText}
						</Link>
					</Button>
				</strong>
				<p>
					Preencha o formulário e envie para efetivar sua inscrição e concorrer
					às vagas disponíveis do PET Engenharia Elétrica.
				</p>
			</Card>
			<FormInput params={params} />
		</main>
	)
}
