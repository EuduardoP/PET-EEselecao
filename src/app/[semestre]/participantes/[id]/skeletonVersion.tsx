import { User } from "@/components/User"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function SkeletonVersion() {
	const router = useRouter()
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
				<User.Root data={[]} className="w-full sm:w-1/2 lg:w-1/3">
					<User.Borders>
						<User.Header>
							<Skeleton className="w-[58px] h-[30.5px] rounded-full" />
							<Skeleton className="h-12 w-12 rounded-full" />
						</User.Header>
						<User.Content>
							<Skeleton className="h-4 w-[197px]" />
							<Skeleton className="h-4 w-[197px]" />
							<Skeleton className="h-4 w-[197px]" />
						</User.Content>
						<User.Footer className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							<Label className="col-span-2">
								Média da atividade de apresentação
							</Label>
							<Skeleton className="w-[93px] h-[30.5px] rounded-full" />
							<Label className="col-span-2">
								Média da atividade individual
							</Label>
							<Skeleton className="w-[93px] h-[30.5px] rounded-full" />
							<Label className="col-span-2">Média da atividade em grupo</Label>
							<Skeleton className="w-[93px] h-[30.5px] rounded-full" />
							<Label className="col-span-2">
								Média da entrevista com professores
							</Label>
							<Skeleton className="w-[93px] h-[30.5px] rounded-full" />
							<Label className="col-span-2">
								Média da avaliação como membro
							</Label>
							<Skeleton className="w-[93px] h-[30.5px] rounded-full" />
						</User.Footer>
						<User.Footer>
							<p>teste</p>
						</User.Footer>
					</User.Borders>
				</User.Root>
				<Card className="flex-1 w-full sm:w-1/2 lg:w-1/3">
					<CardHeader>
						<CardTitle>Avaliação do participante</CardTitle>
					</CardHeader>
				</Card>
			</main>
		</>
	)
}
