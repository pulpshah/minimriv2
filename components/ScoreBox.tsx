"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ScoreBox() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFixed, setIsFixed] = useState(false); // New state to handle fixed position
  const boxRef = useRef<HTMLDivElement>(null);

  const getSpeakerImage = (speaker: string) => {
    switch (speaker) {
      case "Donald Trump":
        return "/candidates/trump.webp";
      case "Kamala Harris":
        return "/candidates/harris.webp";
      case "David Muir":
        return "/candidates/muir.webp";
      case "Linsey Davis":
        return "/candidates/davis.webp";
      default:
        return "/candidates/default.webp";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (boxRef.current) {
        const box = boxRef.current;
        const boxTop = box.getBoundingClientRect().top; // Distance from top of viewport
        const scrollPosition = window.scrollY;
        const scrollTrigger = box.offsetTop + box.offsetHeight;

        if (scrollPosition > scrollTrigger) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
          const progress = Math.min((scrollPosition - boxTop) / box.offsetHeight, 1);
          setScrollProgress(Math.max(progress, 0)); // Prevent negative values
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply styles based on scrollProgress and whether the component is fixed
  const boxStyle = {
    transform: isFixed
      ? 'translateX(-50%) scale(0.5)'
      : `scale(${1 - scrollProgress * 0.5})`,
    opacity: 1 - scrollProgress * 0.5,
    position: isFixed ? 'fixed' : 'relative',
    top: isFixed ? '70px' : 'auto',
    left: isFixed ? '50%' : 'auto',
    width: isFixed ? '100%' : '100%',
    maxWidth: isFixed ? '500px' : 'none',
    zIndex: 40,
    transition: 'all 0.3s ease-out',
  } as React.CSSProperties;

  // Mini version when attached under the top-pill
  const miniStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color when shrunk under top-pill
    padding: '10px',
    width: '95%',
    maxWidth: '400px', // Adjust this to match the width of the top-pill
    height: 'auto',
    borderRadius: '20px',
    zIndex: 50,
  } as React.CSSProperties;

  return (
    <div
      ref={boxRef}
      className={`box ${isFixed ? 'fixed-style' : ''}`} // Apply different styles when fixed
      style={isFixed ? miniStyle : boxStyle}
    >
      {!isFixed ? (
        <div className="box bg-[url('/bg/total.webp')] bg-cover bg-center gap-[15px] md:gap-[25px] flex-col p-[10px] py-[20px] md:px-[20px] !justify-start rounded-[20px] min-h-fit h-full">
          <div className="box flex-col gap-[24px]">
            <div className="">
              <div className="text-4xl md:text-6xl text-white text-center">
                presidential debate
              </div>
              <div className="text-5xl md:text-7xl text-center text-white">2024</div>
            </div>

            <div className="candidates max-w-[1000px] pb-3 gap-[0px] mt-[40px] md:gap-[20px] !items-center flex flex-col xl:flex-row justify-between w-full">
              <div className="kamala">
                <div className="rounded-[40px] overflow-hidden w-fit md:w-fit mx-auto border-[5px] black-opaque border-black winner h-fit">
                  <Image
                    src={getSpeakerImage("Kamala Harris")}
                    alt="Speaker Image"
                    width={180}
                    height={41}
                    className="block mx-auto w-[132.5px] md:w-[180px]"
                  />
                </div>
                <div className="text-center text-base md:text-lg poppins pt-1.5 text-white">
                  Kamala Harris
                </div>
              </div>

              <div className="flex box !justify-between max-w-[300px] md:max-w-[450px] py-8 xl:py-0">
                <div className="score1 poppins text-4xl md:text-6xl text-white">1000</div>

                <Image
                  src={"icons/vote-icon.svg"}
                  alt="next"
                  height={60}
                  width={90}
                />

                <div className="score2 poppins text-4xl md:text-6xl text-white">1000</div>
              </div>

              <div className="trump">
                <div className="rounded-[40px] overflow-hidden w-fit md:w-fit mx-auto border-[5px] black-opaque border-black">
                  <Image
                    src={getSpeakerImage("Donald Trump")}
                    alt="Speaker Image"
                    width={180}
                    height={41}
                    className="block flex-shrink-0 mx-auto w-[132.5px] md:w-[180px]"
                  />
                </div>
                <div className="text-center text-base md:text-lg poppins pt-1.5 text-white">
                  Donald Trump
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed-scorebox flex items-center justify-between">
          <Image
            src={getSpeakerImage("Kamala Harris")}
            alt="Kamala Harris"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="score1 text-lg font-bold">1000</div>
          <Image
            src={"icons/vote-icon.svg"}
            alt="Vote Icon"
            width={30}
            height={30}
          />
          <div className="score2 text-lg font-bold">1000</div>
          <Image
            src={getSpeakerImage("Donald Trump")}
            alt="Donald Trump"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
}
