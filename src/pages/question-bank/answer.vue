<template>
    <view class="content">
        <view class="quiz-section">
            <view class="question-card">
                <text class="question-text">{{ currentQuestion?.content }}</text>
                <view class="question-info" v-if="!isFollowUp">
                    <text class="difficulty" :class="currentQuestion?.difficulty">
                        {{ currentQuestion?.difficulty }}
                    </text>
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

            <view class="answer-container" v-if="selectedMode === 'text'">
                <view class="answer-section">
                    <textarea class="answer-input" v-model="textAnswer" placeholder="请输入你的答案..." :maxlength="-1" />
                </view>
                <view class="submit-container">
                    <button class="submit-btn" @click="submitAnswer">提交答案</button>
                </view>
            </view>

            <view class="answer-section" v-else-if="selectedMode === 'voice'">
                <view class="recognition-result" v-if="recognitionResult">
                    <text class="result-text">{{ recognitionResult }}</text>
                </view>
                <view v-if="isStarted">
                    <button class="record-btn" :class="{ recording: isRecording }" @click="toggleRecording">
                        {{ isRecording ? '暂停回答' : '继续回答' }}
                    </button>
                    <button class="record-btn stopped" @click="stopRecording">
                        结束回答
                    </button>
                </view>
                <button class="record-btn" v-else-if="!isStopped" :class="{ recording: isRecording }" @click="startRecording">
                    开始回答
                </button>
                <button class="record-btn" v-if="isStopped" @click="submitAnswer">
                    提交答案
                </button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { ref, getCurrentInstance } from 'vue'

interface CurrentQuestion {
    content: string
    difficulty?: string
    category?: string
}

const currentQuestion = ref<CurrentQuestion | null>(null)
const selectedMode = ref('')
const textAnswer = ref('')

const isStarted = ref(false)
const isRecording = ref(false)
const isStopped = ref(false)

const isFollowUp = ref(false)

import { AudioRecorder } from '@/utils/audio'

// 语音识别相关变量
const audioRecorder = ref<AudioRecorder | null>(null)
const recognitionResult = ref('')

onLoad(() => {
    const instance = getCurrentInstance()?.proxy
    const eventChannel = (instance as any)?.getOpenerEventChannel()

    if (!eventChannel || !eventChannel.on) {
        uni.switchTab({
            url: '/pages/index/index'
        })
        return
    }

    // 监听页面传参
    eventChannel.on('setQuestion', (params: { question: string, difficulty?: string, category?: string, isFollowUp?: boolean }) => {
        currentQuestion.value = {
            content: params.question,
            difficulty: params.difficulty,
            category: params.category
        }
        isFollowUp.value = params.isFollowUp || false
        // 默认选择文字回答模式
        selectAnswerMode('text')
    })
})

const selectAnswerMode = async (mode: 'text' | 'voice') => {
    selectedMode.value = mode

    console.log('selectAnswerMode', mode)
    if (mode === 'voice') {
        if (!audioRecorder.value) {
            audioRecorder.value = new AudioRecorder({
                onResult: (result) => {
                    recognitionResult.value = result
                    textAnswer.value = recognitionResult.value
                },
                onError: (error) => {
                    uni.showToast({
                        title: error,
                        icon: 'none'
                    })
                }
            })
        }

        await audioRecorder.value?.prepareRecording()
    }
}

const submitAnswer = async () => {
    if (!currentQuestion.value || !textAnswer.value.trim()) {
        uni.showToast({
            title: '请输入答案',
            icon: 'none'
        })
        return
    }

    uni.navigateTo({
        url: '/pages/question-bank/evaluation',
        success: (res) => {
            res.eventChannel.emit('evaluateAnswer', {
                question: currentQuestion.value?.content,
                answer: textAnswer.value,

                difficulty: currentQuestion.value?.difficulty,
                category: currentQuestion.value?.category,

                isFollowUp: isFollowUp.value
            })
        }
    })
}

const startRecording = async () => {
    if (isStarted.value) {
        return
    }

    isStarted.value = true

    if (audioRecorder.value) {
        await audioRecorder.value.startRecording()
        isRecording.value = true
    }
}

const toggleRecording = async () => {
    if (isRecording.value) {
        if (audioRecorder.value) {
            audioRecorder.value.pauseRecording()
            isRecording.value = false
        }
    } else {
        isRecording.value = true
        await audioRecorder.value?.resumeRecording()
    }
}

const stopRecording = async () => {
    if (!isRecording.value) {
        return
    }

    // 判断是否有答案，没有的话不允许停止
    if (!textAnswer.value.trim()) {
        uni.showToast({
            title: '请继续答案',
            icon: 'none'
        }) 
        return
    }

    if (audioRecorder.value) {
        audioRecorder.value.stopRecording()
        isRecording.value = false
        isStarted.value = false
    }

    isStopped.value = true
}

onUnload(() => {
    if (audioRecorder.value) {
        audioRecorder.value.stopRecording()
        audioRecorder.value = null
    }
})
</script>

<style>
.content {
    padding: 20rpx;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

/* #ifdef WEB */
.content {
    height: 100%;
}

/* #endif */

/* #ifndef WEB */
.content {
    height: 100vh;
}

/* #endif */

.quiz-section {
    padding: 10rpx;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.answer-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.answer-section {
    background-color: #fff;
    padding: 20rpx;
    border-radius: 20rpx;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 20rpx;
}

.answer-input {
    width: 100%;
    flex: 1;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    background-color: #f9f9f9;
    border-radius: 10rpx;
    box-sizing: border-box;
    resize: none;
}

.submit-container {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background-color: #fff;
    box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 1;
}

.submit-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #007AFF;
    color: #fff;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
}

.question-card {
    background-color: #fff;
    padding: 40rpx;
    border-radius: 20rpx;
    margin-bottom: 40rpx;
    width: 100%;
    box-sizing: border-box;
}

.question-text {
    font-size: 32rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 20rpx;
    display: block;
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

.answer-options {
    display: flex;
    gap: 20rpx;
    margin-bottom: 30rpx;
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

.answer-btn.disabled {
    color: #ccc;
    border-color: #ccc;
}

.answer-section {
    background-color: #fff;
    padding: 30rpx;
    border-radius: 20rpx;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.answer-input {
    width: 100%;
    flex: 1;
    min-height: 350rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    background-color: #f9f9f9;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
    resize: none;
}

.submit-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #007AFF;
    color: #fff;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    margin-top: 20rpx;
}

.record-btn {
    width: 100%;
    height: 120rpx;
    line-height: 120rpx;
    background-color: #4CAF50;
    color: #fff;
    border-radius: 60rpx;
    font-size: 32rpx;
    font-weight: bold;
}

.record-btn.recording {
    background-color: #F44336;
}

.record-btn.stopped {
    background-color: #FF9800;
    margin-top: 20rpx;
}

.recognition-result {
    background-color: #f9f9f9;
    padding: 20rpx;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
}

.result-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
}
</style>