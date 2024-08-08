import ChatPanel from '../components/ChatPanel'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import PDFViewer from '../components/PDFViewer'

const BASE_URL = 'http://localhost:8000'

const FileDetailPage = () => {
  const { id } = useParams()
  const [fileUrl, setFileUrl] = useState('')

  useEffect(() => {
    const fetchFileUrl = async () => {
      const API_URI = `${BASE_URL}/api/files/${id}`
      console.log('Fetching file URL from:', API_URI)
      try {
        const response = await axios.get(API_URI)

        console.log('API Response:', response.data)

        if (response.data && response.data.url) {
          setFileUrl(`${BASE_URL}${response.data.url}`)
          console.log('fileUrl set to:', `${BASE_URL}${response.data.url}`)
        } else {
          console.error('Invalid API response:', response.data)
        }
      } catch (err) {
        console.error('Error fetching file URL:', err)
      }
    }

    fetchFileUrl()
  }, [id])

  return (
    <div
      className='grid grid-cols-3 gap-2 px-4'
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <div className='col-span-1'>
        <ChatPanel docId={id} />
      </div>
      <div className='col-span-2'>
        {fileUrl ? <PDFViewer documentUrl={fileUrl} /> : <p>Loading...</p>}
      </div>
    </div>
  )
}

export default FileDetailPage
