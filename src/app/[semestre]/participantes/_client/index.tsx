"use client"

import { User } from "@/components/User"
import type { SubscriberData } from "@/components/User/UserRoot"
import { SettingsSheet } from "@/components/settingsSheet/index"
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
import type { AuthorizedUser, SelecaoData } from "@/http/db"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import type { Session } from "next-auth"
import { getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ClientComponentProps {
	params: { semestre: string }
	selecao: SelecaoData[] | null
	authorized: AuthorizedUser[] | null
	session: Session | null
}
export function ClientComponent({
	params,
	authorized,
	selecao,
	session,
}: ClientComponentProps) {
	const router = useRouter()
	const [filter, setFilter] = useState<string>("no-filter")
	const {
		data: users,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser()
			const { data } = await supabase.from("participantes").select()
			return data
		},
	})

	const sortedData = () => {
		if (!Array.isArray(users)) return []

		switch (filter) {
			case "name":
				return [...users].sort((a, b) => a.name.localeCompare(b.name))
			case "average":
				return [...users].sort((a, b) => b.mediaFinal - a.mediaFinal)
			case "no-filter":
				return users
			default:
				return users
		}
	}

	const handleSubscriberClick = (subscriberId: string) => {
		const currentPath = window.location.pathname
		router.push(`${currentPath}/${subscriberId}?page=1`)
	}

	function isAuthorized() {
		if (!session?.user?.email || !authorized) {
			return false
		}

		const autorizadosData = authorized as {
			email: string
			role: string
		}[]

		if (!autorizadosData) {
			return false
		}

		const autorizado = autorizadosData.find(
			(authUser) => authUser.email === session.user?.email,
		)

		return autorizado?.role === "admin"
	}
	console.log(isAuthorized())

	return (
		<div className="flex flex-col min-h-screen mt-10 font-[family-name:var(--font-geist-sans)]">
			<header>
				<h1 className="text-3xl font-bold text-center mb-4">
					{`${Number.parseInt(params.semestre.slice(0, 2))}° Seleção de ${params.semestre.slice(2)}`}
				</h1>
			</header>
			<Card>
				<CardHeader>
					<CardTitle className="flex justify-between items-center">
						<span>Participantes</span>
						{isAuthorized() && <SettingsSheet />}
					</CardTitle>
					<CardDescription className="w-full flex justify-between items-center">
						<div className="flex flex-row gap-2 items-center">
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
							{!isAuthorized() && (
								<sub className="text-sm text-foreground-muted">
									Clique nos participantes para avaliar
								</sub>
							)}
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							<Skeleton className="w-full h-36" />
							<Skeleton className="w-full h-36" />
							<Skeleton className="w-full h-36" />
							<Skeleton className="w-full h-36" />
						</div>
					) : isError ? (
						<h3 className="text-center">Erro ao carregar participantes.</h3>
					) : sortedData().length === 0 ? (
						<h3 className="text-center">Nenhum participante inscrito ainda.</h3>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{sortedData().map((subscriber) => (
								<div key={subscriber.email} className="col-span-1">
									<div
										className="w-full text-left data-[status=Pendente]:transition-transform data-[status=Pendente]:hover:scale-105"
										data-status={subscriber.status}
									>
										<User.Root data={[subscriber]}>
											<User.Borders
												subscriber={subscriber}
												colorBorders
												authorized={isAuthorized()}
												selecao={selecao?.[0]}
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
					)}{" "}
				</CardContent>
			</Card>
		</div>
	)
}