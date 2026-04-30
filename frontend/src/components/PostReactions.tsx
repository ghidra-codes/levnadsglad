import { REACTIONS } from "@/constants/reactions";
import { useReactions } from "@/hooks/useReactions";
import { getStorageKey } from "@/lib/utils/helpers";

const PostReactions = ({ postId }: { postId: string }) => {
	const { counts, toggleReaction, loading } = useReactions(postId);

	if (loading) return null;

	return (
		<div className="post-reactions">
			<div className="post-reactions__list">
				{REACTIONS.map((r) => {
					const reacted = !!localStorage.getItem(getStorageKey(postId, r.key));

					return (
						<button
							key={r.key}
							className={`post-reactions__btn ${reacted ? "post-reactions__btn--active" : ""}`}
							onClick={() => toggleReaction(r.key)}
						>
							<span>{r.label}</span>
							<span>{counts[r.key] || 0}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default PostReactions;
