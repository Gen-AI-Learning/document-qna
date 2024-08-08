import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import UploadPage from './pages/UploadPage'
import FileDetailPage from './pages/FileDetailPage'

function App() {
  return (
    <div className='container mx-auto h-screen px-6'>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/upload' element={<UploadPage />} />
        <Route path='/details/:id' element={<FileDetailPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
