import React, { useState } from 'react'
import { getWordData } from '../../apiClient/FreeDictionaryAPI/getWordData'
import { shouldDisplayWordText } from '../../apiClient/FreeDictionaryAPI/shouldDisplayWordText'
import {
  getAnimatedText,
  getGiphyImage,
} from '../../apiClient/GIPHY/getGiphyImageURL'
import './ImageList.scss'

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
    if (event.key === ' ' || event.key === '.') {
      const wordText = currentWord.trim()
      let giphyURL = null
      const wordData = await getWordData(wordText)
      const displayWordText: boolean = shouldDisplayWordText(wordData)
      if (displayWordText) {
        giphyURL = await getAnimatedText(wordText)
      } else {
        giphyURL = await getGiphyImage(wordText)
      }
      setWords([...words, { wordText, giphyURL }])
      setCurrentWord('')
    }
  }

  const handleImageClick = async (index: number) => {
    const wordItems = [...words]
    const clickedImageText = wordItems[index].wordText
    const animatedTextURL = await getAnimatedText(clickedImageText)
    wordItems[index] = {...wordItems[index], giphyURL: animatedTextURL}
    setWords(wordItems)
  }

  const imageList = words.map((word, i) => {
    if (word.giphyURL !== null) {
      return (
        <img
          className="gif-image slide-left"
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
      <div className="word-input">
        <input
          type="text"
          value={currentWord}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="image-list">{imageList}</div>
    </>
  )
}

export default ImageList
