<template>
  <view class="content">
    <view class="welcome-section">
      <image class="logo" src="/static/logo.png" />
      <view class="text-area">
        <text class="title">生存挑战</text>
        <text class="subtitle">准备好接受挑战了吗？</text>
      </view>
      <button class="start-btn" @click="startQuiz">开始挑战</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { activeQuestionBankId, questionBankList } from '@/store/config'

const startQuiz = () => {
  const activeId = activeQuestionBankId.value
  if (!activeId) {
    uni.showToast({
      title: '请先激活题库',
      icon: 'none'
    })
    return
  }

  // 获取激活的题库
  const activeBank = questionBankList.value.find(bank => bank.id === activeId)
  if (!activeBank) {
    uni.showToast({
      title: '题库不存在',
      icon: 'none'
    })
    return
  }

  // 从激活的题库中随机选择一个题目
  const randomQuestionIndex = Math.floor(Math.random() * activeBank.questions.length)
  const selectedQuestion = activeBank.questions[randomQuestionIndex]

  // 跳转到答题页面
  uni.navigateTo({
    url: '/pages/question-bank/answer',
    success: (res) => {
      res.eventChannel.emit('setQuestion', {
        question: selectedQuestion.content,
        difficulty: selectedQuestion.difficulty,
        category: selectedQuestion.category
      })
    }
  })
}
</script>

<style>
.content {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* #ifdef H5 */
.content {
  height: 100%;
}

/* #endif */

/* #ifdef MP-WEIXIN */
.content {
  height: 100vh;
}

/* #endif */

.welcome-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-bottom: 60rpx;
}

.text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 32rpx;
  color: #666;
}

.start-btn {
  width: 80%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: bold;
}
</style>
