import type { Post } from "./PostsList";
import LikesComponent from "./LikesComponent";
import { useState } from "react";
import CommentsComponent from "./CommentsComponent";
import { useAuth } from "../contexts/AuthContext";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase/supabase-client";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  const { user } = useAuth();
  const isLong = post.content.length > 100;
  const [showMore, setShowMore] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deletePost } = useMutation({
    mutationFn: async (postId: number) => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user?.id);
      if (error) throw new Error("Post deletion failed: " + error.message);
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  return (
    <div className="max-w-xl bg-stone-900 p-4 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={post?.avatar_url}
            alt="user_avatar"
            className="size-5 md:size-6 rounded-full"
          />
          <span className="font-medium text-xs md:text-base">
            {post?.user_name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs md:text-sm">
            {formatDistanceToNow(new Date(post?.created_at))} ago
          </span>
          {user?.id === post?.user_id && (
            <Trash2
              className="size-8 cursor-pointer hover:bg-stone-700 rounded-full transition-colors p-2"
              onClick={() => deletePost(post?.id)}
            >
              Delete
            </Trash2>
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-4">{post?.title}</h3>
      <p className="text-gray-300 text-sm font-medium mt-1">
        {isLong
          ? showMore
            ? post.content
            : post.content.slice(0, 100) + "..."
          : post.content}
        {isLong && (
          <button
            className="text-white ml-1 cursor-pointer underline"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </p>
      <img src={post?.image_url} alt={post?.title} className="w-full mt-4" />
      <div className="mt-4 space-y-4">
        <LikesComponent postId={post?.id} />
        <CommentsComponent postId={post?.id} />
      </div>
    </div>
  );
};

export default PostItem;
