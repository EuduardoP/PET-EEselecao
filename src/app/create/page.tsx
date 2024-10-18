import { Button } from "@/components/ui/button"
import { type AuthorizedUser, getAuthorized, getSelecao } from "@/http/api"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import FormInput from "./formInput"
import ToastHandler from "./toastHandler"

export default async function Create() {
	const session = await getServerSession()
	const authorized = await getAuthorized()
	const selecao = await getSelecao()

	let isAuthorized = false
	let showToast = false
	if (!session) {
		redirect("/login")
	}

	if (session.user?.email) {
		const userAuthorized = authorized.some(
			(user: AuthorizedUser) => user.email === session.user?.email,
		)
		if (!userAuthorized) {
			showToast = true
			isAuthorized = false
			redirect("/denied")
		} else {
			showToast = true
			isAuthorized = true
		}
	} else {
		redirect("/login")
	}

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-pattern bg-no-repeat bg-center">
			<main className="flex flex-col gap-8 row-start-2 -mt-52 items-center justify-center">
				<Image src="/logo.png" alt="Logo do PET-EE" width={300} height={157} />
				<p className="leading-relaxed text-center">
					Crie a seleção do (PET-EE) selecione o semestre e o dia da seleção.
				</p>

				<FormInput />
				{selecao.data.semestre && (
					<>
						<p>Já existe uma seleção criada</p>
						<Button asChild>
							<Link href={`/${selecao.data.semestre}/participantes`}>
								Ir para a seleção
							</Link>
						</Button>
					</>
				)}
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				Created by{" "}
				<Link
					href="https://github.com/EuduardoP"
					target="_blank"
					rel="noopener noreferrer"
				>
					Eduardo Pires Rosa
				</Link>
			</footer>
			<ToastHandler showToast={showToast} isAuthorized={isAuthorized} />
		</div>
	)
}
