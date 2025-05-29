import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import supabase from "../supabase/supabase-client";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  postId: number;
}

const CommentsComponent = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId) => {
      await supabase
        .from("comments")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user?.id)
        .eq("id", commentId);
      toast.success("Comment deleted successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (newComment: string) => {
      if (!user?.id) {
        toast.error("You must be logged in to comment.");
        return;
      }
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment,
        user_name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setComment("");
      setShowComments(true);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment added");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <p>Comments ({commentsData?.length})</p>
        {commentsData && commentsData.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm font-medium cursor-pointer underline"
          >
            {showComments ? "Hide" : "View"}
          </button>
        )}
      </div>
      {user && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (comment.trim()) mutate(comment);
          }}
          className="flex flex-col gap-2 mb-4"
        >
          <input
            placeholder="Write a comment..."
            className="w-full border border-gray-600 rounded-full px-4 py-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </form>
      )}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        showComments && (
          <ul className="flex flex-col gap-4">
            {commentsData?.map((c) => (
              <li key={c.id} className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.avatar_url}
                      alt={c.user_name}
                      className="size-5 md:size-6 rounded-full"
                    />
                    <span className="font-medium text-xs md:text-sm">
                      {c.user_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs md:text-sm">
                      {formatDistanceToNow(new Date(c?.created_at))} ago
                    </span>
                    {user?.id === c.user_id && (
                      <Trash2
                        className="size-8 cursor-pointer hover:bg-stone-700 rounded-full transition-colors p-2"
                        onClick={() => deleteComment(c.id)}
                      >
                        Delete
                      </Trash2>
                    )}
                  </div>
                </div>
                <p className="ml-8 text-sm md:text-base">{c.content}</p>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default CommentsComponent;
