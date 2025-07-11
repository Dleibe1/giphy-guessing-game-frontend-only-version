import { GiphyFetch } from '@giphy/js-fetch-api'
import { getWordData } from '../FreeDictionaryAPI/getWordData'
import { shouldDisplayWordText } from '../FreeDictionaryAPI/shouldDisplayWordText'

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY)

const getGiphyImage = async (wordText: string) => {
  try {
    const { data: gifs } = await gf.search(wordText, {
      sort: 'relevant',
      limit: 1,
    })
    const imageURLs = gifs.map((gif) => {
      return gif.images.fixed_height.url
    })
    const numImages = imageURLs.length
    const randomImageIndex = Math.floor(Math.random() * numImages)
    return imageURLs[randomImageIndex]
  } catch (error) {
    console.error('animate', error)
    throw new Error('Failed to fetch animated text')
  }
}

export const getAnimatedText = async (wordText: string) => {
  try {
    const { data: gifs } = await gf.animate(wordText, { limit: 50 })
    const imageURLs = gifs.map((gif) => {
      return gif.images.fixed_width.url
    })
    const numImages = imageURLs.length
    const randomImageIndex = Math.floor(Math.random() * numImages)
    return imageURLs[randomImageIndex]
  } catch (error) {
    console.error('animate', error)
    throw new Error('Failed to fetch animated text')
  }
}

export const getGifOrAnimatedText = async (wordText: string) => {
  let giphyURL = null
  let isAnimatedText = false
  const wordData = await getWordData(wordText)
  const displayWordText: boolean = shouldDisplayWordText(wordData)
  if (displayWordText) {
    giphyURL = await getAnimatedText(wordText)
    isAnimatedText = true
  } else {
    giphyURL = await getGiphyImage(wordText)
    if (giphyURL === undefined) {
      giphyURL = await getAnimatedText(wordText)
      isAnimatedText = true
    }
  }
  return { giphyURL, isAnimatedText }
}
