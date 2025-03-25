<template>
    <view class="content">
        <!-- 评估展示 -->
        <view class="evaluation-section">
            <view class="evaluation-card">
                <view class="score-section">
                    <text class="score-label">得分</text>
                    <text class="score-value">
                        {{ evaluationProgress.score < 0 ? '评估中' + loadingDots : evaluationProgress.score }}
                    </text>
                </view>
                <view class="feedback-section" v-if="evaluationProgress.feedback">
                    <text class="feedback-title">评价</text>
                    <text class="feedback-content">
                        {{ evaluationProgress.feedback }}
                    </text>
                </view>
                <view class="suggestions-section" v-if="evaluationProgress.suggestions">
                    <text class="suggestions-title">建议</text>
                    <text class="suggestions-content">
                        {{ evaluationProgress.suggestions }}
                    </text>
                </view>
                <view class="example-section" v-if="evaluationProgress.example">
                    <text class="example-title">范例</text>
                    <text class="example-content">
                        {{ evaluationProgress.example }}
                    </text>
                </view>
                <view v-if="evaluationProgress.needFollowUp" class="follow-up-section">
                    <text class="follow-up-title">追问</text>
                    <text class="follow-up-content">
                        {{ evaluationProgress.followUpQuestion }}
                    </text>
                    <button class="follow-up-btn" @click="handleFollowUp">继续回答</button>
                </view>
            </view>
        </view>

        <button class="back-btn" @click="goBack">返回</button>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { evaluateAnswer } from '@/utils/deepseek'

const loadingDots = ref('...')
let dotsTimer: number | null = null

const updateDots = () => {
    if (loadingDots.value === '') loadingDots.value = '.'
    else if (loadingDots.value === '.') loadingDots.value = '..'
    else if (loadingDots.value === '..') loadingDots.value = '...'
    else loadingDots.value = ''
}

onMounted(() => {
    dotsTimer = setInterval(updateDots, 500)
})

onUnmounted(() => {
    if (dotsTimer) {
        clearInterval(dotsTimer)
        dotsTimer = null
    }
})

const evaluationProgress = ref<{
    score: number
    feedback: string
    suggestions: string
    example: string
    needFollowUp: boolean
    followUpQuestion?: string
}>({
    score: -1,
    feedback: '',
    suggestions: '',
    example: '',
    needFollowUp: false
})

onMounted(() => {
    const instance = getCurrentInstance()?.proxy
    const eventChannel = (instance as any)?.getOpenerEventChannel();

    if (!eventChannel || !eventChannel.on) {
        uni.switchTab({
            url: '/pages/index/index'
        })
        return
    }

    eventChannel.on('evaluateAnswer', async (params: { question: string, answer: string }) => {
        try {
            const result = await evaluateAnswer(
                params.question,
                params.answer,
                (progress) => {
                    evaluationProgress.value = {
                        score: progress.score || -1,
                        feedback: progress.feedback || '',
                        suggestions: progress.suggestions || '',
                        example: progress.example || '',
                        needFollowUp: progress.needFollowUp || false,
                        followUpQuestion: progress.followUpQuestion || ''
                    }
                }
            )

            evaluationProgress.value = result
        } catch (error) {
            console.log('评估失败', error)
            uni.showToast({
                title: '评估失败，请重试',
                icon: 'none'
            })
        }
    })
})

const handleFollowUp = () => {
    if (evaluationProgress.value?.followUpQuestion) {
        uni.navigateTo({
            url: '/pages/question-bank/answer',
            success: (res) => {
                res.eventChannel.emit('setQuestion', {
                    question: evaluationProgress.value?.followUpQuestion,
                    isFollowUp: true
                })
            }
        })
    }
}

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
.suggestions-section,
.example-section {
    margin-bottom: 20rpx;
}

.feedback-title,
.suggestions-title,
.example-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
    display: block;
}

.feedback-content,
.suggestions-content,
.example-content {
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
    display: block;
    transition: opacity 0.3s ease;
}

@keyframes typing {
    from {
        border-right: 2px solid #007AFF;
    }

    to {
        border-right: 2px solid transparent;
    }
}

.follow-up-section {
    margin-top: 30rpx;
    padding-top: 20rpx;
    border-top: 2rpx solid #f0f0f0;
}

.follow-up-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
    display: block;
}

.follow-up-content {
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
    display: block;
    margin-bottom: 20rpx;
}

.follow-up-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #4CAF50;
    color: #fff;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
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