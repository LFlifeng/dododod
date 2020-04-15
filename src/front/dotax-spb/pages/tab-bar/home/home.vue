<template>
	<scroll-view scroll-y="true" class="home-body">
		<view class="home-banner">
			<image mode="widthFix" src="../../../static/sy/banner.jpg"></image>
		</view>
		<view class="action-section">
			<!-- #ifdef MP-TOUTIAO -->
			<view class="action-item" @click="handleWxfp">
				<image src=""></image>
				<text>飞书功能</text>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="action-item" @click="handleWxfp">
				<image src="/static/sy/action-wxpj.png"></image>
				<text>卡包收票</text>
			</view>
			<!-- #endif -->
			<view class="action-item" @click="handleSmsp">
				<image src="/static/sy/action-smsp.png"></image>
				<text>扫码收票</text>
			</view>
			<view class="action-item" @click="handleFpcy">
				<image src="/static/sy/action-fpcy.png"></image>
				<text>发票查验</text>
			</view>
			<view class="action-item" @click="handleDksp">
				<image src="/static/sy/action-dksp.png"></image>
				<text>抵扣收票</text>
			</view>
		</view>
		<view class="middle-entry">
			<image src="../../../static/sy/pzsp-entry.png" @click="handlePzsp"></image>
			<text>AI+OCR识别、查验，支持多票平铺混拍，自动价税分离</text>
		</view>
		<swiper class="swiper" :circular="true" vertical="true" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item>
				<view class="home-notify">
					<image src="../../../static/sy/notify.png"></image>
					<text @click="handleDshReceipt('Auditing')" class="spb-navi-text cont">您有 {{reimburse.auditingCount}} 张报销单状态为待审批</text>
					<text class="spb-navi-icon uni-icon icon">&#xe470;</text>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="home-notify">
					<image src="../../../static/sy/notify.png"></image>
					<text @click="handleDshReceipt('Rejected')" class="spb-navi-text cont">您有 {{reimburse.rejectedCount}} 张报销单状态为已驳回</text>
					<text class="spb-navi-icon uni-icon icon">&#xe470;</text>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="home-notify">
					<image src="../../../static/sy/notify.png"></image>
					<text @click="handleDshReceipt('WaitingTickets')" class="spb-navi-text cont">
						您有 {{reimburse.waitingTicketscount}} 张报销单状态为待收票</text>
					<text class="spb-navi-icon uni-icon icon">&#xe470;</text>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="home-notify">
					<image src="../../../static/sy/notify.png"></image>
					<text @click="handleDshReceipt('WaitingPayment')" class="spb-navi-text cont">
						您有 {{reimburse.waitingPaymentCount}} 张报销单状态为待付款</text>
					<text class="spb-navi-icon uni-icon icon">&#xe470;</text>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="home-notify">
					<image src="../../../static/sy/notify.png"></image>
					<text @click="handleDshReceipt('Paid')" class="spb-navi-text cont">
						您有 {{reimburse.paidCount}} 张报销单状态为已付款</text>
					<text class="spb-navi-icon uni-icon icon">&#xe470;</text>
				</view>
			</swiper-item>
		</swiper>
		<view class="bottom-entry">
			<image mode="widthFix" @click="handleXzbx" src="../../../static/sy/wybx-entry.png"></image>
		</view>
	</scroll-view>
</template>

