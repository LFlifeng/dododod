<template>
	<view>
		<view class="uni-flex user-panel">
			<image class="user-icon" :src="userInfo.avatarUrl"></image>
			<text v-if="hasLogin" class="uni-flex user-name">{{userInfo.nickName}}</text>
			<view v-if="!hasLogin" class="uni-flex user-auth">
				<!-- #ifdef MP-TOUTIAO -->
				<button type="primary" size="mini" plain="true" @click="handleTouTiaoLogin()">登录</button>
				<!-- #endif -->
				<!-- #ifndef MP-TOUTIAO -->
				<button type="primary" size="mini" plain="true" open-type="getUserInfo" @getUserInfo="handleLogin">登录</button>
				<!-- #endif -->
			</view>
		</view>
		<!-- #ifdef MP-TOUTIAO -->
		<view>
			<!-- <view class="spb-navi-item" @click="handleChooseGroup">
				<text class="spb-navi-text">我的组织</text>
				<text class="spb-navi-text spb-navi-text_tt">{{group.name}}</text>
			</view> -->
			<view class="spb-navi-item" @click="handleShowbindPhone">
				<text class="spb-navi-text">绑定手机号</text>
				<text class="spb-navi-text spb-navi-text_tt">{{message}}</text>
			</view>
		</view>
		<view class="ab_fy">
			<!-- <view class="spb-navi-item">
				<picker v-if="edit" @change="handleChargeChange" v-bind:id="ridx" :value="0" :range="rimbsTags" range-key="entryName">
					<text class="type-value">费用项目</text>
					<text class="type-value">{{item.fymc}}</text>
				</picker>
				<text v-else class="type-value">{{item.fymc}}</text>
			</view> -->
			<view class="spb-navi-item" @click="handleAboutUs">
				<text class="spb-navi-text">关于收票宝</text>
				<text class="spb-navi-icon uni-icon">&#xe470;</text>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-TOUTIAO -->
		<view>
			<view class="spb-navi-item" @click="handleChooseGroup">
				<text class="spb-navi-text">我的组织：{{group.name}}</text>
				<text class="spb-navi-icon uni-icon">&#xe470;</text>
			</view>
			<view class="spb-navi-item" @click="handleAboutUs">
				<text class="spb-navi-text">关于收票宝</text>
				<text class="spb-navi-icon uni-icon">&#xe470;</text>
			</view>
		</view>
		<!-- #endif -->
		<!-- 组织弹层 -->
		<uni-popup ref="gList" type="bottom" @change="handleGListPopupChange">
			<view class="group-body">
				<view v-if="isEmpty" class="group-empty">您目前没有加入企业，点击“扫一扫”添加吧！</view>
				<view v-if="!isEmpty">
					<scroll-view class="group-list" scroll-y="true">
						<radio-group class="radio-group" @change="handleDefaultGroupChange">
							<block v-for="(item) in groups" :key="item.id">
								<view class="spb-navi-item">
									<view class="group-name">
										<icon v-show="!item.default" type="clear" size="18" color="#F76260" v-bind:id="item.id" @click="handleQuitGroup" />
										<icon v-show="item.default" type="info" size="18" />
										<text>{{item.name}}</text>
									</view>
									<view class="group-oprt">
										<radio :value="item.id" :checked="item.default" />
									</view>
								</view>
							</block>
						</radio-group>
					</scroll-view>
				</view>
				<view class="group-scan">
					<image mode="scaleToFill" src="../../../static/scanning.png" @click="handleScan" />
					<button type="primary" @click="handleScan">扫码加入企业</button>
				</view>
				<view class="group-close" @click="handelCloseGList">
					<icon type="cancel" size="26" color="#999999" />
				</view>
			</view>
		</uni-popup>
		<!-- 绑定手机 -->
		<uni-popup ref="bindPhone" type="bottom" class="bindPhone">
			<view class="phone">
				<view class="">
					<view class="p_text">请输入手机号</view>
					<view class="p_num">
						<text class="p_text1">86+</text>
						<input type="tel" v-model="this.tel" placeholder="请输入手机号" />
					</view>
					<view class="p_btn" @click="handleShowBindCode()">下一步</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="bindCode" type="bottom" class="bindPhone">
			<view class="phone">
				<view class="">
					<view class="p_text">请输入验证码</view>
					<view class="p_yCode">
						<input class="p_yNum" type="text" v-model="this.code" placeholder="请输入验证码" />
					</view>
					<view class="p_btn" @click="handleShowIsBind()">下一步</view>
				</view>
			</view>
		</uni-popup>
		<!-- 绑定成功 -->
		<uni-popup ref="bind" type="bottom" class="bindPhone">
			<view class="phone_succ">
				<image class="p_succ" src="../../../static/me/编组@3x.png" mode=""></image>
				<view class="p_succText">恭喜你，绑定手机号成功！</view>
				<view class="p_btn" @click="this.$refs.bind.close()">完成</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		authTouTiaoSign,
		authWechatSign,
		groupJoinGroup,
		groupListGroup,
		groupQuitGroup,
		groupSetDefault,
		getAuthCode,
		getBindPhone
	} from '../../../service/service.js';
	import {
		ActionJcdl
	} from '@/utils/actions.js';
	import store from '@/store/index.js';

	export default {
		components: {
			uniPopup
		},

		data() {
			let deftReceiptItems = [{
				fymc: '无',
				fyId: 0,
				invoices: [],
				zs: 0,
				je: 0
			}];
			let deftRimbsTags = [{
					id: 1,
					entryName: "交通费"
				},
				{
					id: 2,
					entryName: "住宿费"
				},
				{
					id: 3,
					entryName: "餐饮费"
				},
				{
					id: 4,
					entryName: "快递费"
				},
				{
					id: 5,
					entryName: "办公费"
				},
				{
					id: 6,
					entryName: "通讯费"
				},
				{
					id: 7,
					entryName: "其他"
				},
			];
			return {
				group: {
					name: "无"
				},
				isEmpty: true, //是否有组织
				isBind: false, //是否绑定手机
				tel: '',
				code: '', //验证码
				receiptItems: deftReceiptItems,
				rimbsTags: deftRimbsTags,
				edit: true
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			groups: function() {
				return store.state.mine.addedGroups;
			},
			message: function() {
				return this.isBind ? this.tel : '未绑定';
			},
		},
		onLoad(option) {},
		onShow() {
			if (store.state.hasLogin) {
				this.loadListGroup();
			}
			if (store.state.mine.popupScan) {
				console.log('弹出扫码加入企业..')
				this.$refs.gList.open();
				store.state.mine.popupScan = false;
			}
			// this.handleChargeChange()
		},
		watch: {
			'groups': function(val) {
				store.state.hasGroup = val.length > 0;
			}
		},
		methods: {
			...mapMutations(['login']),
			// 选择企业
			handleChooseGroup() {
				this.$refs.gList.open();
			},
			// 关于我们
			handleAboutUs() {
				uni.navigateTo({
					url: '/pages/mine/about-us/about-us_tt'
				});
			},
			//头条授权登录 
			handleTouTiaoLogin() {
				tt.login({
					success: (res) => {
						console.log('登录成功..', res);
						if (res.errMsg !== 'login:ok') {
							uni.showModal({
								title: '',
								content: '请求登录授权失败：' + res.errMsg,
								showCancel: false
							});
							return;
						}
						authTouTiaoSign({
							code: res.code
						}).then((awRes) => {
							console.log('授权成功..', awRes);
							if (awRes.success) {
								let userInfo = awRes.data;
								// user.userId = awRes.data.userId;
								this.login(userInfo);
								store.state.hasLogin = true;
								uni.showToast({
									title: '登录成功',
									icon: 'none',
									duration: 2000
								});
								uni.$emit('LOGIN_SUCCESS', {});
								// console.log('登录用户信息..', store.state.userInfo);
								// this.loadListGroup();
							}
						});

					},
					fail: (err) => {
						console.log('授权失败..', err);
						uni.showModal({
							title: '',
							content: '授权失败：' + err,
							showCancel: false
						});
					}
				});
			},
			//微信授权登录
			handleWeChatLogin(detail) {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						console.log('登录成功..', res);
						if (res.errMsg !== 'login:ok') {
							uni.showModal({
								title: '',
								content: '请求登录授权失败：' + res.errMsg,
								showCancel: false
							});
							return;
						}
						authWechatSign({
							code: res.code
						}).then((awRes) => {
							console.log('授权成功..', awRes);
							if (awRes && awRes.success) {
								let user = detail.userInfo;
								user.userId = awRes.data.userId;
								this.login(user);
								uni.$emit('LOGIN_SUCCESS', {});
								console.log('登录用户信息..', store.state.userInfo);
								this.loadListGroup();
							}
						});
					},
					fail: (err) => {
						console.log('授权失败..', err);
						uni.showModal({
							title: '',
							content: '授权失败：' + err,
							showCancel: false
						});
					}
				});
			},
			// 授权登录
			handleLogin(rsp) {
				console.log('点击了登录..');
				let detail = rsp.detail;
				let errMsg = detail.errMsg;
				if (errMsg !== 'getUserInfo:ok') {
					uni.showModal({
						title: '',
						content: '获取用户信息失败：' + errMsg,
						showCancel: false
					});
					return;
				}
				//#ifdef MP-TOUTIAO
				this.handleTouTiaoLogin();
				//#endif
				//#ifndef MP-TOUTIAO
				this.handleWeChatLogin(detail);
				//#endif


			},
			// 企业列表显隐
			handleGListPopupChange(e) {
				let args = {
					animation: true
				};
				if (e.show) {
					uni.hideTabBar(args);
				} else {
					uni.showTabBar(args);
				}
			},
			// 关闭企业列表
			handelCloseGList() {
				this.$refs.gList.close();
			},
			// 扫码加入企业
			handleScan() {
				let that = this;
				uni.scanCode({
					onlyFromCamera: true,
					scanType: 'qrCode',
					success: function(res) {
						//企业码格式：TenantId,企业ID,企业名称
						let cont = res.result;
						console.log('扫码识别的内容..', res);
						that.joinToGroup(cont);
					},
					fail: function(err) {
						console.log('扫码取消/失败!!', err);
					}
				});
				/* 测试代码 */
				// let cont = '8,35,多啦财税科技有限公司';
				// let cont = '3,36,河北悟诚信息技术有限公司';
				// console.log('扫码识别的内容：', cont);
				// that.joinToGroup(cont);
			},
			// 退出已加企业
			handleQuitGroup(e) {
				let that = this;
				let gid = e.target.id;
				console.log('请求退出已加企业..', gid);
				groupQuitGroup({
					userGroupId: gid
				}).then((res) => {
					console.log('退出已加企业结果..', res);
					if (res && res.success) {
						let ggs = store.state.mine.addedGroups;
						for (let i = 0; i < ggs.length; i++) {
							if (ggs[i].id == gid) {
								ggs.splice(i, 1);
								break;
							}
						}
					}
				});
			},
			// 设置默认企业
			handleDefaultGroupChange(e) {
				let that = this;
				let gid = e.detail.value;
				console.log('请求设置默认企业..');
				groupSetDefault({
					userGroupId: gid
				}).then((res) => {
					console.log('设置默认企业结果..', res);
					if (res && res.success) {
						let ggs = store.state.mine.addedGroups;
						for (let i = 0; i < ggs.length; i++) {
							let g = ggs[i];
							if (g.id == gid) {
								g.default = true;
							} else {
								if (g.default) {
									g.default = false;
								}
							}
							if (g.default) {
								that.group = g;
							}
						}
					}
				});
			},
			// 加载企业列表
			loadListGroup() {
				let that = this;
				let ggs = store.state.mine.addedGroups;
				if (ggs.length < 1) {
					console.log('请求获取企业列表..');
					groupListGroup().then((res) => {
						console.log('获取企业列表结果..', res);
						if (res && res.success) {
							let gs = res.data;
							ggs = gs;
							setDeftGroup(gs);
						}
					});
				} else {
					setDeftGroup(ggs);
				}

				function setDeftGroup(gs) {
					that.isEmpty = (gs.length < 1);
					if (gs.length > 0) {
						for (let i = 0; i < gs.length; i++) {
							if (gs[i].default) {
								that.group = gs[i];
								break;
							}
						}
					}
				}
			},
			joinToGroup(cont) {
				let that = this;
				if (!(/^\d{1,5},\d{1,5},[^,]+$/.test(cont))) {
					uni.showModal({
						title: '',
						content: '请扫描多啦票单通企业二维码',
						showCancel: false,
						confirmText: '我知道了'
					});
					return;
				}
				let props = cont.split(',');
				let tenantId = props[0];
				let groupId = props[1];
				let groupName = props[2];
				uni.showModal({
					title: '温馨提示',
					content: `您确认加入【${groupName}】吗？`,
					success: function(result) {
						if (result.confirm) {
							console.log('请求加入到企业..');
							groupJoinGroup({
								tenantId: tenantId,
								groupId: groupId
							}).then((jgRes) => {
								console.log('加入到企业结果..', jgRes);
								if (jgRes && jgRes.success) {
									let g = jgRes.data;
									let ggs = store.state.mine.addedGroups;
									ggs.push(g);
									if (that.isEmpty) {
										that.isEmpty = false;
									}
									if (g.default) {
										that.group = g;
									}
								}
							});
						} else if (result.cancel) {
							console.log('取消加入到企业..');
						}
					},
					cancel: function() {
						console.log('取消加入到企业..');
					}
				});
			},

			
			// 绑定手机弹层
			handleShowbindPhone() {
				let dl = ActionJcdl();
				if (!dl) {
					return;
				}
				this.$refs.bindPhone.open();
			},
			handleShowBindCode() {
				if (this.tel.length != 11) {
					uni.showToast({
						title: "手机号不正确",
						icon: 'none',
						duration: 2000
					});
					return;
				}
				getAuthCode({
					phone: this.tel
				}).then((res) => {
					if(!res.success) {
						return ;
					}
					console.log("已发送验证码", res);
					this.$refs.bindPhone.close();
					this.$refs.bindCode.open();
				})
				
			},
			handleShowIsBind() {
				getBindPhone({
					code: this.code,
					phone: this.tel
				}).then((res) => {
					console.log("绑定手机号", res)
					if (!res.success) {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
						return;
					}
					this.tel = this.tel;
					this.isBind = true;
					this.$refs.bindCode.close();
					this.$refs.bind.close();

				})

			},
			// 选择费用项目
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
		}
	}
