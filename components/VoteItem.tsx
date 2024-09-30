import Image from "next/image"
import Link from "next/link"

interface MediaItem {
  id: string
  name: string
  description: string
  imageUrl: string
  turn: number
}

const dummyData: MediaItem[] = [
  {
    id: "1",
    turn: 1,
    name: "Kamala Harris",
    description: "A stunning view of the sun setting over the ocean.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    turn: 2,
    name: "Kamala Harris",
    description: "The impressive skyline of a modern metropolis at night.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    turn: 3,
    name: "Redditor",
    description: "A breathtaking view of snow-capped mountains.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    turn: 4,
    name: "Donald Trump",
    description: "Crystal clear waters and white sand on a tropical paradise.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "5",
    turn: 5,
    name: "Donald Trump",
    description: "Mysterious and historic ruins of an ancient civilization.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "6",
    turn: 6,
    name: "Redditor",
    description: "The mesmerizing aurora borealis lighting up the night sky.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  }
]

export default function Component() {
  return (
    <div className="feed w-full h-fit z-40 items-center justify-center flex">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-fit gap-[24px]">
        {dummyData.map((item) => (
          <div key={item.id} className="white-opaque rounded-[40px] p-[25px] overflow-hidden shadow-md">
            <div className="flex justify-between mb-[15px]">
              <h3 className="text-lg md:text-xl">{item.name}</h3>
              <div className="flex gap-2 items-center">
                <div
                  className={`turn flex w-fit !shadow-none text-base md:text-lg h-fit px-[8px] py-[1px] black-opaque items-center rounded-full`}
                >
                  Turn {item.turn}
                </div>
                <Link href="/relatedmedia" passHref>
                  <button className="flex items-center justify-center w-auto h-auto flex-col gap-1">
                    <Image
                      src={item.name === "Redditor" ? '/icons/globe-icon-black.svg' : '/icons/play-icon.svg'}
                      alt={item.name === "Redditor" ? 'Globe Icon' : 'Play Icon'}
                      width={32}
                      height={30}
                    />
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative flex flex-col gap-[25px] justify-between mx-auto w-full h-fit">
              <div className="quote w-full flex justify-center">
                <p className="text-xl md:text-xl">"{item.description}"</p>
              </div>
              
              {/* Flex container to hold the icons and abstain text */}
              <div className="flex items-center justify-center gap-4">
                <Image
                  src={'/icons/invalid-icon.svg'}
                  alt="Invalid"
                  width={42}
                  height={30}
                />
                <div className="text-xl md:text-2xl poppins">abstain</div>
                <Image
                  src={'/icons/valid-icon.svg'}
                  alt="Valid"
                  width={42}
                  height={30}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
