<template>
	<view class="page-body">
		<scroll-view class="body-section" :class="{'body-xz':(biz=='xz')}" scroll-y="true">
			<view class="rcpt-props">
				<view class="props-item">
					<view class="prop-label bx_16">所属组织<text class='ired'></text></view>
					<view v-if="!edit" class="uni-input prop-value">{{receipt.organization}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" v-model="receipt.organization" />
					</view>
				</view>
				<view class="props-item bxsmv">
					<view class="prop-label bx_sm">报销说明<text class='ired'>*</text></view>
				</view>
				<view class="bxsmarea" v-if="edit">
					<textarea v-model="receipt.description"/>
				</view>
				<view class="bxsmarea" v-if="!edit">
					<text>{{receipt.description}}</text>
				</view>
				<view class="props-item">
					<view class="prop-label bx_16 bx_je">报销金额<text class='ired'>*</text></view>
					<view v-if="!edit" class="uni-input prop-value">{{fmtMoney(receipt.reimburseAmount)}}</view>
					<view v-else class="edit-value">
						<input class="uni-input" type="digit" maxlength="10" v-model="receipt.reimburseAmount" />
					</view>
				</view>
			</view>
			<view class="rcpt-items" v-if="edit">
				<view v-for="(item,ridx) in receiptItems" v-bind:key="ridx" class="rcpt-item">
					<view class="item-head fylist">
						<view class="head-z fyxm">
							<view class="item-name">
								<text class='fyxmbt'>费用项目{{ridx+1}}</text>
							</view>
							<view class="item-type">
								<text class="type-label fybq">费用标签</text>
								<picker @change="handleChargeChange" v-bind:id="ridx" :value="0" :range="rimbsTags" range-key="entryName">
									<!-- <image :src="item.imgUrl" mode=""></image> -->
									<text class="type-value">{{item.fymc}}</text>
								</picker>
							</view>
						</view>
						<view class="head-y">
							<view v-if="(receiptItems.length>1)" v-bind:id="ridx" @click="handleDelItme">
								<text class='scpj'>删除</text>
							</view>
						</view>
					</view>
					<view class="item-cont">
							<view class="ls-name">
								<text>票据</text>
								<view v-bind:id="ridx" @click="handleChooseInvoices" class="oprt">
									<image class='addpj' src="../../../static/bx/add_piaoju.png"></image>
								</view>
							</view>
							<view class="ls-item" v-for="(invoice,iidx) in item.invoices" v-bind:key="iidx">
								<text class="lx">{{invoice.fplx}}</text>
								<text class="rq">{{invoice.kprq}}</text>
								<text class="je">&#165;{{fmtMoney(invoice.je)}}</text>
								<text class="sc" v-if="edit" v-bind:id="ridx+','+iidx" @click="handleDelInvoice">删除</text>
							</view>
							<view class="ls-foot">
								<text class="zs">小计张数<text class='jjjl'>{{item.zs}}</text></text>
								<text class="je">小计金额<text class='jjjl'>&#165;{{fmtMoney(item.je)}}</text></text>
							</view>
							
							<view v-bind:id="ridx" @click="handleAddItme" class='tjxm'>
								<image src="../../../static/bx/add_icon.png" mode=""></image>
								<text>添加项目</text>
							</view>
					</view>
					
				</view>
				<view class="ls-foot zzshj" style="height: 80rpx;">
					<text class="zs">合计票据:<text class="jjjl">{{receipt.zs}}</text></text>
					<text class="je">合计金额:<text class="jjjl">&#165;{{fmtMoney(receipt.je)}}</text></text>
				</view>
			</view>
			<view class="rcpt-items" v-if="!edit">
				<view v-for="(item,ridx) in receipt.items" v-bind:key="ridx" class="rcpt-item">
					<view class="item-head fylist">
						<view class="head-z fyxm">
							<view class="item-name">
								<text class='fyxmbt'>费用项目{{ridx+1}}</text>
							</view>
							<view class="item-type">
								<text class="type-label fybq">费用标签</text>
								<text class="type-value">{{item.itemName}}</text>
							</view>
						</view>
					</view>
					<view class="item-cont">
							<view class="ls-name">
								<text>票据</text>
							</view>
							<view class="ls-item" v-for="(invoice,iidx) in item.tickets" v-bind:key="iidx">
								<text class="lx">{{item.itemName}}</text>
								<text class="rq">{{invoice.ticketDate | formatDate}}</text>
								<text class="je">&#165;{{fmtMoney(invoice.ticketAmount)}}</text>
								<text class="sc" v-if="edit" v-bind:id="ridx+','+iidx" @click="handleDelInvoice">删除</text>
							</view>
							<view class="ls-foot">
								<text class="zs">小计张数<text class='jjjl'>{{item.tickets.length}}</text></text>
								<text class="je">小计金额<text class='jjjl'>&#165;{{fmtMoney(sumAmount)}}</text></text>
							</view>
					</view>
				</view>
				<view class="ls-foot zzshj" style="height: 80rpx;">
					<text class="zs">合计票据:<text class="jjjl">{{hj}}</text></text>
					<text class="je">合计金额:<text class="jjjl">&#165;{{fmtMoney(hjMoney)}}</text></text>
				</view>
				<view class="zzs">已查验增值税发票<text class="jjjl">{{hj}}</text>张</view>
			</view>
			<view class="sp">
				<view class="" v-if="edit">
					<view class='sct pjjj'>
						<view>审批人<text class='ired'>*</text></view>
						<view>
							<view class="spr" v-for="(item,index) in sprList" :key="index" v-if="isImg">
								<image class='addspr' :src="item.avatarUrls[0]"></image>
							</view>
							<image class='addspr' @click="addSpr" src="../../../static/bx/add_icon1.png"></image>
						</view>
					</view>
					<view class='sct pjjj'>
						<view>抄送人</view>
						<view>
							<view class="spr" v-for="(item,index) in cprList" :key="index" v-if="isImg">
								<image class='addspr' :src="item.avatarUrls[0]"></image>
							</view>
							<image class='addspr' @click="addCsr" src="../../../static/bx/add_icon1.png"></image>
						</view>
					</view>
				</view>
					<view class='sct pjjj' v-if="!edit">
						<view>审批流程</view>
						<view class="splc">
							<view class="spInfo" v-for="(items,i) in receipt.records" :key="i">
								<view class="one">
									<view class="addspr">
										<image class='' :src="items.avatarUrl"></image>
									</view>
									<view class="spName">
										<view class="">{{items.nickName}}</view>
										<view class="">{{items.createTime | formatDate}}</view>
										<view class="jy">{{items.actionRemark}}</view>
									</view>
									<view class="spType">{{items.action1}}</view>
								</view>
								<view class="two" v-if="items.children.length>0" v-for="(item,ixs) in items.children" :key="ixs">
									<view class="addspr">
										<image class='' :src="item.operatorAvatarUrl"></image>
									</view>
									<view class="spName">
										<view class="">{{item.operatorNickName}}</view>
										<view class="">{{item.createTime | formatDate}}</view>
										<view class="jy">{{item.actionRemark}}</view>
									</view>
									<view class="spType">{{item.action1}}</view>
								</view>
							</view>
						</view>
					</view>
			</view>
		</scroll-view>
		<view class="foot-section">
			<view class="foot-content">
				<view class="oprts-row sct">
					<button class='bdtj' v-if="edit" @click="handleSubmit" type="primary">提交</button>
					<view class="spDetail" v-if="!edit">
						<button type="default" @click="spCC()">抄送</button>
						<button  type="default" @click="this.$refs.spJJ.open()">拒绝</button>
						<button  type="default" @click="this.$refs.spTG.open()">同意</button>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="spTG" type="bottom" class="bindPhone">
			<view class="phone">
				<textarea v-model="approvalRemark" placeholder="请输入审批意见..." />
				<view class="p_btn" @click="spTG()">同意</view>
			</view>
		</uni-popup>
		<uni-popup ref="spJJ" type="bottom" class="bindPhone">
			<view class="phone">
				<textarea v-model="approvalRemark" placeholder="请输入审批意见..." />
				<view class="p_btn" @click="spJJ()">拒绝</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		reimburseAddReimburse,
		reimburseGetReimburse,
		reimburseListRimbsTags,
		reimburseDeleteReimburse,
		addReimburse,
		getReimburse,
		spCC,
		spJJ,
		spTG,
		xxCord 
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
				fymc: '请选择费用类别',
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
			// ,"住宿费","餐饮费","快递费","办公费","通讯费","其他"
			let deftRimbsTags = [
									{id:1,entryName:"交通费"},
									{id:2,entryName:"住宿费"},
									{id:3,entryName:"餐饮费"},
									{id:4,entryName:"快递费"},
									{id:5,entryName:"办公费"},
									{id:6,entryName:"通讯费"},
									{id:7,entryName:"其他"},
								];
			return {
				rtid: 0,
				edit: true,
				biz: 'xz', //xz:新增 ck:查看
				title: '报销',
				receipt: {},
				sumAmount:0,
				hj:0,
				hjMoney: 0,
				receiptItems: deftReceiptItems,
				rimbsTags: deftRimbsTags,
				sprList: [],
				cprList:[],
				isImg: false,
				isAdd: false,
				spUsers: [],
				ccUsers: [],
				approvalRemark: ''
				// spUsers:[]
			}
		},
		beforeDestroy: function() {
			console.log('报销单详情页面销毁..');
			let r = store.state.reimburse;
			r.allChosenInvoice = [];
			r.crtChosenInvoice = [];
		},
		filters: {
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
				return MM + '-' + d + " " + h + ':' + m;
			}
		},
		onLoad(option) {
			// console.log(store.state.mine.addedGroups)
			console.log(option)
			// let option = JSON.parse(option)
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
					console.log(11331,that.rtid)
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
			this.sumAmount = 0;
			this.hj = 0;
			this.hjMoney = 0;
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
			...mapState(['hasLogin', 'userInfo']),
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
				// console.log(22222,this.spUsers)
				let that = this;
				let arg = this.buildSubmitData();
				let nikeName = store.state.userInfo.nickName;
				console.log('提交保存报销 开始........')
				console.log(arg)
				console.log('提交保存报销 结束........');
				addReimburse(arg).then((rgrRes) => {
					console.log('获取报销单信息结果..', rgrRes);
					if (rgrRes.success) {
						console.log(122211,rgrRes)
						// xxCord({
						// 	name:nikeName,
						// 	openId:that.spUsers[0].userId,        //接受人的openId   (都需要)
						// 	msgType:"0",                      //审批状态             (都需要)
						// 	dep:that.receipt.organization,                      //所属公司             (都需要)
						// 	reimburseType:"报销费用" ,   //所属部门              (抄送 需要)
						// 	reason:that.receipt.description,                 //报销事由              (都需要)
						// 	tenantKey:"2de434e8e88f575d",   //报销事由    (都需要)
						// 	reimburseMentId:that.rtid,         //报销信息id           ( 都需要)
						// }).then((xres) => {
						// 	console.log(222222,xres)
						// });
						// xxCord({
						// 	name:nikeName,
						// 	openId:that.ccUsers[0].userId,        //接受人的openId   (都需要)
						// 	msgType:"3",                      //审批状态             (都需要)
						// 	dep:that.receipt.organization,                      //所属公司             (都需要)
						// 	childDep:"子部545454门",   //所属部门              (抄送 需要)
						// 	reason:that.receipt.description,                 //报销事由              (都需要)
						// 	tenantKey:"2de434e8e88f575d",   //报销事由    (都需要)
						// 	reimburseMentId:that.rtid,         //报销信息id           ( 都需要)
						// }).then((xres) => {
						// 	console.log(222222,xres)
						// })
						uni.navigateTo({
							url: `../../result/submit-reimburse-result/submit-reimburse-result_tt?success=true&recepit=${rgrRes.data}`
						});
					}
				})
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
					ri.fymc= rt.entryName;
				}
			},
			// 处理添加项目
			handleAddItme(e) {
				console.log('处理添加项目..');
				//let ridx = e.currentTarget.id;
				let ridx = this.receiptItems.length;
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
					url: `../../ticket/choose/choose_tt?biz=xz&reimburseId=${that.rtid}`
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
				let that = this;
				let r = this.receipt;
				r.userId = store.state.userInfo.userId;
				let items = [];
				let tickets = [];
				let ris = this.receiptItems;
				ris.forEach((ri) => {
					let ivs = ri.invoices;
					ivs.forEach((iv) => {
						tickets.push({
							ticketId:iv.fpId
						});
						items.push({
							reimbursementId: 0,
							itemName: ri.fymc,
							tickets:tickets
						});
					});
				});
				this.sprList.map((ev) => {
					var userId = ev.openId;
					that.spUsers.push({
						source:"MP-FEISHU",
						userId:userId
					});
				});
				this.cprList.map((ev) => {
					var userId = ev.openId;
					that.ccUsers.push({
						source:"MP-FEISHU",
						userId:userId
					});
				});
				let data = {
					reimbursementId: 0,
					source: "MP-FEISHU",
					subject: "报销主题",
					reimburseNo: "",
					organization: r.organization,
					reimburseAmount: r.reimburseAmount,
					description: r.description,
					userId: r.userId,
					items: items,
					spUsers: that.spUsers,
					ccUsers: that.ccUsers,
					records: [],
					
				};
				console.log(JSON.stringify(data))
				
				return data;
			},
			// 请求获取报销单信息
			reqGetReimburse(id, callback) {
				let that = this;
				let length;
				let money;
				let userId = store.state.userInfo.userId;
				console.log('请求获取报销单信息..');
				getReimburse({
					reimbursementId:id,
					source:"MP-FEISHU",
					userId:userId
				}).then((rgrRes) => {
					console.log('获取报销单信息结果..111', rgrRes);
					that.receipt = rgrRes.data;
					let arr = [];
					that.receipt.items.map((ev) => {
						length = ev.tickets.length;
						console.log(32332,ev)
						arr = ev.tickets;
						that.hj += length;
						arr.map((e) => {
							that.hjMoney += e.ticketAmount;
						})
						
					});
					arr.map((e) => {
						that.sumAmount += e.ticketAmount;
					})
					
					that.receipt.records.map((item) =>{
						// console.log(213231,item.pendingApproverUserId)
						if(item.action== "XZ") {
							item.action1 = "发起";
						} else if(item.action == "CC") {
							item.action1="抄送";
						} else if(item.action == "JJ") {
							item.action1="拒绝";
						} else if(item.action == "TG") {
							item.action1 = "通过";
						}
						if(item.children.length > 0) {
							item.children.map((ev) => {
								if(ev.action== "XZ") {
									ev.action1 = "发起";
								} else if(ev.action == "CC") {
									ev.action1="抄送";
								} else if(ev.action == "JJ") {
									ev.action1="拒绝";
								} else if(ev.action == "TG") {
									ev.action1 = "通过";
								}
							})
						}
						
					});
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
				if (PropIsEmpty(receipt.organization) ||
					!(/^\S{1,25}$/.test(receipt.organization))) {
					return '所属组织只能填写25个汉字哦';
				}
				if (PropIsEmpty(receipt.description) ||
					!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(receipt.description)) ||
					receipt.description <= 0) {
					return '请填写报销说明';
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
			},
			//添加审批人
			addSpr() {
				let that = this;
				//  #ifdef MP-TOUTIAO
						tt.chooseContact({
							multi: true,
							ignore:true,
						    success (res) 
							{
								that.sprList = res.data;
								that.isImg = true;
								console.log(3443423,that.sprList)
						    },
						    fail (res) {
						       console.log(res)
						    }
						});
				// #endif
			},
			//添加抄送人
			addCsr(){
				let that = this;
				//  #ifdef MP-TOUTIAO
						tt.chooseContact({
							multi: true,
							ignore:true,
						    success (res) 
							{
								that.cprList = res.data;
								that.isImg = true;
						    },
						    fail (res) {
								console.log(11)
						       console.log(res)
						    }
						});
				// #endif
			},
			// 审批通过
			spTG() {
				let that = this;
				let userId = store.state.userInfo.userId;
				spTG({
					reimbursementId: that.rtid,
					approvalRemark:that.approvalRemark,
					source:"MP-FEISHU",
					userId:userId
				}).then((res) => {
					console.log(res)
					if(res.success) {
						that.$refs.spTG.close();
						// xxCord({
						// 	openId:userId,        //接受人的openId   (都需要)
						// 	msgType:"1",                      //审批状态             (都需要)
						// 	dep:that.receipt.organization,                      //所属公司             (都需要)
						// 	reason:that.receipt.description,                 //报销事由              (都需要)
						// 	tenantKey:"2de434e8e88f575d",   //报销事由    (都需要)
						// 	reimburseMentId:that.rtid,         //报销信息id           ( 都需要)
						// 	reimburseType:''
						// }).then((xres) => {
						// 	console.log(222222,xres)
						// })
					}
				})
			},
			// 审批拒绝
			spJJ() {
				let that = this;
				let userId = store.state.userInfo.userId;
				spJJ({
					reimbursementId: that.rtid,
					approvalRemark:that.approvalRemark,
					source:"MP-FEISHU",
					userId:userId
				}).then((res) => {
					console.log(res)
					if(res.success) {
						that.$refs.spJJ.close();
						// xxCord({
						// 	openId:userId,        //接受人的openId   (都需要)
						// 	msgType:"2",                      //审批状态             (都需要)
						// 	dep:that.receipt.organization,                      //所属公司             (都需要)
						// 	reason:that.receipt.description,                 //报销事由              (都需要)
						// 	tenantKey:"2de434e8e88f575d",   //报销事由    (都需要)
						// 	reimburseMentId:that.rtid,         //报销信息id           ( 都需要)
						// 	money:that.receipt.reimburseAmount
						// }).then((xres) => {
						// 	console.log(222222,xres)
						// })
					}
					
				})
			},
			//审批抄送
			spCC() {
				let that = this;
				let userId = store.state.userInfo.userId;
				let nikeName = store.state.userInfo.nickName;
				//#ifdef MP-TOUTIAO
				tt.chooseContact({
					multi: true,
					ignore:true,
				    success (res) {
						console.log(res)
						that.cprList = res.data;
						that.cprList.map((ev) => {
							var userId = ev.openId;
							that.ccUsers.push({
								source:"MP-FEISHU",
								userId:userId
							});
						});
						spCC({
							reimbursementId: that.rtid,
							approvalRemark: "看一看",
							source: "MP-FEISHU",
							userId: userId,
							ccUsers: that.ccUsers
						}).then((cres) => {
							// xxCord({
							// 	name:nikeName,
							// 	openId:that.ccUsers[0].userId,        //接受人的openId   (都需要)
							// 	msgType:"3",                      //审批状态             (都需要)
							// 	dep:"总部门",                      //所属公司             (都需要)
							// 	childDep:"子部545454门",   //所属部门              (抄送 需要)
							// 	reason:that.receipt.description,                 //报销事由              (都需要)
							// 	tenantKey:"2de434e8e88f575d",   //报销事由    (都需要)
							// 	reimburseMentId:that.rtid,         //报销信息id           ( 都需要)
							// }).then((xres) => {
							// 	console.log(222222,xres)
							// 	if(xres.success) {
							// 		uni.showModal({
							// 			title: '提示',
							// 			content: xres.message,
							// 			success: (mres) => {
							// 				if (res.confirm) {
							// 					uni.navigateTo({
							// 						url: '../../tab-bar/reimburse/reimburse_tt'
							// 					})
							// 				}
							// 			}
							// 		});
							// 	}
							// })
							// console.log(11111,cres)
							
							
						})
				    },
				    fail (res) {
						console.log(res)
				    }
				});
				//#endif
			}
		}
	}
