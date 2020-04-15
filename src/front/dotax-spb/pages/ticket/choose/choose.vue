<template>
	<view>
		<view class="list-head">
			<view class="head-item">
				<text class="prop-label">金额:</text>
				<text class="prop-value">&#165;{{invoiceData.amount}}</text>
			</view>
			<view class="head-item">
				<text class="prop-label">税额:</text>
				<text class="prop-value">&#165;{{invoiceData.taxAmount}}</text>
			</view>
			<view class="head-item">
				<text class="prop-label">张数:</text>
				<text class="prop-value">{{invoiceData.invoiceQuantity}}</text>
			</view>
			<view v-if="biz!='xz'" class="head-item">
				<image class="filter" src="../../../static/icon-filter.png" @click="handleChooseFilter"></image>
			</view>
		</view>
		<scroll-view class="list-body" v-bind:class="{'list-body-xz':(biz=='xz')}" scroll-y="true">
			<block v-if="datanone">
				<view class="data-none">
					<icon type="warn" size="18" color="#BBBBBB"></icon>
					<text>没有筛选到符合条件的发票数据</text>
				</view>
			</block>
			<block v-else>
				<block v-for="(cate,gidx) in invoiceData.allTicketList" v-bind:key="cate.time">
					<view class="list-cate">
						<text>{{cate.time}}（{{cate.count}}张）</text>
						<text class="money">&#165;{{cate.sumAmount}}</text>
					</view>
					<block v-for="(item,index) in cate.items" v-bind:key="index">
						<uni-swipe-action>
							<uni-swipe-action-item :disabled="biz!='gl'" :options="swipeOptions" @click="handleSwipeClick($event,item.id)">
								<view class="list-item" v-bind:id="gidx+','+index+','+item.id" @click="handleInvoiceHotspot">
									<view class="props-head">
										<view>
											<checkbox v-if="biz=='xz'" :value="item.id" v-bind:disabled="item.disabled" v-bind:checked="item.checked" />
											<text class="genre">{{fmtInvoiceType(item.invoiceType)}}</text>
										</view>
										<text class="money">&#165;{{item.amount}}</text>
									</view>
									<view class="props-item" v-if="isShowSaler(item.invoiceType)">
										<text>{{item.companyName}}</text>
										<text :class="'cy-'+item.checkState">{{fmtInvoiceVerifyStatus(item.checkState)}}</text>
									</view>
									<view class="props-item" v-if="isShowCity(item.invoiceType)">
										<text>城市：{{item.city}}</text>
									</view>
									<view class="props-item" v-if="isShowJourney(item.invoiceType)">
										<text>{{item.departure}}-{{item.destination}}</text>
									</view>
									<view class="props-foot">
										<text>提交时间：{{item.invoiceTime}}</text>
										<text>税额：&#165;{{item.taxAmount}}</text>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</block>
				</block>
			</block>
		</scroll-view>
		<view v-if="biz=='xz'" class="foot-section">
			<view class="foot-content">
				<text class="zs">合计票据：{{chosenInvoice.count}}</text>
				<text class="je">合计金额：&#165;{{chosenInvoice.amount}}</text>
				<button @click="handleChooseInvoicesSubmit" class="an" size="mini" type="primary">选好了</button>
			</view>
		</view>
		<view v-if="biz=='gl'" class="spb-action-suspend">
			<image src="../../../static/pj/action-pzsp.png" @click="handlePzspAction"></image>
		</view>
		<uni-popup ref="filter" type="top" @change="handleFilterPopupChange">
			<view class="filter-body">
				<scroll-view class="cond-section" scroll-y="true">
					<view class="cond-prop">
						<text>发票类型：</text>
					</view>
					<view class="tags-block">
						<block v-for="(item,index) in invoiceTypes" v-bind:key="item.value">
							<view class="tag-item">
								<uni-tag :type="item.ttype" @click="handleFilterInvoiceTypeTag(index)" :text="item.label"></uni-tag>
							</view>
						</block>
					</view>
					<view class="cond-prop">
						<text>收票时间：</text>
					</view>
					<view class="date-block">
						<picker mode="date">
							<view class="uni-input">开始日期</view>
						</picker>
						<text>~</text>
						<picker mode="date">
							<view class="uni-input">结束日期</view>
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
		invoiceQueryInvoices,
		invoiceDelInvoice
	} from '@/service/service.js';
	import {
		FmtInvoiceVerifyStatus
	} from '@/common/spb.js';
	import {
		ActionPzsp
	} from '@/utils/actions.js';
	import store from '@/store/index.js';
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			uniPopup,
			uniTag
		},
		data() {
			let mockInvoiceData = {
				amount: 150.0,
				taxAmount: 15.0,
				invoiceQuantity: '5',
				allTicketList: [{
					time: '2019-01',
					count: 3,
					sumAmount: 60.0,
					items: [{
							id: 1,
							invoiceType: 'SpecInvoice',
							amount: 10.0,
							taxAmount: 1.0,
							invoiceTime: '2019-01-01',
							companyName: '北京多啦科技有限公司',
							departure: '',
							destination: '',
							city: '',
							checkState: '0',
							checked: false,
							disabled: false
						},
						{
							id: 2,
							invoiceType: 'PlaneInvoice',
							amount: 20.0,
							taxAmount: 2.0,
							invoiceTime: '2019-01-01',
							companyName: '',
							departure: '沧州西',
							destination: '北京南',
							city: '',
							checkState: '0',
							checked: false
						},
						{
							id: 3,
							invoiceType: 'QuotaInvoice',
							amount: 30.0,
							taxAmount: 3.0,
							invoiceTime: '2019-01-01',
							companyName: '',
							departure: '沧州西',
							destination: '北京南',
							city: '北京',
							checkState: '0',
							checked: false,
							disabled: false
						}
					]
				}, {
					time: '2019-02',
					count: 2,
					sumAmount: 90.0,
					items: [{
							id: 4,
							invoiceType: 'SpecInvoice',
							amount: 40.0,
							taxAmount: 4.0,
							invoiceTime: '2019-01-01',
							companyName: '北京多啦科技有限公司',
							departure: '',
							destination: '',
							city: '',
							checkState: '0',
							checked: false,
							disabled: false
						},
						{
							id: 5,
							invoiceType: 'PlaneInvoice',
							amount: 50.0,
							taxAmount: 5.0,
							invoiceTime: '2019-01-01',
							companyName: '',
							departure: '沧州西',
							destination: '北京南',
							city: '',
							checkState: '0',
							checked: false,
							disabled: false
						}
					]
				}]
			};
			let deftInvoiceData = {
				amount: 0,
				taxAmount: 0,
				invoiceQuantity: '0',
				allTicketList: []
			};
			return {
				biz: 'gl', //gl:管理 xz:报销选择
				filter: {
					invoiceStartTime: null,
					invoiceEndTime: null,
					selectReimburse: true,
					reimburseId: 0,
				},
				invoiceTypes: [{
						label: '增值税专用发票',
						value: 'SpecInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '增值税普通发票',
						value: 'GenerInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '增值税电子发票',
						value: 'EleInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '增值税电子发票(通行票)',
						value: 'EleTollInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '增值税卷式发票',
						value: 'VolInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '机动车销售统一发票',
						value: 'VehInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '定额发票',
						value: 'QuotaInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '飞机票',
						value: 'PlaneInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '火车票',
						value: 'TrainInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '客运票',
						value: 'PassengerInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '通用机打发票',
						value: 'GenerMachineInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '出租车票',
						value: 'TaxiInvoice',
						slted: false,
						ttype: 'default'
					},
					{
						label: '过路费发票',
						value: 'TollInvoice',
						slted: false,
						ttype: 'default'
					}
				],
				invoiceData: deftInvoiceData,
				swipeOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#DD524D'
					}
				}],
				chosenInvoice: {
					items: [],
					count: 0,
					amount: 0
				}
			};
		},
		computed: {
			datanone: function() {
				return (this.invoiceData.allTicketList.length < 1);
			}
		},
		onLoad(option) {
			let that = this;
			if (option.biz) {
				that.biz = option.biz;
			}

			switch (that.biz) {
				case 'xz':
					if (option.reimburseId) {
						that.filter.reimburseId = option.reimburseId;
					}
					that.filter.selectReimburse = true;
					uni.hideTabBar({});
					break;
				default:
					break;
			}
			that.queryInvoices();
		},
		// 下拉刷新列表
		onPullDownRefresh() {
			console.log('下拉刷新发票列表..');
			this.queryInvoices(function() {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
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
					invoiceStartTime: null,
					invoiceEndTime: null,
					selectReimburse: false
				};
				this.invoiceTypes.forEach((item, idx) => {
					if (item.slted) {
						this.handleFilterInvoiceTypeTag(idx);
					}
				});
			},
			// 确认过滤查询
			handleFilterQuery() {
				console.log('确认过滤查询..');
				this.$refs.filter.close();
				this.queryInvoices();
			},
			// 过滤发票类型
			handleFilterInvoiceTypeTag(idx) {
				console.log('选择过滤发票类型标签..', idx);
				let itype = this.invoiceTypes[idx];
				itype.slted = !itype.slted;
				itype.ttype = itype.slted ? 'primary' : 'default';
			},
			// 处理发票热区
			handleInvoiceHotspot(e) {
				console.log('处理发票热区点击事件..', e);
				let ids = e.currentTarget.id.split(',');
				let gidx = ids[0];
				let iidx = ids[1];
				let iid = ids[2];
				if (this.biz == 'xz') {
					let invoice = this.invoiceData.allTicketList[gidx].items[iidx];
					if (invoice.disabled) return;
					console.log('处理发票热区点击事件,选择或取消选中发票..');
					let checked = invoice.checked;
					invoice.checked = !checked;
					if (invoice.checked) {
						this.addChosenInvoice(invoice);
					} else {
						this.delChosenInvoice(invoice);
					}
					this.computeChosenInvoice();
					return;
				}
				console.log('处理发票热区点击事件,跳转到发票详情页面..');
				uni.navigateTo({
					url: `../../ticket/detail/detail?id=${iid}&state=query`
				});
			},
			// 处理左滑删除
			handleSwipeClick(e, iid) {
				let action = e.content.text;
				switch (action) {
					case '删除':
						uni.showModal({
							title: '',
							content: '您确定删除此发票吗？',
							success: function(res) {
								if (res.confirm) {
									console.log('删除发票-确定', iid);
									let arg = {
										invoiceId: iid
									};
									invoiceDelInvoice(arg).then((diRes) => {
										console.log('删除指定发票..', diRes);
										if (diRes && diRes.success) {
											this.queryInvoices();
										}
									});

								} else if (res.cancel) {
									console.log('删除发票-取消', iid);
								}
							}
						});
						break;
				}
			},
			// 处理拍照收票
			handlePzspAction() {
				ActionPzsp();
			},
			// 添加选择的发票
			addChosenInvoice(invoice) {
				let items = this.chosenInvoice.items;
				items.push(invoice);
			},
			// 删除选择的发票
			delChosenInvoice(invoice) {
				let id = invoice.id;
				let idx = -1;
				let items = this.chosenInvoice.items;
				items.forEach((item, index) => {
					if (item.id == id) {
						idx = index;
						return;
					}
				});
				if (idx != -1) {
					items.splice(idx, 1);
				}
			},
			// 计算选中的发票
			computeChosenInvoice() {
				let ci = this.chosenInvoice;
				let items = ci.items;
				let count = 0;
				let amount = 0;
				items.forEach((item) => {
					count = count + 1;
					amount = amount + item.amount
				});
				ci.count = count;
				ci.amount = amount;
			},
			// 处理已选发票确定
			handleChooseInvoicesSubmit() {
				let rmb = store.state.reimburse;
				// 所有已选择的票据
				let aci = rmb.allChosenInvoice;
				// 当前已选择的票据
				let occi = rmb.crtChosenInvoice;
				let cci = [];
				let cii = this.chosenInvoice.items;
				occi.forEach((item) => {
					let fpId = item.fpId;
					let idx = -1;
					aci.forEach((aciItem, aciIdx) => {
						if (aciItem.fpId == fpId) {
							idx = aciIdx;
							return;
						}
					});
					if (idx != -1) {
						aci.splice(idx, 1);
					}
				})
				cii.forEach((item) => {
					aci.push({
						fpId: item.id
					});
					cci.push({
						fpId: item.id,
						fplx: this.fmtInvoiceType(item.invoiceType),
						kprq: item.invoiceTime,
						je: item.amount
					});
				});
				rmb.crtChosenInvoice = cci;
				console.log('当前选中的票据..', JSON.stringify(cci));
				uni.$emit('ReimburseChooseInvoices', {
					msg: 'OK'
				});
				uni.navigateBack({
					delta: 1
				});
			},
			// 同步发票选中状态
			synchronizeInvoiceChecked() {
				let rmb = store.state.reimburse;
				// 所有已选择的票据
				let aci = rmb.allChosenInvoice;
				// 当前已选择的票据
				let cci = rmb.crtChosenInvoice;
				// console.log('当前已选择的票据..', JSON.stringify(cci));
				let cis = [];
				let atl = this.invoiceData.allTicketList;
				atl.forEach((item) => {
					item.items.forEach((invoice) => {
						invoice.checked = false;
						invoice.disabled = false;
						// 包含在所有已选择的票据
						let aciExisted = (aci.find((aciItem) => {
							return (aciItem.fpId == invoice.id);
						}) != null);
						// 包含在当前已选择的票据
						let cciExisted = (cci.find((cciItem) => {
							return (cciItem.fpId == invoice.id);
						}) != null);
						// 将票据状态设置为已选中
						if (aciExisted) {
							invoice.checked = true;
						}
						// 将票据状态设置为不可改
						if (aciExisted && !cciExisted) {
							invoice.disabled = true;
						}
						if (cciExisted) {
							cis.push(invoice);
						}
					});
				});
				// console.log('同步发票选中状态..', JSON.stringify(atl));
				this.chosenInvoice.items = cis;
				this.computeChosenInvoice();
			},
			// 查询发票列表
			queryInvoices(callback) {
				let that = this;
				let arg = that.filter;
				let types = [];
				that.invoiceTypes.forEach((item) => {
					if (item.slted) {
						types.push(item.value);
					}
				});
				arg.invoiceTypes = types.join(',');
				invoiceQueryInvoices(arg).then((qiRes) => {
					console.log('查询发票列表..', qiRes);
					if (callback) callback();
					if (qiRes && qiRes.success) {
						that.invoiceData = qiRes.data.data;
						that.synchronizeInvoiceChecked();
					}
				});
			},
			// 是否显示销方
			isShowSaler(itype) {
				switch (itype) {
					case 'SpecInvoice':
					case 'VolInvoice':
					case 'EleInvoice':
					case 'GenerInvoice':
					case 'EleTollInvoice':
					case 'VehInvoice':
						return true;
					default:
						return false;
				}
			},
			// 是否显示城市
			isShowCity(itype) {
				switch (itype) {
					case 'QuotaInvoice':
					case 'TaxiInvoice':
						return true;
					default:
						return false;
				}
			},
			// 是否显示行程
			isShowJourney(itype) {
				switch (itype) {
					case 'PlaneInvoice':
					case 'PassengerInvoice':
					case 'TrainInvoice':
						return true;
					default:
						return false;
				}
			},
			// 格式化发票类型
			fmtInvoiceType(itype) {
				let its = this.invoiceTypes;
				let c = its.length;
				for (let i = 0; i < c; i++) {
					let t = its[i];
					if (t.value == itype) {
						return t.label;
					}
				}
				return '无效类型';
			},
			// 格式化发票查验状态
			fmtInvoiceVerifyStatus(istate) {
				return FmtInvoiceVerifyStatus(istate);
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
						// color: #555555;
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
				color: #1BA2E7;
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

				.cy-1,
				.cy-2,
				.cy-3 {
					font-size: 24rpx;
				}

				.cy-1 {
					color: #03A401;
				}

				.cy-2 {
					color: #CB0606;
				}

				.cy-null,
				.cy-0,
				.cy-3 {
					color: #F39C39;
				}
			}

			.props-foot {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 22rpx;
				color: #999999;
			}
		}
	}

	.list-body-xz {
		padding-bottom: 100rpx;
	}

	// 底部
	.foot-section {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		border-top: 1rpx solid #E5E5E5;
		background-color: #FFFFFF;

		.foot-content {
			display: flex;
			justify-content: space-around;
			padding: 0rpx 30rpx;
			align-items: center;
			height: 98rpx;
			color: #666666;

			.zs {
				width: 30%;
			}

			.je {
				width: 45%;
			}

			.an {
				width: 25%;
			}
		}
	}
</style>
