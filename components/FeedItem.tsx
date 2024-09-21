import React from 'react'
import Image from 'next/image'

import JFile from "@/public/data/dummydata.json";
import { title } from 'process';

const FeedItem: React.FC<{ turn_number: number, title: string, topic: string, }> = ({ turn_number, title }) => {
  return (
    <div className="graph box w-full h-fit gap-[25px]">
      <div className="box gap-[25px] flex-col p-[20px] !justify-start white-opaque rounded-[40px] min-h-fit h-full">
        <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">

          <div className="feed-text w-fit h-fit flex flex-row items-center justify-start gap-[10px]">
            <span>{title}</span> {/* Render topic */}
          </div>

          <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
            <div className="turn flex w-fit black-opaque !shadow-none h-fit px-[5px] py-[1px] items-center rounded-full box text-white">
              Turn {turn_number}
            </div>
            <button>
              <Image className='cursor-pointer' src='/icons/feed-play.svg' alt='Fetch' height={42} width={42} />
            </button>
          </div>

        </div>

        <div className="w-full h-full box">
          <div className="topic-text auth-text !text-black flex flex-col md:flex-row gap-[8px]">
              <div className="w-3/4 mx-auto">
                this turn is about {turn_number}.
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedItem;
