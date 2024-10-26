import { User } from "@/components/User"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { fetchSelecao, fetchUserById } from "@/http/db"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface SucessoPageProps {
	params: { semestre: string; id: string }
}

export default async function Sucesso({ params }: SucessoPageProps) {
	const { data: inscrito } = await fetchUserById(params.id)
	const { data: selecao } = await fetchSelecao()

	return (
		<>
			<main className="flex flex-col items-center justify-center w-full min-h-screen p-4 gap-4 mt-20 md:mt-14">
				<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center">
					Essas são as respostas que iremos receber.
				</h2>
				<sub className="text-sm items-center">
					Você pode editar o quanto quiser até dia{" "}
					{selecao?.[0]?.date_to
						? format(
								new Date(`${selecao[0].date_to}T00:00:00`),
								"dd 'de' MMMM",
								{
									locale: ptBR,
								},
							)
						: " "}
					, basta acessar o formulário com seu id{" "}
					<Button asChild variant={"link"}>
						<Link href={`/${params.semestre}/formulario/${params.id}`}>
							<strong>{params.id}</strong>
						</Link>
					</Button>
				</sub>
				{inscrito && (
					<User.Root data={[inscrito]} className="w-full lg:w-1/2">
						<User.Borders subscriber={inscrito} disableChangeStatus>
							<User.Header>
								<User.Avatar subscriber={inscrito} />
							</User.Header>
							<User.Content>
								<User.Name subscriber={inscrito} />
								<User.Email subscriber={inscrito} />
								<User.Matricula subscriber={inscrito} />
							</User.Content>
							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Semestre:</Label>
								<Badge className="text-xs md:text-base flex items-center justify-center">
									{`${inscrito.semestre}°`}
								</Badge>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Conheceu o PET:</Label>
								<p>{inscrito.conhecimentoPET}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Interesse no PET:</Label>
								<p>{inscrito.interessePET}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Competências Desejadas:</Label>
								<p>{inscrito.competenciasDesejadas}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Atividades Extracurriculares:</Label>
								<p>{inscrito.atividadesExtracurriculares}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Atividades de Interesse:</Label>
								<p>{inscrito.atividadesInteresse}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Carga Horária:</Label>
								<p>{inscrito.cargaHoraria}</p>
							</User.Footer>
						</User.Borders>
					</User.Root>
				)}
			</main>
		</>
	)
}
