import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'

const HomePage = () => {
  const appList = [
    { id: '101', name: 'CPE LR' },
    { id: '102', name: 'Polaris' },
    { id: '103', name: 'Learning Request' },
  ]

  const [apps, setApps] = useState([])

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const API_URI = `http://localhost:8000/api/apps/`
        const response = await axios.get(API_URI)
        setApps(response.data)
      } catch (err) {
        console.error('Error fetching files:', err)
      }
    }

    fetchFiles()
  }, [])

  return (
    <>
      <div className='flex flex-row justify-between items-center my-4'>
        <h2 className='text-3xl font-bold m-2'>Your Apps</h2>

        <div className='flex gap-5 items-center'>
          <Link
            to='/add'
            className='py-2 px-4 inline-flex justify-center items-center rounded-md border border-transparent font-semibold bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800'
          >
            Add
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
                      App Name
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'
                    >
                      App Domain
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
                  {apps.map((app) => (
                    <tr
                      className='hover:bg-gray-100 dark:hover:bg-gray-700'
                      id={app.id}
                      key={app.id}
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>
                        {app.appName}
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                        {app.appDomain}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <Link
                          className='text-blue-500 hover:text-blue-700'
                          to={`/app/${app.id}`}
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

export default HomePage
