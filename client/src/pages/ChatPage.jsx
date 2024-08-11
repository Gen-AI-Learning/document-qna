import ChatPanel from '../components/ChatPanel'

const ChatPage = () => {
  return (
    <div className='flex flex-col items-center h-screen bg-gray-100 p-4 md:p-6'>
      <div className='w-full max-w-3xl'>
        <ChatPanel />
      </div>
    </div>
  )
}

export default ChatPage
