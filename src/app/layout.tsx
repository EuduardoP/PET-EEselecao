import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { ModeToggle } from "@/components/modeToggle"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryProvider } from "@/lib/reactQueryProvider"

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
})
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
})

export const metadata: Metadata = {
	title: "Seleção PET-EE",
	description: "Gerenciador de seleção do PET-EE",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ReactQueryProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Toaster />
						<header className="absolute top-4 right-4">
							<ModeToggle />
						</header>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ReactQueryProvider>
	)
}
