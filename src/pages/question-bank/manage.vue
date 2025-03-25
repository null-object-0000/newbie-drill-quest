<template>
    <view class="container">
        <view class="bank-info">
            <view class="form-item">
                <text class="label">题库ID</text>
                <input v-model="bank.id" placeholder="请输入题库ID" />
            </view>
            <view class="form-item">
                <text class="label">题库名称</text>
                <input v-model="bank.name" placeholder="请输入题库名称" />
            </view>
            <view class="form-item">
                <text class="label">题库描述</text>
                <textarea v-model="bank.description" placeholder="请输入题库描述" />
            </view>
        </view>

        <view class="questions-list">
            <view class="list-header">
                <text class="title">题目列表</text>
                <view class="header-actions">
                    <button class="clear-btn" @click="showClearDialog">清空题目</button>
                    <button class="import-btn" @click="showImportDialog">批量导入</button>
                    <button class="add-btn" @click="addQuestion">添加题目</button>
                </view>
            </view>
            <view class="import-dialog" v-if="showImport">
                <view class="dialog-header">
                    <text class="dialog-title">批量导入题目</text>
                    <text class="dialog-desc">每行一个题目，格式：题目内容|答案|难度(easy/medium/hard)</text>
                </view>
                <textarea v-model="importText" :maxlength="-1" class="import-textarea" placeholder="示例：
Java中的访问修饰符有哪些？|public、protected、default、private|easy
什么是线程安全？|当多个线程访问同一个对象时，不需要进行额外的同步处理|medium" />
                <view class="dialog-actions">
                    <button class="cancel-btn" @click="cancelImport">取消</button>
                    <button class="confirm-btn" @click="confirmImport">确认导入</button>
                </view>
            </view>
            <view class="import-dialog" v-if="showClearConfirm">
                <view class="dialog-header">
                    <text class="dialog-title">确认清空</text>
                    <text class="dialog-desc">确定要清空所有题目吗？此操作不可恢复。</text>
                </view>
                <view class="dialog-actions">
                    <button class="cancel-btn" @click="cancelClear">取消</button>
                    <button class="confirm-btn" @click="confirmClear">确认清空</button>
                </view>
            </view>
            <view class="question-item" v-for="(question, index) in bank.questions" :key="index">
                <view class="question-header">
                    <text class="question-index">题目 {{ index + 1 }}</text>
                    <button class="delete-btn" @click="deleteQuestion(index)">删除</button>
                </view>
                <view class="form-item">
                    <text class="label">题目ID</text>
                    <input v-model="question.id" placeholder="请输入题目ID" />
                </view>
                <view class="form-item">
                    <text class="label">难度</text>
                    <picker @change="handleDifficultyChange($event, index)"
                        :value="difficultyIndex(question.difficulty)" :range="difficulties">
                        <view class="picker-value">{{ question.difficulty || '请选择难度' }}</view>
                    </picker>
                </view>
                <view class="form-item">
                    <text class="label">题目内容</text>
                    <textarea v-model="question.content" placeholder="请输入题目内容" />
                </view>
                <view class="form-item">
                    <text class="label">答案</text>
                    <textarea v-model="question.answer" placeholder="请输入答案" />
                </view>
            </view>
        </view>

        <view class="actions">
            <button class="primary-btn" @click="generateQRCode">生成二维码</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Question, QuestionBank } from '@/mock/questions'
import QRCode from 'qrcode'

const difficulties = ['easy', 'medium', 'hard']

const bank = ref<QuestionBank>({
    id: '',
    name: '',
    description: '',
    questions: []
})

const difficultyIndex = (difficulty: string) => {
    return difficulties.indexOf(difficulty)
}

const handleDifficultyChange = (e: any, index: number) => {
    bank.value.questions[index].difficulty = difficulties[e.detail.value] as 'easy' | 'medium' | 'hard'
}

const addQuestion = () => {
    bank.value.questions.push({
        id: '',
        content: '',
        difficulty: 'easy',
        category: bank.value.id,
        answer: ''
    })
}

const deleteQuestion = (index: number) => {
    bank.value.questions.splice(index, 1)
}

const generateQRCode = async () => {
    try {
        const qrData = JSON.stringify(bank.value)
        console.log(qrData)
        const qrImage = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'L' })

        // 创建一个临时的a标签来下载二维码图片
        const a = document.createElement('a')
        a.href = qrImage
        a.download = `${bank.value.id}-qrcode.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        uni.showToast({
            title: '二维码生成成功',
            icon: 'success'
        })
    } catch (error) {
        console.error('Failed to generate QR code:', error)
        uni.showToast({
            title: '二维码生成失败',
            icon: 'none'
        })
    }
}

const showImport = ref(false)
const importText = ref('')

const showImportDialog = () => {
    showImport.value = true
}

const cancelImport = () => {
    showImport.value = false
    importText.value = ''
}

const confirmImport = () => {
    const lines = importText.value.split('\n').filter(line => line.trim())

    lines.forEach(line => {
        const [content, answer, difficulty] = line.split('|').map(s => s.trim())
        if (content) {
            bank.value.questions.push({
                id: `${bank.value.id}-${bank.value.questions.length}`,
                content,
                answer: answer || '',
                difficulty: (difficulty || 'medium') as 'easy' | 'medium' | 'hard',
                category: bank.value.id
            })
        }
    })

    showImport.value = false
    importText.value = ''

    uni.showToast({
        title: '导入成功',
        icon: 'success'
    })
}
const showClearConfirm = ref(false)

const showClearDialog = () => {
    showClearConfirm.value = true
}

const cancelClear = () => {
    showClearConfirm.value = false
}

const confirmClear = () => {
    bank.value.questions = []
    showClearConfirm.value = false
    uni.showToast({
        title: '清空成功',
        icon: 'success'
    })
}
</script>

<style>
.container {
    padding: 20px;
}

.bank-info,
.questions-list {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}

.form-item {
    margin-bottom: 16px;
}

.label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
}

input,
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

textarea {
    height: 100px;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.title {
    font-size: 16px;
    font-weight: bold;
}

.add-btn,
.delete-btn {
    font-size: 14px;
    padding: 4px 12px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
}

.question-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.question-index {
    font-size: 16px;
    font-weight: bold;
}

.picker-value {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.actions {
    margin-top: 20px;
    text-align: center;
}

.primary-btn {
    background-color: #007aff;
    color: #fff;
    border: none;
    padding: 8px 24px;
    border-radius: 4px;
    font-size: 16px;
}

.header-actions {
    display: flex;
    gap: 8px;
}

.import-btn {
    font-size: 14px;
    padding: 4px 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
}

.import-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
}

.dialog-header {
    margin-bottom: 16px;
}

.dialog-title {
    display: block;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}

.dialog-desc {
    display: block;
    font-size: 14px;
    color: #666;
}

.import-textarea {
    width: 100%;
    height: 200px;
    margin-bottom: 16px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.cancel-btn {
    padding: 6px 16px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px;
    font-size: 14px;
}

.confirm-btn {
    padding: 6px 16px;
    background-color: #007aff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
}
</style>