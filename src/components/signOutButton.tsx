"use client"

import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"

interface SignOutButtonProps {
	user?: {
		name?: string | null | undefined
		email?: string | null | undefined
		image?: string | null | undefined
	}
}

export default function SignOutButton({ user }: SignOutButtonProps) {
	const getInitials = (name?: string | null | undefined): string => {
		if (!name) return "AF"
		const words = name.split(" ")
		if (words.length === 1) return words[0][0].toUpperCase()
		return (words[0][0] + words[1][0]).toUpperCase()
	}

	return (
		<div className="flex gap-4 items-center">
			<Avatar>
				<AvatarImage src={user?.image || undefined} alt="avatar do login" />
				<AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
			</Avatar>
			<Button onClick={() => signOut({ callbackUrl: "/" })}>Sair</Button>
		</div>
	)
}
