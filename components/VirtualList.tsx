'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface VirtualListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
  overscan?: number
  onEndReached?: () => void
  endReachedThreshold?: number
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 0.8,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { ref: endRef, inView } = useInView({
    threshold: endReachedThreshold,
  })

  useEffect(() => {
    if (inView && onEndReached) {
      onEndReached()
    }
  }, [inView, onEndReached])

  const visibleItemCount = Math.ceil(containerHeight / itemHeight)
  const totalHeight = items.length * itemHeight
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const getItemStyle = (index: number) => ({
    position: 'absolute' as const,
    top: 0,
    transform: `translateY(${(startIndex + index) * itemHeight}px)`,
    width: '100%',
    height: itemHeight,
  })

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div key={startIndex + index} style={getItemStyle(index)}>
            {renderItem(item, startIndex + index)}
          </div>
        ))}
        <div ref={endRef} style={{ height: 1 }} />
      </div>
    </div>
  )
}
