import { ChatDeepSeek } from '@langchain/deepseek'
import { MessageContent, MessageContentComplex } from '@langchain/core/messages'
import { ChatPromptTemplate } from '@langchain/core/prompts'

const apiKey = import.meta.env.VITE_CHATMODEL_API_KEY
if (!apiKey) {
  throw new Error('API key is not defined in environment variables')
}

// 1. OpenAI 모델 대신 DeepSeek 모델을 사용합니다.
// const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0, apiKey })

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0,
  maxTokens: 10000,
  maxRetries: 2,
  apiKey,
})

export async function streamChatResponse(
  targetLanguage: string,
  userMessage: string,
  onMessage: (message: string) => void,
) {
  // 2. 템플릿을 생성합니다.
  const systemTemplate = 'Translate the following from Korean into {language}'
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['user', '{text}'],
  ])

  // 3. 프롬프트를 생성합니다.
  const prompt = await promptTemplate.invoke({
    language: targetLanguage,
    text: userMessage,
  })
  // 3-1. 동일한 기능을 하는 다른 코드
  /* const prompt = await promptTemplate.formatMessages({
    language: 'English',
    text: userMessage,
  }) */

  // 4. 프롬프트를 모델에 전달하여 대화를 생성합니다.
  const stream = await model.stream(prompt)

  // 5. 대화 스트림을 이용하여 메시지를 처리합니다.
  const chunks = []
  for await (const chunk of stream) {
    const content = parseContent(chunk.content)
    chunks.push(content)
    onMessage(content)
  }

  // 6. 대화 스트림이 종료되면 결과를 출력합니다.
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
