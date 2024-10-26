import ClientComponent from "@/components/HomeComponent/clientPage"
import { FormInput } from "@/components/HomeComponent/formInput"
import { Toaster } from "@/components/ui/toaster"
import { fetchSelecao } from "@/http/db"
import Image from "next/image"
import Link from "next/link"

export function isSelecaoOpen(dateFrom: string, dateTo: string) {
	const currentDate = new Date().toISOString().split("T")[0]
	const from = new Date(dateFrom).toISOString().split("T")[0]
	const to = new Date(dateTo).toISOString().split("T")[0]

	return currentDate >= from && currentDate <= to
}

export default async function Home() {
	const { data: selecao, error } = await fetchSelecao()
	const isOpen = selecao
		? isSelecaoOpen(selecao[0].date_from, selecao[0].date_to)
		: false
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-pattern bg-no-repeat bg-center">
			<main className="flex flex-col gap-8 row-start-2 -mt-52 items-center justify-center">
				<Image src="/logo.png" alt="Logo do PET-EE" width={300} height={157} />
				<p className="leading-relaxed text-center">
					Participe da seleção do PET Engenharia Elétrica
				</p>

				{!selecao ? (
					<div className="flex w-96 h-14 items-center gap-2 bg-transparent p-2 rounded-xl border border-zinc-800 focus-within:ring-1 ring-blue-500 ring-offset-2 ring-offset-zinc-950 justify-center">
						Não há seleção neste momento
					</div>
				) : isOpen ? (
					<FormInput />
				) : (
					<div className="flex w-96 h-14 items-center gap-2 bg-transparent p-2 rounded-xl border border-zinc-800 focus-within:ring-1 ring-blue-500 ring-offset-2 ring-offset-zinc-950 justify-center">
						As inscrições estão encerradas
					</div>
				)}
				{!selecao ? (
					<div className="flex w-96 h-14 items-center gap-2 bg-transparent p-2 rounded-xl border border-zinc-800 focus-within:ring-1 ring-blue-500 ring-offset-2 ring-offset-zinc-950 justify-center">
						Não há seleção neste momento
					</div>
				) : isOpen ? (
					<FormInput />
				) : (
					<div className="flex w-96 h-14 items-center gap-2 bg-transparent p-2 rounded-xl border border-zinc-800 focus-within:ring-1 ring-blue-500 ring-offset-2 ring-offset-zinc-950 justify-center">
						As inscrições estão encerradas
					</div>
				)}

				<ClientComponent error={error} selecao={selecao} />
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

			<Toaster />
		</div>
	)
}
