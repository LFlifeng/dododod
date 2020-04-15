<template>
	<view class="content">
		<view class="item"><icon type="success" size="80" /></view>
		<view class="item tipsMsg">提交成功</view>
		<view class="item des">提交发票：{{ invCount }}份，请前往PC端查看</view>
		<view class="item"><button style="background-color: #FF7A08;" @click="handleContinue">继续收票</button></view>
		<view class="item"><button type="default" @click="handleGoHome">返回首页</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return { invCount: 0 };
	},
	methods: {
		handleContinue() {
			uni.redirectTo({
				url: '/pages/ticket/choose-image/choose-image?biz=dksp'
			});
		},
		handleGoHome() {
			uni.removeStorageSync('scanGrant');
			uni.switchTab({
				url: '/pages/tab-bar/home/home'
			});
		}
	},
	onLoad(option) {
		this.invCount = option.invCount;
	}
};
</script>

<style>
body {
	background-color: #ffffff;
}
.content {
	margin: 20rpx 10rpx;
	text-align: center;
	font-family: ‌FingFangSC_Regular;
	padding: 5rpx;
}
.content .item {
	margin-top: 20rpx;
	font-family: ‌FingFangSC_Regular;
}
.tipsMsg {
	font-size: 35rpx;
	font-family: ‌FingFangSC_Regular;
}

.item button{
	font-family: ‌FingFangSC_Regular;
}
</style>
