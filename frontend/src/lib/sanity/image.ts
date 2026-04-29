import type { SanityImageSource } from "@sanity/image-url";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanity } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(sanity);

export const imageUrlFor = (source: SanityImageSource) => builder.image(source);
