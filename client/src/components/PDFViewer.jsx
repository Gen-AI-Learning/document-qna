import React, { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js'

const PDFViewer = ({ documentUrl }) => {
  const canvasContainerRef = useRef(null)
  const [destroyed, setDestroyed] = useState(false)

  const renderPage = async (page) => {
    const viewport = page.getViewport({ scale: 1.2 })

    const wrapper = document.createElement('div')
    wrapper.style.marginBottom = '16px'
    wrapper.style.position = 'relative'
    wrapper.id = `page-${page._pageIndex + 1}`
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    canvas.height = viewport.height
    canvas.width = viewport.width
    wrapper.appendChild(canvas)
    canvasContainerRef.current.appendChild(wrapper)

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    })

    const textLayer = document.createElement('div')
    textLayer.className = 'textLayer'
    const textContent = await page.getTextContent()
    pdfjs.renderTextLayer({
      textContentSource: textContent,
      viewport: page.getViewport(),
      container: textLayer,
    })

    wrapper.appendChild(textLayer)
  }

  useEffect(() => {
    const loadPdf = async () => {
      const pdfDoc = await pdfjs.getDocument(documentUrl).promise

      if (destroyed) {
        return
      }

      for (let num = 1; num <= pdfDoc.numPages; num++) {
        pdfDoc.getPage(num).then(renderPage)
      }
    }

    loadPdf()

    return () => {
      setDestroyed(true)
    }
  }, [documentUrl])

  return (
    <div className='pdf-container'>
      <div
        ref={canvasContainerRef}
        className='pdf-wrapper'
        style={{ '--scale-factor': 1.2 }}
      />
    </div>
  )
}

export default PDFViewer
