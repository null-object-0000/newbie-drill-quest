import { ref } from 'vue'
import { questionBanks } from '@/mock/questions'

// 当前激活的题库ID
export const activeQuestionBankId = ref<string | null>(null)

// 初始化默认题库
if (!activeQuestionBankId.value && questionBanks.length > 0) {
  activeQuestionBankId.value = questionBanks[0].id
}

// 激活题库
export const activateQuestionBank = (bankId: string) => {
  activeQuestionBankId.value = bankId
}

// 获取当前激活的题库ID
export const getActiveQuestionBankId = () => activeQuestionBankId.value

// 清除激活的题库
export const clearActiveQuestionBank = () => {
  activeQuestionBankId.value = null
}