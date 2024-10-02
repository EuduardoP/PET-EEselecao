"use client"

import { User } from "@/components/User"
import type { SubscriberData } from "@/components/User/UserRoot"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { type SelecaoData, getInscritos, getSelecao } from "@/http/api"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Participantes({
	params,
}: { params: { semestre: string } }) {
	const router = useRouter()
	const [filter, setFilter] = useState<string>("no-filter")

	const { data, isLoading, error } = useQuery<SubscriberData[], Error>({
		queryKey: ["inscritos"],
		queryFn: () => getInscritos(),
	})

	const sortedData = () => {
		if (!data) return []

		switch (filter) {
			case "name":
				return [...data].sort((a, b) => a.name.localeCompare(b.name))
			case "average":
				return [...data].sort((a, b) => b.mediaFinal - a.mediaFinal)
			case "no-filter":
				return data
			default:
				return data
		}
	}

	const handleSubscriberClick = (subscriberId: string) => {
		const currentPath = window.location.pathname
		router.push(`${currentPath}/${subscriberId}`)
	}

	const { data: selecao } = useQuery<SelecaoData, Error>({
		queryKey: ["selecao"],
		queryFn: getSelecao,
	})

	if (selecao?.data.semestre !== params.semestre) {
		return (
			<div className="flex flex-col justify-center items-center min-h-screen text-red-800 p-6 rounded-lg shadow-lg">
				<h1 className="text-5xl font-bold mb-4">Erro no ID da Seleção</h1>
				<sub className="text-lg mb-2">Esse ID não existe no banco de dados</sub>

				<Button
					variant="destructive"
					onClick={() => window.history.back()}
					className="mt-4 px-4 py-2"
				>
					Voltar
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col justify-between min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<header className="absolute top-4 left-1/2 transform -translate-x-1/2">
				<h1 className="text-3xl font-bold text-center">
					{`${Number.parseInt(params.semestre.slice(0, 2))}° Seleção de ${params.semestre.slice(2)}`}
				</h1>
			</header>
			<Card className="mt-16 sm:mt-1">
				<CardHeader>
					<CardTitle>
						<span>Participantes</span>
					</CardTitle>
					<CardDescription className="w-full flex justify-between items-center">
						<div className="mb-4">
							<h3>Filtrar por:</h3>
							<Select onValueChange={setFilter} defaultValue="no-filter">
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Tipo de filtro" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Filtro</SelectLabel>
										<SelectItem value="no-filter">Ordem de envio</SelectItem>
										<SelectItem value="name">Ordem alfabética</SelectItem>
										<SelectItem value="average">Ordem por Nota</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							<Skeleton className="w-full h-36" />
							<Skeleton className="w-full h-36" />
							<Skeleton className="w-full h-36" />
						</div>
					) : error ? (
						<h3>Erro ao carregar participantes: {error.message}</h3>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{sortedData()?.map((subscriber) => (
								<div key={subscriber.email} className="col-span-1">
									<div
										className="w-full text-left data-[status=Pendente]:transition-transform data-[status=Pendente]:hover:scale-105"
										data-status={subscriber.status}
									>
										<User.Root data={[subscriber]}>
											<User.Borders
												subscriber={subscriber}
												colorBorders
												onSubscriberClick={
													subscriber.status === "Pendente"
														? handleSubscriberClick
														: undefined
												}
											>
												<User.Header>
													<User.Points value={subscriber.mediaFinal} />
													<User.Avatar subscriber={subscriber} />
												</User.Header>
												<User.Content>
													<User.Name subscriber={subscriber} />
													<User.Email subscriber={subscriber} />
													<User.Matricula subscriber={subscriber} />
												</User.Content>
											</User.Borders>
										</User.Root>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
