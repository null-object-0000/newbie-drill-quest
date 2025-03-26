<template>
    <view class="config-page">
        <view class="config-section">
            <text class="section-title">AI 配置</text>
            <view class="config-form">
                <view class="form-item">
                    <text class="label">API 地址</text>
                    <input class="input" type="text" v-model="config.baseURL" placeholder="请输入 API 地址" />
                </view>
                <view class="form-item">
                    <text class="label">API Key</text>
                    <input class="input" type="text" v-model="config.apiKey" placeholder="请输入 API Key" />
                </view>
                <view class="form-item">
                    <text class="label">模型</text>
                    <input class="input" type="text" v-model="config.model" placeholder="请输入模型名称" />
                </view>
                <view class="form-item">
                    <text class="label">温度</text>
                    <slider class="slider" :value="config.temperature" @change="handleTemperatureChange" :min="0" :max="2"
                        :step="0.1" show-value />
                </view>
                <view class="button-group">
                    <button class="save-btn" @click="handleSave">保存配置</button>
                    <button class="reset-btn" @click="handleReset">重置默认</button>
                </view>
            </view>
        </view>

        <view class="config-section">
            <text class="section-title">挑战管理</text>
            <view class="config-form">
                <button class="clear-btn" @click="handleClearRecords">清空练习记录</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentConfig, saveAIConfig, resetAIConfig, loadConfig, clearEvaluationRecords } from '@/store/config'

const config = ref({
    baseURL: currentConfig.value.baseURL,
    apiKey: currentConfig.value.apiKey,
    model: currentConfig.value.model,
    temperature: currentConfig.value.temperature
})

const handleSave = () => {
    saveAIConfig(config.value)
    uni.showToast({
        title: '配置已保存',
        icon: 'success'
    })
}

const handleReset = () => {
    resetAIConfig()
    config.value = { ...currentConfig.value }
    uni.showToast({
        title: '已重置为默认配置',
        icon: 'success'
    })
}

const handleTemperatureChange = (e: any) => {
    config.value.temperature = e.detail.value
}

const handleClearRecords = () => {
    uni.showModal({
        title: '确认清空',
        content: '确定要清空所有练习记录吗？此操作不可恢复。',
        success: (res) => {
            if (res.confirm) {
                clearEvaluationRecords()
                uni.showToast({
                    title: '记录已清空',
                    icon: 'success'
                })
            }
        }
    })
}

onMounted(() => {
    loadConfig()
    config.value = { ...currentConfig.value }
})
</script>

<style>
.config-page {
    padding: 20px;
    background-color: #f8f8f8;
    box-sizing: border-box;
    overflow: hidden;
}

.config-section {
    margin-bottom: 20px;
}

.section-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    display: block;
}

/* #ifdef H5 */
.config-page {
  height: 100%;
}

/* #endif */

/* #ifdef MP-WEIXIN */
.config-page {
  height: 100vh;
}

/* #endif */

.config-form {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    width: 100%;
}

.form-item {
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
}

.form-item .input {
    width: 100%;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 12px;
    font-size: 14px;
    box-sizing: border-box;
}

.form-item .slider {
    margin: 15px 0;
}

.form-item .label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
}

.button-group {
    display: flex;
    gap: 15px;
    margin-top: 30px;

}


.button-group button {
    flex: 1;
    height: 40px;
    border-radius: 4px;
    font-size: 14px;
}

.button-group .save-btn {
    background-color: #007aff;
    color: #fff;
}

.button-group .reset-btn {
    background-color: #FF3B30;
    color: #fff;
}

.button-group .clear-btn {
    background-color: #FF9500;
    color: #fff;
}
</style>