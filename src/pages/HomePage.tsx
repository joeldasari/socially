import PostsList from "../components/PostsList";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h2 className="text-xl font-semibold text-pink-500 font-mono">
        Recent Posts
      </h2>
      <PostsList />
    </div>
  );
};

export default HomePage;
