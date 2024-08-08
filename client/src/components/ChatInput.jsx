import { useEffect, useState } from 'react'

const ChatInput = ({ onSubmit }) => {
  const [value, setValue] = useState('')
  const [height, setHeight] = useState('72px') // Default height

  useEffect(() => {
    // Calculate height based on the number of newlines
    const lines = value.split('\n').length
    setHeight(`${lines * 25 + 72}px`)
  }, [value])

  const handleKeyDown = (event) => {
    const isCombo =
      event.shiftKey || event.ctrlKey || event.altKey || event.metaKey
    if (event.key !== 'Enter' || isCombo) {
      return
    }

    if (event.key === 'Enter' && !isCombo && value.trim() === '') {
      event.preventDefault()
      return
    }
    event.preventDefault()
    onSubmit(value) // Call the submit handler passed as a prop
    setValue('') // Clear the input
  }

  return (
    <textarea
      className='w-full mx-auto py-1.5 px-2.5 resize-none border-2 border-gray-300 rounded max-h-40'
      style={{ height }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}

export default ChatInput
