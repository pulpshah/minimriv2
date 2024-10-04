"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface CustomScrollbarProps {
  children: React.ReactNode
  turns: number[]
}

export default function CustomScrollbar({ children, turns }: CustomScrollbarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const controls = useAnimation()
  const thumbHeight = 40; // Adjust as needed for the size of the scrollbar thumb

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const newScrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollPercentage(newScrollPercentage);
      }
    };

    scrollContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollbarDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: { point: { y: number } }) => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollableHeight = scrollHeight - clientHeight;

      // Calculate new scrollTop based on the drag position of the thumb
      const newScrollTop = (info.point.y / clientHeight) * scrollableHeight;

      // Set the scrollTop to the calculated value
      scrollContainerRef.current.scrollTop = newScrollTop;
    }
  };

  const scrollToTurn = (turnIndex: number) => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current
      const scrollableHeight = scrollHeight - clientHeight
      const newScrollTop = (turnIndex / (turns.length - 1)) * scrollableHeight
      controls.start({ y: newScrollTop })
      scrollContainerRef.current.scrollTo({ top: newScrollTop, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-scroll pr-4 scrollbar-hide"
        style={{ paddingRight: '20px', marginRight: '-20px' }}
      >
        {children}
      </div>
      <div className="absolute top-0 right-0 h-full w-12 bg-gray-200 rounded-r-lg z-50">
        <div className="relative h-full">
        <div className="absolute top-0 right-0 h-full w-4 bg-gray-200 rounded-r-lg z-50">
        <motion.div
          className="w-full bg-blue-500 rounded cursor-pointer"
          style={{ height: `${thumbHeight}px`, top: `${scrollPercentage}%`, transform: 'translateY(-50%)' }}
          animate={controls}
          drag="y"
          dragConstraints={{ top: 0, bottom: scrollContainerRef.current ? scrollContainerRef.current.clientHeight - thumbHeight : 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleScrollbarDrag}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
          {turns.map((turn, index) => (
            <div
              key={turn}
              className="absolute w-full flex items-center justify-start cursor-pointer"
              style={{ top: `${(index / (turns.length - 1)) * 100}%` }}
              onClick={() => scrollToTurn(index)}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
              {turn % 2 === 0 && (
                <span className="text-xs font-semibold text-blue-500">Q{turn / 2}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}