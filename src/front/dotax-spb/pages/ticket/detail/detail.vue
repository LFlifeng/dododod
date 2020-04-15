<template>
	<view>
		<!-- 头部 -->
		<view class="head-section">
			<picker v-if="edit" @change="handleInvoiceTypeChange" :value="invoiceTypePickerValue" :range="invoiceTypes"
			 range-key="label">
				<text>{{fmtInvoiceType(invoice.invoiceType)}}</text>
			</picker>
			<text v-if="!edit">{{fmtInvoiceType(invoice.invoiceType)}}</text>
			<view v-if="!edit&&invoiceVerifiable()" class="cy-icon">
				<text :class="'cy-'+invoice.checkState">{{fmtInvoiceVerifyStatus(invoice.checkState)}}</text>
			</view>
		</view>
		<!-- 主体 -->
		<scroll-view class="body-section" :class="{'body-section-wt':!invoiceImageVisible}" scroll-y="true">
			<view class="body-content">
				<view v-if="invoicePropEditable('invoiceCode')" class="props-item">
					<view class="prop-label">发票代码：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.invoiceCode}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="发票代码" v-model="invoice.invoiceCode" />
					</view>
				</view>
				<view v-if="invoicePropEditable('invoiceNum')" class="props-item">
					<view class="prop-label">发票号码：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.invoiceNum}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="发票号码" v-model="invoice.invoiceNum" />
					</view>
				</view>
				<view v-if="invoicePropEditable('invoiceOpenDate')" class="props-item">
					<view class="prop-label">{{getInvoicePropName('invoiceOpenDate')}}：</view>
					<picker v-if="edit" mode="date" v-model="invoice.invoiceOpenDate" @change="handleInvoiceOpenDateChange" :start="invoiceMinDate"
					 :end="invoiceMaxDate">
						<view class="uni-input">{{invoice.invoiceOpenDate}}</view>
					</picker>
					<view v-else class="uni-input prop-value">{{invoice.invoiceOpenDate}}</view>
				</view>
				<view v-if="invoicePropEditable('city')" class="props-item">
					<view class="prop-label">城市：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.city}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="城市" v-model="invoice.city" />
					</view>
				</view>
				<view v-if="invoicePropEditable('rider')" class="props-item">
					<view class="prop-label">{{getInvoicePropName('rider')}}：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.rider}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" :placeholder="getInvoicePropName('rider')" v-model="invoice.rider" />
					</view>
				</view>
				<view v-if="invoicePropEditable('eleTicktNo')" class="props-item">
					<view class="prop-label">电子客票号码：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.eleTicktNo}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="电子客票号码" v-model="invoice.eleTicktNo" />
					</view>
				</view>
				<view v-if="invoicePropEditable('departure')" class="props-item">
					<view class="prop-label">出发站：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.departure}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="出发站" v-model="invoice.departure" />
					</view>
				</view>
				<view v-if="invoicePropEditable('setOutDate')" class="props-item">
					<view class="prop-label">乘车日期：</view>
					<picker v-if="edit" mode="date" v-model="invoice.setOutDate" @change="handleSetOutDateChange" :start="setOutMinDate"
					 :end="setOutMaxDate">
						<view class="uni-input">{{invoice.setOutDate}}</view>
					</picker>
					<view v-else class="uni-input prop-value">{{invoice.setOutDate}}</view>
				</view>
				<view v-if="invoicePropEditable('destination')" class="props-item">
					<view class="prop-label">到达站：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.destination}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="到达站" v-model="invoice.destination" />
					</view>
				</view>
				<view v-if="invoicePropEditable('getOnTime')" class="props-item">
					<view class="prop-label">{{getInvoicePropName('getOnTime')}}：</view>
					<picker v-if="edit" mode="time" v-model="invoice.getOnTime" @change="handleGetOnTimeChange">
						<view class="uni-input">{{invoice.getOnTime}}</view>
					</picker>
					<view v-else class="uni-input prop-value">{{invoice.getOnTime}}</view>
				</view>
				<view v-if="invoicePropEditable('getOffTime')" class="props-item">
					<view class="prop-label">下车时间：</view>
					<picker v-if="edit" mode="time" v-model="invoice.getOffTime" @change="handleGetOffTimeChange">
						<view class="uni-input">{{invoice.getOffTime}}</view>
					</picker>
					<view v-else class="uni-input prop-value">{{invoice.getOffTime}}</view>
				</view>
				<view v-if="invoicePropEditable('kilometre')" class="props-item">
					<view class="prop-label">里程(公里)：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.kilometre}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="里程(公里)" v-model="invoice.kilometre" />
					</view>
				</view>
				<view v-if="invoicePropEditable('sumAmount')" class="props-item">
					<view class="prop-label">金额(元)：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.sumAmount}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="金额(元)" v-model="invoice.sumAmount" />
					</view>
				</view>
				<view v-if="invoicePropEditable('ticketPrice')" class="props-item">
					<view class="prop-label">票价(元)：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.ticketPrice}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="票价(元)" v-model="invoice.ticketPrice" />
					</view>
				</view>
				<view v-if="invoicePropEditable('flight')" class="props-item">
					<view class="prop-label">{{getInvoicePropName('flight')}}：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.flight}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" :placeholder="getInvoicePropName('flight')" v-model="invoice.flight" />
					</view>
				</view>
				<view v-if="invoicePropEditable('seatClass')" class="props-item">
					<view class="prop-label">座位等级：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.seatClass}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="座位等级" v-model="invoice.seatClass" />
					</view>
				</view>
				<view v-if="invoicePropEditable('surcharge')" class="props-item">
					<view class="prop-label">燃油附加费：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.surcharge}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="燃油附加费" v-model="invoice.surcharge" />
					</view>
				</view>
				<view v-if="invoicePropEditable('planeTicketAmount')" class="props-item">
					<view class="prop-label">合计金额(元)：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.planeTicketAmount}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="合计金额(元)" v-model="invoice.planeTicketAmount" />
					</view>
				</view>
				<view v-if="invoicePropEditable('verifyCode')" class="props-item">
					<view class="prop-label">校验码后6位：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.verifyCode}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="校验码后6位" v-model="invoice.verifyCode" />
					</view>
				</view>
				<view v-if="invoicePropEditable('amount')" class="props-item">
					<view class="prop-label">不含税金额：</view>
					<view v-if="!edit" class="uni-input prop-value">{{invoice.amount}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="不含税金额" v-model="invoice.amount" />
					</view>
				</view>
				<view v-if="!edit&&invoiceVerifiable()" class="check-block">
					<uni-collapse>
						<uni-collapse-item :open="false" :show-animation="false" :disabled="false" title="查看增值税发票查验结果:">
							<view v-if="!edit&&invoice.checkState==1" class="cg-cont">
								<view class="cont-item">
									<text class="label">发票代码：</text>
									<text class="value">{{invoice.invoiceCode}}</text>
								</view>
								<view class="cont-item">
									<text class="label">发票号码：</text>
									<text class="value">{{invoice.invoiceNum}}</text>
								</view>
								<view class="cont-item">
									<text class="label">开票日期：</text>
									<text class="value">{{invoice.invoiceOpenDate}}</text>
								</view>
								<view class="cont-item">
									<text class="label">价税合计：</text>
									<text class="value">{{invoice.sumAmount}}元</text>
								</view>
								<view class="cont-item">
									<text class="label">开票金额（不含税）：</text>
									<text class="value">{{invoice.amount}}元</text>
								</view>
								<view class="cont-item">
									<text class="label">税额：</text>
									<text class="value">{{invoice.taxAmount}}</text>
								</view>
								<view class="cont-item">
									<text class="label">购买方：</text>
									<text class="value">{{invoice.customerName}}</text>
								</view>
								<view class="cont-item">
									<text class="label">纳税人识别号：</text>
									<text class="value">{{invoice.customerTaxNo}}</text>
								</view>
								<view class="cont-item">
									<text class="label">开户银行及账号：</text>
									<text class="value">{{invoice.customerBankAccount}}</text>
								</view>
								<view class="cont-item">
									<text class="label">公司地址及电话：</text>
									<text class="value">{{invoice.customerAddrTel}}</text>
								</view>
								<view class="cont-item">
									<text class="label">销售方：</text>
									<text class="value">{{invoice.saleName}}</text>
								</view>
								<view class="cont-item">
									<text class="label">纳税人识别号：</text>
									<text class="value">{{invoice.saleTaxNo}}</text>
								</view>
								<view class="cont-item">
									<text class="label">开户银行及账号：</text>
									<text class="value">{{invoice.saleBankAccount}}</text>
								</view>
								<view class="cont-item">
									<text class="label">公司地址及电话：</text>
									<text class="value">{{invoice.saleAddrTel}}</text>
								</view>
								<view class="hwmx-cont">
									<view class="subject">
										货物或应税劳务：
									</view>
									<view v-for="(item,index) in invoice.items" :key="index" class="hwmx-item">
										<text class="mc">{{item.merchandiseName}}</text>
										<text class="je">{{item.amount}}元</text>
										<text class="se">{{item.taxAmount}}元</text>
									</view>
								</view>
							</view>
							<view v-if="!edit&&invoice.checkState==2" class="sb-cont">
								<view class="message">查验失败：<text>{{invoice.failedMessage}}</text></view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
		</scroll-view>
		<!-- 底部 -->
		<view class="oprt-section" :class="{'oprt-section-wt':!invoiceImageVisible}">
			<view v-if="invoiceImageVisible" class="image-section">
				<image :mode="aspectFit" :src="invoice.invoiceImg" @click="handlePreviewInvoiceImage" @error="handleInvoiceImageError"></image>
			</view>
			<view class="btn-group">
				<button v-if="updateButtonVisible" type="primary" @click="handleUpdate">编辑</button>
				<button v-if="submitButtonVisible" type="primary" @click="handleSubmit">{{confirmText}}</button>
				<button v-if="deleteButtonVisible" type="default" @click="handleDelete">删除</button>
				<button v-if="cancelButtonVisible" type="default" @click="handleCancel">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
	import {
		InvoiceTypes,
		FmtInvoiceType,
		InvoicePropEditable,
		GetInvoicePropName,
		InvoiceVerifiable,
		FmtInvoiceVerifyStatus,
		ExtendProps,
		Clone,
		PropIsEmpty,
		DateFormat,
		ValidateInvoice,
		InvoiceModel,
		InvoiceDeductible
	} from '@/common/spb.js';
	import {
		invoiceGetInvoice,
		invoiceDelInvoice,
		invoiceAddInvoice,
		invoiceIsExisted
	} from '@/service/service.js';
	import store from '@/store/index.js';

	export default {
		components: {
			uniCollapse,
			uniCollapseItem
		},
		data() {
			let mockInvoice = {
				id: 0,
				invoiceCode: '',
				invoiceType: 'TaxiInvoice',
				checkState: 0,
				rider: '乘车人',
				departure: '出发站',
				destination: '到达站',
				invoiceImg: null
			};
			let maxTime = new Date();
			let minTime = new Date(maxTime - 365 * 24 * 60 * 60 * 1000);
			return {
				id: 0,
				state: null,
				edit: false, //编辑状态
				biz: 'fpgl', //smsp:扫码收票 smcy:扫码查验 //fpgl:发票管理 //pzsp:拍照识票 //dksp:抵扣收票 //sgcy:手工录入
				confirmText: '保存',
				invoiceTypes: [],
				invoice: {},
				invoiceMinDate: DateFormat(minTime),
				invoiceMaxDate: DateFormat(maxTime),
				showPicker: false
			}
		},
		computed: {
			invoiceTypePickerValue: function() {
				let that = this;
				let itypes = that.invoiceTypes;
				let itype = that.invoice.invoiceType;
				for (let i = 0; i < itypes.length; i++) {
					if (itypes[i].value == itype) {
						return i;
					}
				}
				return -1;
			},
			updateButtonVisible: function() {
				let that = this;
				switch (that.biz) {
					case 'fpgl':
						let invoice = that.invoice;
						// 非编辑模式下，且查验状态非查验成功，且没有添加到报销单据
						return (!that.edit && invoice &&
							invoice.checkState != '1' &&
							(!invoice.reimburseAdded || invoice.reimburseReject));
					default:
						return false;
				}
			},
			cancelButtonVisible: function() {
				let that = this;
				switch (that.biz) {
					case 'fpgl':
						return that.edit;
					case 'sgcy':
					case 'smcy':
						return true;
					default:
						return false;
				}
			},
			deleteButtonVisible: function() {
				let that = this;
				switch (that.biz) {
					case 'fpgl':
						let invoice = that.invoice;
						return (!that.edit && invoice &&
							!invoice.reimburseAdded);
					case 'pzsp':
						return true;
					case 'dksp':
						return true;
					default:
						return false;
				}
			},
			submitButtonVisible: function() {
				return this.edit;
			},
			invoiceImageVisible: function() {
				return !PropIsEmpty(this.invoice.invoiceImg);
			}
		},
		onLoad(option) {
			let that = this;
			let biz = option.biz;
			let edit = option.edit;
			let state = option.state;
			if (biz) that.biz = biz;
			if (edit) {
				if (edit == "true" || edit == "1") {
					that.edit = true;
				}
			}
			if (state) {
				/**
				 * state 模型
				 * fpgl：{id:发票标识} 
				 * pzsp：{gidx:分组索引,iidx:发票索引}
				 */

				that.state = JSON.parse(decodeURIComponent(state));
			}
			// 数据源头
			let dataSource = 'local';
			// 获取途径 WECHAT:微信 YXSP:影像收票 CYSP:查验收票 DKSP:抵扣收票
			let dataGetWay = '';
			switch (that.biz) {
				case 'pzsp': //拍照收票
					dataSource = 'local';
					that.confirmText = '保存';
					dataGetWay = 'YXSP';
					break;
				case 'dksp': //抵扣收票
					dataSource = 'local';
					that.confirmText = '保存';
					dataGetWay = 'DKSP';
					break;
				case 'smsp': //扫码收票
				case 'smcy': //扫码查验
					dataSource = 'local';
					that.confirmText = '添至票夹';
					dataGetWay = 'CYSP';
					break;
				case 'sgcy': //手工查验
					dataSource = 'input';
					that.confirmText = '添至票夹';
					dataGetWay = 'CYSP';
					break;
				case 'fpgl': //发票管理
				default:
					dataSource = 'remote';
					that.confirmText = '保存';
					break;
			}
			if (dataGetWay != '') {
				that.setSelectTypes(dataGetWay);
			}
			switch (dataSource) {
				case 'local': //本地
					uni.showLoading({
						mask: true,
						title: ''
					});
					uni.getStorage({
						key: 'EDIT_INVOICE',
						success: (res) => {
							console.log('成功获取到数据..', res);
							that.invoice = res.data;
						},
						fail: (err) => {
							console.log('获取数据时出错..', err);
							uni.showModal({
								showCancel: false,
								content: '抱歉，获取数据时出错，请重新进入。',
								confirmText: '好的',
								success: (res) => {
									if (res.confirm) {
										uni.navigateBack({});
									}
								}
							});
						},
						complete: () => {
							uni.hideLoading();
						}
					});
					break;
				case 'remote': //远程
					that.getInvoice();
					break;
				case 'input': //录入
				default:
					let empty = Clone(InvoiceModel);
					empty.source = 'CYSP';
					that.invoice = empty;
					break;
			}
		},
		// 下拉刷新发票
		onPullDownRefresh() {
			let that = this;
			if (that.edit) {
				uni.stopPullDownRefresh();
				return;
			}
			console.log('下拉刷新发票信息..');
			that.getInvoice(function() {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
			handleInvoiceOpenDateChange(e) {
				this.invoice.invoiceOpenDate = e.target.value;
			},
			handleSetOutDateChange(e) {
				this.invoice.setOutDate = e.target.value;
			},
			handleGetOnTimeChange(e) {
				this.invoice.getOnTime = e.target.value;
			},
			handleGetOffTimeChange(e) {
				this.invoice.getOffTime = e.target.value;
			},
			onSelectedSetOutDate(e) {
				this.showPicker = false;
				if (e) {
					this.invoice.setOutDate = e.value;
				}
			},
			//乘车时间
			handleGetOnTime(e) {
				this.invoice.getOnTime = e.target.value;
			},
			// 改变发票类型
			handleInvoiceTypeChange(e) {
				console.log('选择更改发票类型..', e);
				let itypes = this.invoiceTypes;
				this.invoice.invoiceType = itypes[e.detail.value].value;
			},
			// 处理编辑操作
			handleUpdate() {
				this.edit = !this.edit;
			},
			// 处理提交操作
			handleSubmit() {
				console.log('处理提交操作..');
				let that = this;
				let errmsg = that.submitValidate();
				if (errmsg != '') {
					uni.showToast({
						icon: 'none',
						title: errmsg
					});
					return;
				}
				let invoice = this.invoice;
				switch (that.biz) {
					case 'fpgl':
					case 'sgcy':
					case 'smcy':
						let userId = store.state.userInfo.userId;
						invoice.userId = userId;
						console.log('请求保存发票信息..');
						invoiceAddInvoice([invoice]).then((aiRes) => {
							console.log('保存发票信息结果..', aiRes);
							if (aiRes && aiRes.success) {
								uni.showModal({
									title: '',
									content: '发票保存成功，您是否跳转到票夹页面？',
									confirmText: '立即跳转',
									cancelText: '留在此页',
									success: function(res) {
										if (res.confirm) {
											console.log('跳转到票夹-确定');
											uni.reLaunch({
												url: '../../tab-bar/ticket/ticket'
											});
										} else if (res.cancel) {
											console.log('跳转到票夹-取消');
										}
									}
								});
							}
						});
						break;
					case 'pzsp':
					case 'dksp':
						checkExist(that.biz, invoice, function() {
							// 不存在
							let data = ExtendProps(Clone(that.state), {
								'invoice': invoice
							});
							uni.$emit("recgz-image-update", data);
							uni.navigateBack({});
						});
						break;
				}

				function checkExist(biz, invoice, passed) {
					let type = invoice.invoiceType;
					if (type == 'TrainInvoice' &&
						type == 'PlaneInvoice') {
						passed();
						return;
					}
					let ieArg = {
						biz: biz,
						fpdm: invoice.invoiceCode,
						fphm: invoice.invoiceNum,
						invoiceId: invoice.id
					};
					console.log('请求检查发票是否存在..');
					invoiceIsExisted(ieArg).then((ieRes) => {
						console.log('检查发票是否存在结果..', ieRes);
						if (ieRes && ieRes.success) {
							if (ieRes.data) {
								// 已存在
								uni.showModal({
									title: '',
									content: '票夹中已经存在相同发票代码、发票号码的票据',
									showCancel: false,
									confirmText: '我知道了'
								});
							} else {
								passed();
							}
						}
					});
				}
			},
			// 处理取消操作
			handleCancel() {
				console.log('处理取消操作..');
				let that = this;
				switch (that.biz) {
					case 'smcy':
					case 'smsp':
					case 'sgcy':
						console.log('放弃添票..');
						uni.navigateBack({
							delta: 1
						});
						break;
					case 'fpgl':
					default:
						console.log('取消编辑..');
						this.edit = !this.edit;
						break;
				}
			},
			// 处理删除操作
			handleDelete() {
				console.log('删除发票..');
				let that = this;
				uni.showModal({
					title: '提示',
					content: '您确定删除此发票吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('删除发票-确定..');
							switch (that.biz) {
								case 'fpgl':
									let iid = that.state.id;
									let arg = {
										invoiceId: iid
									};
									invoiceDelInvoice(arg).then((diRes) => {
										console.log('删除指定发票..', diRes);
										if (diRes && diRes.success) {
											uni.showToast({
												title: '发票删除成功.',
												icon: 'none',
												duration: 2000
											});

											uni.switchTab({
												url: "/pages/tab-bar/ticket/ticket",
												success() {
													let page = getCurrentPages().pop();
													//跳转页面成功之后           
													if (!page) return;
													page.onLoad(); //如果页面存在，则重新刷新页面	
												}
											});
										}
									});
									break;
								case 'pzsp':
								case 'dksp':
									uni.$emit("recgz-image-delete", that.state);
									uni.navigateBack({});
									break;
							}

						} else if (res.cancel) {
							console.log('删除发票-取消', iid);
						}
					}
				});
			},
			// 发票图像错误
			handleInvoiceImageError() {
				uni.showToast({
					title: '加载发票图像时出错！',
					icon: 'none',
					duration: 2000
				});
			},
			// 预览发票图像
			handlePreviewInvoiceImage() {
				uni.previewImage({
					urls: [this.invoice.invoiceImg],
					indicator: 'default'
				});
			},
			// 获取发票信息
			getInvoice(callback) {
				let that = this;
				if (that.state) {
					invoiceGetInvoice(that.state.id).then((giRes) => {
						console.log('获取发票信息..', giRes);
						if (callback) callback();
						if (giRes && giRes.success) {
							let invoice = giRes.data;
							that.invoice = invoice;
							that.state.id = invoice.id;
							that.setSelectTypes(invoice.source);
						}
					});
				} else {
					if (callback) callback();
				}
			},
			// 保存提交校验
			submitValidate() {
				let that = this;
				let invoice = that.invoice;
				return ValidateInvoice(invoice);
			},
			// 设置可选票种
			setSelectTypes(source) {
				let itypes;
				switch (source) {
					// 微信收票
					case 'WECHAT':
						itypes = InvoiceTypes.filter((item) => {
							return item.value == 'GenerInvoice';
						});
						break;
						// 抵扣收票
					case 'DKSP':
						itypes = InvoiceTypes.filter((item) => {
							return InvoiceDeductible(item.value);
						});
						break;
						// 查验收票
					case 'CYSP':
						itypes = InvoiceTypes.filter((item) => {
							return InvoiceVerifiable(item.value);
						});
						break;
						// 影像收票
					case 'YXSP':
					default:
						itypes = InvoiceTypes;
						break;
				}
				this.invoiceTypes = Clone(itypes);
			},
			fmtInvoiceType(itype) {
				if (!itype) return '';
				return FmtInvoiceType(itype);
			},
			invoicePropEditable(prop) {
				return InvoicePropEditable(this.invoice.invoiceType, prop);
			},
			getInvoicePropName(prop) {
				return GetInvoicePropName(this.invoice.invoiceType, prop);
			},
			invoiceVerifiable() {
				return InvoiceVerifiable(this.invoice.invoiceType);
			},
			fmtInvoiceVerifyStatus(istate) {
				return FmtInvoiceVerifyStatus(istate);
			}
		}
	}
</script>

<style lang="scss">
	.head-section {
		display: block;
		position: relative;
		height: 88rpx;
		font-size: 30rpx;
		text-align: center;
		background-color: #FFFFFF;
		color: #666666;
		line-height: 88rpx;

		.cy-icon {
			display: flex;
			position: absolute;
			top: 0rpx;
			right: 0rpx;
			bottom: 0rpx;
			align-items: center;

			text {
				// border-width: 1rpx;
				// border-style: solid;
				margin-right: 30rpx;
				background-repeat: no-repeat;
				font-size: 20rpx;
				background-size: 25rpx;
				border-radius: 6rpx;
				padding: 0rpx 10rpx 0rpx 40rpx;
				background-position: 10rpx center;
			}

			.cy-null,
			.cy-0,
			.cy-3 {
				color: #F39C39;
				// border-color: #F39C39;
				background-image: url(../../../static/pj/cy-doing.png);
			}

			.cy-1 {
				color: #03A401;
				// border-color: #03A401;
				background-image: url(../../../static/pj/cy-success.png);
			}

			.cy-2 {
				color: #CB0606;
				// border-color: #CB0606;
				background-image: url(../../../static/pj/cy-error.png);
			}
		}
	}

	.body-section {
		position: absolute;
		bottom: 500rpx;
		top: 108rpx;
		left: 0rpx;
		right: 0rpx;
		padding: 15rpx 0rpx 0rpx 0rpx;
		background-color: #FFFFFF;

		.body-content {
			padding: 10rpx 0rpx 0rpx 0rpx;
		}

		.props-item:first-child {
			border: none;
		}

		.props-item {
			height: 80rpx;
			font-size: 34rpx;
			border-top: 1rpx solid #E5E5E5;
			margin: 0rpx 30rpx;
			display: flex;

			.prop-label,
			.prop-value,
			.edit-value {
				display: flex;
				align-items: center;
			}

			picker,
			.prop-value,
			.edit-value {
				width: 74%;
			}

			.prop-label {
				color: #333333;
				width: 26%;
			}

			.prop-value {
				color: #999999;
			}

			.edit-value {
				color: #666666;
			}
		}

		.check-block {
			padding: 0rpx 0rpx;

			.cg-cont {
				padding: 0rpx 30rpx 20rpx 30rpx;

				.cont-item {
					.label {
						font-size: 28rpx;
						color: #555555;
					}

					.value {
						font-size: 26rpx;
						color: #999999;
					}
				}

				.hwmx-cont {
					padding: 0rpx 0rpx;

					.subject {
						font-size: 28rpx;
						color: #555555;
						border-bottom: double 4rpx #333333;
					}

					.hwmx-item {
						padding: 0rpx 10rpx;
						display: flex;
						font-size: 26rpx;
						color: #999999;
						border-bottom: solid 1rpx #777777;

						.mc {
							width: 50%;
						}

						.je {
							width: 25%;
							padding-left: 5rpx;
						}

						.se {
							width: 25%;
							padding-left: 5rpx;
						}
					}
				}
			}

			.sb-cont {
				padding: 0rpx 30rpx 20rpx 30rpx;

				.message {
					display: flex;
					align-items: flex-end;
					font-size: 28rpx;
					color: #FF3333;
					font-weight: 500;

					text {
						font-size: 26rpx;
						color: #C91702;
					}
				}
			}
		}
	}

	.body-section-wt {
		bottom: 140rpx;
	}

	.image-section {
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 380rpx;

		image {
			width: 440rpx;
			height: 340rpx;
			background-color: #EEEEEE;
			border: 1rpx solid #888888;
			border-radius: 10rpx;
		}
	}

	.oprt-section {
		position: absolute;
		bottom: 0rpx;
		height: 480rpx;
		left: 0rpx;
		right: 0rpx;
		padding: 0rpx;

		.btn-group {
			background-color: #FFFFFF;
			display: flex;
			padding: 0rpx 30rpx;
			height: 100rpx;
			justify-content: space-between;

			button {
				width: 48%;
				height: 80rpx;
				line-height: 80rpx;
			}
		}
	}

	.oprt-section-wt {
		height: 120rpx;

		.btn-group {
			height: 120rpx;
			align-items: center;
		}
	}
</style>
