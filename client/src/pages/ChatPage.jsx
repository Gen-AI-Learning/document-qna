import ChatPanel from '../components/ChatPanel'
import { useParams } from 'react-router-dom'

const ChatPage = () => {
  const { appid } = useParams()
  return (
    <div className='flex flex-col items-center h-screen bg-gray-100 p-4 md:p-6'>
      <div className='w-full max-w-3xl'>
        <ChatPanel appId={appid} />
      </div>
    </div>
  )
}

export default ChatPage
