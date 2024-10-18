"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function GoBackButton() {
	return (
		<Button variant="destructive" onClick={() => useRouter().back()}>
			Voltar
		</Button>
	)
}
