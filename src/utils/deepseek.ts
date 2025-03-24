// DeepSeek API 配置
const WS_URL = 'ws://localhost:18780'

interface FeedbackResult {
    score: number
    feedback: string
    suggestions: string
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

/**
 * 使用 DeepSeek API 对答案进行评分和点评
 * @param question 面试问题
 * @param answer 用户答案
 * @returns 评分和反馈结果
 */
export async function evaluateAnswer(question: string, answer: string, onProgress?: (data: Partial<FeedbackResult>) => void): Promise<FeedbackResult> {
    return new Promise((resolve, reject) => {
        try {
            let currentContent = ''
            let currentScore = 0
            let currentFeedback = ''
            let currentSuggestions = ''
            let socketTask: UniApp.SocketTask

            try {
                socketTask = uni.connectSocket({
                    url: WS_URL,
                    complete: () => {}
                })
            } catch (error) {
                console.error('创建WebSocket连接失败:', error)
                reject(new Error('创建WebSocket连接失败'))
                return
            }

            socketTask.onOpen(() => {
                const prompt = `作为面试官，请对以下面试问题的回答进行评估。

                            问题：${question}

                            答案：${answer}

                            请分段返回评估结果，每个部分都必须是合法的 JSON 格式：

                            1. 首先返回分数：
                            {"type":"score","value":0-100的整数}

                            2. 然后返回评价：
                            {"type":"feedback","value":"详细的评价内容"}

                            3. 最后返回建议：
                            {"type":"suggestions","value":"具体的改进建议"}
                            
                            注意：
                            1. 每个 JSON 对象必须独立返回
                            2. score 必须是 0-100 的整数
                            3. feedback 和 suggestions 必须是非空字符串
                        `

                const apiConfig = {
                    model: 'deepseek-chat',
                    temperature: 0.7,
                    max_tokens: 1000,
                    messages: [
                        { role: 'system', content: '你是一位经验丰富的技术面试官，善于评估候选人的回答并提供建设性的反馈。' },
                        { role: 'user', content: prompt }
                    ]
                }

                socketTask.send({
                    data: JSON.stringify(apiConfig),
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

                    if (data.choices?.[0]?.delta) {
                        const delta = data.choices[0].delta
                        if (delta.content) {
                            currentContent += delta.content
                            try {
                                // 尝试解析当前内容中的所有 JSON 对象
                                const jsonMatches = currentContent.match(/\{[^\{\}]*\}/g)
                                if (jsonMatches) {
                                    for (const match of jsonMatches) {
                                        const parsedResult = JSON.parse(match)
                                        switch (parsedResult.type) {
                                            case 'score':
                                                currentScore = parsedResult.value || 0
                                                break
                                            case 'feedback':
                                                currentFeedback = parsedResult.value || ''
                                                break
                                            case 'suggestions':
                                                currentSuggestions = parsedResult.value || ''
                                                break
                                        }

                                        if (onProgress) {
                                            onProgress({
                                                score: currentScore,
                                                feedback: currentFeedback,
                                                suggestions: currentSuggestions
                                            })
                                        }
                                    }
                                }
                            } catch (parseError) {
                                // 解析错误说明 JSON 还未完整，继续等待更多数据
                            }
                        }
                    }

                    // 检查是否收到结束信号
                    if (data.choices?.[0]?.finish_reason === 'stop') {
                        socketTask.close({})
                        resolve({
                            score: currentScore,
                            feedback: currentFeedback,
                            suggestions: currentSuggestions
                        })
                        return
                    }
                } catch (error) {
                    console.error('处理消息时出错:', error)
                }
            })

            socketTask.onClose(() => {
                if (currentScore === 0 && !currentFeedback && !currentSuggestions) {
                    reject(new Error('WebSocket 连接已关闭，未收到有效评估结果'))
                    return
                }

                resolve({
                    score: currentScore,
                    feedback: currentFeedback,
                    suggestions: currentSuggestions
                })
            })

            socketTask.onError((error) => {
                console.error('WebSocket 错误:', error)
                reject(new Error('WebSocket 连接错误'))
            })
        } catch (error) {
            console.error('评估答案时出错:', error)
            reject(new Error('评估答案失败'))
        }
    })
}