<script>
	import {
		wechatSyncInvoice,
		indexQueryData
	} from '@/service/service.js';
	import {
		ActionPzsp,
		ActionSmcy,
		ActionWxfp,
		ActionXzbx,
		ActionJcdl,
		ActionDksp
	} from '@/utils/actions.js';
	import store from '@/store/index.js';

	export default {
		data() {
			return {
				// // 报销模块
				// reimburse: {
				// 	auditingCount: 0,
				// 	waitingTicketscount: 0,
				// 	waitingPaymentCount: 0,
				// 	paidCount: 0,
				// 	rejectedCount: 0
				// },
				autoplay: true,
				interval: 3000,
				duration: 1000
			};
		},
		onLoad() {
			let that = this;
			console.log('首页加载..');
			uni.$on('LOGIN_SUCCESS', function(data) {
				console.log('监听到【LOGIN_SUCCESS】事件..');
				that.queryData();
			});
		},
		onShow() {
			console.log('首页显示..');
			this.queryData();
		},
		// 下拉刷新信息
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
			console.log('下拉刷新首页信息..');
			this.queryData(function() {
				uni.stopPullDownRefresh();
			});
		},
		computed: {
			reimburse: function() {
				return store.state.home.reimburse;
			}
		},
		methods: {
			// 抵扣收票
			handleDksp() {
				console.log('抵扣收票..');
				ActionDksp();
			},
			// 微信发票
			handleWxfp() {
				console.log('点击了我');
				// #ifdef MP-WEIXIN
				console.log('微信发票..');
				// #endif
				// #ifdef MP-TOUTIAO
				console.log('飞书发票..');
				// #endif
				// ActionWxfp();
			},
			// 发票查验
			handleFpcy() {
				console.log('发票查验..');
				ActionSmcy();
			},
			// 扫码收票
			handleSmsp() {
				console.log('扫码收票..');
				ActionSmcy();
			},
			// 拍照识票
			handlePzsp() {
				console.log('拍照收票..');
				ActionPzsp();
			},
			// 新增报销
			handleXzbx() {
				console.log('新增报销..');
				ActionXzbx();
			},
			// 处理待审核的报销单据
			handleDshReceipt(audit) {
				console.log('跳转至待审核的报销单据..');
				let dl = ActionJcdl();
				if (!dl) {
					return;
				}
				store.state.reimburse.audit = audit;
				uni.switchTab({
					url: "../reimburse/reimburse",
					success() {
						let page = getCurrentPages().pop();
						//跳转页面成功之后           
						if (!page) return;
						page.onLoad(); //如果页面存在，则重新刷新页面	
					}
				});
			},
			queryData(callback) {
				let that = this;
				console.log('请求查询首页信息..');
				indexQueryData().then((qdRes) => {
					console.log('查询首页信息结果..', qdRes);
					if (callback) callback();
					if (qdRes && qdRes.success) {
						let rdata = qdRes.data;
						if (rdata) {
							let mdata = rdata.data;
							if (mdata) {
								store.state.home.reimburse = mdata;
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.home-body {
		display: flex;
		background-color: #FFFFFF;
	}

	.home-banner image {
		height: 360rpx;
		width: 100%;
		margin: 0rpx;
		z-index: 5;
	}

	/* 一般功能 */
	.action-section {
		position: relative;
		border: 2rpx solid #EEEEEE;
		border-radius: 10rpx;
		margin: -60rpx 30rpx 0rpx 30rpx;
		padding: 40rpx 0rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		z-index: 10;
		background-color: #FFFFFF;

		.action-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 24rpx;
			color: #333333;
		}

		image {
			width: 88rpx;
			height: 88rpx;
			margin-bottom: 14rpx;
			background-color: #FFFFFF;
		}
	}

	/* 中部入口 */
	.middle-entry {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		font-size: 20rpx;
		color: #666666;
		margin-top: 30rpx;
		padding-bottom: 40rpx;

		image {
			width: 230rpx;
			height: 230rpx;
			margin-bottom: 20rpx;
		}
	}

	/* 业务通知 */
	.home-notify {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0rpx 30rpx 20rpx 30rpx;
		padding: 0rpx 30rpx;
		height: 50rpx;
		background-color: #F4F4F4;

		image {
			width: 80rpx;
			height: 30rpx;
			margin-right: 50rpx;
		}

		.cont {
			font-size: 22rpx;
			color: #333333;
			letter-spacing: 3rpx;
		}

		.icon {
			font-size: 36rpx;
		}
	}

	.swiper {
		height: 50rpx;
		margin-bottom: 22rpx;
	}

	/* 底部入口 */
	.bottom-entry {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		margin: 0rpx 30rpx;

		image {
			width: 100%;
			height: 140rpx;
			margin-bottom: 30rpx;
		}
	}
</style>
