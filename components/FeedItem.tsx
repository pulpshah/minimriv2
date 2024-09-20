import React from 'react'
import Image from 'next/image'

const FeedItem = () => {
  return (
    <div className="graph box w-full h-fit gap-[24px]">
    <div className="box gap-[10px] flex-col p-[25px] !justify-start white-opaque rounded-[40px] min-h-fit h-[288px]">
      <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">

        <div className="feed-text w-fit h-fit flex flex-row items-center justify-start gap-[10px]">
          graph title
        </div>

        <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
          <div className="turn flex w-fit black-opaque !shadow-none h-fit px-[5px] py-[1px] items-center rounded-full box text-white">
              turn 1
          </div>
          <button>
            <Image className='cursor-pointer' src='icons/feed-play.svg' alt='Fetch' height={42} width={42}/>
          </button>
        </div>

      </div>

      <div className="w-full h-full box">hi</div>
</div>
</div>
  )
}

export default FeedItem