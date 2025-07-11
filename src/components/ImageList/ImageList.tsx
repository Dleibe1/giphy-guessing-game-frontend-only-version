import React, { useState } from 'react'
import {
  getGifOrAnimatedText,
  getAnimatedText,
} from '../../apiClient/GIPHY/getURL'
import { imagePreloader } from '../../services/imagePreloader'
import './ImageList.scss'

interface WordItem {
  wordText: string
  giphyURL: string | null
  isReplacement?: boolean
  guessedWordText?: string
  width?: number
  isAnimatedText?: boolean
}

const ImageList = () => {
  const [wordItems, setWordItems] = useState<WordItem[]>([])

  const onInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): Promise<void> => {
    const currentWordItems = [...wordItems]
    currentWordItems[index] = {
      ...currentWordItems[index],
      [event.currentTarget.name]: event.currentTarget.value,
    }
    if (
      currentWordItems[index].wordText.toLowerCase() ===
      currentWordItems[index].guessedWordText?.toLowerCase()
    ) {
      const containerDiv = event.currentTarget.closest('.word-item-container')
      const imgElement = containerDiv?.querySelector('img')
      const originalWidth = imgElement?.clientWidth || undefined
      currentWordItems[index].width = originalWidth
      currentWordItems[index].giphyURL = await getAnimatedText(
        currentWordItems[index].wordText
      )
      currentWordItems[index].isReplacement = true
      setWordItems(currentWordItems)
      await imagePreloader(currentWordItems[index].giphyURL)
      currentWordItems[index].isAnimatedText = true
    }
    setWordItems(currentWordItems)
  }

  const onKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.key === ' ' || event.key === '.') {
      const wordText = event.currentTarget.value
      const { giphyURL, isAnimatedText } = await getGifOrAnimatedText(wordText)
      const currentWordItems = [...wordItems]
      currentWordItems.push(
        { wordText, giphyURL, isAnimatedText },
        { wordText: '', giphyURL: null }
      )
      setWordItems(currentWordItems)
    }
  }

  const handleImageClick = async (
    event: React.MouseEvent<HTMLImageElement>,
    index: number
  ) => {
    const originalWidth = (event.target as HTMLImageElement).width
    const currentWordItems = [...wordItems]
    const clickedImageText = wordItems[index].wordText
    const animatedTextURL = await getAnimatedText(clickedImageText)
    await imagePreloader(animatedTextURL)
    currentWordItems[index] = {
      ...wordItems[index],
      giphyURL: animatedTextURL,
      isReplacement: true,
      width: originalWidth,
      isAnimatedText: true,
    }
    setWordItems(currentWordItems)
  }

  const imageList = wordItems.map((word, i) => {
    if (word.giphyURL === null) {
      return null
    }
    return (
      <div className="word-item-container">
        <img
          className={`gif-image ${word.isReplacement ? '' : 'slide-left'}`}
          key={`${i}${word.giphyURL}`}
          src={word.giphyURL}
          onClick={(event) => handleImageClick(event, i)}
          style={
            word.isReplacement && word.width ? { width: `${word.width}px` } : {}
          }
        />
        {word.isAnimatedText !== true &&
          word.wordText !== word.guessedWordText && (
            <input
              type="text"
              name="guessedWordText"
              value={word.guessedWordText}
              onChange={(event) => onInputChange(event, i)}
            />
          )}
      </div>
    )
  })
  return (
    <>
      <input
        type="text"
        name="wordText"
        value={wordItems[wordItems.length - 1]?.wordText}
        onChange={(event) => onInputChange(event, wordItems.length - 1)}
        onKeyDown={onKeyDown}
      />
      <div className="image-list">{imageList}</div>
    </>
  )
}

export default ImageList
