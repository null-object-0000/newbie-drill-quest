// DeepSeek API 配置
const WS_URL = 'ws://localhost:18780'

interface DeepSeekConfig {
    baseURL: string
    apiKey: string
}

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

function generatePrompt(question: string, answer: string): string {
    const prompt = `作为技术面试官，请对以下回答进行评估，并严格分步返回结果：

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

    return prompt
}

function generateParameters(prompt: string) {
    return {
        model: currentConfig.value.model,
        temperature: currentConfig.value.temperature,
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: '你是一位经验丰富的技术面试官，善于评估候选人的回答并提供建设性的反馈。' },
            { role: 'user', content: prompt }
        ]
    }
}

import { currentConfig } from '@/store/config'

function generateAIConfig() {
    const config: DeepSeekConfig = {
        baseURL: currentConfig.value.baseURL,
        apiKey: currentConfig.value.apiKey
    }
    return config
}

/**
 * 使用 DeepSeek API 对答案进行评分和点评
 * @param question 面试问题
 * @param answer 用户答案
 * @returns 评分和反馈结果
 */
async function evaluateWithRequest(question: string, answer: string): Promise<FeedbackResult> {
    return new Promise((resolve, reject) => {
        const config: DeepSeekConfig = generateAIConfig()
        const prompt = generatePrompt(question, answer)
        const data = generateParameters(prompt)

        uni.request({
            url: `${config.baseURL}/chat/completions`,
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            data,
            success: (res) => {
                try {
                    const data = res.data as any
                    const content = data.choices[0].message.content
                    const result = JSON.parse(content)
                    resolve({
                        score: result.score,
                        feedback: result.feedback || '',
                        suggestions: result.suggestions || '',
                        example: result.example || '',
                        needFollowUp: result.needFollowUp || false,
                        followUpQuestion: result.followUpQuestion || ''
                    })
                } catch (error) {
                    reject(new Error('解析评估结果失败'))
                }
            },
            fail: (error) => {
                reject(new Error('请求评估失败'))
            }
        })
    })
}

export async function evaluateAnswer(question: string, answer: string, onProgress?: (data: Partial<FeedbackResult>) => void): Promise<FeedbackResult> {
    return new Promise(async (resolve, reject) => {
        try {
            let currentContent = ''

            let current: FeedbackResult = {
                score: -1,
                feedback: '',
                suggestions: '',
                example: '',
                needFollowUp: false,
                followUpQuestion: ''
            }

            let socketTask: UniApp.SocketTask = uni.connectSocket({
                url: WS_URL,
                complete: () => { }
            })

            socketTask.onOpen(() => {
                const config: DeepSeekConfig = generateAIConfig()
                const prompt = generatePrompt(question, answer)
                const data = generateParameters(prompt)

                const apiConfig = {
                    ...data,
                    baseURL: config.baseURL,
                    apiKey: config.apiKey
                }

                socketTask.send({
                    data: JSON.stringify(apiConfig),
                    fail: (error) => {
                        console.error('发送消息失败:', error)
                        reject(new Error('发送消息失败'))
                    }
                })
            })

            function completionContent(message: string) {
                // 先看是不是完整的 JSON 对象，是的话直接返回
                try {
                    JSON.parse(message)
                    return message
                } catch (error) {
                    // 如果是逗号结尾，就先去掉逗号
                    if (message.endsWith(',')) {
                        message = message.slice(0, -1)
                    }

                    // 不是完整的 JSON 对象，尝试完善
                    if (message.endsWith('"')) {
                        // 先看结尾有引号，但是没有花括号的情况，就补充花括号
                        message += '}'
                    } else if (!message.endsWith('"') && !message.endsWith('}')) {
                        // 结尾没有引号也没有花括号的情况，就补充
                        message += '"}'
                    }

                    return message
                }
            }

            socketTask.onMessage((result) => {
                try {
                    const data = JSON.parse(result.data as string) as StreamResponse
                    if (data.error) {
                        socketTask.close({})
                        reject(new Error(data.error))
                        return
                    }

                    if (data.choices?.[0]?.delta) {
                        const delta = data.choices[0].delta
                        if (delta.content) {
                            currentContent += delta.content
                            console.log('当前内容:', currentContent)
                            console.log('补全内容:', completionContent(currentContent))
                            try {
                                // 尝试解析当前内容中的 JSON 对象
                                const parsedResult = JSON.parse(completionContent(currentContent))
                                current.score = parsedResult.score
                                current.feedback = parsedResult.feedback || ''
                                current.suggestions = parsedResult.suggestions || ''
                                current.example = parsedResult.example || ''
                                current.needFollowUp = parsedResult.needFollowUp || false
                                current.followUpQuestion = parsedResult.followUpQuestion || ''

                                if (onProgress) {
                                    onProgress(current)
                                }
                            } catch (parseError) {
                                // 解析错误说明 JSON 还未完整，继续等待更多数据
                            }
                        }
                    }

                    // 检查是否收到结束信号
                    if (data.choices?.[0]?.finish_reason === 'stop') {
                        socketTask.close({})
                        resolve(current)
                        return
                    }
                } catch (error) {
                    console.error('处理消息时出错:', error)
                }
            })

            socketTask.onError(async (error) => {
                console.warn('WebSocket 连接失败，降级使用 HTTP 请求:', error)
                current = await evaluateWithRequest(question, answer)
                console.warn('降级使用 HTTP 请求结果:', current)
                onProgress && onProgress(current)
                resolve(current)
            })

            socketTask.onClose(() => {
                if (current.score >= 0 && !current.feedback && !current.suggestions) {
                    resolve(current)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}