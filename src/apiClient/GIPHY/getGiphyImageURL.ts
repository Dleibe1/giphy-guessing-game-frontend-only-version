import { GiphyFetch } from '@giphy/js-fetch-api'

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY)

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

export const getGiphyImage = async (wordText: string) => {
  try {
    const { data: gifs } = await gf.search(wordText, {
      sort: 'relevant',
      limit: 1,
    })
    console.log(gifs)
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
