import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import supabase from "../supabase/supabase-client";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string;
  user_name: string;
  user_id: string;
}

const createPostFn = async (post: PostInput, imageFile: File) => {
  const filePath = `${imageFile.name}-${Date.now()}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error("Image Upload Failed" + uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data: createPostData, error: createPostError } = await supabase
    .from("posts")
    .insert([
      {
        ...post,
        image_url: publicURLData.publicUrl,
      },
    ]);

  if (createPostError)
    throw new Error("Post Creation Failed: " + createPostError.message);

  return createPostData;
};

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ post, imageFile }: { post: PostInput; imageFile: File }) =>
      createPostFn(post, imageFile),
    onSuccess: () => {
      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url,
        user_name: user?.user_metadata.full_name,
        user_id: user!.id,
      },
      imageFile: file!,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="border border-gray-600 p-2 rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            rows={5}
            placeholder="Content"
            required
            onChange={(e) => setContent(e.target.value)}
            value={content}
            className="border border-gray-600 p-2 rounded"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="upload-image">Upload Image</label>
          <input
            ref={fileInputRef}
            id="upload-image"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            required
            className="border border-gray-600 p-2 rounded cursor-pointer"
          />
        </div>
        <button
          disabled={isPending}
          className={`${
            isPending ? "bg-gray-300" : ""
          } bg-gray-100 h-10 text-black cursor-pointer p-2 rounded hover:bg-gray-300 transition-colors`}
        >
          {isPending ? (
            <Loader2 className="animate-spin size-5 mx-auto" />
          ) : (
            "Create Post"
          )}
        </button>
        {isError && <p className="text-red-500">Something went wrong.</p>}
      </form>
    </div>
  );
};

export default CreatePost;
