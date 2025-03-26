<template>
    <view class="content">
        <view class="records-list">
            <view v-for="record in displayRecords" :key="record.timestamp" class="record-card">
                <view class="record-header">
                    <text class="record-score">得分：{{ record.score }}</text>
                    <text class="record-time">{{ formatTime(record.timestamp) }}</text>
                </view>
                <view class="record-content">
                    <view class="record-section">
                        <view class="section-header">
                            <text class="section-title">题目</text>
                            <view class="question-info" v-if="record.questionDifficulty && record.questionCategory">
                                <text class="difficulty" :class="record.questionDifficulty">
                                    {{ record.questionDifficulty }}
                                </text>
                                <text class="category">{{ record.questionCategory }}</text>
                            </view>
                        </view>
                        <text class="section-content">{{ record.questionContent }}</text>
                    </view>
                    <view v-if="record.showDetails">
                        <view class="record-section">
                            <text class="section-title">我的答案</text>
                            <text class="section-content">{{ record.answer }}</text>
                        </view>
                        <view class="record-section">
                            <text class="section-title">评价</text>
                            <text class="section-content">{{ record.feedback }}</text>
                        </view>
                        <view class="record-section" v-if="record.suggestions">
                            <text class="section-title">建议</text>
                            <text class="section-content">{{ record.suggestions }}</text>
                        </view>
                        <view class="record-section" v-if="record.example">
                            <text class="section-title">范例</text>
                            <text class="section-content">{{ record.example }}</text>
                        </view>
                    </view>
                    <view class="expand-all" @click="record.showDetails = !record.showDetails">
                        <text class="expand-icon">{{ record.showDetails ? '收起全部' : '展开全部' }}</text>
                    </view>
                </view>
            </view>
            <view v-if="hasMoreRecords" class="load-more" @click="loadMore">
                加载更多
            </view>
            <view v-else-if="displayRecords.length === 0" class="empty-state">
                暂无练习记录
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEvaluationRecords } from '@/store/config'
import type { EvaluationRecord } from '@/store/config'

interface Record extends EvaluationRecord {
    showDetails: boolean
}

const PAGE_SIZE = 10
const records = ref<any[]>([])
const displayRecords = ref<Record[]>([])
const currentPage = ref(1)
const hasMoreRecords = ref(true)

const loadRecords = () => {
    const allRecords = getEvaluationRecords()
    records.value = allRecords.sort((a, b) => b.timestamp - a.timestamp)
    loadMore()
}

const loadMore = () => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    const end = currentPage.value * PAGE_SIZE
    const newRecords = records.value.slice(start, end)

    if (newRecords.length < PAGE_SIZE) {
        hasMoreRecords.value = false
    }

    displayRecords.value = [...displayRecords.value, ...newRecords]
    currentPage.value++
}

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
    loadRecords()
})
</script>

<style>
.content {
    padding: 40rpx;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.records-list {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
}

.record-card {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
}

.record-score {
    font-size: 32rpx;
    color: #007AFF;
    font-weight: bold;
}

.record-time {
    font-size: 28rpx;
    color: #999;
}

.record-section {
    margin-bottom: 20rpx;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
}

.section-title {
    font-size: 28rpx;
    color: #666;
    margin-right: 20rpx;
}

.question-info {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.difficulty {
    font-size: 24rpx;
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    color: #fff;
}

.difficulty.easy {
    background-color: #4CAF50;
}

.difficulty.medium {
    background-color: #FF9800;
}

.difficulty.hard {
    background-color: #F44336;
}

.category {
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    background-color: #f0f0f0;
    color: #666;
}

.section-content {
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
    display: block;
    word-break: break-all;
    white-space: pre-wrap;
}

.load-more {
    text-align: center;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    color: #007AFF;
    font-size: 28rpx;
}

.empty-state {
    text-align: center;
    padding: 100rpx 0;
    color: #999;
    font-size: 28rpx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.expand-icon {
    font-size: 24rpx;
    color: #007AFF;
    padding: 6rpx 12rpx;
    border: 2rpx solid #007AFF;
    border-radius: 6rpx;
}

.expand-all {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20rpx;
    cursor: pointer;
}
</style>