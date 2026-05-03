import { useSanityQuery } from "@/hooks/useSanityQuery";
import { diaryNavQuery } from "@/lib/sanity/queries";
import type { DiaryNavPost } from "@/types/diary.types";

const useDiaryNavigation = () => {
	return useSanityQuery<DiaryNavPost[]>(["diary-navigation"], diaryNavQuery);
};

export default useDiaryNavigation;
