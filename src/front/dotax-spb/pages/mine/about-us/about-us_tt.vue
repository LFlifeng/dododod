<template>
	<view>
		<view class="uni-flex uni-column program-panel">
			<view class="uni-center">
				<image class="program-logo" src="../../../static/logo.png"></image>
			</view>
			<view class="uni-center">
				<text class="program-version">收票宝</text>
				<text class="program-version">SPBao</text>
			</view>
			<view class="uni-center">
				<text class="program-version">SPBao</text>
				<text class="program-version">{{version}}</text>
			</view>
			<view class="uni-text">多啦收票宝，是北京多啦财税科技有限公司为企业员工或个人精心打造的一款集拍照收票、扫码收票、第三方平台收票、员工报销、往来对账收票、流程审批等多功能于一体的微信小程序。应用AI+OCR识别技术，基于发票查验接口，可大大提高收集日常票据的效率。对于增值税发票，通过自动查验，大大降低了个人及财务的收票风险。</view>
		</view>
		<view class="spb-navi-item" @click="handleWebsite">
			<text class="spb-navi-text">官网</text>
			<text class="spb-navi-text">{{website}}</text>
		</view>
		<view class="spb-navi-item" @click="handleTelephone">
			<text class="spb-navi-text">客服电话</text>
			<text class="spb-navi-text">{{telephone}}</text>
		</view>
		<!-- <view class="uni-padding-wrap">
			<button type="default" class="operate-panel" @click="handleGoBack">返回</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				website: 'www.dotax.cn',
				telephone: '400-608-0017',
				version: '1.0.0'
			};
		},
		onLoad() {

		},
		methods: {
			handleWebsite() {

			},
			handleTelephone() {
				uni.makePhoneCall({
					phoneNumber: this.telephone
				});
			},
			handleGoBack() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
	.program-panel {
		padding: 80rpx 0rpx 30rpx 0rpx;
		background-color: #FFFFFF;
		border-bottom: 1px solid #EEEEEE;
		margin-bottom: 30rpx;
	}

	.program-logo {
		width: 120rpx;
		height: 120rpx;
	}

	.uni-center .program-version {
		font-size: 34rpx;
	}
	.uni-center .program-version:last-child {
		margin-left: 10rpx;
	}

	.uni-padding-wrap {
		margin-top: 30rpx;
	}
	.spb-navi-text {
		font-size: 34rpx;
		display: inline-block;
		width: 20%;
	}
	.spb-navi-item .spb-navi-text:last-child {
		text-align: right;
		font-size: 30rpx;
		color: #999;
		display: inline-block;
		width: 80%;
	} 
	.uni-text {
		margin: 0 32rpx;
		text-indent: 60rpx;
		font-size: 24rpx;
		color: #999;
		margin-top: 24rpx;
	}
</style>
