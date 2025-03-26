<template>
  <view class="container">
    <view class="user-info">
      <image class="avatar" src="/static/logo.png" />
      <view class="info">
        <text class="nickname">用户昵称</text>
        <text class="stats">已完成挑战: 0</text>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" @click="handleNavigateToRecords">
        <text class="menu-text">练习记录</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item">
        <text class="menu-text">收藏题目</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="handleNavigateToConfig">
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleNavigateToConfig = () => {
  uni.navigateTo({
    url: '/pages/profile/config'
  })
}

const handleNavigateToRecords = () => {
  uni.navigateTo({
    url: '/pages/profile/records'
  }) 
}
</script>

<style>
.container {
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* #ifdef WEB */
.container {
  height: 100%;
}

/* #endif */

/* #ifndef WEB */
.container {
  height: 100vh;
}

/* #endif */

.user-info {
  display: flex;
  align-items: center;
  padding: 40rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 30rpx;
}

.info {
  flex: 1;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.stats {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.menu-list {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 32rpx;
  color: #333;
}

.menu-arrow {
  color: #999;
  font-size: 32rpx;
}
</style>