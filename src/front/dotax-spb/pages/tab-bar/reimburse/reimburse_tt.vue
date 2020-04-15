<template>
	<view>
		<ms-tabs :list="list2" v-model="active"></ms-tabs>
		<view class="list-head">
			<view class="head-item">
				<text class="prop-label">金额:</text>
				<text class="prop-value">&#165;{{fmtMoney(csMoney)}}</text>
				<text class="prop-label bxzs">张数:</text>
				<text class="prop-value">{{sp.length}}</text>
			</view>
			<view class="head-item">
				<image class="filter" src="../../../static/icon-filter.png" @click="handleChooseFilter"></image>
			</view>
		</view>
		<scroll-view class="list-body" scroll-y="true">
			<view v-if="sp.length < 1">
				<view class="data-none">
					<icon type="warn" size="18" color="#BBBBBB"></icon>
					<text>没有筛选到符合条件的报销单据</text>
				</view>
			</view>
			<view v-else>
				<view v-for="(item,index) in sp" v-bind:key="index">
					<!-- <view class="list-cate">
						<text>（张）</text>
						<text class="money">&#165;</text>
					</view> -->
					<view>
						<uni-swipe-action>
							<uni-swipe-action-item :disabled="true" :options="swipeOptions" @click="handleSwipeClick($event,item.id)">
								<view class="list-item" @click="handleItemHotspot(item.reimbursementId)">
									<view class="props-head">
										<view>
											<text class="genre">{{item.subject}}</text>
										</view>
										<text class="name_money">&#165;{{item.reimburseAmount}}</text>
									</view>
									<view class="props-item">
										<text>{{item.description}}</text>
									</view>
									<view class="props-foot">
										<text>提交时间：{{item.actionTime | formatDate}}</text>
										<text class="zt" v-html="fmtReimburseStatus(item.approvalStatus)"></text>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="spb-action-suspend">
			<image src="../../../static/bx/action-xzbx.png" @click="handleXzbxAction"></image>
		</view>
		<uni-popup ref="filter" type="top" @change="handleFilterPopupChange">
			<view class="filter-body">
				<scroll-view class="cond-section" scroll-y="true">
					<!-- <view class="cond-prop">
						<text>单据状态：</text>
					</view>
					<view class="tags-block">
						<block v-for="(item,index) in reimburseStatuses" v-bind:key="item.value">
							<view class="tag-item">
								<uni-tag :type="item.ttype" @click="handleFilterReimburseStatusTag(index)" :text="item.label"></uni-tag>
							</view>
						</block>
					</view> -->
					<view class="cond-prop">
						<text>提交时间：</text>
					</view>
					<view class="date-block">
						<picker mode="date" @change="handleStartTime">
							<view class="uni-input">{{filter.invoiceStartTime}}</view>
						</picker>
						<text>~</text>
						<picker mode="date" @change="handleEndTime">
							<view class="uni-input">{{filter.invoiceEndTime}}</view>
						</picker>
					</view>
				</scroll-view>
				<view class="oprt-section">
					<button type="default" @click="handleFilterReset">重置</button>
					<button type="primary" @click="handleFilterQuery">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import mTabs from '@/components/ms-tabs/ms-tabs';
	// import sTabs from '@/components/s-tabs';
	// import sTab from '@/components/s-tab';
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import uniTag from "@/components/uni-tag/uni-tag.vue";
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
	import {
		ActionXzbx
	} from '@/utils/actions.js';
	import {
		FmtReimburseColorStatus
	} from '@/common/spb.js';
	import {
		reimburseQueryReimburses,
		dspReimburse,
		yspReimburse,
		csMeReimburse,
		meDoReimburse
	} from '@/service/service.js';
	import store from '@/store/index.js';

	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			uniPopup,
			// sTabs,
			// sTab,
			mTabs
		},
		data() {
			let deftListData = {
				amount: 0.0,
				invoiceQuantity: 0,
				allReimburseList: []
			};
			return {
				list2: [{
					title: '待审批'
				}, {
					title: '已审批'
				}, {
					title: '抄送我'
				}, {
					title: '已发起'
				}],
				active: 0,
				sp: [],
				csMoney: 0,
				filter: {
					invoiceStartTime: "",
					invoiceEndTime: ""
				},
				reimburseStatuses: [{
						value: 'Auditing',
						label: '待审批',
						ttype: 'default'
					},
					{
						value: 'Rejected',
						label: '已驳回',
						ttype: 'default'
					},
					{
						value: 'WaitingTickets',
						label: '待收票',
						ttype: 'default'
					},
					{
						value: 'WaitingPayment',
						label: '待付款',
						ttype: 'default'
					},
					{
						value: 'Paid',
						label: '已付款',
						ttype: 'default'
					}
				],
				listData: deftListData,
				swipeOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#DD524D'
					}
				}]
			};
		},
		filters: {
			// 时间处理
			formatDate: function(value) {
				let date = new Date(value);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '.' + MM + '.' + d;
			}
		},
		watch: {
			active() {
				let that = this;
				that.csMoney = 0;
				if(this.active == 0) {
					that.dspReimburse();
				} else if(this.active == 1) {
					that.yspReimburse();
				}else if(this.active == 2) {
					that.csMeReimburse()
				}else if(this.active == 3) {
					that.meDoReimburse();
				}
			}
		},
		computed: {

		},
		onLoad() {
			if (store.state.reimburse.audit) {
				this.reimburseStatuses.forEach((item) => {
					if (item.value == store.state.reimburse.audit) {
						item.slted = true;
						item.ttype = 'primary';
					} else {
						item.slted = false;
						item.ttype = 'default';
					}
				});
				store.state.reimburse.audit = '';
			}
		},
		// 下拉刷新列表
		onPullDownRefresh() {
			console.log('下拉刷新报销列表..');
			this.queryReimburses(function() {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
			dspReimburse(){
				let that = this;
				let userId = store.state.userInfo.userId;
				dspReimburse({
					filter: {
						source: "MP-FEISHU",
						userId: userId
					},
					aging: {
						total: 1,
						size: 10,
						current: 1
					}
				}).then((dspRes) => {
					console.log(1111, dspRes)
					if (dspRes.success) {
						that.sp = dspRes.data.records;
						that.sp.map((ev) => {
							console.log(ev)
							that.csMoney += ev.reimburseAmount
						})
					}
				});
			},
			yspReimburse(){
				let that = this;
				let userId = store.state.userInfo.userId;
				yspReimburse({
					filter: {
						source: "MP-FEISHU",
						userId: userId
					},
					aging: {
						total: 1,
						size: 10,
						current: 1
					}
				}).then((yspRes) => {
					console.log(1111, yspRes)
					if (yspRes.success) {
						that.sp = yspRes.data.records;
						that.sp.map((ev) => {
							console.log(ev)
							that.csMoney += ev.reimburseAmount
						})
					}
				});
			},
			csMeReimburse(){
				let that = this;
				let userId = store.state.userInfo.userId;
				csMeReimburse({
					filter: {
						source: "MP-FEISHU",
						userId: userId
					},
					aging: {
						total: 1,
						size: 10,
						current: 1
					}
				}).then((cspRes) => {
					console.log(1111, cspRes)
					if (cspRes.success) {
						that.sp = cspRes.data.records;
						that.sp.map((ev) => {
							console.log(ev)
							that.csMoney += ev.reimburseAmount
						})
					}
				});
			},
			meDoReimburse(){
				let that = this;
				let userId = store.state.userInfo.userId;
				meDoReimburse({
					filter: {
						source: "MP-FEISHU",
						userId: userId
					},
					aging: {
						total: 1,
						size: 10,
						current: 1
					}
				}).then((mspRes) => {
					console.log(1111, mspRes)
					if (mspRes.success) {
						that.sp = mspRes.data.records;
						that.sp.map((ev) => {
							that.csMoney += ev.reimburseAmount
						})
					}
				});
			},
			handleStartTime(event) {
				this.filter.invoiceStartTime = event.detail.value;
				console.log("开始时间：" + this.filter.invoiceStartTime)
			},
			handleEndTime(event) {
				this.filter.invoiceEndTime = event.detail.value;
				console.log("结束时间：" + this.filter.invoiceEndTime)
			},
			// 弹出筛选窗口
			handleChooseFilter() {
				this.$refs.filter.open();
			},
			// 筛选条件显隐
			handleFilterPopupChange(e) {
				let args = {
					animation: true
				};
				if (e.show) {
					uni.hideTabBar(args);
				} else {
					uni.showTabBar(args);
				}
			},
			// 重置过滤条件
			handleFilterReset() {
				console.log('重置过滤条件..');
				this.filter = {
					invoiceStartTime: "",
					invoiceEndTime: ""
				};
				this.reimburseStatuses.forEach((item, idx) => {
					if (item.slted) {
						this.handleFilterReimburseStatusTag(idx);
					}
				});
			},
			// 过滤报销状态
			handleFilterReimburseStatusTag(idx) {
				console.log('选择过滤报销状态标签..', idx);
				let itype = this.reimburseStatuses[idx];
				itype.slted = !itype.slted;
				itype.ttype = itype.slted ? 'primary' : 'default';
			},
			// 确认过滤查询
			handleFilterQuery() {
				console.log('确认过滤查询..');
				// this.queryReimburses();
				this.active();
				this.$refs.filter.close();
			},
			// 处理发票热区
			handleItemHotspot(id) {
				// console.log('处理子项热区点击事件..', e);
				// let ids = id;
				uni.navigateTo({
					url: `../../reimburse/detail/detail_tt?biz=ck&id=` + id
				});
			},
			// 处理新增报销
			handleXzbxAction() {
				ActionXzbx();
			},
			// 格式化报销状态
			fmtReimburseStatus(istatusColor) {
				const colorStatus = FmtReimburseColorStatus(istatusColor);
				return "<text style='color:" + colorStatus.color + "'>" + colorStatus.label + "</text>";
			},
			//格式化金额
			fmtMoney(money) {
				if (!money) return 0.00;
				return parseFloat(money).toFixed(2);//保留两位小数
			}
		}
	}
</script>

<style lang="scss">
	// .s-tabs-nav-wrap .s-tab-nav-view {
	// 	background-color: #fff !important;
	// }

	.Tabs-Page {
		.article {
			&:not(:first-child) {
				margin-top: 40rpx;
			}

			.title {
				padding: 20rpx;
				font-size: 28rpx;
				text-align: center;
			}

			.desc {
				padding: 0 40rpx;
				font-size: 26rpx;
			}
		}

		/deep/.s-tabs {
			.s-tab-panel {
				padding: 30rpx;
			}
		}

		.custom-tabs {
			/deep/.s-tab-nav-view {
				display: flex;
				justify-content: center;

				.s-tab-nav {
					&:not(:first-child) {
						margin-left: 40rpx;
					}
				}
			}
		}
	}

	.list-head {
		height: 88rpx;
		background-color: #FFFFFF;
		padding: 0rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8rpx;

		.head-item {
			font-size: 26rpx;
			display: flex;
			align-items: center;

			.prop-label {
				color: #999999;
				margin-right: 6rpx;
			}

			.prop-value {
				color: #FF6908;
			}

			.filter {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.filter-body {
		background-color: #FFFFFF;
		font-size: 24rpx;

		.cond-section {
			height: 160rpx;
			display: flex;

			.cond-prop {
				display: flex;
				align-items: center;
				height: 60rpx;
				background-color: #F4F4F4;
				color: #666666;
				padding: 0rpx 30rpx;
			}

			.tags-block {
				display: flex;
				justify-content: space-between;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 30rpx 40rpx 10rpx 40rpx;

				.tag-item {
					width: 48%;
					margin-bottom: 20rpx;

					view {
						height: 60rpx;
						line-height: 60rpx;
					}

					text {
						letter-spacing: 1rpx;
					}

					.uni-tag--default {
						font-size: 25rpx;
					}

					.uni-tag {
						padding: 0rpx;
					}
				}
			}

			.date-block {
				display: flex;
				justify-content: space-around;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 30rpx 30rpx 10rpx 30rpx;

				picker {
					width: 45%;
				}

				.uni-input {
					background-color: #F4F4F4;
					border-radius: 5rpx;
					border: 1rpx solid #F4F4F4;
					text-align: center;
					height: 50rpx;
					line-height: 50rpx;
					color: #555555;
				}
			}
		}

		.oprt-section {
			display: flex;
			justify-content: space-around;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 30rpx 30rpx;

			button {
				width: 45%;
			}
		}
	}

	.list-body {
		// position: absolute;
		// bottom: 0rpx;
		// top: 88rpx;
		// left: 0rpx;
		// right: 0rpx;
		// margin-bottom: 100rpx;
		padding-top: 0rpx;
		padding-right: 0rpx;
		padding-left: 0rpx;
		background-color: #F4F4F4;
		letter-spacing: 1rpx;

		.data-none {
			display: flex;
			height: 100rpx;
			justify-content: center;
			align-items: center;
			color: #BBBBBB;

			icon {
				margin-right: 10rpx;
			}
		}

		.list-cate {
			padding: 0rpx 30rpx;
			background-color: #F4F4F4;
			height: 80rpx;
			font-size: 24rpx;
			color: #666666;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.money {
				color: #D90202;
				font-weight: 500;
			}
		}

		.list-item {
			padding: 10rpx 30rpx 30rpx 30rpx;
			border-bottom: 1rpx solid #EEEEEE;
			background-color: #FFFFFF;
			width: 100%;

			.props-head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #333333;
				height: 80rpx;

				.genre {
					font-size: 26rpx;
				}

				.money {
					font-size: 28rpx;
				}
			}

			.props-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 22rpx;
				color: #666666;
				height: 60rpx;
			}

			.props-foot {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 22rpx;
				color: #999999;

				.zt {
					color: #1BA2E7;
					font-size: 26rpx;
					font-weight: 500;
				}
			}
		}
	}

	.money,
	.prop-value {
		color: #b60000 !important;
	}

	.bxzs {
		margin-left: 40rpx;
	}

	.prop-value {
		margin-left: 8rpx;
	}

	.head-item,
	.list-body .list-item .props-head .genre {
		font-size: 28rpx !important;
	}

	.name_money {
		color: #333;
	}

	.zt {
		color: #3d94ff;
	}
</style>
