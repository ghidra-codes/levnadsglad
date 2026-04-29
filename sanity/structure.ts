import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
	S.list()
		.title("Content")
		.items([
			S.listItem()
				.title("About Section")
				.child(S.document().schemaType("aboutSection").documentId("aboutSection")),

			S.divider(),

			S.listItem().title("Posts").child(S.documentTypeList("post")),

			S.listItem().title("Categories").child(S.documentTypeList("category")),

			S.listItem().title("Category Groups").child(S.documentTypeList("categoryGroup")),
		]);
