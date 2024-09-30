import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const NavBar: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
    const [activePage, setActivePage] = useState('');

    useEffect(() => {
        // This will set the active page based on the current pathname
        setActivePage(window.location.pathname);
    }, []);

    return (
        <div className="poppins text-white text-xs sm:text-sm md:text-base px-6 md:px-6 rounded-none sm:rounded-[40px] pb-8 sm:pb-2 nav-bar flex backdrop-blur-[200px] flex-row items-center justify-between py-2 max-w-full md:max-w-[500px] w-full">

            <Link href="/home" passHref>
                <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                    <Image
                        src={activePage === '/home' ? '/icons/home-icon-filled.svg' : '/icons/home-icon.svg'}
                        alt='Home'
                        width={30}
                        height={30}
                    />
                </button>
            </Link>

            <Link href="/relatedmedia" passHref>
                <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                    <Image
                        src={activePage === '/relatedmedia' ? '/icons/globe-icon-filled.svg' : '/icons/globe-icon.svg'}
                        alt='Search'
                        width={30}
                        height={30}
                    />
                </button>
            </Link>

            <Link href="/search" passHref>
                <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                    <Image
                        src={activePage === '/search' ? '/icons/search-icon-filled.svg' : '/icons/search-icon.svg'}
                        alt='Search'
                        width={30}
                        height={30}
                    />
                </button>
            </Link>

            <Link href="/vote" passHref>
                <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                    <Image
                        src={activePage === '/vote' ? '/icons/vote-icon-filled.svg' : '/icons/vote-icon.svg'}
                        alt='Vote'
                        width={30}
                        height={30}
                    />
                </button>
            </Link>
        </div>
    );
};
