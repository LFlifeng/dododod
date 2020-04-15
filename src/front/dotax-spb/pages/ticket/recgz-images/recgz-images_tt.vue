<template>
	<view class="ri-main">
		<view class="head-section">
			<view class="head-content">
				<view>本次识别:<text>{{totalCount}}</text>张</view>
				<view>识别成功:<text>{{successCount-duplicateCount}}</text>张</view>
				<view>识别重复:<text>{{duplicateCount}}</text>张</view>
				<view>识别失败:<text>{{failCount}}</text>张</view>
			</view>
		</view>
		<scroll-view class="body-section" scroll-y="true">
			<block v-for="(items,gidx) in recgzs" v-bind:key="gidx">
				<view class="cont-area">
					<block v-for="(item,iidx) in items" v-bind:key="iidx">
						<view class="cont-item">
							<view class="item-head">
								<text>{{fmtInvoiceType(item.invoiceType)}}</text>
								<view class="head-y">
									<image src="../../../static/xp/icon-del.png" @click="handleDelete(gidx,iidx)"></image>
								</view>
							</view>
							<view class="item-body">
								<view class="body-z">
									<view class="zt" :class="{'zt-0':item.recgzStatus=='0','zt-1':item.recgzStatus=='1','zt-2':item.recgzStatus=='2'||item.duplicate}">
										{{fmtRecgzStatus(item.recgzStatus,item.duplicate)}}</view>
									<image :src="item.invoiceImg" :data-src="item.invoiceImg" @click="handlePreviewImage"></image>
								</view>
								<view class="body-y" @click="handleDetail(gidx,iidx)">
									<view v-if="invoicePropEditable(item.invoiceType,'invoiceCode')" class="prop-item">
										<text class="label">发票代码：</text>
										<text class="value">{{item.invoiceCode}}</text>
									</view>
									<view v-if="invoicePropEditable(item.invoiceType,'invoiceNum')" class="prop-item">
										<text class="label">发票号码：</text>
										<text class="value">{{item.invoiceNum}}</text>
									</view>
									<view v-if="invoicePropEditable(item.invoiceType,'rider')" class="prop-item">
										<text class="label">{{getInvoicePropName(item.invoiceType,'rider')}}：</text>
										<text class="value">{{item.rider}}</text>
									</view>
									<view v-if="invoicePropEditable(item.invoiceType,'invoiceOpenDate')" class="prop-item">
										<text class="label">{{getInvoicePropName(item.invoiceType,'invoiceOpenDate')}}：</text>
										<text class="value">{{item.invoiceOpenDate}}</text>
									</view>
									<view v-if="invoicePropEditable(item.invoiceType,'departure')" class="prop-item">
										<text class="label">出发站：</text>
										<text class="value">{{item.departure}}</text>
									</view>
									<view v-if="invoicePropEditable(item.invoiceType,'destination')" class="prop-item">
										<text class="label">到达站：</text>
										<text class="value">{{item.destination}}</text>
									</view>
									<view v-if="invoicePropEditable(item.invoiceType,'setOutDate')" class="prop-item">
										<text class="label">出发时间：</text>
										<text class="value">{{item.setOutDate}}</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
		</scroll-view>
		<view class="foot-section">
			<view class="foot-content">
				<button @click="handleSubmit" v-bind:disabled="totalCount==0" type="primary">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		FmtRecgzStatus,
		FmtInvoiceType,
		InvoicePropEditable,
		GetInvoicePropName,
		Clone,
		InvoiceModel,
		ValidateInvoice,
		InvoiceDeductible
	} from '@/common/spb.js';
	import {
		invoiceAddInvoice,
		deductionPushInvoices
	} from '@/service/service.js';

	import store from '@/store/index.js';
	export default {
		data() {
			// let mockRecgzs = [
			// 	[Clone(InvoiceModel)],
			// 	[Clone(InvoiceModel)]
			// ];
			let deftRecgzs = [];
			return {
				// pzsp:拍照识票 dksp:抵扣收票
				biz: 'pzsp',
				// 识别的票据二维数组
				recgzs: deftRecgzs,
				// 抵扣收票定制属性
				userId: ''
			};
		},
		computed: {
			totalCount: function() {
				let count = 0;
				this.recgzs.forEach((items, gidx) => {
					count += items.length;
				});
				return count;
			},
			successCount: function() {
				let count = 0;
				this.recgzs.forEach((items, gidx) => {
					items.forEach((item, iidx) => {
						if (item.recgzStatus != 0) {
							count++;
						}
					});
				});
				return count;
			},
			failCount: function() {
				let count = 0;
				this.recgzs.forEach((items, gidx) => {
					items.forEach((item, iidx) => {
						if (item.recgzStatus == 0) {
							count++;
						}
					});
				});
				return count;
			},
			duplicateCount: function() {
				let count = 0;
				this.recgzs.forEach((items, gidx) => {
					items.forEach((item, iidx) => {
						if (item.recgzStatus == 2 ||
							item.duplicate) {
							count++;
						}
					});
				});
				return count;
			}
		},
		onLoad(option) {
			let that = this;
			let biz = option.biz;
			if (biz) that.biz = biz;
			uni.showLoading({
				title: '正在准备数据..',
				mask: true
			});

			if (biz == 'dksp') {
				let scanGrant = uni.getStorageSync('scanGrant');
				if (!scanGrant) {
					uni.showModal({
						content: '请扫票单通抵扣收票二维码获取授权',
						showCancel: false,
						success: function(res) {
							uni.switchTab({
								url: '/pages/tab-bar/home/home_tt'
							});
						}
					});
					return;
				}
				let splits = scanGrant.split(',');
				this.userId = splits[1];
			}

			uni.getStorage({
				key: 'RECGZED_IMAGES',
				success: (res) => {
					console.log('成功获取到数据..', res);
					let recgzs = res.data;
					recgzs.forEach((items) => {
						items.forEach((item) => {
							// item.isValid = (ValidateInvoice(item) == '');
							if (item.recgzStatus == '1') {
								if (ValidateInvoice(item) != '') {
									item.recgzStatus = '0';
								}
							}
						});
					});
					that.recgzs = recgzs;
					that.localReiterateStateRefresh();
				},
				fail: (err) => {
					// console.log('获取数据时出错..', err);
					// uni.showModal({
					// 	showCancel: false,
					// 	content: '抱歉，获取数据时出错，请重新选择图片并提交识别！',
					// 	confirmText: '好的',
					// 	success: (res) => {
					// 		if (res.confirm) {
					// 			uni.reLaunch({
					// 				url: `../choose-image/choose-image?biz=${that.biz}`
					// 			});
					// 		}
					// 	}
					// });
				},
				complete: () => {
					uni.hideLoading();
				}
			});

		},
		methods: {
			// 图片预览
			handlePreviewImage(e) {
				var current = e.target.dataset.src;
				uni.previewImage({
					current: current,
					urls: [current]
				});
			},
			// 处理跳转
			handleDetail(gidx, iidx) {
				let that = this;
				// 设置更新监听
				uni.$off('recgz-image-update');
				uni.$once('recgz-image-update', function(data) {
					console.log('监听到来自recgz-image-update的事件..', data);
					that.updateItem(data.gidx, data.iidx, data.invoice);
				});
				// 设置删除监听
				uni.$off('recgz-image-delete');
				uni.$once('recgz-image-delete', function(data) {
					console.log('监听到来自recgz-image-delete的事件..', data);
					that.deleteItem(data.gidx, data.iidx);
				});
				uni.showLoading({
					title: '',
					mask: true
				});
				// 缓存发票信息
				uni.setStorage({
					key: 'EDIT_INVOICE',
					data: that.recgzs[gidx][iidx],
					success: () => {
						let state = encodeURIComponent(JSON.stringify({
							gidx: gidx,
							iidx: iidx
						}));
						uni.navigateTo({
							url: `../detail/detail_tt?biz=${that.biz}&edit=true&state=${state}`
						});
					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '无法跳转，暂存信息时出错'
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			// 处理删除操作
			handleDelete(gidx, iidx) {
				let that = this;
				uni.showModal({
					confirmColor: '#3d94ff',
					content: '您确定要删除该张发票吗？',
					success: (res) => {
						if (res.confirm) {
							let invoice = that.recgzs[gidx][iidx];
							that.deleteItem(gidx, iidx);
						}
					}
				});
			},
			// 处理提交操作
			handleSubmit() {
				let that = this;
				let vRes = that.validateSubmit();
				if (!vRes.success) {
					uni.showModal({
						title: '',
						content: vRes.message,
						confirmText: '我知道了',
						showCancel: false
					});
					return;
				}

				uni.showModal({
					content: '请确认所提交的数据真实有效？',
					success: (res) => {
						if (res.confirm) {
							let invoices = [];
							let userId = store.state.userInfo.userId;
							if (that.biz == 'dksp') {
								userId = that.userId;
							}

							that.recgzs.forEach(items => {
								items.forEach(item => {
									item.userId = userId;
									invoices.push(item);
								});
							});
							console.log(that.recgzs)
							console.log('请求保存发票信息..');
							if (that.biz == 'dksp') {
								deductionPushInvoices(invoices).then((piRes) => {
									console.log('保存发票信息结果..', piRes);
									if (piRes && piRes.success) {
										uni.setStorageSync('RECGZED_IMAGES', []);
										uni.redirectTo({
											url: '/pages/result/choose-invoice-result/choose-invoice-result_tt?invCount=' + invoices.length
										});
									}
								});
							} else {
								invoiceAddInvoice(invoices).then((aiRes) => {
									// console.log('保存发票信息结果..', aiRes);
									// if (aiRes && aiRes.success) {
									// 	uni.setStorageSync('RECGZED_IMAGES', []);
									// 	uni.showModal({
									// 		title: '',
									// 		content: '发票保存成功，跳转到票夹页面查看',
									// 		confirmText: '确定',
									// 		showCancel: false,
									// 		success: (res) => {
									// 			if (res.confirm) {
									// 				uni.reLaunch({
									// 					url: '/pages/result/choose-invoice-result/choose-invoice-result_tt?invCount=' + invoices.length
									// 				});
									// 			}
									// 		}
									// 	});
									// }
									uni.reLaunch({
										url: '/pages/result/choose-invoice-result/choose-invoice-result_tt?invCount=' + invoices.length
									});
								});
							}
						}
					},
					fail() {
						
					}
				});
			},
			// 更新列表子项
			updateItem(gidx, iidx, invoice) {
				let that = this;
				let areas = that.recgzs;
				let items = areas[gidx];
				let item = items[iidx];
				Object.assign(item, invoice, {
					isValid: true,
					recgzStatus: '1',
					duplicate: false
				});
				that.localReiterateStateRefresh();
			},
			// 删除列表子项
			deleteItem(gidx, iidx) {
				let that = this;
				let areas = that.recgzs;
				let items = areas[gidx];
				if (items.length == 1) {
					areas.splice(gidx, 1);
				} else {
					items.splice(iidx, 1);
				}
				that.localReiterateStateRefresh();
			},
			// 本地重复发票的刷新
			localReiterateStateRefresh() {
				let that = this;
				let recgzs = that.recgzs;
				if (recgzs.length < 1) return;
				let invoices = [];
				// 转换为一维数组
				recgzs.forEach((items) => {
					items.forEach((item) => {
						// 统一校验更新发票的状态
						// 假如是非服务端重复发票
						if (!item.duplicate) {
							let status = (ValidateInvoice(item) == '') ? '1' : '0';
							if (item.recgzStatus != status) {
								item.recgzStatus = status;
							}

							// 过滤掉不检查的票据
							let type = item.invoiceType;
							if (type != 'TrainInvoice' &&
								type != 'PlaneInvoice' &&
								item.invoiceCode != '' &&
								item.invoiceNum != '') {
								invoices.push(item);
							}
						}
					});
				});

				let len = invoices.length;
				// 判断票据是否重复的检查
				for (let i = 0, c = len - 1; i < c; i++) {
					let witem = invoices[i];
					for (let j = i + 1; j < len; j++) {
						let nitem = invoices[j];
						if (witem.invoiceCode == nitem.invoiceCode &&
							witem.invoiceNum == nitem.invoiceNum) {
							nitem.recgzStatus = '2';
						}
					}
				}
			},
			// 提交数据前校验
			validateSubmit() {
				let that = this;
				let ispass = true;
				let message = '';
				let recgzs = that.recgzs;
				let biz = that.biz;
				for (let i = 0; i < recgzs.length; i++) {
					let items = recgzs[i];
					for (let j = 0; j < items.length; j++) {
						let invoice = items[j];
						if (invoice.recgzStatus != '1' || invoice.duplicate) {
							ispass = false;
							message = `提交的票据包含识别失败或识别重复的数据，请点击票据补全信息或删除票据`;
							break;
						}
						if (biz == 'dksp') {
							if (!InvoiceDeductible(invoice.invoiceType)) {
								ispass = false;
								message = '系统抵扣支持的发票类型只有增值税专用发票、机动车销售发票、通行费电子发票，请修改或删除其余票据';
								break;
							}
						}
					}
					if (!ispass) break;
				}
				return {
					success: ispass,
					message: message
				};
			},
			// 格式化发票类型
			fmtInvoiceType(itype) {
				return FmtInvoiceType(itype);
			},
			// 格式化识别状态
			fmtRecgzStatus(istatus, duplicate) {
				if (duplicate) istatus = '2';
				return FmtRecgzStatus(istatus);
			},
			invoicePropEditable(itype, prop) {
				return InvoicePropEditable(itype, prop);
			},
			getInvoicePropName(itype, prop) {
				return GetInvoicePropName(itype, prop);
			}
		}
	}
</script>

<style lang="scss">
	.ri-main {
		background-color: #F4F4F4;
	}

	.head-section {
		position: absolute;
		height: 80rpx;
		left: 0rpx;
		right: 0rpx;
		padding: 0rpx 32rpx;
		background-color: #FFFFFF;

		.head-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;

			view {
				width: 25%;
				color: #666666;
				font-size: 24rpx;

				text {
					font-size: 28rpx;
					color: #C91702;
					margin-left: 8rpx;
				}
			}
		}
	}

	.body-section {
		position: absolute;
		top: 80rpx;
		left: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		padding: 0px 0px 120rpx 0rpx;
		background-color: #F4F4F4;

		.cont-area {
			// border-bottom: double 6rpx #E5E5E5;
			// padding-bottom: 10rpx;
		}

		.cont-item {
			margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 0rpx 30rpx 20rpx 30rpx;

			.item-head {
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					margin-top: 24rpx;
					font-size: 30rpx;
					color: #666666;
					font-weight: 600;
					letter-spacing: 2rpx;
				}

				.head-y {
					display: flex;
					height: 80rpx;
					justify-content: space-between;
					align-items: center;

					.wz {
						font-size: 20rpx;
						color: #C91702;
						font-weight: 300;
						border: solid 1rpx #C91702;
						border-radius: 5rpx;
						padding: 0rpx 10rpx;
						margin-right: 20rpx;
						height: 38rpx;
						line-height: 38rpx;
					}

					.wz-1 {
						color: #09BA07;
						border-color: #09BA07;
					}

					image {
						width: 36rpx;
						height: 40rpx;
					}
				}
			}

			.item-body {
				display: flex;
				justify-content: flex-start;
				position: relative;

				.body-z {
					.zt {
						position: absolute;
						top: 4rpx;
						left: 4rpx;
						height: 30rpx;
						width: 80rpx;
						font-size: 16rpx;
						color: #FFFFFF;
						border-radius: 5rpx;
						opacity: 0.8;
						text-align: center;
						line-height: 30rpx;
					}

					.zt-0 {
						background-color: #E50505;
					}

					.zt-1 {
						background-color: #09BB07;
					}

					.zt-2 {
						background-color: #FF7A08;
					}

					image {
						width: 168rpx;
						height: 168rpx;
						background-color: #EEEEEE;
						border-radius: 5rpx;
					}
				}

				.body-y {
					padding: 5rpx 0rpx 5rpx 30rpx;
					min-width: 430rpx;
					min-height: 210rpx;
					margin-left: 40rpx;

					.prop-item {
						height: 50rpx;
						line-height: 50rpx;

						.label {
							font-size: 26rpx;
							color: #999;
						}

						.value {
							color: #999999;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
	}

	.foot-section {
		position: absolute;
		height: 119rpx;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
		// border-top: solid 1rpx #D8D8D8;
		background-color: #FFFFFF;

		.foot-content {
			padding: 0rpx 40rpx;
			height: 119rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;

			button {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				margin: 0rpx;
			}
		}
	}
</style>
