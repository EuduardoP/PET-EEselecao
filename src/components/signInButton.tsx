"use client"
import { signIn } from "next-auth/react"
import { Button } from "./ui/button"

export default function SignInButton() {
	return (
		<Button
			onClick={() => {
				console.log("Login button clicked")
				signIn("google", { callbackUrl: "/create" })
			}}
		>
			Login PET-EE
		</Button>
	)
}
