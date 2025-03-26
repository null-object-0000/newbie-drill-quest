import { ref } from 'vue'
import { questionBanks } from '@/mock/questions'
import type { QuestionBank } from '@/mock/questions'

export interface EvaluationRecord {
    questionContent: string
    questionDifficulty?: string
    questionCategory?: string
    questionIsFollowUp: boolean

    answer: string
    score: number
    feedback: string
    suggestions: string
    example: string
    timestamp: number
}

export interface AIConfig {
    baseURL: string
    apiKey: string
    model: string
    temperature: number
}

// 题库列表
export const questionBankList = ref<QuestionBank[]>(questionBanks)

// 评估记录列表
export const evaluationRecords = ref<EvaluationRecord[]>([])

// 当前激活的题库ID
export const activeQuestionBankId = ref<string | null>(null)

// 默认配置
const defaultConfig: AIConfig = {
    baseURL: 'https://api.deepseek.com',
    apiKey: '',
    model: 'deepseek-chat',
    temperature: 0.7
}

// 当前配置
export const currentConfig = ref<AIConfig>(defaultConfig)

// 从本地存储加载题库列表
export const loadQuestionBanks = () => {
    uni.getStorage({
        key: 'question_banks',
        success: (res) => {
            const banks = res.data as QuestionBank[]
            questionBankList.value = banks
        },
        fail: () => {
            // 如果没有本地存储，使用默认题库
            questionBankList.value = questionBanks
        }
    })
}

// 保存题库列表到本地存储
export const saveQuestionBanks = () => {
    uni.setStorage({
        key: 'question_banks',
        data: questionBankList.value
    })
}

// 从本地存储加载激活的题库ID
export const loadActiveQuestionBank = () => {
    uni.getStorage({
        key: 'active_question_bank',
        success: (res) => {
            activeQuestionBankId.value = res.data as string
        },
        fail: () => {
            // 如果没有本地存储，使用第一个题库
            if (questionBankList.value.length > 0) {
                activeQuestionBankId.value = questionBankList.value[0].id
                saveActiveQuestionBank()
            }
        }
    })
}

// 保存激活的题库ID到本地存储
export const saveActiveQuestionBank = () => {
    if (activeQuestionBankId.value) {
        uni.setStorage({
            key: 'active_question_bank',
            data: activeQuestionBankId.value
        })
    }
}

// 激活题库
export const activateQuestionBank = (bankId: string) => {
    activeQuestionBankId.value = bankId
    saveActiveQuestionBank()
}

export const loadAIConfig = () => {
    uni.getStorage({
        key: 'ai_config',
        success: (res) => {
            const config = res.data as AIConfig
            currentConfig.value = config
        },
        fail: () => {
            // 如果没有本地配置，使用默认配置
            currentConfig.value = defaultConfig
        }
    })
}

export const saveAIConfig = (config: AIConfig) => {
    currentConfig.value = config
    uni.setStorage({
        key: 'ai_config',
        data: config
    })
}

export const resetAIConfig = () => {
    currentConfig.value = defaultConfig
    uni.setStorage({
        key: 'ai_config',
        data: defaultConfig
    })
}

// 从本地存储加载评估记录
export const loadEvaluationRecords = () => {
    uni.getStorage({
        key: 'evaluation_records',
        success: (res) => {
            evaluationRecords.value = res.data as EvaluationRecord[]
        },
        fail: () => {
            evaluationRecords.value = []
        }
    })
}

// 获取评估记录
export const getEvaluationRecords = (): EvaluationRecord[] => {
    try {
        const records = uni.getStorageSync('evaluation_records')
        return records ? records as EvaluationRecord[] : []
    } catch (error) {
        console.error('获取评估记录失败:', error)
        return []
    }
}

// 保存评估记录到本地存储
export const saveEvaluationRecord = (record: EvaluationRecord) => {
    evaluationRecords.value = [record, ...evaluationRecords.value]
    uni.setStorage({
        key: 'evaluation_records',
        data: evaluationRecords.value
    })
}

// 清空评估记录
export const clearEvaluationRecords = () => {
    evaluationRecords.value = []
    uni.removeStorageSync('evaluation_records')
}

export const loadConfig = () => {
    loadActiveQuestionBank()
    loadAIConfig()
    loadEvaluationRecords()
}