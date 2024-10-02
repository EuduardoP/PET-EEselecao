import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getInscritos } from "@/http/api"
import { use } from "react"

interface FormularioPageProps {
	params: { semestre: string; id: string }
}
export default function FormularioPage({ params }: FormularioPageProps) {
	const inscrito = use(getInscritos(params.id))
	const semestreText = `${params.semestre.slice(2)}/${Number.parseInt(params.semestre.slice(0, 2))}`
	return (
		<main className="flex flex-col items-center justify-center w-full h-full p-5 lg:px-[32rem] gap-4">
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
					<Button variant="link">Seleção {semestreText} </Button>
				</strong>
				<p>
					Preencha o formulário e envie para efetivar sua inscrição e concorrer
					às vagas disponíveis do PET Engenharia Elétrica.
				</p>
			</Card>
			<Card className="flex flex-col gap-4 p-4 w-full container focus-within:ring-1 ring-blue-500 ring-offset-2 ring-offset-zinc-950">
				<p>E-mail:</p>
				<Input placeholder="Sua resposta" defaultValue={inscrito[0].email} />
			</Card>
			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>Nome completo:*</p>
				<Input placeholder="Sua resposta" defaultValue={inscrito[0].name} />
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>Número da matrícula:*</p>
				<Input
					placeholder="Sua resposta"
					defaultValue={inscrito[0].matricula}
				/>
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>Qual semestre você se encontra cursando:*</p>
				<Input placeholder="Sua resposta" />
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>Você se identifica como:*</p>
				<div className="flex flex-col gap-2">
					<label>
						<input type="radio" name="identificacao" value="Negro" /> Negro
					</label>
					<label>
						<input type="radio" name="identificacao" value="Pardo" /> Pardo
					</label>
					<label>
						<input type="radio" name="identificacao" value="Indígena" />{" "}
						Indígena
					</label>
					<label>
						<input type="radio" name="identificacao" value="Branco" /> Branco
					</label>
					<label>
						<input type="radio" name="identificacao" value="Outro" /> Outro:
						<Input placeholder="Especifique" />
					</label>
				</div>
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>Como você conheceu o PET?*</p>
				<Input placeholder="Sua resposta" />
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>Por que você tem interesse em entrar no PET Engenharia Elétrica?*</p>
				<Input placeholder="Sua resposta" />
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>
					Quais as competências que você deseja adquirir ou melhorar fazendo
					parte do PET?*
				</p>
				<Input placeholder="Sua resposta" />
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>Quais atividades extracurriculares você já realizou/realiza?*</p>
				<Input placeholder="Sua resposta" />
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>
					Qual(ais) tipo(s) de atividades você tem interesse em realizar no
					PET?*
				</p>
				<Input placeholder="Sua resposta" />
			</Card>

			<Card className="flex flex-col gap-4 p-4 w-full container">
				<p>
					Qual a carga horária que você terá disponível para atividades do PET
					durante a semana (incluindo sábados)?
				</p>
				<Input placeholder="Sua resposta" />
			</Card>
		</main>
	)
}
