import React, { useRef, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface CustomScrollbarProps {
  children: React.ReactNode
  turns: number[]
}

export default function CustomScrollbar({ children, turns }: CustomScrollbarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
        const newScrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
        setScrollPercentage(newScrollPercentage)
      }
    }

    scrollContainerRef.current?.addEventListener('scroll', handleScroll)
    return () => scrollContainerRef.current?.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollbarDrag = (event: React.MouseEvent<HTMLDivElement>, info: { offset: { y: number } }) => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current
      const scrollableHeight = scrollHeight - clientHeight
      const newScrollTop = (info.offset.y / clientHeight) * scrollableHeight
      scrollContainerRef.current.scrollTop = newScrollTop
    }
  }

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
      <div className="absolute top-0 right-0 h-full w-2 bg-gray-200 rounded">
        <motion.div
          className="w-full bg-gray-400 rounded cursor-pointer"
          style={{ height: `${100 / turns.length}%` }}
          animate={controls}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleScrollbarDrag}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
        {turns.map((turn, index) => (
          <div
            key={turn}
            className="absolute w-full h-1 bg-blue-500 cursor-pointer"
            style={{ top: `${(index / (turns.length - 1)) * 100}%` }}
            onClick={() => scrollToTurn(index)}
          />
        ))}
      </div>
    </div>
  )
}