import Image from "next/image"

export const NavBar = () => {
    return (
        <div className="poppins text-white text-[10px] w-full max-w-[500px] px-[30px] rounded-[20px] bg-[#070707]/80 flex flex-row items-center justify-between py-[1px]">
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-[3px]">
                <Image src='/icons/tv-icon-white.svg' alt='Related Media' width={19} height={17} />
                <p>media</p>
            </button>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-[3px]">
                <Image src='/icons/search-icon.svg' alt='search' width={19} height={17} />
                <p>search</p>
            </button>
            <button className="flex items-center justify-center w-auto h-auto flex-col gap-[3px]">
                <Image src='/icons/vote-icon.svg' alt='search' width={19} height={17} />
                <p>vote</p>
            </button>
        </div>
    )
}