export interface RootAuthorizedUser {
	object: string
	id: string
	created_time: string
	last_edited_time: string
	created_by: CreatedBy
	last_edited_by: LastEditedBy
	parent: Parent
	archived: boolean
	in_trash: boolean
	properties: Properties
	url: string
}

export interface CreatedBy {
	object: string
	id: string
}

export interface LastEditedBy {
	object: string
	id: string
}

export interface Parent {
	type: string
	database_id: string
}

export interface Properties {
	Email: Email
	Cargo: Cargo
	Id: Id
}

export interface Email {
	id: string
	type: string
	email: string
}

export interface Cargo {
	id: string
	type: string
	select: Select
}

export interface Select {
	id: string
	name: string
	color: string
}

export interface Id {
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
