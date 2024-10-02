"use client"

// app/page.tsx
import { FormInput } from "@/components/HomeComponent/formInput"
import { toast } from "@/hooks/use-toast"
import { getSelecao } from "@/http/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SelecaoData {
	semestre: string
	dateRange: {
		from: string
		to: string
	}
}

export default function Home() {
	const [data, setData] = useState<SelecaoData | null>(null)

	useEffect(() => {
		getSelecao()
			.then((response) => {
				setData(response.data)
			})
			.catch(() => {
				toast({
					title: "Erro ao buscar seleção",
					description: "Tente novamente mais tarde",
					variant: "destructive",
				})
			})
	}, [])

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-pattern bg-no-repeat bg-center">
			<main className="flex flex-col gap-8 row-start-2 -mt-52 items-center justify-center">
				<Image src="/logo.png" alt="Logo do PET-EE" width={300} height={157} />
				<p className="leading-relaxed text-center">
					Participe da seleção do PET Engenharia Elétrica
				</p>

				<FormInput />

				{data && (
					<div className="text-center">
						<p>
							As inscrições começam no dia{" "}
							<strong>
								{format(
									new Date(`${data.dateRange.from}T23:59:59Z`),
									"dd 'de' MMM yyyy",
									{
										locale: ptBR,
									},
								)}
							</strong>{" "}
							e vão até{" "}
							<strong>
								{format(
									new Date(`${data.dateRange.to}T23:59:59Z`),
									"dd 'de' MMM yyyy",
									{
										locale: ptBR,
									},
								)}
							</strong>
						</p>
					</div>
				)}
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				Criado por{" "}
				<Link
					href="https://github.com/EuduardoP"
					target="_blank"
					rel="noopener noreferrer"
				>
					Eduardo Pires Rosa
				</Link>
			</footer>
		</div>
	)
}
