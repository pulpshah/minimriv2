import Image from "next/image";

interface NavBarProps {
  onSearchClick: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ onSearchClick }) => {
  return (
    <div className="poppins text-white text-sm md:text-base px-4 md:px-6 rounded-2xl black-opaque flex flex-row items-center justify-between py-2 max-w-full md:max-w-[500px] w-full">
      <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
        <Image src='/icons/tv-icon-white.svg' alt='Related Media' width={19} height={17} />
        <p>media</p>
      </button>
      <button onClick={onSearchClick} className="flex items-center justify-center w-auto h-auto flex-col gap-1">
        <Image src='/icons/search-icon.svg' alt='search' width={19} height={17} />
        <p>search</p>
      </button>
      <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
        <Image src='/icons/vote-icon.svg' alt='vote' width={19} height={17} />
        <p>vote</p>
      </button>
    </div>
  );
};
