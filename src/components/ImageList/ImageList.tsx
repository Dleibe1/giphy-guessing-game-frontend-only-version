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
  isReplacement?: boolean
  width?: number
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
        if (giphyURL === undefined) {
          giphyURL = await getAnimatedText(wordText)
        }
      }
      setWords([...words, { wordText, giphyURL }])
      setCurrentWord('')
    }
  }

  const handleImageClick = async (
    index: number,
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    const originalWidth = (e.target as HTMLImageElement).width
    const wordItems = [...words]
    const clickedImageText = wordItems[index].wordText
    const animatedTextURL = await getAnimatedText(clickedImageText)
    await preloadImage(animatedTextURL)
    wordItems[index] = {
      ...wordItems[index],
      giphyURL: animatedTextURL,
      isReplacement: true,
      width: originalWidth,
    }
    setWords(wordItems)
  }

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve() // Resolve anyway on error to prevent hanging
      img.src = src
    })
  }

  const imageList = words.map((word, i) => {
    if (word.giphyURL === null) {
      return null
    }
    return (
      <img
        className={`gif-image ${word.isReplacement ? '' : 'slide-left'}`}
        key={`${i}${word.wordText}${word.giphyURL}`}
        src={word.giphyURL}
        onClick={(e) => handleImageClick(i, e)}
        style={
          word.isReplacement && word.width ? { width: `${word.width}px` } : {}
        }
      />
    )
  })

  return (
    <>
      <input
        type="text"
        value={currentWord}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />
      <div className="image-list">{imageList}</div>
    </>
  )
}

export default ImageList
