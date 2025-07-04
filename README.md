# GIPHY Sentence Creator
Convert english sentences into GIPHYs.  Type a sentence into the input field.  As you type, a GIPHY version in the sentence is generated.

## Future Features
This app is meant to be a game where one person types a sentence and another person guesses the sentence.  I will later add a feature that allows another user to guess each word in the sentence to receive a score.  Right now, clicking an image will reveal the word in the form of animated text.

## Usage
```sh
npm install
npm run dev
```

Generate an API key for the GIPHY SDK from [https://developers.giphy.com/](https://developers.giphy.com/).  You must create an SDK API key for the animated text feature to work, you will not have access to animated text with a regular API key.  Create a .env file in the project's root directory that contains your GIPHY API key.

```.env
VITE_GIPHY_API_KEY=your-giphy-sdk-api-key
```

