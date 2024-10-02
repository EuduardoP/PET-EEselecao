import type { SubscriberData } from "./UserRoot"

export function UserMatricula({ subscriber }: { subscriber: SubscriberData }) {
	return (
		<p className="text-xs sm:text-sm text-muted-foreground truncate">
			Matrícula: {subscriber.matricula}
		</p>
	)
}