</script>

<style lang="scss">
	.jy {
		background-color: #F4F4F4;
		color: #999;
		padding-left: 10rpx;
	}
	.zzshj {
		margin: 0 !important;
		.je {
			margin-left: 120rpx;
		}
	}
	.zzs {
		margin: 0 32rpx;
	}
	.bindPhone {
		z-index: 1000;
	}
	
	.phone {
		border-top: 1rpx solid #fff;
		border-bottom: 1rpx solid #fff;
		background-color: #fff;
		padding: 0 32rpx;
		.p_btn {
			width: 100%;
			height: 96rpx;
			background-color: #3d94ff;
			color: #fff;
			font-size: 32rpx;
			line-height: 96rpx;
			text-align: center;
			margin-top: 80rpx;
			margin-bottom: 40rpx;
			border-radius: 8rpx;
		}
		textarea {
			margin-top: 20rpx;
		}
	}
	
	
	.splc {
		background-color: #fff;
		padding-bottom: 40rpx;
		margin-top: 20rpx;
		.spInfo {
			margin-top: 20rpx;
			.one {
				display: flex;
				.addspr,.spName,.spType {
					flex: 1;
					justify-items: center;
					justify-content: space-between;
				}
				.spName {
					margin-left: -120rpx;
				}
				.addspr image {
					width: 98rpx;
					height: 98rpx;
					margin-top: -20rpx;
				}
				.spType {
					text-align: right;
					margin-right: 32rpx;
					color: #09BB07;
				}
			}
			.two {
				margin-top: 10rpx;
				display: flex;
				margin-left: 160rpx;
				.addspr,.spName,.spType {
					flex: 1;
					justify-items: center;
					justify-content: space-between;
				}
				.spName {
					margin-left: -100rpx;
					view {
						font-size: 24rpx;
					}
				}
				.addspr image {
					width: 60rpx;
					height: 60rpx;
					margin-top: -20rpx;
				}
				.spType {
					text-align: right;
					margin-right: 32rpx;
					color: #09BB07;
					font-size: 24rpx;
				}
			}
			
		}
	}
	
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
		top: 0rpx;
		left: 0rpx;
		right: 0rpx;
		padding: 10rpx 0rpx 120rpx 0rpx;
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
			// border-top: 1rpx solid #E5E5E5;
			display: flex;
			background-color: #FFFFFF;

			.prop-label{
				text-align: left;
				line-height: 80rpx;
			}
			.prop-value,
			.edit-value {
				text-align: right;
				margin-right: 32rpx;
				color: #333;
			}

			picker,
			.prop-value,
			.edit-value {
				width: 74%;
				
			}

			.prop-label {
				color: #333333;
				font-size: 30rpx;
				width: 26%;
			}

			.prop-value {
				color: #333;
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
				.ls-item {
					margin: 0 32rpx;
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
					// display: flex;
					// justify-content: space-around;

					.lx {
						// width: 44%;
						margin-left: 32rpx;
						margin-right: 40rpx;
					}

					.rq {
						// width: 26%;
						margin-right: 40rpx;
					}

					.je {
						// width: 18%;
					}

					.sc {
						float: right;
						margin-right: 32rpx;
						color: #b60000;
					}
				}

				.ls-foot {
					display: flex;
					justify-content: space-between;
					color: #666666;

					.zs {
						width: 40%;
						margin-left: 0;
					}

					.je {
						width: 60%;
						margin-left: 0;
					}
					
				}
			}
			.ls-foot {
				display: flex;
				justify-content: space-between;
				color: #666666;
			
				.zs {
					width: 40%;
					margin-left: 0;
				}
			
				.je {
					width: 60%;
					margin-left: 0;
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
			color: #666666;

			.props-row {
				.value {
					color: #D0021B;
				}
				.je {
					margin-left: 132rpx !important;
				}
			}

			.oprts-row {
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				
				button {
					// width: 48%;
					margin: 20rpx 0;
					height: 80rpx;
					line-height: 80rpx;
				}
				.spDetail {
					display: flex;
					justify-content: space-between;
					// margin-left: 180rpx;
					width: 100%;
					margin: 0 32rpx;
					button {
						flex: 1;
						text-align: center;
						
					}
					uni-button:after {
						border: none !important;
					}
					uni-button[type=default] {
						background-color: #fff;
					}
				}
				.return {
					width: 100%;
				}
			}
		}
	}
	
	
	.tjxm
	{
		background: #FFF;
		color: #3d94ff;
		font-size: 28rpx;
		line-height: 92rpx;
		text-align: center;
		margin-bottom: 20rpx;
		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 16rpx;
			vertical-align: middle;
		}
	}
	.rcpt-props,.fylist,.body-section .rcpt-item,.body-section .rcpt-item .item-cont
	{
		padding:0 !important;
		background-color: #f4f4f4 !important;
	}
	.bx_16
	{
		padding: 32rpx auto 32rpx 32rpx;
		font-size: 30rpx;
		color:#333;
		margin-left: 32rpx;
	}
	.bx_sm
	{
		padding: 32rpx auto 32rpx 32rpx;
		font-size: 30rpx;
		color:#333;
		margin-left: 32rpx;
	}
	.bx_je
	{
		margin-bottom: 0;
	}
	.props-item
	{
		margin-bottom: 20rpx;
	}
	.fyxm
	{
		margin-left: 32rpx;
	}
	.fyxmbt
	{
		font-size: 32rpx !important;
		color: #666666 !important;
	}
	.body-section .rcpt-item .item-cont
	{
		background-color: #FFF !important;
	}
	.ls-name,.ls-foot
	{
		margin-left: 32rpx;
		margin-right: 32rpx;
	}
	.item-cont
	{
		margin-bottom: 32rpx;
	}
	.body-section .rcpt-items{
		padding: 24rpx 0 0 0;
	}
	.scpj
	{
		margin-right: 32rpx;
		color:#3D94FF !important;
	}
	.item-head
	{
		margin-bottom: 24rpx;
	}
	.fybq
	{
		margin-right: 8rpx;
	}
	.body-xz
	{
		padding-top: 0px;
	}
	.oprt,.addpj
	{
		width: 48rpx !important;
		height: 48rpx !important;
	}
	.bdtj
	{
		width:100% !important;
		padding: 0 32rpx;
		background-color: #3D94FF;
		height: 96rpx;
		line-height: 96rpx;
	}
	.foot-content
	{
		height:auto;
	}
	.spr {
		display: inline-block;
	}
	.addspr
	{
		border-radius: 30rpx;
		height:60rpx;
		width:60rpx;
		margin: 24rpx 0px;
		margin-right: 16rpx;
	}
	.csr
	{
		height:60rpx;
		width:60rpx;
		margin: 32rpx 0 24rpx 0;
	}
	.uni-view
	{
		font-size: 30rpx;
		color: #333;
	}
	.foot-content
	{
		padding:0 !important;
		background: #F4F4F4;
	}
	.sct,.bxsmarea
	{
		background-color: #FFF;
	}
	.bxsmarea {
		padding-left:32rpx;
		margin-bottom: 20rpx;
	}
	.oprts-row
	{
		height:120rpx !important;
	}
	.pjjj
	{
		margin-bottom: 20rpx !important;
		padding-top: 32rpx;
	}
	
	.jjjl
	{
		margin: 0 16rpx;
		color: #b60000;
	}
	.ls-foot
	{
		justify-content: normal !important;
	}
	.je
	{
		// margin-left: 24rpx;
	}
	.zs {
		margin-left: 32rpx;
	}
	.zs,.je
	{
		float: left;
		// width: 50% !important;
	}
	input
	{
		text-align: right;
		font-size: 30rpx;
		color: #333;
	}
	.ired
	{
		color: #b60000;
	}
	.bxsmv
	{
		margin-bottom: 0rpx !important;
	}
	.bxsmarea
	{
		padding-right: 40rpx;
	}
	uni-textarea
	{
		width: auto;
		line-height: 48rpx;
		font-size: 28rpx !important;
		color: #999999 !important;
	}
	.uni-picker-item
	{
		background-image: url('../../../static/me/LOGO.png') !important;
		background-repeat: no-repeat;
		background-size: 68rpx;
	}
	.lx
	{
		width:32% !important;
		margin-left: 12rpx;
	}
	.rq
	{
		width:22% !important;
	}
	.sp {
		padding: 0 32rpx;
		background-color: #fff;
		.props-row {
			display: flex;
			.zs,.je {
				flex: 1;
			}
			.je {
				padding-left: 16rpx;
			}
		}
	}
</style>
