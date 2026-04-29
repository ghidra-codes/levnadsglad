import { useSanityQuery } from "@/hooks/useSanityQuery";
import { diaryNavQuery } from "@/lib/sanity/queries";
import type { DiaryNavPost } from "@/types/diary.types";

const EMPTY_LIST: DiaryNavPost[] = [];

const useDiaryNavigation = () => {
	return useSanityQuery<DiaryNavPost[]>(["diary-navigation"], diaryNavQuery, {
		placeholderData: EMPTY_LIST,
	});
};

export default useDiaryNavigation;
