import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/queryClient";
import { supabase } from "@/lib/supabase/supabase";
import { getStorageKey, mapReactions } from "@/lib/utils/helpers";

export const useReactions = (postId: string) => {
	const { data: counts = {}, isLoading } = useQuery({
		queryKey: ["reactions", postId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("reactions")
				.select("reaction_type, count")
				.eq("post_id", postId);

			if (error) throw error;

			return mapReactions(data);
		},
	});

	// MUTATION
	const mutation = useMutation({
		mutationFn: async ({ type, delta }: { type: string; delta: number }) => {
			const { error } = await supabase.rpc("toggle_reaction", {
				p_post_id: postId,
				p_type: type,
				p_delta: delta,
			});

			if (error) throw error;
		},

		// OPTIMISTIC UPDATE
		onMutate: async ({ type, delta }) => {
			const key = getStorageKey(postId, type);

			await queryClient.cancelQueries({ queryKey: ["reactions", postId] });

			const previous = queryClient.getQueryData<Record<string, number>>(["reactions", postId]);

			// update localStorage
			if (delta === 1) localStorage.setItem(key, "1");
			if (delta === -1) localStorage.removeItem(key);

			// optimistic cache update
			queryClient.setQueryData<Record<string, number>>(["reactions", postId], (old) => ({
				...old,
				[type]: Math.max((old?.[type] || 0) + delta, 0),
			}));

			return { previous };
		},

		// ROLLBACK
		onError: (_err, variables, context) => {
			if (!context) return;

			queryClient.setQueryData(["reactions", postId], context.previous);

			const key = getStorageKey(postId, variables.type);

			// revert localStorage
			if (variables.delta === 1) localStorage.removeItem(key);
			if (variables.delta === -1) localStorage.setItem(key, "1");
		},

		// REVALIDATE
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["reactions", postId] });
		},
	});

	// PUBLIC API
	const toggleReaction = (type: string) => {
		const key = getStorageKey(postId, type);
		const hasReacted = !!localStorage.getItem(key);

		mutation.mutate({
			type,
			delta: hasReacted ? -1 : 1,
		});
	};

	return {
		counts,
		toggleReaction,
		loading: isLoading,
	};
};
