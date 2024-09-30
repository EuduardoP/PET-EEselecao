"use client"

import { User } from "@/components/User"
import type { SubscriberData } from "@/components/User/UserRoot"
import AvaliarForm from "@/components/avaliarComponent/avaliarForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getInscritos } from "@/http/get-participants"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { SkeletonVersion } from "./skeletonVersion"

export default function ParticipantePage({
	params,
}: { params: { email: string } }) {
	const router = useRouter()

	const { data: inscritos, isLoading } = useQuery({
		queryKey: ["inscritos"],
		queryFn: getInscritos,
		refetchOnWindowFocus: true,
	})

	if (isLoading) return <SkeletonVersion />

	const participante = inscritos?.find(
		(inscrito) => inscrito.email === decodeURIComponent(params.email),
	)

	return (
		<>
			<header className="absolute top-4 left-4">
				<Button
					className="flex items-center gap-2"
					onClick={() => router.back()}
				>
					<ArrowLeft />
					Voltar
				</Button>
			</header>
			<main className="flex flex-col sm:flex-row flex-wrap justify-between p-4 sm:p-8 lg:p-20 font-[family-name:var(--font-geist-sans)] gap-4 mt-16 sm:mt-0">
				{participante && (
					<User.Root data={[participante]} className="w-full sm:w-1/2 lg:w-1/3">
						<User.Borders subscriber={participante} colorBorders>
							<User.Header>
								<User.Points value={participante.mediaFinal} />
								<User.Avatar subscriber={participante} />
							</User.Header>
							<User.Content>
								<User.Name subscriber={participante} />
								<User.Email subscriber={participante} />
								<User.Status subscriber={participante} />
							</User.Content>
							<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								<Label className="col-span-2">
									Média da atividade de apresentação
								</Label>
								<User.Points value={participante.mediaApresentacao} />
								<Label className="col-span-2">
									Média da atividade individual
								</Label>
								<User.Points value={participante.mediaIndividual} />
								<Label className="col-span-2">
									Média da atividade em grupo
								</Label>
								<User.Points value={participante.mediaGrupo} />
								<Label className="col-span-2">
									Média da entrevista com professores
								</Label>
								<User.Points value={participante.mediaEntrevista} />
								<Label className="col-span-2">
									Média da avaliação como membro
								</Label>
								<User.Points value={participante.mediaMembro} />
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
						<AvaliarForm />
					</CardContent>
				</Card>
			</main>
		</>
	)
}
