import React from 'react';
import Image from 'next/image';

const FeedItem: React.FC<{ 
  turn_number: number, 
  title: string, // Can be "question", "answer", or "rebuttal"
  topic: string, 
  speaker: string 
}> = ({ turn_number, title, topic, speaker }) => {

  const getSpeakerImage = (speaker: string) => {
    switch (speaker) {
      case 'Donald Trump':
        return '/candidates/trump.webp';
      case 'Kamala Harris':
        return '/candidates/harris.webp';
      case 'David Muir':
        return '/candidates/muir.webp';
      case 'Linsey Davis':
        return '/candidates/davis.webp';
      default:
        return '/candidates/default.webp';
    }
  };

  const isQuestion = title.toLowerCase() === 'question';
  const isRebuttal = title.toLowerCase() === 'rebuttal';

  return (
    <div className={`graph box w-full h-fit gap-[25px] ${isQuestion ? 'bg-question-color' : isRebuttal ? 'bg-rebuttal-color' : 'bg-answer-color'}`}>
      <div className={`box gap-[25px] flex-col p-[20px] !justify-start white-opaque rounded-[40px] min-h-fit h-full ${isQuestion ? 'black-opaque' : 'white-opaque'}`}>
        <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">

          <div className={`feed-text w-fit !text-lg md:!text-xl h-fit flex flex-row items-center justify-start gap-[10px] ${isQuestion ? 'text-white' : 'text-black'}`}>
            <span>{title}</span>
          </div>

          <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
            <div className={`turn flex w-fit !shadow-none text-lg md:text-xl h-fit px-[5px] py-[1px] items-center rounded-full box ${isQuestion ? 'white-opaque' : 'black-opaque'}`}>
              Turn {turn_number}
            </div>

            <button>
              <Image className={`cursor-pointer ${isQuestion ? 'invert' : ''}`} src='/icons/feed-play.svg' alt='Fetch' height={44} width={47} />
            </button>
          </div>

        </div>

        <div className="w-full h-full box">
          <div className="topic-text auth-text !text-black flex flex-col md:flex-row gap-[8px]">
              <div className={`w-full mx-auto ${isQuestion ? 'text-white' : ''}`}>

                {isQuestion 
                  ? "Let's talk about" 
                  : isRebuttal 
                  ? "My rebuttal On" 
                  : "My thoughts on"}

                <div className="text-white topic-outline">
                  {isQuestion || isRebuttal ? `${topic}.` : `${topic},`}
                </div>
              </div>
          </div>
        </div>

        <div className="candidate">
          <div className="rounded-[40px] overflow-hidden w-fit border-[5px] black-opaque border-black h-fit">
            <Image 
              src={getSpeakerImage(speaker)} 
              alt="Speaker Image" 
              width={220} 
              height={41} 
              className="block mx-auto"
            />
          </div>
          <div className="text-center text-base md:text-lg poppins pt-1.5">
            {speaker}
          </div>
        </div>

        {isQuestion 
                  ? <div className="question">

                  </div>
                  : <div className="analysis grid grid-cols-1 w-full h-fit">
                      <div className="appeal-score box flex-col lg:!justify-between lg:flex-row gap-[25px]">
                        <div className="appeal w-full h-full">
                          <div className="flex gap-2 text-7xl md:text-8xl items- justify-center lg:text-9xl w-full h-fit lg:justify-start outline-text items-center">
                              <div className="flex md:gap-3 lg:gap-4">
                                appeal
                              </div>
                            </div>
                        </div>
                            <div className="w-fit text-center lg:text-left poppins text-lg">
                              The appeal score evaluates a speaker's effectiveness in using ethos (credibility), pathos (emotional impact), and logos (logical reasoning). Each aspect is scored based on trustworthiness, emotional engagement, and logical soundness.
                            </div>
                      </div>
                      <div className="analysis-content w-full h-fit">
                          s
                      </div>
                  </div> }
      </div>
    </div>
  )
}

export default FeedItem;
