import { ref } from 'vue'
import { currentConfig } from './config'
import type { AIConfig } from './config'

export interface UserBalance {
    balance: number
    unit: string
}

export const userBalance = ref<UserBalance | null>(null)

// 检查用户权限
export const checkUserPermission = async (config?: AIConfig): Promise<boolean> => {
    try {
        const response = await fetch((config || currentConfig.value).baseURL + '/user/balance', {
            headers: {
                'Authorization': `Bearer ${(config || currentConfig.value).apiKey}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        userBalance.value = data
        return true
    } catch (error: any) {
        console.error('检查用户权限失败:', error)
        uni.showToast({
            title: '请检查 AI API Key 是否正确，原始错误：' + error.message,
            icon: 'none',
            duration: 3000
        })
        return false
    }
}