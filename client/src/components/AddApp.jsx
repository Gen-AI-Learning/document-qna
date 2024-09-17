import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddApp = () => {
  // State for form fields
  const [appName, setAppName] = useState('')
  const [appDomain, setAppDomain] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate() // Hook to navigate to other routes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset messages
    setError('')
    setSuccessMessage('')

    if (!appName || !appDomain) {
      setError('Both fields are required')
      return
    }

    const payload = { appName, appDomain }

    try {
      const response = await fetch('http://localhost:8000/api/apps/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSuccessMessage('Application added successfully')
        setAppName('') // Clear input fields
        setAppDomain('')

        // Redirect to home page after successful form submission
        setTimeout(() => {
          navigate('/') // Redirect to home page
        }, 1000) // Adding a slight delay for the success message to be visible
      } else {
        setError('Failed to add application')
      }
    } catch (error) {
      setError('An error occurred: ' + error.message)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white shadow-md rounded-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Add Application</h1>

        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {successMessage && (
          <p className='text-green-500 mb-4'>{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='appName'
              className='block text-sm font-medium text-gray-700'
            >
              App Name
            </label>
            <input
              type='text'
              id='appName'
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='Enter app name'
            />
          </div>

          <div className='mb-4'>
            <label
              htmlFor='appDomain'
              className='block text-sm font-medium text-gray-700'
            >
              App Domain
            </label>
            <input
              type='text'
              id='appDomain'
              value={appDomain}
              onChange={(e) => setAppDomain(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='Enter app domain'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddApp
