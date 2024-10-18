import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import AvaliarForms from "./avaliarForms"

export default function AvaliarPage({
	page,
}: { params: { id: string }; page: string }) {
	const currentPage = Number(page) < 1 ? "1" : page

	return (
		<div className="w-full h-full flex flex-col">
			<header className="flex items-start mb-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href={`?page=${Math.max(1, Number(currentPage) - 1)}`}
								disabled={currentPage === "1"}
							/>
						</PaginationItem>
						{[1, 2, 3, 4, 5].map((pageNumber) => (
							<PaginationItem key={pageNumber}>
								<PaginationLink
									href={`?page=${pageNumber}`}
									isActive={currentPage === pageNumber.toString()}
								>
									{pageNumber}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								href={`?page=${Number(currentPage) + 1}`}
								disabled={currentPage === "5"}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</header>
			<main className="flex-grow">
				<AvaliarForms />
			</main>
		</div>
	)
}
