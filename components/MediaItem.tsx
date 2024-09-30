import Image from "next/image";
import Link from "next/link";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface MediaItemProps {
  items: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  }[];
}

const dummyData: MediaItem[] = [
  {
    id: "1",
    title: "reference 1",
    description: "A stunning view of the sun setting over the ocean.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "reference 2",
    description: "The impressive skyline of a modern metropolis at night.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "reference 3",
    description: "A breathtaking view of snow-capped mountains.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    title: "reference 4",
    description: "Crystal clear waters and white sand on a tropical paradise.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "5",
    title: "reference 5",
    description: "Mysterious and historic ruins of an ancient civilization.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "6",
    title: "reference 6",
    description: "The mesmerizing aurora borealis lighting up the night sky.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
];

export default function MediaItem({ items }: MediaItemProps) {
  return (
    <div className="feed w-full h-fit z-40 items-center justify-center flex">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-fit gap-[24px]">
        {items.map((item) => (
          <div
            key={item.id}
            className="white-opaque rounded-[40px] p-[25px] overflow-hidden shadow-md"
          >
            <div className="flex justify-between mb-[15px]">
              <h3 className="text-lg md:text-xl">{item.title}</h3>
              <Link href="/relatedmedia" passHref>
                <button className="flex invert items-center justify-center w-auto h-auto flex-col gap-1">
                  <Image
                    src={"/icons/globe-icon.svg"}
                    alt="Search"
                    width={32}
                    height={30}
                  />
                </button>
              </Link>
            </div>

            {/* 16:9 Aspect Ratio Wrapper */}
            <div className="relative w-full pb-[56.25%] black-opaque rounded-[40px] overflow-hidden">
              <Image
                className="absolute top-0 left-0 w-full h-full object-cover rounded-[40px]"
                src={item.imageUrl}
                layout="fill"
                objectFit="cover"
                alt={item.title}
              />
            </div>

            <div className="pt-5">
              <p className="text-sm poppins text-gray-600">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
