import { ref } from 'vue'

interface DeepSeekConfig {
    baseURL: string
    apiKey: string
    model: string
    temperature: number
}

// 默认配置
const defaultConfig: DeepSeekConfig = {
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: 'sk-93b1e770e4b84470baa224e7a2f647f2',
    model: 'deepseek-chat',
    temperature: 0.7
}

// 当前配置
export const currentConfig = ref<DeepSeekConfig>(defaultConfig)

// 从本地存储加载配置
export const loadConfig = () => {
    uni.getStorage({
        key: 'deepseek_config',
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

// 保存配置到本地存储
export const saveConfig = (config: DeepSeekConfig) => {
    currentConfig.value = config
    uni.setStorage({
        key: 'deepseek_config',
        data: config
    })
}

// 重置配置为默认值
export const resetConfig = () => {
    currentConfig.value = defaultConfig
    uni.setStorage({
        key: 'deepseek_config',
        data: defaultConfig
    })
}