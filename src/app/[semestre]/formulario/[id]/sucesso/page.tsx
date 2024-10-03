import { User } from "@/components/User"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { getInscritos } from "@/http/api"
import { use } from "react"

interface SucessoPageProps {
	params: { semestre: string; id: string }
}

export default function Sucesso({ params }: SucessoPageProps) {
	const inscritos = use(getInscritos(params.id))
	return (
		<main className="flex flex-col items-center justify-center w-full min-h-screen p-4 gap-4">
			<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Essas são as respostas que iremos receber.
			</h2>
			<User.Root data={inscritos} className="w-full sm:w-1/2 lg:w-1/3">
				<User.Borders subscriber={inscritos[0]} disableChangeStatus>
					<User.Header>
						<User.Avatar subscriber={inscritos[0]} />
					</User.Header>
					<User.Content>
						<User.Name subscriber={inscritos[0]} />
						<User.Email subscriber={inscritos[0]} />
						<User.Matricula subscriber={inscritos[0]} />
					</User.Content>
					<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<Label className="col-span-2">Semestre:</Label>
						<Badge className="text-xs md:text-base flex items-center justify-center">
							{`${inscritos[0].semestre}°`}
						</Badge>
					</User.Footer>

					<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<Label className="col-span-2">Conheceu o PET:</Label>
						<p>{inscritos[0].conhecimentoPET}</p>
					</User.Footer>

					<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<Label className="col-span-2">Interesse no PET:</Label>
						<p>{inscritos[0].interessePET}</p>
					</User.Footer>

					<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<Label className="col-span-2">Competências Desejadas:</Label>
						<p>{inscritos[0].competenciasDesejadas}</p>
					</User.Footer>

					<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<Label className="col-span-2">Atividades Extracurriculares:</Label>
						<p>{inscritos[0].atividadesExtracurriculares}</p>
					</User.Footer>

					<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<Label className="col-span-2">Atividades de Interesse:</Label>
						<p>{inscritos[0].atividadesInteresse}</p>
					</User.Footer>

					<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<Label className="col-span-2">Carga Horária:</Label>
						<p>{inscritos[0].cargaHoraria}</p>
					</User.Footer>
				</User.Borders>
			</User.Root>
		</main>
	)
}
