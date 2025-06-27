import React, { useState, useEffect } from 'react'
import { fetchGiphy } from '../../apiClient/GIPHY/fetchGiphy'
import { getWordData } from '../../apiClient/FreeDictionaryAPI/getWordData'
import { shouldDisplayWordText } from '../../apiClient/FreeDictionaryAPI/shouldDisplayWordText'
import './ImageList.css'

interface WordItem {
  wordText: string
  giphyURL: string | null
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
      let giphyURL = null
      const wordData = await getWordData(wordText)
      let displayWordText = shouldDisplayWordText(wordData)
      if (!displayWordText) {
        const giphyResponse = await fetchGiphy(wordText)
        if (giphyResponse.data.length) {
          giphyURL = giphyResponse.data[0].images.fixed_height.url
        }
      }
      setWords([...words, { wordText, giphyURL }])
      setCurrentWord('')
    }
  }

  const handleImageClick = (index: number) => {
    const wordItems = [...words]
    wordItems[index] = {
      giphyURL: null,
      wordText: wordItems[index].wordText,
    }
    setWords(wordItems)
  }

  const imageList = words.map((word, i) => {
    if (word.giphyURL !== null) {
      return (
        <img
          key={`${i}${word.wordText}${word.giphyURL}`}
          src={word.giphyURL}
          onClick={() => handleImageClick(i)}
        />
      )
    } else {
      return <p key={`${i}${word.wordText}`}>{word.wordText}</p>
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
