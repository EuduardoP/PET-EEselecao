import type { SubscriberData } from "./UserRoot"

export function UserStatus({ subscriber }: { subscriber: SubscriberData }) {
	return (
		<p className="text-xs sm:text-sm text-muted-foreground truncate">
			Status: {subscriber.status}
		</p>
	)
}
