<template>
	<view class="container">
		<cover-image src="../../static/authorize.png"></cover-image>
		<cover-view class="cover-view">
			<button class="btn1">点击授权</button>
		</cover-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.cover-view {
		position: absolute;
		display: flex;
		flex-direction: row;
		margin-top: 310rpx;
	}

	.container {
		background: #CCCCCC;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.btn1 {
		width: 506rpx;
		margin-top: 20rpx;
		background-color: #4bb0f7;
		color: #FFFFFF;
		height: 90rpx;
		border-radius: 45rpx;
		font-family: FingFangSC-Medium;
		font-size: 34rpx;
	}

	cover-image {
		width: 622rpx;
		height: 840rpx;
	}
</style>
