<template>
	<view class="page-body">
		<view v-if="biz!='xz'" class="head-section">
			<view class="head-z">
				<text class="status-label">单据状态：</text>
				<text class="status-value">{{fmtReimburseStatus(receipt.reimburseType)}}</text>
			</view>
			<view class="head-y">
				<text v-if="isShowBhyy" @click="handleClickBhyy">查看驳回原因</text>
				<text v-if="isShowDydj" @click="handleClickDydj">打印报销单据</text>
			</view>
		</view>
		<scroll-view class="body-section" :class="{'body-xz':(biz=='xz')}" scroll-y="true">
			<view class="rcpt-props">
				<view class="props-item">
					<view class="prop-label">所属公司：</view>
					<picker v-if="edit" @change="handleGroupChange" :value="groupPickerValue" :range="groups" range-key="name">
						<view class="uni-input">{{receipt.saleInfoName}}</view>
					</picker>
					<text v-else class="uni-input prop-value">{{receipt.saleInfoName}}</text>
				</view>
				<view class="props-item">
					<view class="prop-label">所属部门：</view>
					<view v-if="!edit" class="uni-input prop-value">{{receipt.department}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="所属部门" v-model="receipt.department" />
					</view>
				</view>
				<view class="props-item">
					<view class="prop-label">入账项目：</view>
					<view v-if="!edit" class="uni-input prop-value">{{receipt.entryItems}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="入账项目" v-model="receipt.entryItems" />
					</view>
				</view>
				<view class="props-item">
					<view class="prop-label">提交人：</view>
					<view v-if="!edit" class="uni-input prop-value">{{receipt.submitUser}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="提交人" v-model="receipt.submitUser" />
					</view>
				</view>
				<view class="props-item">
					<view class="prop-label">支付方式：</view>
					<view class="uni-input prop-value">银行转账</view>
				</view>
				<view class="props-item">
					<view class="prop-label">开户银行：</view>
					<view v-if="!edit" class="uni-input prop-value">{{receipt.bankName}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" placeholder="开户银行" v-model="receipt.bankName" />
					</view>
				</view>
				<view class="props-item">
					<view class="prop-label">银行账号：</view>
					<view v-if="!edit" class="uni-input prop-value">{{receipt.bankAccount}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" type="number" maxlength="20" placeholder="银行账号" v-model="receipt.bankAccount" />
					</view>
				</view>
				<view class="props-item">
					<view class="prop-label">报销金额：</view>
					<view v-if="!edit" class="uni-input prop-value">{{receipt.reimburseAmount}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" type="digit" maxlength="10" placeholder="报销金额" v-model="receipt.reimburseAmount" />
					</view>
				</view>
				<view v-if="!edit" class="props-item">
					<view class="prop-label">付款金额：</view>
					<view class="uni-input prop-value">{{receipt.payAmount}}</view>
				</view>
				<view v-if="!edit" class="props-item">
					<view class="prop-label">提交时间：</view>
					<view class="uni-input prop-value">{{receipt.submitDate}}</view>
				</view>
			</view>
			<view class="rcpt-items">
				<view v-for="(item,ridx) in receiptItems" v-bind:key="ridx" class="rcpt-item">
					<view class="item-head">
						<view class="head-z">
							<view class="item-name">
								<text>费用项目{{ridx+1}}</text>
							</view>
							<view class="item-type">
								<text class="type-label">费用标签：</text>
								<picker v-if="edit" @change="handleChargeChange" v-bind:id="ridx" :value="0" :range="rimbsTags" range-key="entryName">
									<text class="type-value">{{item.fymc}}</text>
								</picker>
								<text v-else class="type-value">{{item.fymc}}</text>
							</view>
						</view>
						<view class="head-y">
							<view v-if="edit&&(receiptItems.length>1)" v-bind:id="ridx" @click="handleDelItme">
								<text>删除项目</text>
								<image src="../../../static/bx/icon-del-item.png"></image>
							</view>
							<view v-if="edit" v-bind:id="ridx" @click="handleAddItme">
								<text>增加项目</text>
								<image src="../../../static/bx/icon-add-item.png"></image>
							</view>
						</view>
					</view>
					<view class="item-cont">
						<view class="ls-name">
							<text>票据</text>
							<view v-if="edit" v-bind:id="ridx" @click="handleChooseInvoices" class="oprt">
								<text>增加票据</text>
								<image src="../../../static/bx/icon-add-bill.png"></image>
							</view>
						</view>
						<view class="ls-item" v-for="(invoice,iidx) in item.invoices" v-bind:key="iidx">
							<text class="lx">{{invoice.fplx}}</text>
							<text class="rq">{{invoice.kprq}}</text>
							<text class="je">&#165;{{fmtMoney(invoice.je)}}</text>
							<text class="sc" v-if="edit" v-bind:id="ridx+','+iidx" @click="handleDelInvoice">删除</text>
						</view>
						<view class="ls-foot">
							<text class="zs">小计张数：{{item.zs}}</text>
							<text class="je">小计金额：&#165;{{fmtMoney(item.je)}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="foot-section">
			<view class="foot-content">
				<view class="props-row">
					<view class="zs">
						<text>合计票据：</text>
						<text class="value">{{receipt.zs}}</text>
					</view>
					<view class="je">
						<text>合计金额：</text>
						<text class="value">&#165;{{fmtMoney(receipt.je)}}</text>
					</view>
				</view>
				<view class="oprts-row">
					<button v-if="edit" @click="handleSubmit" type="primary">提交</button>
					<button v-if="!edit&&biz!='xz'&&receipt.reimburseType=='Rejected'" @click="handleUpdate" type="primary">编辑</button>
					<button v-if="!edit&&biz=='ck'&&receipt.reimburseType=='Rejected'" @click="handleDelete" type="warn">删除</button>
					<button v-if="edit" @click="handleCancel" type="default">取消</button>
					<button v-if="(!edit&&receipt.reimburseType!='Rejected')" @click="handleReturn" class="return" type="default">返回</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reimburseAddReimburse,
		reimburseGetReimburse,
		reimburseListRimbsTags,
		reimburseDeleteReimburse
	} from '@/service/service.js';
	import store from '@/store/index.js';
	import {
		PropIsEmpty,
		FmtInvoiceType,
		FmtReimburseStatus
	} from '@/common/spb.js';
	export default {
		data() {
			let deftReceiptItems = [{
				fymc: '无',
				fyId: 0,
				invoices: [],
				zs: 0,
				je: 0
			}];
			let deftReceipt = {
				id: 0,
				saleInfoId: 0,
				saleInfoName: '',
				tenantId: 0,
				zs: 0,
				je: 0
			};
			let deftRimbsTags = [];
			return {
				rtid: 0,
				edit: true,
				biz: 'xz', //xz:新增 ck:查看
				title: '新增报销单',
				receipt: {},
				receiptItems: deftReceiptItems,
				rimbsTags: deftRimbsTags
			}
		},
		beforeDestroy: function() {
			console.log('报销单详情页面销毁..');
			let r = store.state.reimburse;
			r.allChosenInvoice = [];
			r.crtChosenInvoice = [];
		},
		onLoad(option) {
			let that = this;
			if (option.biz != undefined) {
				that.biz = option.biz;
			}
			if (that.biz == 'xz') {
				// 新增报销单据
				that.seltDeftGroup();
			} else if (that.biz == 'ck') {
				that.title = '查看报销单';
				that.edit = false;
				if (option.id != undefined) {
					that.rtid = option.id;
					// 查询报销单据
					that.reqGetReimburse(that.rtid);
				}
			}

			uni.setNavigationBarTitle({
				title: that.title
			});
		},
		// 下拉刷新列表
		onPullDownRefresh() {
			if (this.edit) {
				uni.stopPullDownRefresh();
				return;
			}

			console.log('下拉刷新报销信息..');
			this.reqGetReimburse(this.rtid, function() {
				uni.stopPullDownRefresh();
			});
		},
		computed: {
			isShowBhyy: function() {
				if (this.edit) {
					return false;
				}
				return (this.receipt.reimburseType == 'Rejected');
			},
			isShowDydj: function() {
				if (this.edit) {
					return false;
				}
				let status = this.receipt.reimburseType;
				return (status && status != 'Auditing' && status != 'Rejected');
			},
			groups:function(){
				return store.state.mine.addedGroups;
			},
			groupPickerValue: function() {
				let that = this;
				let idx = -1;
				let gs = that.groups;
				let gId = that.receipt.saleInfoId;
				for (let i = 0; i < gs.length; i++) {
					if (gs[i].groupId == gId) {
						idx = i;
						break;
					}
				}
				return idx;
			}
		},
		methods: {
			// 处理返回操作
			handleReturn() {
				console.log('处理返回操作..');
				uni.navigateBack({
					delta: 1
				});
			},
			// 处理编辑操作
			handleUpdate() {
				console.log('处理编辑操作..');
				this.edit = true;
			},
			// 处理取消操作
			handleCancel() {
				console.log('处理取消操作..');
				let biz = this.biz;
				if (biz == 'xz') {
					uni.navigateBack({
						delta: 1
					});
				} else if (biz == 'ck') {
					this.edit = false;
				}
			},
			// 处理删除操作
			handleDelete() {
				console.log('处理删除操作..');
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确实删除些报销单？',
					success: function(res) {
						if (res.confirm) {
							reimburseDeleteReimburse(that.rtid).then(res => {
								if (res.success) {
									uni.showModal({
										title: '删除提示',
										showCancel: false,
										content: '删除成功！'
									});
									uni.switchTab({
										url: "/pages/tab-bar/reimburse/reimburse",
										success() {
											let page = getCurrentPages().pop();
											//跳转页面成功之后           
											if (!page) return;
											page.onLoad(); //如果页面存在，则重新刷新页面	
										}
									});
								} else {
									uni.showModal({
										title: '删除提示',
										showCancel: false,
										content: res.message
									});
								}
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			// 处理点击驳回原因
			handleClickBhyy() {
				console.log('点击驳回原因按钮..');
				let that = this;
				uni.showModal({
					title: '驳回原因',
					showCancel: false,
					content: that.receipt.rejectReason
				});
			},
			// 处理点击打印单据
			handleClickDydj() {
				console.log('点击打印单据按钮..');
				uni.navigateTo({
					url: `../print/print?id=${this.rtid}`
				});
			},
			// 处理保存事件
			handleSubmit() {
				let errmsg = this.submitValidate();
				if (errmsg != '') {
					uni.showToast({
						icon: 'none',
						title: errmsg
					});
					return;
				}
				let arg = this.buildSubmitData();
				console.log('提交保存报销..');
				reimburseAddReimburse(arg).then((arRes) => {
					console.log('保存报销结果..', arRes);
					if (arRes && arRes.success) {
						uni.navigateTo({
							url: `../../result/submit-reimburse-result/submit-reimburse-result?success=true&recepit=${arRes.data}`
						});
					}
				});
			},
			// 处理切换企业
			handleGroupChange(e) {
				console.log('选择更改报销企业..', e);
				let gs = this.groups;
				let group = gs[e.detail.value];
				if (group) {
					let receipt = this.receipt;
					let groupId = group.groupId;
					if (receipt.saleInfoId == groupId) {
						console.log('报销企业没有更改..');
						return;
					}
					receipt.saleInfoId = groupId;
					receipt.saleInfoName = group.name;
					receipt.tenantId = group.tenantId;
					this.receiptItems.forEach((item) => {
						item.fyId = 0;
						item.fymc = '无';
					});
					this.loadRimbsTags(groupId);
				}
			},
			// 处理切换费用
			handleChargeChange(e) {
				console.log('选择更改项目费用..', e);
				let riidx = e.currentTarget.id;
				let rtidx = e.detail.value;
				let ri = this.receiptItems[riidx];
				let rt = this.rimbsTags[rtidx];
				if (rt) {
					if (ri.fyId == rt.id) {
						console.log('项目费用没有更改..');
						return;
					}
					ri.fyId = rt.id;
					ri.fymc = rt.entryName;
				}
			},
			// 处理添加项目
			handleAddItme(e) {
				console.log('处理添加项目..');
				let ridx = e.currentTarget.id
				this.receiptItems.splice(ridx + 1, 0, {
					fymc: '无',
					fyId: 0,
					invoices: [],
					zs: 0,
					je: 0
				});
			},
			// 处理删除项目
			handleDelItme(e) {
				console.log('处理删除项目..');
				let ridx = e.currentTarget.id;
				let invs = this.receiptItems[ridx].invoices;
				this.receiptItems.splice(ridx, 1);
				// 恢复发票可选
				let aci = store.state.reimburse.allChosenInvoice;
				invs.forEach((item) => {
					let delIdx = -1;
					let fpId = item.fpId;
					aci.forEach((aciItem, aciIdx) => {
						if (aciItem.fpId == fpId) {
							delIdx = aciIdx;
							return;
						}
					});
					if (delIdx != -1) {
						aci.splice(delIdx, 1);
					}
				});
				this.computeRecepitItems();
			},
			// 处理删除发票 
			handleDelInvoice(e) {
				console.log('处理删除发票..');
				let ids = e.currentTarget.id.split(',');
				let rdx = ids[0];
				let idx = ids[1];
				let item = this.receiptItems[rdx];
				let invs = item.invoices;
				let fpId = invs[idx].fpId;
				invs.splice(idx, 1);
				// 恢复发票可选
				let aci = store.state.reimburse.allChosenInvoice;
				let delIdx = -1;
				aci.forEach((aciItem, aciIdx) => {
					if (aciItem.fpId == fpId) {
						delIdx = aciIdx;
						return;
					}
				});
				if (delIdx != -1) {
					aci.splice(delIdx, 1);
				}
				// 计算项目的票据
				this.computeRecepitItems();
			},
			// 处理选择票据
			handleChooseInvoices(e) {
				let that = this;
				console.log('处理选择票据..');
				let rdx = e.currentTarget.id;
				let ivs = that.receiptItems[rdx].invoices;
				let cci = [];
				ivs.forEach((iv) => {
					cci.push({
						fpId: iv.fpId
					});
				});
				store.state.reimburse.crtChosenInvoice = cci;
				console.log("当前费用项目已选择的发票..", cci);
				uni.$once('ReimburseChooseInvoices', function(data) {
					console.log('监听到事件来自 ReimburseChooseInvoices');
					that.synchronizeChosenInvoices(rdx);
				});
				uni.navigateTo({
					url: `../../ticket/choose/choose?biz=xz&reimburseId=${that.rtid}`
				});
			},
			// 同步选票信息
			synchronizeChosenInvoices(rdx) {
				let ri = this.receiptItems[rdx];
				let ivs = [];
				let cci = store.state.reimburse.crtChosenInvoice;
				cci.forEach((item) => {
					ivs.push(item);
				});
				ri.invoices = ivs;
				this.computeRecepitItems();
			},
			// 选中默认企业
			seltDeftGroup(){
				let that = this;
				let gs = that.groups;
				let group = null;
				if (gs.length > 0) {
					for (let i = 0; i < gs.length; i++) {
						if (gs[i].default) {
							group = gs[i];
							break;
						}
					}
				}
				if (group != null) {
					let groupId = group.groupId;
					let receipt = that.receipt;
					receipt.saleInfoId = groupId;
					receipt.saleInfoName = group.name;
					receipt.tenantId = group.tenantId;
					that.loadRimbsTags(groupId);
				}
			},
			// 加载报销标签
			loadRimbsTags(groupId) {
				let that = this;
				console.log('请求获取报销标签..');
				reimburseListRimbsTags(groupId).then((lrtRes) => {
					console.log('获取报销标签结果..', lrtRes);
					if (lrtRes && lrtRes.success) {
						that.rimbsTags = lrtRes.data;
					}
				});
			},
			// 构造提交数据
			buildSubmitData() {
				let r = this.receipt;
				r.userId = store.state.userInfo.userId;
				let items = [];
				let ris = this.receiptItems;
				ris.forEach((ri) => {
					let ivs = ri.invoices;
					ivs.forEach((iv) => {
						items.push({
							reimbursementSettingId: ri.fyId,
							entryName: ri.fymc,
							invId: iv.fpId,
							id: iv.riid,
							invoiceTime: iv.kprq
						});
					});
				});
				let data = {
					reimburse: r,
					reimburseItem: items
				};
				return data;
			},
			// 请求获取报销单信息
			reqGetReimburse(reimburseId, callback) {
				let that = this;
				console.log('请求获取报销单信息..');
				reimburseGetReimburse(reimburseId).then((rgrRes) => {
					console.log('获取报销单信息结果..', rgrRes);
					if (callback) callback();
					if (rgrRes && rgrRes.success) {
						that.parseReturnData(rgrRes.data);
					}
				});
			},
			// 解析响应数据
			parseReturnData(rdata) {
				let that = this;
				that.receipt = rdata.reimburse;
				let ritems = rdata.items;
				let items = [];
				let aci = [];
				store.state.reimburse.allChosenInvoice = aci;
				ritems.forEach((ritem) => {
					let invoices = [];
					ritem.invItem.forEach((rinvoice) => {
						invoices.push({
							riid: rinvoice.id,
							fpId: rinvoice.invId,
							fplx: that.fmtInvoiceType(rinvoice.invoiceType),
							kprq: rinvoice.invoiceTime,
							je: rinvoice.sumAmount
						});
						aci.push({
							fpId: rinvoice.invId
						});
					});
					let item = {
						fyId: ritem.entryId,
						fymc: ritem.entryName,
						invoices: invoices,
						zs: 0,
						je: 0
					};
					items.push(item);
				})
				that.receiptItems = items;
				that.computeRecepitItems();
			},
			// 计算报销项目
			computeRecepitItems() {
				let r = this.receipt;
				let ris = this.receiptItems;
				console.log('费用项目明细..', ris);
				let zs = 0;
				let je = 0;
				ris.forEach((item) => {
					this.computeItemInvoices(item);
					zs += item.zs;
					je += parseFloat(item.je);
				});
				r.zs = zs;
				r.je = parseFloat(je);
			},
			// 计算项目发票
			computeItemInvoices(item) {
				let zs = 0;
				let je = 0;
				item.invoices.forEach((invoice) => {
					zs += 1;
					je += parseFloat(invoice.je);
				});
				item.zs = zs;
				item.je = parseFloat(je);
			},
			// 保存提交校验
			submitValidate() {
				let receipt = this.receipt;
				if (receipt.saleInfoId == 0) {
					return '请选择报销单所对应的公司哦';
				}
				if (PropIsEmpty(receipt.department) ||
					!(/^\S{1,25}$/.test(receipt.department))) {
					return '所属部门只能填写25个汉字哦';
				}
				if (PropIsEmpty(receipt.entryItems) ||
					!(/^\S{1,25}$/.test(receipt.entryItems))) {
					return '入账项目只能填写25个汉字哦';
				}
				if (PropIsEmpty(receipt.submitUser) ||
					!(/^\S{2,10}$/.test(receipt.submitUser))) {
					return '提交人只能填写2-10个汉字哦';
				}
				if (PropIsEmpty(receipt.bankName) ||
					!(/^\S{1,25}$/.test(receipt.bankName))) {
					return '开户银行只能填写25个汉字哦';
				}
				if (PropIsEmpty(receipt.bankAccount) ||
					!(/^([1-9]{1})(\d{15}|\d{16}|\d{18})$/.test(receipt.bankAccount))) {
					return '银行账号输入的格式不正确哦';
				}
				if (PropIsEmpty(receipt.reimburseAmount) ||
					!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(receipt.reimburseAmount)) ||
					receipt.reimburseAmount <= 0) {
					return '报销金额应是大于零的数值哦';
				}
				let ris = this.receiptItems;
				if (ris.length < 0) {
					return '请至少添加一项费用项目哦';
				}
				let len = ris.length;
				for (let idx = 0; idx < len; idx++) {
					let item = ris[idx];
					if (item.fyId == 0) {
						return `请选择费用项目${idx + 1}的费用标签`;

					}
					if (item.invoices.length == 0) {
						return `请增加费用项目${idx + 1}的报销单据`;
					}
				}
				return '';
			},
			fmtInvoiceType(itype) {
				return FmtInvoiceType(itype);
			},
			fmtReimburseStatus(istatus) {
				if (!istatus) return '';
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
	.page-body {
		background-color: #F4F4F4;
		height: 100%;
	}

	// 头部
	.head-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;
		height: 88rpx;
		font-size: 30rpx;
		padding: 0rpx 30rpx;

		.head-z,
		.head-y {
			display: flex;
			align-items: center;
		}

		.head-z {
			.status-label {
				color: #333333;
			}

			.status-value {
				color: #D0021B;
			}
		}

		.head-y {
			color: #1BA2E7;

			text {
				margin-left: 20rpx;
			}

			text:first {
				margin-left: 0rpx;
			}
		}

	}

	// 主体
	.body-section {
		position: absolute;
		bottom: 0rpx;
		top: 88rpx;
		left: 0rpx;
		right: 0rpx;
		padding: 10rpx 0rpx 200rpx 0rpx;
		background-color: #F4F4F4;

		.rcpt-props {
			padding: 0rpx 30rpx 0rpx 30rpx;
			background-color: #FFFFFF;
		}

		.props-item:first-child {
			border: none;
		}

		.props-item {
			height: 80rpx;
			font-size: 34rpx;
			border-top: 1rpx solid #E5E5E5;
			display: flex;
			background-color: #FFFFFF;

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

		.rcpt-items {
			padding: 20rpx 0rpx 0rpx 0rpx;
		}

		.rcpt-item {
			padding: 0rpx 30rpx 20rpx 30rpx;

			.item-head {
				display: flex;
				justify-content: space-between;
				padding-bottom: 20rpx;

				.head-z {
					.item-name {
						text {
							color: #333333;
							font-size: 34rpx;
							font-weight: 500;
						}
					}

					.item-type {
						display: flex;
						font-size: 24rpx;

						.type-label {
							color: #999999;
						}

						.type-value {
							color: #1BA2E7;
						}
					}
				}

				.head-y {
					display: flex;
					align-items: center;

					view {
						display: flex;
						align-items: center;
						padding-left: 30rpx;
					}

					text {
						color: #666666;
						font-size: 30rpx;
					}

					image {
						width: 30rpx;
						height: 30rpx;
					}
				}
			}

			.item-cont {
				border: 1rpx solid #FFFFFF;
				border-radius: 15rpx;
				background-color: #FFFFFF;
				padding: 0rpx 30rpx;

				.ls-name,
				.ls-item,
				.ls-foot {
					line-height: 88rpx;
				}

				.ls-name {
					display: flex;
					justify-content: space-between;
					align-items: center;

					text {
						font-size: 30rpx;
						color: #666666;
						font-weight: 500;
					}

					.oprt {
						display: flex;
						align-items: center;

						text {
							font-size: 28rpx;
							font-weight: normal;
							padding-right: 2rpx;
						}

						image {
							width: 30rpx;
							height: 30rpx;
						}
					}
				}

				.ls-item {
					border-top: 1rpx solid #E5E5E5;
					color: #1BA2E7;
					font-size: 26rpx;
					display: flex;
					justify-content: space-around;

					.lx {
						width: 44%;
					}

					.rq {
						width: 26%;
					}

					.je {
						width: 18%;
					}

					.sc {
						color: #EA3D3C;
					}
				}

				.ls-foot {
					display: flex;
					justify-content: space-between;
					color: #666666;

					.zs {
						width: 40%;
					}

					.je {
						width: 60%;
					}
				}
			}
		}
	}

	.body-xz {
		top: 0rpx;
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
			padding: 0rpx 40rpx;
			height: 200rpx;
			color: #666666;

			.props-row {
				display: flex;
				align-items: center;
				height: 100rpx;

				.zs {
					width: 40%;

				}

				.je {
					width: 60%;
				}

				.value {
					color: #D0021B;
				}
			}

			.oprts-row {
				height: 100rpx;
				display: flex;
				justify-content: space-between;

				button {
					width: 48%;
					margin: 0rpx;
					height: 80rpx;
					line-height: 80rpx;
				}

				.return {
					width: 100%;
				}
			}
		}
	}
</style>
