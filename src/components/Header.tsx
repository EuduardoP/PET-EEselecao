import { getServerSession } from "next-auth"
import { ModeToggle } from "./modeToggle"
import SignInButton from "./signInButton"
import SignOutButton from "./signOutButton"

export default async function Header() {
	const session = await getServerSession()
	return (
		<header className="absolute top-4 right-4 flex items-center gap-4">
			{session ? (
				<SignOutButton user={session?.user ?? undefined} />
			) : (
				<SignInButton />
			)}
			<ModeToggle />
		</header>
	)
}
