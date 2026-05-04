import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
	S.list()
		.title("Innehåll")
		.items([
			S.listItem()
				.title("Om mig")
				.child(S.document().schemaType("aboutSection").documentId("aboutSection")),

			S.divider(),

			S.listItem().title("Inlägg").child(S.documentTypeList("post")),

			S.listItem().title("Kategorier").child(S.documentTypeList("category")),

			S.listItem().title("Kategorigrupper").child(S.documentTypeList("categoryGroup")),
		]);