</script>

<style lang="scss">
	.user-panel {
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
	}

	.user-icon {
		width: 98rpx;
		height: 98rpx;
		border-radius: 60rpx;
		margin: 32rpx;
	}

	.user-name,
	.user-auth {
		align-items: center;
		font-size: 34rpx;
	}

	/* 组织列表 */
	.group-body {
		text-align: center;
		background-color: #FFFFFF;
	}

	.group-close {
		height: 80rpx;
		text-align: center;
		background-color: #EEEEEE;
		color: #999999;
		align-items: center;
		display: flex;
		justify-content: center;
	}

	.group-scan {
		margin-top: 80rpx;
		text-align: center;
	}

	.group-scan image {
		width: 140rpx;
		height: 140rpx;
		margin: 0rpx auto 0rpx auto;
	}

	.group-scan button {
		width: 260rpx;
		height: 60rpx;
		font-size: 22rpx;
		border-radius: 12rpx;
		margin: 30rpx auto 44rpx auto;
		line-height: 60rpx;
		border: 1rpx solid #3D94FF;
		color: #333;
	}

	.group-list {
		max-height: 400rpx;
		font-size: 24rpx;
	}

	.group-list .spb-navi-item {
		justify-content: space-between;
	}

	.group-list .group-name {
		display: flex;
		color: #666666;
		align-items: center;
	}

	.group-name text {
		padding-left: 10rpx;
	}

	.group-list .group-oprt {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.group-oprt text {
		font-size: 20rpx;
		padding-right: 10rpx;
		color: #888888;
	}

	.group-empty {
		font-size: 26rpx;
		color: #666666;
		padding-top: 60rpx;
		text-align: center;
		width: 100%;
	}

	.spb-navi-item {
		clear: both;
		.type-value {
			font-size: 34rpx;
		}
	}

	.spb-navi-item .spb-navi-text:nth-child(1) {
		font-size: 34rpx;
		color: #333;
		float: left;
	}

	.spb-navi-item .spb-navi-text_tt {
		font-size: 34rpx;
		color: #999;
		float: right;
	}

	.spb-navi-item .spb-navi-icon {
		float: right;
		line-height: 88rpx;
	}

	.ab_fy {
		margin-top: 20rpx;
	}

	/* 绑定手机 */
	.bindPhone {
		z-index: 1000;
	}

	.phone {
		border-top: 1rpx solid #fff;
		border-bottom: 1rpx solid #fff;
		background-color: #fff;
		padding: 0 40rpx;
	}

	.p_text {
		margin-top: 80rpx;
		font-size: 36rpx;
		color: #666;
	}

	.p_num,
	.p_yCode {
		border: 2rpx solid #979797;
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 24rpx;
		clear: both;

		input {
			float: left;
			width: 50%;
			height: 100%;
			line-height: 80rpx;
			margin-left: 30rpx;
		}
	}

	.p_text1 {
		color: #999;
		margin-left: 32rpx;
		float: left;
	}

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

	.yBind {
		margin-top: 144rpx;
		text-align: center;
		color: #666;
		font-size: 36rpx;
	}

	.phone_succ {
		text-align: center;
		background-color: #fff;
		border-bottom: 1px solid #fff;
		padding: 0 40rpx;
	}

	.p_succ {
		width: 100rpx;
		height: 100rpx;
		margin-top: 60rpx;
	}

	.p_succText {
		margin-top: 24rpx;
		color: #666;
		font-size: 32rpx;
	}

	.p_yCode {
		border: none;

		input {
			width: 100%;
			border: 2rpx solid #979797;
			margin-left: 0rpx;
		}

		.p_yNum {
			text-align: center;
		}

		.p_yText {
			float: right;
			font-size: 32rpx;
		}
	}
</style>
