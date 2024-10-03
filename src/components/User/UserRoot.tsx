import React from "react"

export interface SubscriberData {
	id: string
	name: string
	email: string
	status: string
	matricula: string
	mediaApresentacao: number
	mediaIndividual: number
	mediaGrupo: number
	mediaEntrevista: number
	mediaMembro: number
	mediaFinal: number
	semestre: string
	identificacao: string
	conhecimentoPET: string
	interessePET: string
	competenciasDesejadas: string
	atividadesExtracurriculares: string
	atividadesInteresse: string
	cargaHoraria: string
}

interface UserRootProps {
	children: React.ReactNode
	data: SubscriberData[]
	className?: string
}

export function UserRoot({ children, data, className }: UserRootProps) {
	return (
		<div className={className}>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(
						child as React.ReactElement<{ data: SubscriberData[] }>,
						{ data },
					)
				}
				return child
			})}
		</div>
	)
}
