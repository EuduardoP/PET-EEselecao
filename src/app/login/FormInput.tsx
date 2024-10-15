"use client"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
	email: z
		.string({
			required_error: "O email é obrigatório",
		})
		.email({
			message: "Digite um email válido",
		}),
	password: z
		.string()
		.min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
})

export function FormInput() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast({
			title: "Conta acessada",
			description: (
				<pre className="bg-muted p-4 rounded-md">
					{JSON.stringify(values, null, 2)}
				</pre>
			),
		})
	}
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="m@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input placeholder="" type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full">
						Login
					</Button>
				</form>
			</Form>
			<Button onClick={() => signIn("google", { callbackUrl: "/create" })}>
				Login com google
			</Button>
		</>
		// <div className="grid gap-4">
		// 	<div className="grid gap-2">
		// 		<Label htmlFor="email">Email</Label>
		// 		<Input id="email" type="email" placeholder="m@example.com" required />
		// 	</div>
		// 	<div className="grid gap-2">
		// 		<div className="flex items-center">
		// 			<Label htmlFor="password">Password</Label>
		// 		</div>
		// 		<Input id="password" type="password" required />
		// 	</div>
		// 	<Button type="submit" className="w-full">
		// 		Login
		// 	</Button>
		// </div>
	)
}
