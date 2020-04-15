<template>
	<view>
		<view class="uni-flex user-panel">
			<image class="user-icon" :src="userInfo.avatarUrl"></image>
			<text v-if="hasLogin" class="uni-flex user-name">{{userInfo.nickName}}</text>
			<view v-if="!hasLogin" class="uni-flex user-auth">
				<button type="primary" size="mini" plain="true" open-type="getUserInfo" @getuserinfo="handleLogin">登录</button>
			</view>
		</view>
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
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		authWechatSign,
		groupJoinGroup,
		groupListGroup,
		groupQuitGroup,
		groupSetDefault
	} from '../../../service/service.js';
	import store from '@/store/index.js';

	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				group: {
					name: "无"
				},
				isEmpty: true
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			groups: function() {
				return store.state.mine.addedGroups;
			}
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
					url: '/pages/mine/about-us/about-us'
				});
			},
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
				console.log('点击了登录..', rsp);
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
				this.handleWeChatLogin(detail);
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
			}
		}
	}
</script>

<style>
	.user-panel {
		padding: 30rpx;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		border-bottom: 1px solid #EEEEEE;
		background-color: #FFFFFF;
	}

	.user-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 30rpx;
		border: 1rpx solid #EEEEEE;
	}

	.user-name,
	.user-auth {
		align-items: center;
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
</style>
