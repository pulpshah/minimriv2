import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface VoteItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  turn: number;
}

interface VoteItemProps {
  items: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    turn: number;
  }[];
}

const dummyData: VoteItem[] = [
  {
    id: "1",
    turn: 12,
    name: "Transcript",
    description: "The economy is better off now that it was four years ago.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    turn: 31,
    name: "Transcript",
    description: "Women should trust Trump's position on abortion.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    turn: 53,
    name: "Transcript",
    description: "Kamala Harris will handle border security differently than Biden.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    turn: 84,
    name: "Transcript",
    description: "Kamala Harris' changing policy positions is a problem.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "5",
    turn: 93,
    name: "Transcript",
    description: "Trump should regret his actions regarding Jan 6.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "6",
    turn: 102,
    name: "Transcript",
    description: "Trump should acknowledge that he lost in 2020.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "7",
    turn: 113,
    name: "Transcript",
    description: "Harris would be able to breakthrough an Israel-Hamas stalemate.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "8",
    turn: 123,
    name: "Transcript",
    description: "Trump wants Ukraine to win the war against Russia.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "9",
    turn: 136,
    name: "Transcript",
    description: "Harris bears responsibility for the way pulling out of Afghanistan played out.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "10",
    turn: 144,
    name: "Transcript",
    description: "It is inappropriate for a presidential candidate to discuss their oppponents race.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "11",
    turn: 157,
    name: "Transcript",
    description: "Trump has a plan around American healthcare.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "12",
    turn: 174,
    name: "Transcript",
    description: "Harris has a clear plan for climate change.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "12",
    turn: 179,
    name: "Transcript",
    description: "Kamala Harris should be the next President of the United States.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "12",
    turn: 192,
    name: "Transcript",
    description: "Donald Trump should be the next President of the United States.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
];

export default function VoteItem({ items }: VoteItemProps) {
  const [votes, setVotes] = useState<{ [key: string]: string }>({});
  const [swipedCard, setSwipedCard] = useState<{ [key: string]: string }>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSwipe = (itemId: string, direction: string) => {
    if (direction === "left") {
      setVotes((prevVotes) => ({ ...prevVotes, [itemId]: "invalid" }));
      setSwipedCard((prev) => ({ ...prev, [itemId]: "swiped-left" }));
    } else if (direction === "right") {
      setVotes((prevVotes) => ({ ...prevVotes, [itemId]: "valid" }));
      setSwipedCard((prev) => ({ ...prev, [itemId]: "swiped-right" }));
    }
    setTimeout(() => {
      setSwipedCard((prev) => ({ ...prev, [itemId]: "disappear" }));
    }, 300);
  };

  const handleClick = (itemId: string, vote: string) => {
    setVotes((prevVotes) => ({ ...prevVotes, [itemId]: vote }));

    if (!isMobile) {
      setSwipedCard((prev) => ({ ...prev, [itemId]: "fade-out" }));
    } else {
      setSwipedCard((prev) => ({
        ...prev,
        [itemId]:
          vote === "invalid"
            ? "swiped-left"
            : vote === "valid"
            ? "swiped-right"
            : "fade-out",  // For the "abstain" vote, make sure to trigger the fade-out
      }));
    }

    setTimeout(() => {
      setSwipedCard((prev) => ({ ...prev, [itemId]: "disappear" }));
    }, 500);
};


  // Determine if all items have been swiped (disappear state)
  const allSwiped = dummyData.every(
    (item) => swipedCard[item.id] === "disappear"
  );

  return (
    <div className="feed w-full h-fit z-40 items-center justify-center flex">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-fit gap-[24px]">
        {dummyData.map((item) => {
          const swipeHandlers = useSwipeable({
            onSwipedLeft: () => handleSwipe(item.id, "left"),
            onSwipedRight: () => handleSwipe(item.id, "right"),
            trackMouse: true,
          });

          return (
            <div
              key={item.id}
              {...(isMobile ? swipeHandlers : {})}
              className={clsx(
                "white-opaque rounded-[20px] p-[25px] overflow-hidden shadow-md transition-all duration-300",
                swipedCard[item.id] === "swiped-left" && "translate-x-[-100%]",
                swipedCard[item.id] === "swiped-right" && "translate-x-[100%]",
                swipedCard[item.id] === "fade-out" && "opacity-0",
                swipedCard[item.id] === "disappear" && "hidden"
              )}
            >
              <div className="flex justify-between mb-[15px]">
                <h3 className="text-lg md:text-xl">{item.name}</h3>
                <div className="flex gap-2 items-center">
                  <div className="turn flex w-fit !shadow-none text-base md:text-lg h-fit px-[8px] py-[1px] black-opaque items-center rounded-full">
                    Turn {item.turn}
                  </div>
                  <Link href="/relatedmedia" passHref>
                    <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                      <Image
                        src={
                          item.name === "Redditor"
                            ? "/icons/reddit-icon.svg"
                            : "/icons/play-icon.svg"
                        }
                        alt={
                          item.name === "Redditor" ? "Globe Icon" : "Play Icon"
                        }
                        width={32}
                        height={30}
                      />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="relative flex flex-col gap-[25px] justify-between mx-auto w-full">

                <div className="quote w-full flex justify-center">
                  <p className="text-xl md:text-xl ">"{item.description}"</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => handleClick(item.id, "invalid")}>
                    <Image
                      src={"/icons/invalid-icon.svg"}
                      alt="Invalid"
                      width={42}
                      height={30}
                    />
                  </button>
                  <button onClick={() => handleClick(item.id, "abstain")}>
                    <div className="text-xl md:text-2xl poppins">abstain</div>
                  </button>
                  <button onClick={() => handleClick(item.id, "valid")}>
                    <Image
                      src={"/icons/valid-icon.svg"}
                      alt="Valid"
                      width={42}
                      height={30}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {allSwiped && (
          <div className="empty-state w-full h-full flex flex-row items-center justify-center">
            <Image
              src="/icons/zzz-icon.svg"
              alt="ZZZ Icon"
              width={64}
              height={64}
            />
            <h3 className="text-base mt-4 poppins">No new votables</h3>
          </div>
        )}
      </div>
    </div>
  );
}
