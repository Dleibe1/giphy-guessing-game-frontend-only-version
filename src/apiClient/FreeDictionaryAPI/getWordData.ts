export const getWordData = async (word: string) => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
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
