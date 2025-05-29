import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../supabase/supabase-client";
import PostItem from "../components/PostItem";
import { Loader2 } from "lucide-react";

const YourPostsPage = () => {
  const { user } = useAuth();
  const {
    data: postsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["posts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-semibold text-pink-500 font-mono">
        Your Posts
      </h2>
      {isLoading && <Loader2 className="animate-spin size-6" />}
      {error && <div className="text-red-500">{error.message}</div>}
      {postsData?.length === 0 && (
        <div className="text-gray-500">You have no posts yet.</div>
      )}
      <div className="grid grid-cols-1 gap-8">
        {postsData?.map((post) => (
          <PostItem post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default YourPostsPage;
