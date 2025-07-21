import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import UserIcon from "../components/icons/UserIcon";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  const toggleShowAuth = () => {
    setShowAuth(!showAuth);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(e.target as Node)) {
        setShowAuth(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-center w-full bg-primary-200 @container">
      <div className="flex w-full items-center justify-between max-w-[1080px] px-4 md:px-8 lg:px-16 @min-[1080px]:px-0">
        <nav aria-label="Main navigation">
          <Link to="/">
            <img
              src="/intelliquiz/images/brand.png"
              alt="Intelliquiz Logo"
              className="w-[150px] md:w-[200px]"
            />
          </Link>
        </nav>
        <div className="relative" ref={authRef}>
          <button
            onClick={toggleShowAuth}
            aria-haspopup="true"
            aria-expanded={showAuth}
            aria-controls="auth-menu"
            className="text-primary-500 hover:text-primary-700 active:text-primary-800 cursor-pointer"
          >
            <UserIcon />
            <span className="sr-only">My Profile</span>
          </button>
          {showAuth && (
            <div
              role="menu"
              tabIndex={-1}
              className="px-2 py-1 border border-primary-500 z-10 rounded-lg absolute right-0 top-10 bg-white text-grayscale-900 min-w-max"
            >
              <p className="heading-font mb-2">Feature coming soon!</p>
              <p className="body-font text-grayscale-900 mb-1">
                Stay tuned for:
              </p>
              <ul className="list-disc list-inside body-font" role="list">
                <li>User profile</li>
                <li>Save quizzes in-app</li>
                <li>Quiz history</li>
                <li>Performance tracking</li>
                <li>Topic tagging</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
