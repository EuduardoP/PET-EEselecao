export interface RootMembers {
	properties: Properties
}

export interface Properties {
	semestre: Semestre
	interessePET: InteressePet
	status: Status
	competenciasDesejadas: CompetenciasDesejadas
	mediaMembro: MediaMembro
	email: Email
	mediaEntrevista: MediaEntrevista
	conhecimentoPET: ConhecimentoPet
	mediaApresentacao: MediaApresentacao
	mediaFinal: MediaFinal
	mediaGrupo: MediaGrupo
	atividadesInteresse: AtividadesInteresse
	identificacao: Identificacao
	matricula: Matricula
	atividadesExtracurriculares: AtividadesExtracurriculares
	mediaIndividual: MediaIndividual
	name: Name
	cargaHoraria: CargaHoraria
	id: Id
}

export interface Semestre {
	id: string
	type: string
	number: number | null
}

export interface InteressePet {
	id: string
	type: string
	rich_text: RichText[] | []
}

export interface RichText {
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

export interface Status {
	id: string
	type: string
	select: Select | null
}

export interface Select {
	id: string
	name: string
	color: string
}

export interface CompetenciasDesejadas {
	id: string
	type: string
	rich_text: RichText2[] | []
}

export interface RichText2 {
	type: string
	text: Text2
	annotations: Annotations2
	plain_text: string
}

export interface Text2 {
	content: string
}

export interface Annotations2 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}

export interface MediaMembro {
	id: string
	type: string
	number: number | null
}

export interface Email {
	id: string
	type: string
	email: string
}

export interface MediaEntrevista {
	id: string
	type: string
	number: number | null
}

export interface ConhecimentoPet {
	id: string
	type: string
	rich_text: RichText3[] | []
}

export interface RichText3 {
	type: string
	text: Text3
	annotations: Annotations3
	plain_text: string
}

export interface Text3 {
	content: string
}

export interface Annotations3 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}

export interface MediaApresentacao {
	id: string
	type: string
	number: number | null
}

export interface MediaFinal {
	id: string
	type: string
	number: number | null
}

export interface MediaGrupo {
	id: string
	type: string
	number: number | null
}

export interface AtividadesInteresse {
	id: string
	type: string
	rich_text: RichText4[] | []
}

export interface RichText4 {
	type: string
	text: Text4
	annotations: Annotations4
	plain_text: string
}

export interface Text4 {
	content: string
}

export interface Annotations4 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}

export interface Identificacao {
	id: string
	type: string
	select: Select2 | null
}

export interface Select2 {
	id: string
	name: string
	color: string
}

export interface Matricula {
	id: string
	type: string
	rich_text: RichText5[] | []
}

export interface RichText5 {
	type: string
	text: Text5
	annotations: Annotations5
	plain_text: string
}

export interface Text5 {
	content: string
}

export interface Annotations5 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}

export interface AtividadesExtracurriculares {
	id: string
	type: string
	rich_text: RichText6[] | []
}

export interface RichText6 {
	type: string
	text: Text6
	annotations: Annotations6
	plain_text: string
}

export interface Text6 {
	content: string
}

export interface Annotations6 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}

export interface MediaIndividual {
	id: string
	type: string
	number: number | null
}

export interface Name {
	id: string
	type: string
	rich_text: RichText7[]
}

export interface RichText7 {
	type: string
	text: Text7
	annotations: Annotations7
	plain_text: string
}

export interface Text7 {
	content: string
}

export interface Annotations7 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}

export interface CargaHoraria {
	id: string
	type: string
	rich_text: RichText8[] | []
}

export interface RichText8 {
	type: string
	text: Text8
	annotations: Annotations8
	plain_text: string
}

export interface Text8 {
	content: string
}

export interface Annotations8 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}

export interface Id {
	id: string
	type: string
	title: Title[]
}

export interface Title {
	type: string
	text: Text9
	annotations: Annotations9
	plain_text: string
}

export interface Text9 {
	content: string
}

export interface Annotations9 {
	bold: boolean
	italic: boolean
	strikethrough: boolean
	underline: boolean
	code: boolean
	color: string
}
