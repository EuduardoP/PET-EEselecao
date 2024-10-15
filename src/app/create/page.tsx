import { getAuthorized } from "@/http/api"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { use } from "react"
import FormInput from "./formInput"

export default async function Create() {
	const session = await getServerSession()
	const authorized = await getAuthorized()

	if (!session) {
		redirect("/login")
	}

	if (session.user?.email) {
		const userAuthorized = authorized.find(
			(user) => user.email === session.user?.email && user.role === "admin",
		)

		if (!userAuthorized) {
			redirect("/")
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
		</div>
	)
}
