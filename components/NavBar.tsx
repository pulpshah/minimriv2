import Image from "next/image"

export const NavBar = () => {
    return (
        <div className="poppins text-white text-[10px] w-full px-[30px] rounded-[20px] bg-[#070707]/80 flex flex-row items-center justify-between py-[1px]">
            <div className="items-center justify-center w-auto h-auto flex-col">
                <Image src='/icons/tv-icon-white.svg' alt='Related Media' width={19} height={17} />
                <p>media</p>
            </div>
            <div className="items-center justify-center w-auto h-auto flex-col">
                <Image src='/icons/search-icon.svg' alt='search' width={19} height={17} />
                search
            </div>
            <div className="items-center justify-center w-auto h-auto flex-col">
                <Image src='/icons/vote-icon.svg' alt='search' width={19} height={17} />
                vote
            </div>
        </div>
    )
}