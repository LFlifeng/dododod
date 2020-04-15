<template>
	<view>
		<view class="list-head">
			<view class="head-item">
				<text class="prop-label">金额:</text>
				<text class="prop-value">&#165;{{fmtMoney(listData.amount)}}</text>
			</view>
			<view class="head-item">
				<text class="prop-label">张数:</text>
				<text class="prop-value">{{listData.invoiceQuantity}}</text>
			</view>
			<view class="head-item">
				<image class="filter" src="../../../static/icon-filter.png" @click="handleChooseFilter"></image>
			</view>
		</view>
		<scroll-view class="list-body" scroll-y="true">
			<block v-if="datanone">
				<view class="data-none">
					<icon type="warn" size="18" color="#BBBBBB"></icon>
					<text>没有筛选到符合条件的报销单据</text>
				</view>
			</block>
			<block v-else>
				<block v-for="(cate,gidx) in listData.allReimburseList" v-bind:key="cate.time">
					<view class="list-cate">
						<text>{{cate.time}}（{{cate.count}}张）</text>
						<text class="money">&#165;{{fmtMoney(cate.sumAmount)}}</text>
					</view>
					<block v-for="(item,index) in cate.items" v-bind:key="index">
						<uni-swipe-action>
							<uni-swipe-action-item :disabled="true" :options="swipeOptions" @click="handleSwipeClick($event,item.id)">
								<view class="list-item" v-bind:id="gidx+','+index+','+item.id" @click="handleItemHotspot">
									<view class="props-head">
										<view>
											<text class="genre">{{item.name}}</text>
										</view>
										<text class="money">&#165;{{fmtMoney(item.amount)}}</text>
									</view>
									<view class="props-item">
										<text>{{item.type}}</text>
									</view>
									<view class="props-foot">
										<text>提交时间：{{item.updateTime}}</text>
										<text class="zt">{{fmtReimburseStatus(item.checkState)}}</text>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</block>
				</block>
			</block>
		</scroll-view>
		<view class="spb-action-suspend">
			<image src="../../../static/bx/action-xzbx.png" @click="handleXzbxAction"></image>
		</view>
		<uni-popup ref="filter" type="top" @change="handleFilterPopupChange">
			<view class="filter-body">
				<scroll-view class="cond-section" scroll-y="true">
					<view class="cond-prop">
						<text>单据状态：</text>
					</view>
					<view class="tags-block">
						<block v-for="(item,index) in reimburseStatuses" v-bind:key="item.value">
							<view class="tag-item">
								<uni-tag :type="item.ttype" @click="handleFilterReimburseStatusTag(index)" :text="item.label"></uni-tag>
							</view>
						</block>
					</view>
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
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import uniTag from "@/components/uni-tag/uni-tag.vue";
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
	import {
		ActionXzbx
	} from '@/utils/actions.js';
	import {
		FmtReimburseStatus
	} from '@/common/spb.js';
	import {
		reimburseQueryReimburses
	} from '@/service/service.js';
	import store from '@/store/index.js';

	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			uniPopup,
			uniTag
		},
		data() {
			let deftListData = {
				amount: 0.0,
				invoiceQuantity: 0,
				allReimburseList: []
			};
			return {
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
		computed: {
			datanone: function() {
				return (this.listData.allReimburseList.length < 1);
			}
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
			this.queryReimburses();
		},
		// 下拉刷新列表
		onPullDownRefresh() {
			console.log('下拉刷新报销列表..');
			this.queryReimburses(function() {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
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
				this.queryReimburses();
				this.$refs.filter.close();
			},
			// 处理发票热区
			handleItemHotspot(e) {
				console.log('处理子项热区点击事件..', e);
				let ids = e.currentTarget.id.split(',');
				let gidx = ids[0];
				let iidx = ids[1];
				let iid = ids[2];
				uni.navigateTo({
					url: `../../reimburse/detail/detail?id=${iid}&biz=ck`
				});
			},
			// 处理新增报销
			handleXzbxAction() {
				ActionXzbx();
			},
			// 查询报销列表
			queryReimburses(callback) {
				let that = this;
				let arg = that.filter;
				let statuses = [];
				that.reimburseStatuses.forEach((item) => {
					if (item.slted) {
						statuses.push(item.value);
					}
				});
				arg.checkStates = statuses.join(',');
				console.log('请求查询报销列表..');
				reimburseQueryReimburses(arg).then((qrRes) => {
					console.log('查询报销列表结果..', qrRes);
					if (callback) callback();
					if (qrRes && qrRes.success) {
						if (qrRes.data) {
							let rdata = qrRes.data.data;
							that.listData = rdata;
						} else {
							that.listData = {
								allReimburseList: [],
								amount: 0,
								invoiceQuantity: 0
							};
						}
					}
				});
			},
			// 格式化报销状态
			fmtReimburseStatus(istatus) {
				return FmtReimburseStatus(istatus);
			},
			fmtMoney(money) {
				if (!money) return 0.00;
				return parseFloat(money).toFixed(2);
			}
		}
	}
</script>

<style lang="scss">
	.list-head {
		height: 88rpx;
		background-color: #FFFFFF;
		padding: 0rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

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
			height: 500rpx;
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
					height: 30rpx;
					line-height: 30rpx;
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
		position: absolute;
		bottom: 0rpx;
		top: 88rpx;
		left: 0rpx;
		right: 0rpx;
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
</style>
