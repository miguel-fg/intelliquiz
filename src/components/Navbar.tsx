import UserIcon from "../components/icons/UserIcon";

const Navbar = () => {
  return (
    <div className="flex justify-center w-full bg-primary-200 @container">
      <div className="flex w-full items-center justify-between max-w-[1080px] px-4 md:px-8 lg:px-16 @min-[1080px]:px-0">
        <img
          src="/intelliquiz/images/brand.png"
          alt="Intelliquiz Logo"
          className="w-[150px] md:w-[200px]"
        />
        <button className="text-primary-500 hover:text-primary-700 cursor-pointer">
          <UserIcon />
          <span className="sr-only">My Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
