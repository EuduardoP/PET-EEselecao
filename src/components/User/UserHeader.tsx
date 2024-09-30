export function UserHeader({ children }: { children: React.ReactNode }) {
	return (
		<div className="col-span-1 flex flex-col items-center space-y-2">
			{children}
		</div>
	)
}
