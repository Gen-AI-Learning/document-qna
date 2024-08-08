import React from 'react'
import { marked } from 'marked'

const UserMessage = ({ content }) => {
  return (
    <div
      className='message border rounded-md py-1 px-2.5 my-0.25 break-words self-end bg-slate-200'
      style={{ maxWidth: '80%' }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: marked(content, { breaks: true, gfm: true }),
        }}
      />
    </div>
  )
}

export default UserMessage
