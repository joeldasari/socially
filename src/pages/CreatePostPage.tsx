import CreatePost from "../components/CreatePost";

const CreatePostPage = () => {
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h2 className="text-xl font-semibold text-pink-500 font-mono">
        Create New Post
      </h2>
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;
