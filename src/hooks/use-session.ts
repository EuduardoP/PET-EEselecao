"use client"

import { type SelecaoData, getAuthorized, getSelecao } from "@/http/api"
import { getServerSession } from "next-auth"
import { useEffect, useState } from "react"

const useAuthorization = () => {
	const [showToast, setShowToast] = useState(false)
	const [isAuthorized, setIsAuthorized] = useState(false)
	const [selecao, setSelecao] = useState<SelecaoData>()

	useEffect(() => {
		const checkAuthorization = async () => {
			try {
				const session = await getServerSession()
				if (!session) {
					window.location.href = "/login"
					return
				}

				const authorized = await getAuthorized()
				const selecao = await getSelecao()
				setSelecao(selecao)

				if (session.user?.email) {
					const userAuthorized = authorized.find(
						(user) =>
							user.email === session.user?.email && user.role === "admin",
					)

					if (userAuthorized) {
						setShowToast(true)
						setIsAuthorized(true)
					} else {
						setShowToast(true)
						setIsAuthorized(false)
						window.location.href = "/"
					}
				} else {
					window.location.href = "/login"
				}
			} catch (error) {
				console.error("Error checking authorization:", error)
			}
		}

		checkAuthorization()
	}, [])

	return { showToast, isAuthorized, selecao }
}

export default useAuthorization
