import type { SubscriberData } from "./UserRoot"

export function UserEmail({ subscriber }: { subscriber: SubscriberData }) {
	return (
		<p className="text-xs sm:text-sm text-muted-foreground truncate">
			{subscriber.email}
		</p>
	)
}
