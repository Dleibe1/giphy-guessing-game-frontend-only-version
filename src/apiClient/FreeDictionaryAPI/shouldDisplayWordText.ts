export const shouldDisplayWordText = (
  wordData: { title: string } | Array<{ meanings?: { partOfSpeech: string }[] }>
) => {
  if (
    wordData === undefined ||
    (!Array.isArray(wordData) && wordData.title === 'No Definitions Found')
  ) {
    return false
  }
  console.log(wordData)
  const disallowedPartsOfSpeech = ['conjunction', 'adverb', 'preposition', 'interjection']
  if (Array.isArray(wordData)) {
    for (const entry of wordData) {
      if (!entry.meanings) {
        continue
      }
      const partsOfSpeech = entry.meanings.map(
        (meaning) => meaning.partOfSpeech
      )
      const hasDisallowedPartOfSpeech = partsOfSpeech.some((partOfSpeech) =>
        disallowedPartsOfSpeech.includes(partOfSpeech)
      )
      if (hasDisallowedPartOfSpeech) {
        return true
      }
    }
  }
  return false
}
