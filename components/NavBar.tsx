import Image from "next/image";
import Link from "next/link";
export const NavBar: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
    return (
        <div className="poppins text-white text-xs sm:text-sm md:text-base px-6 md:px-6 rounded-none sm:rounded-[40px] pb-8 sm:pb-2 nav-bar flex backdrop-blur-[200px] flex-row items-center justify-between py-2 max-w-full md:max-w-[500px] w-full">
            <Link href="/home" passHref>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/home-icon.svg' alt='Home' width={30} height={30} />
            </button>
            </Link>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/globe-icon.svg' alt='Related Media' width={30} height={30} />
            </button>
            <Link href="/search" passHref>
              <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/search-icon.svg' alt='search' width={30} height={30} />
            </button>
            </Link>
            <Link href="/vote" passHref>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                <Image src='/icons/vote-icon.svg' alt='vote' width={30} height={30} />
            </button>
        
            </Link>
        </div>
    );
};
