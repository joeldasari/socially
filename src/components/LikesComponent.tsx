import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../supabase/supabase-client";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";

interface Props {
  postId: number;
}

const LikesComponent = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isLiked } = useQuery({
    queryKey: ["likes", postId, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user?.id)
        .maybeSingle();

      return !!data;
    },
  });

  const { data: likesCount } = useQuery({
    queryKey: ["likesCount", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId);
      if (data) {
        return data.length;
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        toast.error("You must be logged in to like a post.");
        return;
      }
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user?.id);
        toast.success("Post unliked");
      } else {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });
        toast.success("Post liked");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", postId, user?.id]);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <Heart
          onClick={() => mutate()}
          className={`${
            isLiked ? "fill-red-500 text-red-500" : ""
          } size-6 cursor-pointer`}
        />
        <span>{likesCount}</span>
      </div>
    </div>
  );
};

export default LikesComponent;
