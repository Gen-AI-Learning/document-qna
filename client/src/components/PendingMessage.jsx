import React from 'react'

const PendingMessage = () => {
  return (
    <div
      className='message border w-32 h-16 flex justify-center items-center rounded-md py-1 px-2.5 my-0.25 break-all self-start bg-gray-400 text-white'
      style={{ minHeight: '60px' }}
    >
      <div
        className='animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-white-600 rounded-full'
        role='status'
        aria-label='loading'
      />
    </div>
  )
}

export default PendingMessage
