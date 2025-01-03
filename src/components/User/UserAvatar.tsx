import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import type { SubscriberData } from "./UserRoot"

export function UserAvatar({ subscriber }: { subscriber: SubscriberData }) {
	return (
		<Avatar className="h-10 w-10 sm:h-12 sm:w-12">
			<AvatarImage src="/placeholder.svg?height=48&width=48" alt="Avatar" />
			<AvatarFallback className="text-xs sm:text-base">
				{subscriber.name?.charAt(0)}
				{subscriber.name?.split(" ")[1]?.charAt(0)}
			</AvatarFallback>
		</Avatar>
	)
}
