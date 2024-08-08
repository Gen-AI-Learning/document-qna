import React, { useEffect, useRef } from 'react'
import UserMessage from './UserMessage' // Adjust the import path
import AssistantMessage from './AssistantMessage' // Adjust the import path
import PendingMessage from './PendingMessage' // Adjust the import path

const ChatList = ({ messages }) => {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='overflow-y-auto flex flex-col flex-1'>
      <div className='flex flex-col flex-1 gap-3 px-1.5 py-1'>
        {messages.map((message, index) => {
          switch (message.role) {
            case 'user':
            case 'human':
              return <UserMessage key={index} content={message.content} />
            case 'assistant':
            case 'ai':
              return <AssistantMessage key={index} content={message.content} />
            case 'pending':
              return <PendingMessage key={index} />
            default:
              return null
          }
        })}
      </div>
      <div className='pt-4' ref={endRef} />
    </div>
  )
}

export default ChatList
