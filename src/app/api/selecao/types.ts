export interface RootSelecao {
	properties: Properties
}

export interface Properties {
	data: DataFrom
	edital: Edital
	semestre: Semestre
}

export interface DataFrom {
	id: string
	type: string
	date: Date
}

export interface Date {
	start: string
	end: string
}

export interface Edital {
	id: string
	type: string
	url: string
}

export interface Semestre {
	id: string
	type: string
	title: Title[]
}

export interface Title {
	type: string
	text: Text
	annotations: Annotations
	plain_text: string
}

export interface Text {
	content: string
}

export interface Annotations {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}
