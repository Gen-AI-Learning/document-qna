import axios from 'axios'
import ChatInput from './ChatInput'
import ChatList from './ChatList'
import { useState, useEffect } from 'react'
const ChatPanel = ({ docId = null }) => {
  // Initialize state with the activeConversation object
  const [activeConversation, setActiveConversation] = useState({
    id: null,
    messages: [],
    // messages: [
    //   { role: 'user', content: 'Hello! How are you?' },
    //   {
    //     role: 'assistant',
    //     content: 'I am doing great, thank you! How can I assist you today?',
    //   },
    //   { role: 'user', content: 'Can you tell me about the weather?' },
    //   { role: 'pending', content: '' }, // Example of a pending message
    //   {
    //     role: 'assistant',
    //     content:
    //       'Sure! The weather today is sunny with a chance of rain in the evening.',
    //   },
  })

  useEffect(() => {
    console.log(`Document id: ${docId}`)
    createNewConversation(docId)
  }, [docId])

  async function createNewConversation(id) {
    try {
      console.log('document ID' + id)
      const API_URI = `http://localhost:8000/api/chat`

      const response = id
        ? await axios.post(`${API_URI}?doc_id=${id}`)
        : await axios.post(`${API_URI}`)
      console.log(response?.data)
      setActiveConversation({
        id: response?.data?.id || null,
        messages: [],
      })
    } catch (err) {
      console.error('Error creating new conversation:', err)
    }
  }

  function onSubmit(value) {
    console.log(value)
    // Need to implement actual logic here
    setActiveConversation((previousState) => ({
      ...previousState,
      messages: [...previousState.messages, { role: 'user', content: value }],
    }))

    sendMessage(value)
  }

  async function sendMessage(value) {
    try {
      const API_URI = `http://localhost:8000/api/chat/message`
      const requestBody = {
        conversation_id: activeConversation.id,
        question: value,
        doc_id: docId,
      }

      console.log(requestBody)

      // Add a 'pending' message to the conversation
      setActiveConversation((previousState) => ({
        ...previousState,
        messages: [...previousState.messages, { role: 'pending', content: '' }],
      }))

      const response = await axios.post(API_URI, requestBody)

      // { role: 'assistant', content: response.data.airesponse }
      // Replace the 'pending' message with the assistant's response
      setActiveConversation((previousState) => ({
        ...previousState,
        messages: [
          ...previousState.messages.slice(0, -1),
          { role: 'assistant', content: response?.data?.answer },
        ],
      }))
    } catch (err) {
      console.error('Error sending message:', error)
      setActiveConversation((previousState) => ({
        ...previousState,
        messages: [
          ...previousState.messages.slice(0, -1),
          {
            role: 'assistant',
            content: 'Failed to send message. Please try again.',
          },
        ],
      }))
    }
  }
  return (
    <div
      style={{ height: 'calc(100vh - 80px)' }}
      className='flex flex-col h-full bg-slate-50 border rounded-xl shadow'
    >
      <div className='rounded-lg border-b px-3 py-2 flex flex-row items-center justify-between'>
        <div className='opacity-40'>
          <input id='chat-type' type='checkbox' />
          <label htmlFor='chat-type' className='italic'>
            Streaming
          </label>
        </div>

        <div className='flex gap-2'>
          {/* <ConversationSelect conversations={$store.conversations} /> */}
          <button
            className='rounded text-sm border border-blue-500 px-2 py-1  bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800'
            onClick={() => createNewConversation(docId)}
          >
            New Chat
          </button>
        </div>
      </div>

      <div className='flex flex-col flex-1 px-3 py-2 overflow-y-scroll'>
        <ChatList messages={activeConversation?.messages || []} />
        <div className='relative'>
          <ChatInput onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
