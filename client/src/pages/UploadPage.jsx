import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import ProgressBar from '../components/Progress'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const UploadPage = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { appid } = useParams()

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        setUploading(true)
        const API_URI = `http://localhost:8000/api/upload/${appid}`
        const response = await axios.post(API_URI, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 90) / progressEvent.total
            )
            setUploadProgress(percentCompleted)
          },
        })

        // Set progress to 100% after successful response
        setUploadProgress(100)
        console.log('File uploaded successfully:', response.data)
        // Add a small delay before navigating
        setTimeout(() => {
          setUploading(false)
          navigate(-1)
        }, 500)
      } catch (error) {
        console.error('Error uploading file:', error)
        setUploading(false)
      }
    }
  }
  const handleFileChange = (event) => {
    console.log(event.target.files)
    console.log(event.target.files[0])
    setFile(event.target.files[0])
  }

  return (
    <div className='w-full max-w-md mx-auto p-6'>
      <h2 className='text-3xl font-bold m-10'>Upload a Document</h2>
      <form onSubmit={handleSubmit}>
        <div className='w-42'>
          <label htmlFor='file-input' className='sr-only'>
            Choose file
          </label>
          <input
            type='file'
            name='file-input'
            id='file-input'
            onChange={handleFileChange}
            className='block w-full border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
        file:mr-4 file:py-2 file:px-4 file:m-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-violet-700
        hover:file:bg-violet-100'
          />
        </div>

        <div className='my-4' />
        <Button className='w-full my-3' disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </Button>
      </form>

      {uploading && (
        <div className='mt-4'>
          <ProgressBar progress={uploadProgress} />
          <p className='text-center mt-2'>{uploadProgress}% Uploaded</p>
        </div>
      )}
    </div>
  )
}

export default UploadPage
