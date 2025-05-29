import { AlignJustify, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { signInWithGoogle, signOut, user, loading } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email || "User";

  const displayPicture = user?.user_metadata?.avatar_url;

  const handleSignIn = () => {
    signInWithGoogle();
    setMenuOpen(false);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setMenuOpen(false);
    }
  };
  return (
    <nav className="flex justify-between items-center p-4 max-w-5xl mx-auto text-sm font-medium">
      <Link to="/" className="font-mono text-xl font-semibold text-pink-500">
        Socially
      </Link>
      {/* Web Links  */}
      <div className="hidden md:flex space-x-6">
        <Link
          to="/"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Home
        </Link>
        <Link
          to="/create"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Create Post
        </Link>
        <Link
          to="/your-posts"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Your Posts
        </Link>
      </div>

      <div className="hidden md:block">
        {/* Loading  */}
        {loading && <div className="w-[200px]"></div>}
        {/* Not Loading and User Exists!  */}
        {!loading && user && (
          <div className="flex items-center gap-2 text-xs font-medium">
            <img
              src={displayPicture}
              alt="displayPicture"
              className="size-6 rounded-full"
            />
            <span className="font-medium">{displayName}</span>
            <button
              onClick={signOut}
              className="bg-red-500 text-white rounded px-3 py-1.5 hover:bg-red-600 cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
        {/* Not Loading and User Does Not Exist!  */}
        {!loading && !user && (
          <button
            onClick={handleSignIn}
            className="text-black bg-white px-3 py-1.5 text-xs rounded cursor-pointer hover:bg-white/90 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Desktop Auth  */}
      {/* <div></div> */}

      {/* Mobile Menu Button  */}
      <AlignJustify
        onClick={() => setMenuOpen(true)}
        className="cursor-pointer md:hidden"
      />

      {/* Mobile Menu  */}
      {menuOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/40"
        >
          <div className="absolute top-0 right-0 bottom-0 bg-black w-[40%] border-l rounded-l-2xl border-gray-600 p-4 flex flex-col justify-between">
            <X
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer absolute top-4 right-4"
            />
            <div className="mt-8 flex flex-col gap-2">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <hr className="text-gray-600" />
              <Link to="/create" onClick={() => setMenuOpen(false)}>
                Create Post
              </Link>
              <hr className="text-gray-600" />
              <Link
                to="/your-posts"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Your Posts
              </Link>
              <hr className="text-gray-600" />
            </div>
            <div>
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={displayPicture}
                      alt="displayPicture"
                      className="size-6 rounded-full"
                    />
                    <span>{displayName}</span>
                  </div>
                  <hr className="text-gray-600" />
                  <button
                    onClick={signOut}
                    className="bg-red-500 text-white w-full rounded px-3 py-1.5 hover:bg-red-600 cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="text-black bg-white w-full px-3 py-1.5 rounded cursor-pointer hover:bg-white/90 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
