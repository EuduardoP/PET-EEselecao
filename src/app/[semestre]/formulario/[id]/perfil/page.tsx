"use client"
import { User } from "@/components/User"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { getInscritos } from "@/http/api"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

interface SucessoPageProps {
	params: { semestre: string; id: string }
}

export default function Sucesso({ params }: SucessoPageProps) {
	const { data: inscrito } = useQuery({
		queryKey: ["inscrito"],
		queryFn: () => getInscritos(params.id),
	})
	const router = useRouter()
	return (
		<>
			<header className="absolute top-4 left-4">
				<Button
					onClick={() => router.push(`/${params.semestre}/participantes`)}
				>
					Voltar
				</Button>
			</header>
			<main className="flex flex-col items-center justify-center w-full min-h-screen p-4 gap-4 mt-20 md:mt-14">
				<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center">
					Essas são as respostas que iremos receber.
				</h2>
				{inscrito && (
					<User.Root data={inscrito} className="w-full lg:w-1/2">
						<User.Borders subscriber={inscrito[0]} disableChangeStatus>
							<User.Header>
								<User.Avatar subscriber={inscrito[0]} />
							</User.Header>
							<User.Content>
								<User.Name subscriber={inscrito[0]} />
								<User.Email subscriber={inscrito[0]} />
								<User.Matricula subscriber={inscrito[0]} />
							</User.Content>
							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Semestre:</Label>
								<Badge className="text-xs md:text-base flex items-center justify-center">
									{`${inscrito[0].semestre}°`}
								</Badge>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Conheceu o PET:</Label>
								<p>{inscrito[0].conhecimentoPET}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Interesse no PET:</Label>
								<p>{inscrito[0].interessePET}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Competências Desejadas:</Label>
								<p>{inscrito[0].competenciasDesejadas}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Atividades Extracurriculares:</Label>
								<p>{inscrito[0].atividadesExtracurriculares}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Atividades de Interesse:</Label>
								<p>{inscrito[0].atividadesInteresse}</p>
							</User.Footer>

							<User.Footer className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2 gap-1">
								<Label>Carga Horária:</Label>
								<p>{inscrito[0].cargaHoraria}</p>
							</User.Footer>
						</User.Borders>
					</User.Root>
				)}
			</main>
		</>
	)
}
