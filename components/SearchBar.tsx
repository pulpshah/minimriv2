import React, { useRef, useEffect } from "react";
import Image from "next/image";

const SearchBar: React.FC<SearchBarProps> = ({
  searchInput,
  onSearchInputChange,
  isSearchMode,
  handleSearchClick,
  handleClearSearch,
  setInboxOpen,
  setFetchOpen,
  isInboxOpen,
  isFetchOpen,
  isSearchBarExpanded,
  onSearchBarClick,
  setSearchBarExpanded,
}) => {
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const clearButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        clearButtonRef.current &&
        !clearButtonRef.current.contains(event.target as Node)
      ) {
        setSearchBarExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSearchBarExpanded]);

  return (
    <div
      className={`search z-[101] gap-2 w-full h-fit box flex flex-row items-center ${
        isSearchMode ? "justify-center" : "!justify-between"
      }`}
      ref={searchBarRef}
    >
      <div
        className={`flex items-center w-full justify-center ${
          isSearchMode ? "" : "mx-0"
        }`}
      >
        <div
          className={`search-bar relative backdrop-blur-[50px] mt-3.5 transition-all z-[101] flex-shrink-0 justify-between w-[65vw] max-h-[50px] flex flex-row gap-[10px] px-[8px] overflow-hidden text-white rounded-full ${
            isSearchBarExpanded
              ? "w-full max-w-[600px] h-[45px]"
              : "h-[35px] w-[65vw] max-w-[450px]"
          }`}
        >
          <div
            onClick={handleSearchClick}
            className="flex items-center gap-[10px] justify-between w-full"
          >
            <button className="w-[19px] h-[19px] md:w[50px] flex-shrink-0">
              <Image
                className="cursor-pointer"
                src="icons/search-icon.svg"
                alt="search"
                height={19}
                width={19}
              />
            </button>

            <input
              placeholder="search"
              type="text"
              className="placeholder-white transition-all poppins bg-transparent outline-none justify-between w-full text-white bg-none"
              value={searchInput}
              onChange={(e) => {
                onSearchInputChange(e);
                setSearchBarExpanded(true);
              }}
              onClick={onSearchBarClick}
              onBlur={() => setSearchBarExpanded(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchClick();
                  setSearchBarExpanded(false);
                }
              }}
            />

            {searchInput && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents input blur from happening
                  handleClearSearch(); // Clears the search input but keeps the bar expanded
                }}
                className="absolute right-[10px] text-lg text-white cursor-pointer"
              >
                clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
