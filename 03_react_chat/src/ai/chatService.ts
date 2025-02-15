import { ChatOpenAI } from '@langchain/openai'
import { MessageContent, MessageContentComplex } from '@langchain/core/messages'
import { ChatPromptTemplate } from '@langchain/core/prompts'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OpenAI API key is not defined in environment variables')
}

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0, apiKey })

export async function streamChatResponse(
  targetLanguage: string,
  userMessage: string,
  onMessage: (message: string) => void,
) {
  // 1. 사용자 메시지를 번역하는 템플릿을 생성합니다.
  const systemTemplate = 'Translate the following from Korean into {language}'
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['user', '{text}'],
  ])

  // 2. 사용자 메시지를 번역합니다.
  const messages = await promptTemplate.invoke({
    language: targetLanguage,
    text: userMessage,
  })
  // 2-1. 동일한 기능을 하는 다른 코드
  /* const messages = await promptTemplate.formatMessages({
    language: 'English',
    text: userMessage,
  }) */

  // 3. 번역된 메시지를 모델에 전달하여 대화를 생성합니다.
  const stream = await model.stream(messages)

  // 4. 대화 스트림을 이용하여 메시지를 처리합니다.
  const chunks = []
  for await (const chunk of stream) {
    const content = parseContent(chunk.content)
    chunks.push(content)
    onMessage(content)
  }

  // 5. 대화 스트림이 종료되면 결과를 출력합니다.
  console.log(chunks.join(''))
}

/**
 * MessageContent 또는 MessageContentComplex를 문자열로 변환
 *
 * @param content   MessageContent | MessageContentComplex
 * @returns
 */
function parseContent(content: MessageContent | MessageContentComplex): string {
  if (typeof content === 'string') {
    return content
  } else if (Array.isArray(content)) {
    return (content as MessageContentComplex[]).map(parseContent).join(' ')
  }
  return ''
}
