import Image from "next/image"

interface MediaItem {
  id: string
  title: string
  description: string
  imageUrl: string
}

const dummyData: MediaItem[] = [
  {
    id: "1",
    title: "Beautiful Sunset",
    description: "A stunning view of the sun setting over the ocean.",
    imageUrl: "/placeholder.svg?height=200&width=400"
  },
  {
    id: "2",
    title: "City Skyline",
    description: "The impressive skyline of a modern metropolis at night.",
    imageUrl: "/placeholder.svg?height=200&width=400"
  },
  {
    id: "3",
    title: "Mountain Landscape",
    description: "A breathtaking view of snow-capped mountains.",
    imageUrl: "/placeholder.svg?height=200&width=400"
  },
  {
    id: "4",
    title: "Tropical Beach",
    description: "Crystal clear waters and white sand on a tropical paradise.",
    imageUrl: "/placeholder.svg?height=200&width=400"
  },
  {
    id: "5",
    title: "Ancient Ruins",
    description: "Mysterious and historic ruins of an ancient civilization.",
    imageUrl: "/placeholder.svg?height=200&width=400"
  },
  {
    id: "6",
    title: "Northern Lights",
    description: "The mesmerizing aurora borealis lighting up the night sky.",
    imageUrl: "/placeholder.svg?height=200&width=400"
  }
]

export default function Component() {
  return (
    <div className="feed w-full h-fit z-40 items-center justify-center flex">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-fit gap-[24px]">
        {dummyData.map((item) => (
          <div key={item.id} className="white-opaque rounded-[40px] p-[25px] overflow-hidden shadow-md">
            <div className="relative bg-gray-500 rounded-[40px] h-64">

              <Image
                className="rounded-[40px]"
                src={item.imageUrl}

                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm poppins text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}