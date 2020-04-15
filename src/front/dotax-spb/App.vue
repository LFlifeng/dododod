<script>
	import store from '@/store/index.js';
	import {
		authTouTiaoSign,
		authWechatSign,
		groupListGroup
	} from '@/service/service.js';
	export default {
		onLaunch: function() {
			let that = this;
			// #ifdef MP-TOUTIAO
			// tt.login({
			// 	success: (lRes) => {
			// 		console.log('登录成功..', lRes);
			// 		if (lRes.errMsg == 'login:ok') {
			// 			// tt.getUserInfo({
			// 			// 	success: function(guiRes) {
			// 			// 		console.log('获取授权用户信息正常..', guiRes);
			// 			// 		let errMsg = guiRes.errMsg;
			// 			// 		if (errMsg == 'getUserInfo:ok') {
			// 			// 			if (awRes && awRes.success) {
			// 			// 				let user = guiRes.userInfo;
			// 			// 				user.userId = awRes.data.userId;
			// 			// 				let gState = store.state;
			// 			// 				gState.hasLogin = true;
			// 			// 				gState.userInfo = user;
			// 			// 				uni.$emit('LOGIN_SUCCESS', {});
			// 			// 			}
			// 			// 		}
			// 			// 	},
			// 			// 	fail: (err) => {
			// 			// 		console.log('获取授权用户信息出错!!', err);
			// 			// 	}
			// 			// });
						
			// 			authTouTiaoSign({
			// 				code: lRes.code
			// 			}).then((awRes) => {
							
			// 				console.log('授权成功..', awRes);
							
			// 			});
			// 		}
			// 	},
			// 	fail: (err) => {
			// 		console.log('登录失败!!', err);
			// 	}
			// });
			
			//#endif
			//#ifndef MP-TOUTIAO
			uni.getUserInfo({
				provider: 'weixin',
				success: function(guiRes) {
					console.log('获取授权用户信息正常..', guiRes);
					let errMsg = guiRes.errMsg;
					if (errMsg == 'getUserInfo:ok') {
						uni.login({
							provider: 'weixin',
							success: (lRes) => {
								console.log('登录成功..', lRes);
								if (lRes.errMsg == 'login:ok') {
									authWechatSign({
										code: lRes.code
									}).then((awRes) => {
										console.log('授权成功..', awRes);
										if (awRes && awRes.success) {
											let user = guiRes.userInfo;
											user.userId = awRes.data.userId;
											let gState = store.state;
											gState.hasLogin = true;
											gState.userInfo = user;
											uni.$emit('LOGIN_SUCCESS', {});
										}
									});
								}
							},
							fail: (err) => {
								console.log('登录失败!!', err);
							}
						});
					}
				},
				fail: (err) => {
					console.log('获取授权用户信息出错!!', err);
				}
			});
			//#endif
			uni.$on("LOGIN_SUCCESS", function(data) {
				console.log('请求获取企业列表..');
				groupListGroup().then((res) => {
					console.log('获取企业列表结果..', res);
					if (res && res.success) {
						let gState = store.state;
						let ggs = res.data;
						gState.mine.addedGroups = ggs;
						if (ggs.length > 0) {
							gState.hasGroup = true;
						}
					}
				});
			});
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style>
	@import './common/uni.css';
	@import './common/spb.css';
	@import './common/iconfont.css';
</style>
