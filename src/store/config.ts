import { ref } from 'vue'
import { questionBanks } from '@/mock/questions'
import type { QuestionBank } from '@/mock/questions'

interface DeepSeekConfig {
    baseURL: string
    apiKey: string
    model: string
    temperature: number
}

// 题库列表
export const questionBankList = ref<QuestionBank[]>(questionBanks)

// 当前激活的题库ID
export const activeQuestionBankId = ref<string | null>(null)

// 默认配置
const defaultConfig: DeepSeekConfig = {
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: 'sk-93b1e770e4b84470baa224e7a2f647f2',
    model: 'deepseek-chat',
    temperature: 0.7
}

// 当前配置
export const currentConfig = ref<DeepSeekConfig>(defaultConfig)

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
            const config = res.data as DeepSeekConfig
            currentConfig.value = config
        },
        fail: () => {
            // 如果没有本地配置，使用默认配置
            currentConfig.value = defaultConfig
        }
    })
}

export const saveAIConfig = (config: DeepSeekConfig) => {
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

export const loadConfig = () => {
    loadActiveQuestionBank()
    loadAIConfig()
}