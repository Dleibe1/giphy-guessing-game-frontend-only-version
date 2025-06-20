import React, { useState, useEffect } from 'react'
import { fetchGiphy } from '../../apiClient/fetchGiphy/fetchGiphy'
import './ImageList.css'

interface WordItem {
  wordText: string
  giphyURL: string
}

const ImageList = () => {
  const [currentWord, setCurrentWord] = useState('')
  const [words, setWords] = useState<WordItem[]>([])

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentWord(event.currentTarget.value)
  }

  const onKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.key === ' ') {
      const wordText = currentWord.trim()
      const giphyResponse = await fetchGiphy(wordText)
      console.log(giphyResponse)
      const giphyURL = giphyResponse.data[0].images.fixed_height.url
      setWords([...words, { wordText, giphyURL }])
      setCurrentWord('')
    }
  }

  const imageList = words.map((word, i) => {
    if (word.giphyURL.length) {
      return (
        <img key={`${i}${word.wordText}${word.giphyURL}`} src={word.giphyURL} />
      )
    }
  })

  return (
    <>
      <div className="image-list">{imageList}</div>
      <div className="word-input">
        <input
          type="text"
          value={currentWord}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </>
  )
}

export default ImageList
