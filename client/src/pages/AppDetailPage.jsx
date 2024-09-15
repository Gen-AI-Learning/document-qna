import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const AppDetailPage = () => {
  const [files, setFiles] = useState([])
  const { appid } = useParams()
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const API_URI = `http://localhost:8000/api/files/${appid}`
        const response = await axios.get(API_URI)
        setFiles(response.data)
      } catch (err) {
        console.error('Error fetching files:', error)
      }
    }

    fetchFiles()
  }, [])
  return (
    <>
      <div className='flex flex-row justify-between items-center my-4'>
        <h2 className='text-3xl font-bold m-2'>Your Documents</h2>

        <div className='flex gap-5 items-center'>
          <Link
            to={files.length > 0 ? `/chat/${appid}` : '#'}
            className={`py-2 px-4 inline-flex justify-center items-center rounded-md border border-transparent font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800 ${
              files.length > 0
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={(e) => files.length === 0 && e.preventDefault()} // Prevent navigation when disabled
          >
            Chat
          </Link>

          <Link
            to={`/upload/${appid}`}
            className='py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800'
          >
            New
          </Link>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='-m-1.5 overflow-x-auto'>
          <div className='p-1.5 min-w-full inline-block align-middle'>
            <div className='border rounded-lg overflow-hidden'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'
                    >
                      ID
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {files.map((file) => (
                    <tr
                      className='hover:bg-gray-100 dark:hover:bg-gray-700'
                      id={file.fileid}
                      key={file.fileid}
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>
                        {file.filename}
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                        {file.fileid}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <Link
                          className='text-blue-500 hover:text-blue-700'
                          to={`/details/${appid}/${file.fileid}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppDetailPage
