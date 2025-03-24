import { ref } from 'vue'

// 当前激活的题库ID
export const activeQuestionBankId = ref<string | null>(null)

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