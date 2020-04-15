
<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt spb-result-cont">
			<icon v-if="success" size="80" :type="iconcat" color="#25cb23"></icon>
			<icon v-if="!success" size="80" :type="iconcat" color="red"></icon>
			<text class="spb-result-subject">{{subject}}</text>
			<!-- <text class="spb-result-message" v-html="message">{{message}}</text> -->
			<text class="spb-result-message" v-if="success">当前成功提交发票<text class="num">{{invCount}}</text>份，发票已自动进入票夹</text>
			<text class="spb-result-message" v-else>非常抱歉您的业务提交处理失败！</text>
		</view>
		<view class="uni-padding-wrap spb-result-oprt">
			<navigator url="/pages/tab-bar/reimburse/reimburse_tt" open-type="switchTab">
				<button type="primary">立即报销</button>
			</navigator>
			<navigator url="/pages/ticket/choose-image/choose-image_tt">
				<button type="default">继续收票</button>
			</navigator>
			<navigator url="/pages/tab-bar/home/home_tt" open-type="switchTab">
				<button type="default">返回首页</button>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				success: true,
				invCount: 0,
			}
		},
		onLoad(option) {
			let success = true;
			if (option.success != undefined) success = option.success;
			console.log('receive success value', success);
			this.success = success;
			this.invCount = option.invCount;
		},
		computed: {
			iconcat: function() {
				return this.success ? 'success' : 'warn';
			},
			subject: function() {
				return this.success ? '提交成功' : '处理失败';
			},
			message: function() {
				return this.success ? `当前成功提交发票<text class="num">`+this.invCount+`</text>份，发票已自动进入票夹`: '非常抱歉您的业务提交处理失败！';
			}
		},
		methods: {

		}
	}
</script>

<style>
	.spb-result-message .num {
		color: #b60000;
		
		margin: 0 10rpx;
	}
	uni-button[type=default] {
		color: #999;
		font-size: 32rpx;
		background-color: #eff0f1;
		border-radius: 8rpx;
		border: none;
	}
	uni-button[type=primary] {
		color: #fff;
		font-size: 32rpx;
		background-color: #3d94ff;
		border-radius: 8rpx;
		border: none;
	}
</style>
