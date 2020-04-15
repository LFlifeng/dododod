import {
	BaseUrl
} from '@/utils/luch-request/index.js';
import store from '@/store/index.js';
import {
	ParseInvoiceQrcode
} from '@/common/spb.js';
import {
	wechatSyncInvoice
} from '@/service/service.js';

// 检查登录
export const ActionJcdl = () => {
	
	let hasLogin = store.state.hasLogin;
	if (!hasLogin) {
		uni.showModal({
			title: '',
			content: '该功能需用户登录后使用！',
			cancelText: '继续浏览',
			confirmText: '马上登录',
			success: function(res) {
				if (res.confirm) {
					uni.switchTab({
						url: '/pages/tab-bar/mine/mine_tt'
					});
				}
			}
		});
		return false;
	}
	return true;
};

// 检测组织
export const ActionJczz = () => {
	let hasGroup = store.state.hasGroup;
	if (!hasGroup) {
		uni.showModal({
			title: '',
			content: '亲，您还未关联任何组织，无法创建报销单据，快去关联一个企业吧！',
			cancelText: '稍后关联',
			confirmText: '关联组织',
			success: function(res) {
				if (res.confirm) {
					store.state.mine.popupScan = true;
					uni.switchTab({
						url: '/pages/tab-bar/mine/mine'
					});
				}
			}
		});
		return false;
	}
	return true;
}

// 拍照识票
export const ActionPzspDz = () => {
	let dl = ActionJcdl();
	if (!dl) {
		return;
	}
	uni.chooseImage({
		count: 1,
		sizeType: ['original'],
		success: (res) => {
			uni.showLoading({
				title: 'Uploading',
				mask: true
			});
			var imageSrc = res.tempFilePaths[0];
			uni.uploadFile({
				url: `${BaseUrl}collect/invoice/OCRCheck`,
				filePath: imageSrc,
				fileType: 'image',
				name: 'image',
				formData: {
					userId: store.state.userInfo.userId
				},
				success: (rsp) => {
					console.log('上传成功:', rsp)
					if (rsp.statusCode == 200) {
						let res = JSON.parse(rsp.data);
						if (res && res.success) {
							uni.showToast({
								title: '上传成功',
								icon: 'success',
								duration: 1000
							});
							store.state.invoice = res.data[0];
							uni.navigateTo({
								url: '/pages/ticket/detail/detail_tt?biz=pzsp&edit=true'
							});
							return;
						}
					}
					uni.showToast({
						title: '识别失败!',
						icon: 'none',
						duration: 2000
					});
				},
				fail: (err) => {
					console.log('上传失败！', err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		fail: (err) => {
			console.log(err);
			uni.getSetting({
				success: (res) => {
					let authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
					if (!authStatus) {
						uni.showModal({
							title: '授权失败',
							content: '多啦收票宝需要从您的相机或相册获取图片，请在设置界面打开相关权限。',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting()
								}
							}
						})
					}
				}
			});
		}
	});
};

// 拍照收票
export const ActionPzsp = () => {
	let dl = ActionJcdl();
	if (!dl) {
		return;
	}
	uni.navigateTo({
		url: '../../ticket/choose-image/choose-image_tt'
	});
};

// 扫码查验
export const ActionSmcy = () => {
	let dl = ActionJcdl();
	if (!dl) {
		return;
	}
	uni.scanCode({
		success: (res) => {
			console.log(res)
			console.log('扫码成功..', res);
			let iqRes = ParseInvoiceQrcode(res.result);
			if (!iqRes.success) {
				uni.showModal({
					content: '解析出错,请确认扫码图像为增值税发票二维码!',
					cancelText: '我知道了',
					confirmText: '手工录入',
					success: (res) => {
						if (res.confirm) {
							console.log(111)
							uni.navigateTo({
								url: '/pages/ticket/detail/detail_tt?biz=sgcy&edit=true'
							});
						}
						if (res.cancel) {
							console.log('放弃扫码..');
						}
					}
				});
				return;
			}
			let invoice = iqRes.invoice;
			invoice.source = 'CYSP';
			uni.setStorageSync("EDIT_INVOICE", invoice);
			uni.navigateTo({
				url: '/pages/ticket/detail/detail_tt?biz=smcy&edit=true'
			});
		},
		fail: (err) => {
			if (err.errMsg == 'scanCode:fail') {
				uni.showModal({
					cancelText: '我知道了',
					confirmText: '手工录入',
					content: '抱歉，无法识别图片中的二维码',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/ticket/detail/detail?biz=sgcy&edit=true'
							});
						}
					}
				});
			} else if (err.errMsg == 'scanCode:fail cancel') {

			} else {
				uni.getSetting({
					success: (res) => {
						let authStatus = res.authSetting['scope.camera'];
						if (!authStatus) {
							uni.showModal({
								title: '授权失败',
								content: '多啦收票宝需要使用您的相机，请在设置界面打开相关权限!',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting()
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

// 抵扣收票
export const ActionDksp = () => {
	let dl = ActionJcdl();
	if (!dl) {
		return;
	}
	uni.scanCode({
		onlyFromCamera: true,
		scanType: 'qrCode',
		success: function(res) {
			if (res.scanType != 'QR_CODE') {
				uni.showModal({
					content: '请使用二维码！',
					showCancel: false
				});
				return;
			}
			let result = res.result;
			let prefix = result.substring(0, 4);
			if (prefix != 'sbp-') {
				uni.showModal({
					content: '请使用正确的二维码！',
					showCancel: false
				});
				return;
			}
			let stiffix = result.substring(4);
			uni.setStorageSync("scanGrant", stiffix);
			uni.navigateTo({
				url: '../../ticket/choose-image/choose-image?biz=dksp'
			});
		},
		fail: function(msg) {
			console.log(msg);
		},
	});
}

// 微信发票
export const ActionWxfp = () => {
	let dl = ActionJcdl();
	if (!dl) {
		return;
	}
	wx.chooseInvoice({
		success: function(res) {
			console.log('已选择的微信发票..', res);
			if (res.errMsg == 'chooseInvoice:ok') {
				let cis = JSON.parse(res.invoiceInfo);
				let cnt = cis.length;
				if (cnt < 1) return;
				console.log('同步微信发票..');
				let invoices = [];
				cis.forEach((invoice) => {
					invoices.push({
						cardId: invoice.card_id,
						encryptCode: invoice.encrypt_code,
						appId: invoice.app_id
					});
				});
				wechatSyncInvoice({
					'invoices': invoices
				}).then((siRes) => {
					console.log('同步发票结果..');
					if (siRes && siRes.success) {
						uni.navigateTo({
							url: '/pages/result/choose-invoice-result/choose-invoice-result?success=true',
							animationType: 'slide-in-top',
							animationDuration: 300
						});
					}
				});
			}
		},
		fail: function(err) {
			console.log('选取微信发票失败!!', err);
		},
		complete: function() {}
	});
}

// 新增报销
export const ActionXzbx = () => {
	// let dl = ActionJcdl();
	// if (!dl) {
	// 	return;
	// }
	// let zz = ActionJczz();
	// if (!zz) {
	// 	return;
	// }
	uni.navigateTo({
		url: '/pages/reimburse/detail/detail_tt'
	});
}
