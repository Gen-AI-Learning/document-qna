import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import UploadPage from './pages/UploadPage'
import FileDetailPage from './pages/FileDetailPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <div className='container mx-auto h-screen px-6'>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/upload' element={<UploadPage />} />
        <Route path='/details/:fileid' element={<FileDetailPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
