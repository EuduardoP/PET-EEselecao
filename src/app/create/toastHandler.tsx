"use client"

import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"

export default function ToastHandler({
	showToast,
	isAuthorized,
}: { showToast: boolean; isAuthorized: boolean }) {
	useEffect(() => {
		if (showToast) {
			if (isAuthorized) {
				toast({
					title: "Seja bem-vindo(a)!",
					description: "Tudo está pronto para começar a seleção.",
				})
			} else {
				toast({
					title: "Acesso negado",
					description: "Você não tem permissão para acessar esta página.",
					variant: "destructive",
				})
			}
		}
	}, [showToast, isAuthorized])

	return null
}
