<template>
  <view class="content">
    <view class="welcome-section" v-if="!currentQuestion?.content">
      <image class="logo" src="/static/logo.png" />
      <view class="text-area">
        <text class="title">面试挑战</text>
        <text class="subtitle">准备好接受挑战了吗？</text>
      </view>
      <button class="start-btn" @click="startQuiz">开始挑战</button>
    </view>

    <view class="quiz-section" v-else>
      <view class="question-card">
        <text class="question-text">{{ currentQuestion?.content }}</text>
        <view class="question-info">
          <text class="difficulty" :class="currentQuestion?.difficulty">{{ currentQuestion?.difficulty }}</text>
          <text class="category">{{ currentQuestion?.category }}</text>
        </view>
      </view>

      <view class="answer-options">
        <button class="answer-btn text" @click="selectAnswerMode('text')">
          <text class="btn-text">文字回答</text>
        </button>
        <button class="answer-btn voice" @click="selectAnswerMode('voice')">
          <text class="btn-text">语音回答</text>
        </button>
      </view>

      <view class="answer-section" v-if="selectedMode === 'text'">
        <textarea
          class="answer-input"
          v-model="textAnswer"
          placeholder="请输入你的答案..."
        />
        <button class="submit-btn" @click="submitAnswer">提交答案</button>
      </view>

      <view class="answer-section" v-else-if="selectedMode === 'voice'">
        <button 
          class="record-btn" 
          :class="{ recording: isRecording }"
          @touchstart="startRecording"
          @touchend="stopRecording"
        >
          {{ isRecording ? '松开结束录音' : '按住开始录音' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { questionBanks } from '@/data/questions'
import { getActiveQuestionBankId } from '@/store'

interface CurrentQuestion {
  content: string
  difficulty: string
  category: string
}

const currentQuestion = ref<CurrentQuestion | null>(null)
const selectedMode = ref('')
const textAnswer = ref('')
const isRecording = ref(false)

const startQuiz = () => {
  const activeId = getActiveQuestionBankId()
  if (!activeId) {
    uni.showToast({
      title: '请先激活题库',
      icon: 'none'
    })
    return
  }

  // 获取激活的题库
  const activeBank = questionBanks.find(bank => bank.id === activeId)
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
  
  currentQuestion.value = {
    content: selectedQuestion.content,
    difficulty: selectedQuestion.difficulty,
    category: selectedQuestion.category
  }
}

const selectAnswerMode = (mode: 'text' | 'voice') => {
  selectedMode.value = mode
}

const submitAnswer = () => {
  // TODO: 调用OpenAI API进行点评
  console.log('提交答案:', textAnswer.value)
}

const startRecording = () => {
  isRecording.value = true
  // TODO: 实现录音功能
}

const stopRecording = () => {
  isRecording.value = false
  // TODO: 停止录音并处理录音文件
}
</script>

<style>
.content {
  padding: 40rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;
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

.quiz-section {
  padding: 20rpx;
}

.question-card {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 34rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.question-info {
  display: flex;
  gap: 20rpx;
  margin-top: 10rpx;
}

.difficulty {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.difficulty.easy {
  background-color: #95de64;
  color: #fff;
}

.difficulty.medium {
  background-color: #ffc53d;
  color: #fff;
}

.difficulty.hard {
  background-color: #ff4d4f;
  color: #fff;
}

.category {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  background-color: #f0f0f0;
  color: #666;
}

.answer-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.answer-btn {
  width: 45%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.answer-btn.text {
  background-color: #007AFF;
  color: #fff;
}

.answer-btn.voice {
  background-color: #fff;
  color: #007AFF;
  border: 2rpx solid #007AFF;
}

.answer-section {
  margin-top: 40rpx;
}

.answer-input {
  width: 100%;
  height: 300rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 28rpx;
  margin-bottom: 30rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.record-btn {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  background-color: #fff;
  color: #007AFF;
  border: 2rpx solid #007AFF;
  border-radius: 60rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.record-btn.recording {
  background-color: #007AFF;
  color: #fff;
}
</style>
