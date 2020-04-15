<template>
	<scroll-view scroll-y="true" class="home-body">
		<!-- <image id="home_icon_icon" src="../../../static/home_icon_icon.png" mode=""></image> -->
		<view class="home-banner">
			<image mode="widthFix" src="../../../static/sy/home_banner_3x.jpg"></image>
		</view>
		<!-- 一般功能 -->
		<view class="home_cont">
			<view class="home">
				<view class="home_icon cy" @click="handleFpcy()">
					<image src="../../../static/sy/home_icon_chayan@3x.png" mode=""></image>
					<view class="home_text">扫码收票</view>
				</view>
				<view class="home_icon sp" @click="handlePzsp()">
					<image src="../../../static/sy/home_icon_photograph@3x.png" mode=""></image>
					<view class="home_text">拍照收票</view>
				</view>
			</view>
			<view class="home">
				<view class="home_icon pj" @click="handleWallet()">
					<image src="../../../static/sy/home_icon_piaojia@3x.png" mode=""></image>
					<view class="home_text">票夹</view>
				</view>
				<view class="home_icon dd" @click="handleDD()">
					<image src="../../../static/sy/home_icon_didi@3x.png" mode=""></image>
					<view class="home_text">滴滴</view>
				</view>
			</view>
		</view>

		<!-- 发票抬头 -->
		<view class="tt_info">
			<view class="tt_title" @click="handleTinvoice()">发票抬头</view>
			<view class="info" v-if="!isRise">
				<view class="tt_cont">
					<view class="cont" v-for="(item,index) in rise" :key="index" @click="handleRiseDetail(index)">
						<view class="cont_title">{{item.title}}</view>
						<view class="cont_code">税号：{{item.companyTaxNo}}</view>
					</view>
					<view class="copy" @click="copyRiseInfo">复制</view>
				</view>
				<view class="more" @click="handleTinvoice()">
					查看更多
				</view>
			</view>
			<view class="info_add" v-else>
				<view class="add" @click="handleAddInvoice">立即添加</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		wechatSyncInvoice,
		indexQueryData,
		getRiseInfo
		// copyRiseInfo
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
				duration: 1000,
				isRise: true,
				rise: []
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
			
			this.showRiseInfo(); //获取抬头
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
			},
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			// 进入抬头详情
			handleRiseDetail(index) {
				let rise_data = this.rise[index];
				rise_data = JSON.stringify(rise_data);
				console.log(this.rise[index])
				uni.navigateTo({
					url: '../../rise/invoice-detail_tt?rise_data=' + rise_data
				});
			},
			// 新增抬头
			handleAddInvoice() {
				let dl = ActionJcdl();
				if (!dl) {
					return;
				}
				uni.navigateTo({
					url: '../../rise/invoice-add_tt'
				})
			},
			//复制功能
			copyRiseInfo() {
				let info = this.rise[0];
				let str = info.title + '\n' + info.companyTaxNo;
				uni.setClipboardData({
					data: str,
					success: function() {
						// console.log('success');
						uni.showToast({
							title: "已复制到剪切板",
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			//获取抬头
			showRiseInfo() {
				let dl = ActionJcdl();
				if (!dl) {
					return;
				}
				getRiseInfo().then((res) => {
					// console.log(res);
					if (res.statusCode === 1) {
						this.rise = res.data.slice(0, 1);
						// console.log(this.rise)
						if(this.rise.length > 0) {
							console.log(this.rise)
							this.isRise = false;
						} else {
							this.isRise = true;
						}
					}
				})
			},
			//跳转更多抬头
			handleRise() {
				let dl = ActionJcdl();
				if (!dl) {
					return;
				}
				uni.navigateTo({
					url: `../../rise/invoice-rise_tt`
				})
			},
			//滴滴跳转 
			handleDD() {
				let dl = ActionJcdl();
				if (!dl) {
					return;
				}
				uni.navigateTo({
					url: `../../dd/dd`
				});
			},
			//票夹跳转
			handleWallet() {
				let dl = ActionJcdl();
				if (!dl) {
					return;
				}
				uni.navigateTo({
					url: '../ticket/ticket_tt'
				});
			},
			//跳转发票抬头
			handleTinvoice() {
				uni.navigateTo({
					url: '../../rise/invoice-rise_tt'
				});
			},
			// 抵扣收票
			handleDksp() {
				console.log('抵扣收票..');
				ActionDksp();
			},
			// 微信发票
			handleWxfp() {
				console.log('微信发票..');
				ActionWxfp();
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
			// handlePzsp() {
			// 	console.log('拍照收票..');
			// 	ActionPzsp();
			// },
			//拍照收票
			handlePzsp() {
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
		background-color: #f4f4f4;
		padding-bottom: 20upx;
	}

	#home_icon_icon {
		width: 56upx;
		height: 48upx;
		position: fixed;
		top: 20upx;
		left: 24upx;
		z-index: 100000;
	}

	.home-banner {
		height: 360upx;
		width: 100%;
	}

	.home-banner image {
		height: 100%;
		width: 100%;
		margin: 0upx;
		z-index: 5;
	}

	/* 一般功能 */
	.home_cont {
		background-color: #fff;
	}

	.home {
		display: flex;
		justify-items: center;
		justify-content: center;
	}

	.home_icon {
		width: 328upx;
		height: 188upx;
		text-align: center;
		border-radius: 8upx;
		margin-top: 40upx;
	}

	.cy {
		background-color: #f0f7ff;
		margin-right: 30upx;
	}

	.sp {
		background-color: #f3f3ff;
	}

	.pj {
		background-color: #fdf4e8;
		margin-right: 30upx;
		margin-bottom: 40upx;
	}

	.dd {
		background-color: #fdefed;
		margin-bottom: 40upx;
	}

	.home_icon .home_text {
		color: #666;
		font-size: 28upx;
		text-align: center;
	}

	.home_icon image {
		width: 96upx;
		height: 96upx;
		margin-top: 24upx;
	}

	/* 发票抬头 */
	.info {
		display: block;
	}

	.tt_info {
		margin-top: 20upx;
		// margin-bottom: 96upx;
		background-color: #fff;
	}

	.tt_title {
		width: 100%;
		height: 96upx;
		line-height: 96upx;
		margin-left: 32upx;
		font-size: 32upx;
	}

	.tt_cont {
		width: 688upx;
		height: 128upx;
		background-color: #f4f4f4;
		margin-left: 32upx;
		border-radius: 8upx;
		clear: both;
	}

	.cont {
		float: left;
		margin-left: 24upx;
	}

	.cont .cont_title {
		font-size: 28upx;
		color: #666;
		margin-top: 24upx;
	}

	.cont .cont_code {
		font-size: 24upx;
		color: #999;
		margin-top: 8upx;
	}

	.copy {
		float: right;
		width: 140upx;
		height: 60upx;
		background-image: repeating-linear-gradient(to right, #3D94FF 50%, #2782F3 50%);
		font-size: 28upx;
		color: #fff;
		line-height: 60upx;
		text-align: center;
		border-radius: 30upx;
		margin-right: 24upx;
		margin-top: 38upx;
	}

	.more {
		font-size: 24upx;
		color: #666;
		width: 100%;
		height: 88upx;
		line-height: 88upx;
		text-align: center;
		border-top: 1upx solid #d8d8d8;
		margin-top: 40upx;
	}

	/* 立即添加 */
	.info_add {
		width: 100%;
		height: 200upx;
		margin-top: 28upx;
	}

	.add {
		width: 350upx;
		height: 72upx;
		font-size: 28upx;
		color: #999;
		line-height: 72upx;
		text-align: center;
		border: 2upx solid #ccc;
		border-radius: 36upx;
		margin: 0 auto;
	}
</style>
