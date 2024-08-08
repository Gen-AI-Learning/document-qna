import React, { useState } from 'react'
import { marked } from 'marked'
import classnames from 'classnames'
import Icon from './Icon' // Adjust the import path

const AssistantMessage = ({ content }) => {
  const [score, setScore] = useState(0)

  const klass =
    'border rounded-full inline-block cursor-pointer hover:bg-slate-200'
  const upKlass = classnames(klass, { 'bg-slate-200': score === 1 })
  const downKlass = classnames(klass, { 'bg-slate-200': score === -1 })

  // const applyScore = async (newScore) => {
  //   if (score !== 0) return
  //   setScore(newScore)
  //   // Call the scoreConversation function (make sure it's available in your context)
  //   // await scoreConversation(newScore);
  // }

  return (
    <div className='flex flex-row items-center justify-between'>
      <div
        className='message border rounded-md py-1.5 px-2.5 my-0.25 break-words self-start bg-blue-500 text-gray-100'
        style={{ maxWidth: '80%' }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: marked(content, { breaks: true, gfm: true }),
          }}
        />
      </div>
      <div className='flex flex-row flex-1 items-start gap-1 flex-wrap justify-center'>
        {score >= 0 && (
          <div
            className={upKlass}
            style={{ lineHeight: '12px', padding: '6px' }}
          >
            {/* <Icon onClick={() => applyScore(1)} name='thumb_up' outlined /> */}
          </div>
        )}
        {score <= 0 && (
          <div
            className={downKlass}
            style={{ lineHeight: '12px', padding: '6px' }}
          >
            {/* <Icon onClick={() => applyScore(-1)} name='thumb_down' outlined /> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssistantMessage
