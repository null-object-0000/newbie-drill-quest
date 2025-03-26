import { currentConfig } from '@/store/config'

// AI API 配置
const WS_URL = 'ws://localhost:18780'

interface FeedbackResult {
    score: number
    feedback: string
    suggestions: string
    example: string
    needFollowUp: boolean
    followUpQuestion?: string
}

interface StreamResponse {
    choices: Array<{
        delta: {
            content?: string
            reasoning_content?: string
        }
        finish_reason?: string
    }>
    error?: string
}

// 生成评估提示词
function generatePrompt(question: string, answer: string): string {
    return `作为技术面试官，请对以下回答进行评估，并严格分步返回结果：

            问题：${question}
            答案：${answer}

            请按以下步骤返回 JSON 结果，每一步均为完整对象：
            1. 评分（仅含分数）：
            {"score": 0-100的整数}
            
            2. 评价（分数+评价）：
            {"score": 同上, "feedback": "面试官口吻的详细评价，中文，非空"}
            
            3. 建议（分数+评价+建议）：
            {"score": 同上, "feedback": 同上, "suggestions": "导师口吻的改进建议，中文，非空"}
            
            4. 范例（分数+评价+建议+范例）：
            {"score": 同上, "feedback": 同上, "suggestions": 同上, "example": "标准答案示例，中文，非空"}
            
            5. 最终结果（含追问判断）：
            {"score": 同上, "feedback": 同上, "suggestions": 同上, "example": 同上, "needFollowUp": true/false, "followUpQuestion": "不要随意追问，若需追问，此处为非空中文问题"}
            
            注意：
            1. score 需综合准确性（0-40）、完整性（0-30）、清晰度（0-20）、逻辑性（0-10）评分。
            2. 所有文本字段必须为非空中文，禁止缺失或混合其他语言。
            3. 以面试官角度考虑该面试者是否值得追问或引导，若需要则将 needFollowUp 设置为 true，否则为 false。
            3. needFollowUp 为 true 时，followUpQuestion 必须是与原问题强相关、能进一步考察候选人技术深度的追问问题，避免开放式提问。
            `
}

// 生成请求参数
function generateRequestConfig(question: string, answer: string, isStream = false) {
    const config = {
        baseURL: currentConfig.value.baseURL,
        apiKey: currentConfig.value.apiKey
    }

    const prompt = generatePrompt(question, answer)
    const data = {
        model: currentConfig.value.model,
        temperature: currentConfig.value.temperature,
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: '你是一位经验丰富的技术面试官，善于评估候选人的回答并提供建设性的反馈。' },
            { role: 'user', content: prompt }
        ] as const,
        stream: isStream
    }

    return { config, data }
}

// 处理评估结果
function processEvaluationResult(result: any): FeedbackResult {
    return {
        score: result.score,
        feedback: result.feedback || '',
        suggestions: result.suggestions || '',
        example: result.example || '',
        needFollowUp: result.needFollowUp || false,
        followUpQuestion: result.followUpQuestion || ''
    }
}

// 处理流式内容
function processStreamContent(message: string) {
    try {
        const parsed = JSON.parse(message)
        if (typeof parsed === 'object' && parsed !== null) {
            return message
        }
    } catch {}

    let processedMessage = message
    if (processedMessage.endsWith(',')) {
        processedMessage = processedMessage.slice(0, -1)
    }
    if (!processedMessage.startsWith('{')) {
        processedMessage = '{' + processedMessage
    }
    if (processedMessage.endsWith('"')) {
        processedMessage += '}'
    } else if (!processedMessage.endsWith('"') && !processedMessage.endsWith('}')) {
        processedMessage += '"}'
    }

    try {
        JSON.parse(processedMessage)
        return processedMessage
    } catch {
        return null
    }
}

// HTTP 请求评估
async function evaluateWithRequest(question: string, answer: string): Promise<FeedbackResult> {
    return new Promise((resolve, reject) => {
        const { config, data } = generateRequestConfig(question, answer)

        uni.request({
            url: `${config.baseURL}/v1/chat/completions`,
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            timeout: 3 * 60 * 1000,
            data,
            success: (res) => {
                try {
                    const content = (res.data as any).choices[0].message.content
                    resolve(processEvaluationResult(JSON.parse(content)))
                } catch (error) {
                    reject(new Error('解析评估结果失败'))
                }
            },
            fail: () => reject(new Error('请求评估失败'))
        })
    })
}

// SSE 连接评估
async function connectSSE(
    question: string,
    answer: string,
    onProgress: (data: Partial<FeedbackResult>) => void
): Promise<FeedbackResult> {
    const { config, data } = generateRequestConfig(question, answer, true)
    let currentContent = ''
    let current = processEvaluationResult({})

    const response = await fetch(`${config.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok || !response.body) {
        throw new Error(response.ok ? 'Response body is null' : `HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n').filter(line => line.trim())) {
            if (!line.startsWith('data: ')) continue

            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
                const parsed = JSON.parse(data) as StreamResponse
                if (parsed.error) throw new Error(parsed.error)

                if (parsed.choices?.[0]?.delta?.content) {
                    currentContent += parsed.choices[0].delta.content
                    const processedContent = processStreamContent(currentContent)
                    if (processedContent) {
                        try {
                            const parsedResult = JSON.parse(processedContent)
                            current = processEvaluationResult(parsedResult)
                            onProgress(current)
                        } catch (error) {
                            console.warn('解析 JSON 结果失败:', error)
                        }
                    }
                }

                if (parsed.choices?.[0]?.finish_reason === 'stop') {
                    return current
                }
            } catch (error) {
                console.error('解析 SSE 数据时出错:', error)
            }
        }
    }

    return current
}

// WebSocket 连接评估
async function connectWebSocket(
    question: string,
    answer: string,
    onProgress: (data: Partial<FeedbackResult>) => void
): Promise<FeedbackResult> {
    return new Promise((resolve, reject) => {
        const { config, data } = generateRequestConfig(question, answer)
        let currentContent = ''
        let current = processEvaluationResult({})

        const socketTask = uni.connectSocket({
            url: WS_URL,
            complete: () => {}
        })

        socketTask.onOpen(() => {
            socketTask.send({
                data: JSON.stringify({ ...data, ...config }),
                fail: (error) => {
                    console.error('发送消息失败:', error)
                    reject(new Error('发送消息失败'))
                }
            })
        })

        socketTask.onMessage((result) => {
            try {
                const data = JSON.parse(result.data as string) as StreamResponse
                if (data.error) {
                    socketTask.close({})
                    reject(new Error(data.error))
                    return
                }

                if (data.choices?.[0]?.delta?.content) {
                    currentContent += data.choices[0].delta.content
                    const processedContent = processStreamContent(currentContent)
                    if (processedContent) {
                        try {
                            const parsedResult = JSON.parse(processedContent)
                            current = processEvaluationResult(parsedResult)
                            onProgress(current)
                        } catch (error) {
                            console.warn('解析 JSON 结果失败:', error)
                        }
                    }
                }

                if (data.choices?.[0]?.finish_reason === 'stop') {
                    socketTask.close({})
                    resolve(current)
                }
            } catch (error) {
                console.error('处理消息时出错:', error)
            }
        })

        socketTask.onError(async () => {
            console.warn('WebSocket 连接失败，降级使用 HTTP 请求')
            try {
                current = await evaluateWithRequest(question, answer)
                onProgress(current)
                resolve(current)
            } catch (error) {
                reject(error)
            }
        })

        socketTask.onClose(() => {
            if (current.score >= 0) resolve(current)
        })
    })
}

/**
 * 使用 AI API 对答案进行评分和点评
 * @param question 面试问题
 * @param answer 用户答案
 * @param onProgress 进度回调函数
 * @returns 评分和反馈结果
 */
export async function evaluateAnswer(
    question: string,
    answer: string,
    onProgress: (data: Partial<FeedbackResult>) => void = () => {}
): Promise<FeedbackResult> {
    try {
        // 在 H5 环境下优先尝试使用 SSE
        if (uni.getSystemInfoSync().uniPlatform === 'web') {
            try {
                return await connectSSE(question, answer, onProgress)
            } catch (error) {
                console.warn('SSE 连接失败，降级使用 WebSocket:', error)
            }
        }

        // 非 H5 环境或 SSE 失败时使用 WebSocket
        return await connectWebSocket(question, answer, onProgress)
    } catch (error) {
        console.error('评估失败:', error)
        throw error
    }
}