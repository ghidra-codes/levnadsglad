import { useSanityQuery } from "@/hooks/useSanityQuery";
import { aboutQuery } from "@/lib/sanity/queries";
import type { AboutSection } from "@/types/about.types";

export const useAboutSection = () => useSanityQuery<AboutSection>(["aboutSection"], aboutQuery);
