"use client"

import { User } from "@/components/User"
import type { SubscriberData } from "@/components/User/UserRoot"
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
import { getInscritos } from "@/http/get-participants"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Participantes({ params }: { params: { id: string } }) {
	const router = useRouter()

	const [filter, setFilter] = useState<string>("no-filter")

	const { data, isLoading } = useQuery({
		queryKey: ["inscritos"],
		queryFn: getInscritos,
		refetchOnWindowFocus: true,
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

	const handleSubscriberClick = (subscriberEmail: string) => {
		const currentPath = window.location.pathname
		router.push(`${currentPath}/${subscriberEmail}`)
	}

	return (
		<div className="flex flex-col justify-between min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<header className="absolute top-4 left-1/2 transform -translate-x-1/2">
				<h1 className="text-3xl font-bold text-center">
					{`${Number.parseInt(params.id.slice(0, 2))}° Seleção de ${params.id.slice(2)}`}
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
						<h3>Buscando participantes</h3>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{sortedData()?.map((subscriber) => (
								<div key={subscriber.email} className="col-span-1">
									<div className="transition-transform hover:scale-105 w-full text-left">
										<User.Root data={[subscriber]}>
											<User.Borders
												subscriber={subscriber}
												colorBorders
												onSubscriberClick={handleSubscriberClick}
											>
												<User.Header>
													<User.Points value={subscriber.mediaFinal} />
													<User.Avatar subscriber={subscriber} />
												</User.Header>
												<User.Content>
													<User.Name subscriber={subscriber} />
													<User.Email subscriber={subscriber} />
													<User.Status subscriber={subscriber} />
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
