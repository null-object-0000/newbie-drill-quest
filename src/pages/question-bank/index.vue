<template>
  <view class="container">
    <view class="header">
      <button class="import-btn" @click="handleImport">导入题库</button>
    </view>
    <view class="question-bank-list">
      <view class="bank-item" :class="{ active: bank.id === activeId }" v-for="(bank, index) in questionBanks"
        :key="index" @click="handleBankClick(bank)">
        <view class="bank-content">
          <text class="bank-title">{{ bank.title }}</text>
          <text class="bank-description">{{ bank.description }}</text>
          <view class="bank-info">
            <text class="question-count">{{ bank.questionCount }}题</text>
            <view class="difficulty-tags">
              <text v-if="bank.difficulty.easy" class="tag easy">简单 {{ bank.difficulty.easy }}</text>
              <text v-if="bank.difficulty.medium" class="tag medium">中等 {{ bank.difficulty.medium }}</text>
              <text v-if="bank.difficulty.hard" class="tag hard">困难 {{ bank.difficulty.hard }}</text>
            </view>
          </view>
        </view>

      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { activeQuestionBankId, questionBankList, activateQuestionBank, loadQuestionBanks, saveQuestionBanks } from '@/store/config'

// 题库列表数据
const questionBanks = ref(questionBankList.value.map(bank => ({
  id: bank.id,
  title: bank.name,
  description: bank.description,
  questionCount: bank.questions.length,
  difficulty: bank.questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)
})))

// 当前激活的题库ID
const activeId = ref(activeQuestionBankId.value)

// 点击题库处理函数
const handleBankClick = (bank: any) => {
  // 激活选中的题库
  activateQuestionBank(bank.id)
  activeId.value = bank.id
}

// 导入题库处理函数
const handleImport = async () => {
  try {
    const { result } = await uni.scanCode({
      scanType: ['qrCode']
    })

    try {
      const importedBank = JSON.parse(result)
      // 添加新题库到列表，若有相同的则覆盖
      questionBankList.value = questionBankList.value.filter(bank => bank.id !== importedBank.id).concat(importedBank)
      // 保存到本地存储
      saveQuestionBanks()
      // 更新显示的题库列表
      questionBanks.value = questionBankList.value.map(bank => ({
        id: bank.id,
        title: bank.name,
        description: bank.description,
        questionCount: bank.questions.length,
        difficulty: bank.questions.reduce((acc, q) => {
          acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }))

      uni.showToast({
        title: '导入成功',
        icon: 'success'
      })
    } catch (parseError) {
      uni.showToast({
        title: '题库格式错误',
        icon: 'none'
      })
    }
  } catch (error) {
    uni.showToast({
      title: '扫码失败',
      icon: 'none'
    })
  }
}

// 组件挂载时加载题库列表
onMounted(() => {
  loadQuestionBanks()
})
</script>

<style>
.container {
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.header {
  margin: 20rpx 0;
  display: flex;
  justify-content: flex-end;
}

.import-btn {
  background-color: #007AFF;
  color: #fff;
  font-size: 28rpx;
  padding: 20rpx 40rpx;
  border-radius: 30rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.import-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(0, 122, 255, 0.15);
  opacity: 0.9;
}

.question-bank-list {
  border-radius: 24rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.bank-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx;
  margin: 24rpx;
  border-radius: 16rpx;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.bank-item.active {
  background-color: rgba(0, 122, 255, 0.03);
  border: 2rpx solid rgba(0, 122, 255, 0.6);
  box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.08);
}

.bank-item:last-child {
  margin-bottom: 0;
}

.bank-content {
  flex: 1;
  margin-right: 20rpx;
}

.bank-title {
  font-size: 34rpx;
  color: #2c3e50;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: block;
}

.bank-description {
  font-size: 28rpx;
  color: #5c6b7a;
  margin-bottom: 16rpx;
  display: block;
  line-height: 1.5;
}

.bank-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8rpx;
}

.question-count {
  font-size: 26rpx;
  color: #8492a6;
}

.difficulty-tags {
  display: flex;
  gap: 12rpx;
}

.tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

.tag.easy {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.tag.medium {
  background-color: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.tag.hard {
  background-color: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}
</style>