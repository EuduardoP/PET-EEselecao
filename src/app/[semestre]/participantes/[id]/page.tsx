"use client"

import { User } from "@/components/User"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getInscritos } from "@/http/api"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import AvaliarPage from "./avaliarPage"
import { SkeletonVersion } from "./skeletonVersion"

export default function ParticipantePage({
	params,
}: { params: { id: string } }) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const page_query = searchParams.get("page") || "1"

	const { data: inscrito, isLoading } = useQuery({
		queryKey: ["inscrito"],
		queryFn: () => getInscritos(params.id),
		refetchOnWindowFocus: true,
	})

	if (isLoading) return <SkeletonVersion />
	const semestre = pathname?.split("/")[1]
	return (
		<>
			<header className="absolute top-4 left-4">
				<Button onClick={() => router.push(`/${semestre}/participantes`)}>
					Voltar
				</Button>
			</header>
			<main className="flex flex-col sm:flex-row flex-wrap justify-between p-4 sm:p-8 lg:p-20 font-[family-name:var(--font-geist-sans)] gap-4 mt-16 sm:mt-0">
				{inscrito && (
					<User.Root data={inscrito} className="w-full sm:w-1/2 lg:w-1/3">
						<User.Borders
							subscriber={inscrito[0]}
							colorBorders
							disableChangeStatus
						>
							<User.Header>
								<User.Points value={inscrito[0].mediaFinal} />
								<User.Avatar subscriber={inscrito[0]} />
							</User.Header>
							<User.Content>
								<User.Name subscriber={inscrito[0]} />
								<User.Email subscriber={inscrito[0]} />
								<User.Matricula subscriber={inscrito[0]} />
							</User.Content>
							<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								<Label className="col-span-2">
									Média da atividade de apresentação
								</Label>
								<User.Points value={inscrito[0].mediaApresentacao} />
								<Label className="col-span-2">
									Média da atividade individual
								</Label>
								<User.Points value={inscrito[0].mediaIndividual} />
								<Label className="col-span-2">
									Média da atividade em grupo
								</Label>
								<User.Points value={inscrito[0].mediaGrupo} />
								<Label className="col-span-2">
									Média da entrevista com professores
								</Label>
								<User.Points value={inscrito[0].mediaEntrevista} />
								<Label className="col-span-2">
									Média da avaliação como membro
								</Label>
								<User.Points value={inscrito[0].mediaMembro} />
							</User.Footer>
							<User.Footer>
								<p>teste</p>
							</User.Footer>
						</User.Borders>
					</User.Root>
				)}
				<Card className="flex-1 w-full sm:w-1/2 lg:w-1/3">
					<CardHeader>
						<CardTitle>Avaliação do participante</CardTitle>
					</CardHeader>
					<CardContent>
						<AvaliarPage params={params} page={page_query} />
					</CardContent>
				</Card>
			</main>
		</>
	)
}
