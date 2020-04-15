<template>
	<view>
		<view class="uni-flex uni-column program-panel">
			<view class="uni-center">
				<image class="program-logo" src="../../../static/logo.png"></image>
			</view>
			<view class="uni-center">
				<text class="program-version">版本号{{version}}</text>
			</view>
		</view>
		<view class="spb-navi-item" @click="handleWebsite">
			<text class="spb-navi-text">官方网站：{{website}}</text>
		</view>
		<view class="spb-navi-item" @click="handleTelephone">
			<text class="spb-navi-text">服务电话：{{telephone}}</text>
		</view>
		<view class="uni-padding-wrap">
			<button type="default" class="operate-panel" @click="handleGoBack">返回</button>
		</view>
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

	.program-version {
		font-size: 20rpx;
	}

	.uni-padding-wrap {
		margin-top: 30rpx;
	}
</style>
