import React, { useState } from 'react'
import langchainLogo from './assets/langchain-logo.png'
import openAILogo from './assets/openai.svg'
import reactLogo from './assets/react.svg'
import { streamChatResponse } from './ai/chatService'
import './App.css'

const App: React.FC = () => {
  const [inputText, setInputText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [chatResponse, setChatResponse] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value)
  }

  const handleSubmit = async () => {
    setChatResponse('') // Clear previous response
    await streamChatResponse(selectedLanguage, inputText, (message) => {
      setChatResponse((prev) => prev + message)
    })
  }

  return (
    <>
      <div className="logos">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo_react" alt="React logo" />
        </a>
        <a href="https://js.langchain.com/docs/introduction/" target="_blank">
          <img
            src={langchainLogo}
            className="logo_langchain"
            alt="LangChain logo"
            width="80"
            height="80"
          />
        </a>
        <a href="https://platform.openai.com/" target="_blank">
          <img src={openAILogo} className="logo_openai" alt="OpenAI logo" />
        </a>
      </div>
      <div className="title">
        <h3>Chat with React + LangChain + Open AI</h3>
        <p>
          Converts korean to selected language
          <br />
          OpenAI's GPT-4o-mini model via LangChain
        </p>
      </div>
      <div className="chatbox">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="문자열을 입력하세요"
        />
        <div className="language">
          <select value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="English" selected>
              영어
            </option>
            <option value="Chinese">중국어</option>
            <option value="Spanish">스페인어</option>
            <option value="Portuguese">포르투갈어</option>
            <option value="French">프랑스어</option>
            <option value="German">독일어</option>
          </select>
          <div className="buttons">
            <button onClick={handleSubmit}>변환</button>
          </div>
        </div>
      </div>
      <div className="response">
        <p>Response: </p>
        <p>{chatResponse}</p>
      </div>
    </>
  )
}

export default App
