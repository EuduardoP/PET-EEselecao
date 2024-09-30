import type { SubscriberData } from "./UserRoot"

export function UserName({ subscriber }: { subscriber: SubscriberData }) {
	return (
		<h3 className="text-sm sm:text-lg font-semibold truncate">
			{subscriber.name}
		</h3>
	)
}
