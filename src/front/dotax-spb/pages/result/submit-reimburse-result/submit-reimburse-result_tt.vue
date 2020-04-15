<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt spb-result-cont">
			<icon v-if="success" size="80" :type="iconcat" color="#25cb23"></icon>
			<icon v-if="!success" size="80" :type="iconcat" color="red"></icon>
			<text class="spb-result-subject">{{subject}}</text>
			<view class="spb-result-message">
				<block v-if="success">
					您提交的报销单<text class="high">{{recepit}}</text>已生成
					<view class="">请等待审核</view>
				</block>
				<block v-else>
					非常抱歉您的业务提交处理失败！
				</block>
			</view>
		</view>
		<view class="uni-padding-wrap spb-result-oprt">
			<navigator url="/pages/reimburse/detail/detail_tt" open-type="reLaunch">
				<button type="primary">继续报销</button>
			</navigator>
			<button type="default" @click="goHome">查看我的报销单</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				success: true,
				recepit: ''
			}
		},
		onLoad(option) {
			console.log('接收到页面参数..', option);
			let success = true;
			if (option.success != undefined) success = option.success;
			this.success = success;
			if (option.recepit != undefined) {
				this.recepit = option.recepit;
			}
		},
		computed: {
			iconcat: function() {
				return this.success ? 'success' : 'warn';
			},
			subject: function() {
				return this.success ? '提交成功' : '处理失败';
			}
		},
		methods: {
			goHome() {
				uni.switchTab({
					url: "/pages/tab-bar/reimburse/reimburse_tt",
					success() {
						let page = getCurrentPages().pop();
						//跳转页面成功之后           
						if (!page) return;
						page.onLoad(); //如果页面存在，则重新刷新页面	
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.high {
		color: #D0021B;
	}
	.spb-result-message {
		text-align: center;
	}
	button {
		height: 96rpx;
		line-height: 96rpx;
	}
	button[type="primary"] {
		background-color: #3D94FF;
	}
	button[type="default"] {
		background-color: #EFF0F1;
		color: #999;
	}
</style>
