export const fetchGiphy = async (searchTerm: string) => {
  const giphyApiKey = import.meta.env.VITE_GIPHY_API_KEY
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/stickers/search?api_key=${giphyApiKey}&q=${searchTerm}&limit=5`
    )
    if (!response.ok) {
      const errorMessage = `${response.status} (${response.statusText})`
      const error = new Error(errorMessage)
      throw error
    }
    const responseBody = await response.json()
    return responseBody
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in Fetch: ${error.message}`)
    } else {
      throw error
    }
  }
}
