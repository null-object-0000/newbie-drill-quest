<template>
    <view class="content">
        <view class="evaluation-section" v-if="evaluationProgress">
            <view class="evaluation-card">
                <view class="score-section">
                    <text class="score-label">得分</text>
                    <text class="score-value" v-if="evaluationProgress.score >= 0">{{ evaluationProgress.score }}</text>
                    <text class="score-value" v-else>评估中</text>
                </view>
                <view class="feedback-section" v-if="evaluationProgress.feedback">
                    <text class="feedback-title">评价</text>
                    <text class="feedback-content">{{ evaluationProgress.feedback }}</text>
                </view>
                <view class="suggestions-section" v-if="evaluationProgress.suggestions">
                    <text class="suggestions-title">建议</text>
                    <text class="suggestions-content">{{ evaluationProgress.suggestions }}</text>
                </view>
            </view>
        </view>

        <button class="back-btn" @click="goBack">返回</button>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { evaluateAnswer } from '@/utils/deepseek'

const evaluationProgress = ref<{
    score: number
    feedback: string
    suggestions: string
} | null>(null)

onMounted(() => {
    const instance = getCurrentInstance()?.proxy
    const eventChannel = (instance as any)?.getOpenerEventChannel();
    eventChannel.on('evaluateAnswer', async (params: { question: string, answer: string }) => {
        try {
            evaluationProgress.value = {
                score: -1,
                feedback: '',
                suggestions: ''
            }

            const result = await evaluateAnswer(
                params.question,
                params.answer,
                (progress) => {
                    evaluationProgress.value = {
                        score: progress.score || 0,
                        feedback: progress.feedback || '',
                        suggestions: progress.suggestions || ''
                    }
                }
            )

            evaluationProgress.value = result
        } catch (error) {
            uni.showToast({
                title: '评估失败，请重试',
                icon: 'none'
            })
        }
    })
})

const goBack = () => {
    uni.navigateBack()
}
</script>

<style>
.content {
    padding: 40rpx;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.evaluation-section {
    margin-top: 40rpx;
}

.evaluation-card {
    background-color: #fff;
    padding: 40rpx;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.score-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
}

.score-label {
    font-size: 32rpx;
    color: #333;
}

.score-value {
    font-size: 48rpx;
    color: #007AFF;
    font-weight: bold;
}

.feedback-section,
.suggestions-section {
    margin-bottom: 20rpx;
}

.feedback-title,
.suggestions-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
    display: block;
}

.feedback-content,
.suggestions-content {
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
    display: block;
}

.back-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #007AFF;
    color: #fff;
    border-radius: 45rpx;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 40rpx;
}
</style>