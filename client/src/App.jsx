import AppDetailPage from './pages/AppDetailPage'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import UploadPage from './pages/UploadPage'
import FileDetailPage from './pages/FileDetailPage'
import ChatPage from './pages/ChatPage'
import AddApp from './components/AddApp'

function App() {
  return (
    <div className='container mx-auto h-screen px-6'>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/add' element={<AddApp />} />
        <Route path='/chat/:appid' element={<ChatPage />} />
        <Route path='/upload/:appid' element={<UploadPage />} />
        <Route path='/app/:appid' element={<AppDetailPage />} />
        <Route path='/details/:appid/:fileid' element={<FileDetailPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
