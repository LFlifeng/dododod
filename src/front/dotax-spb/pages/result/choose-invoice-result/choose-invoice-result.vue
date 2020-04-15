<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt spb-result-cont">
			<icon v-if="success" size="80" :type="iconcat"></icon>
			<icon v-if="!success" size="80" :type="iconcat"></icon>
			<text class="spb-result-subject">{{subject}}</text>
			<text class="spb-result-message">{{message}}</text>
		</view>
		<view class="uni-padding-wrap spb-result-oprt">
			<navigator url="/pages/tab-bar/ticket/ticket" open-type="switchTab">
				<button type="primary">进入票夹</button>
			</navigator>
			<navigator url="/pages/tab-bar/home/home" open-type="switchTab">
				<button type="default">返回首页</button>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				success: true
			}
		},
		onLoad(option) {
			let success = true;
			if (option.success != undefined) success = option.success;
			console.log('receive success value', success);
			this.success = success;
		},
		computed: {
			iconcat: function() {
				return this.success ? 'success' : 'warn';
			},
			subject: function() {
				return this.success ? '提交成功' : '处理失败';
			},
			message: function() {
				return this.success ? '您选择的发票预计在5分钟内同步至收票宝。' : '非常抱歉您的业务提交处理失败！';
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
