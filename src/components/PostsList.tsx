import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase/supabase-client";
import { Loader2 } from "lucide-react";
import PostItem from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  avatar_url: string;
  user_name: string;
  user_id: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Post[];
};

const PostsList = () => {
  const {
    data: postsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
  if (isLoading) return <Loader2 className="animate-spin size-6" />;
  if (error) return <div>Error: {error.message}</div>;
  if (postsData?.length === 0)
    return <div className="text-gray-500">No posts available</div>;
  return (
    <div className="grid grid-cols-1 gap-8">
      {postsData?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostsList;
