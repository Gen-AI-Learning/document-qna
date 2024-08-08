import { useState, useEffect } from 'react'

const ProgressBar = ({ progress = 0, children }) => {
  const [width, setWidth] = useState(1)

  useEffect(() => {
    let animationFrameId
    const startWidth = width
    const duration = 1000
    const start = performance.now()

    const animate = (time) => {
      const elapsedTime = time - start
      const easedProgress = Math.min(elapsedTime / duration, 1)
      setWidth(startWidth + (progress - startWidth) * easedProgress)

      if (elapsedTime < duration) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [progress])

  if (children && width >= 100) {
    return <>{children}</>
  }

  return (
    <div className='flex my-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700'>
      <div
        className='flex flex-col justify-center overflow-hidden bg-blue-800'
        role='progressbar'
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export default ProgressBar
