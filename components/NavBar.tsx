import Image from "next/image";
import Link from "next/link";
export const NavBar: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
    return (
        <div className="poppins text-white text-xs sm:text-sm md:text-base px-4 md:px-6 rounded-2xl nav-bar flex backdrop-blur-[200px] flex-row items-center justify-between py-2 max-w-full md:max-w-[500px] w-full">
            <Link href="/home" passHref>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/home-icon.svg' alt='Home' width={19} height={17} />
                <p>home</p>
            </button>
            </Link>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/tv-icon-white.svg' alt='Related Media' width={19} height={17} />
                <p>media</p>
            </button>
            <Link href="/search" passHref>
              <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/search-icon.svg' alt='search' width={19} height={17} />
                <p>search</p>
            </button>
            </Link>
            <Link href="/vote" passHref>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/vote-icon.svg' alt='vote' width={19} height={17} />
                <p>vote</p>
            </button>
        
            </Link>
        </div>
    );
};
