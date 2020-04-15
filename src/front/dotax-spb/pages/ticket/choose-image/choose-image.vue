<template>
	<view class="ci-main">
		<scroll-view class="ci-body" scroll-y="true">
			<view class="head-section">
				<block>
					<view class="head-cont">
						<text v-if="biz=='pzsp'">请点击下方选择/拍照添加票据图片</text>
						<text v-if="biz=='dksp'">
							已获取帐号
							<text style="color: #FF7A08;">{{ userName }}</text>
							的授权
						</text>
					</view>
				</block>
			</view>
			<view class="body-section">
				<view class="title-block">
					<text class="label">点击已选图片后可预览</text>
					<text class="value">{{images.length}}/9</text>
				</view>
				<view class="image-block">
					<block v-for="(image,index) in images" :key="index">
						<view class="image-item">
							<icon @click="handleDelete(index)" type="clear" size="24" />
							<image :src="image" :data-src="image" @click="handlePreviewImage"></image>
						</view>
					</block>
				</view>
			</view>
			<view class="oprt-section">
				<view class="oprt-item" @click="handleChooseImage(1)">
					<image src="../../../static/xp/icon-xp-xc.png"></image>
					<text>相册选择</text>
				</view>
				<view class="oprt-item" @click="handleChooseImage(0)">
					<image src="../../../static/xp/icon-xp-pz.png"></image>
					<text>相机拍照</text>
				</view>
			</view>
		</scroll-view>
		<view class="ci-foot">
			<view class="foot-section">
				<button @click="handleCancel" type="default">取消</button>
				<button @click="handleSubmit" type="primary">提交</button>
			</view>
		</view>
		<uni-popup ref="progress" type="bottom" :maskClick="false" :animation="true">
			<view class="prog-body">
				<view class="prog-cont">
					<text>上传识别中，请稍候...</text>
				</view>
				<progress :percent="submitPercent" border-radius="10" font-size="20" active-mode="forwards" show-info active
				 stroke-width="20" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import {
		BaseUrl
	} from '@/utils/luch-request/index.js';
	import store from '@/store/index.js';
	import {
		Clone,
		InvoiceModel,
		setObjPropNullToEmpty
	} from '@/common/spb.js';

	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				title: '拍照收票',
				images: [],
				submitPercent: 0,
				recgzs: [],
				// pzsp:拍照识票 dksp:抵扣收票
				biz: 'pzsp',
				userName: '',
				userId: ""
			};
		},
		onShow() {
			this.submitPercent = 0;
		},
		onLoad(option) {
			let that = this;
			let biz = option.biz;
			if (biz) that.biz = biz;
			switch (this.biz) {
				case 'dksp':
					that.title = '抵扣收票';
					let scanGrant = uni.getStorageSync('scanGrant');
					if (!scanGrant) {
						uni.showModal({
							content: '请扫二维码授权！',
							showCancel: false,
							success: function(res) {
								uni.switchTab({
									url: '/pages/tab-bar/home/home'
								});
							}
						});
						return;
					}
					let splits = scanGrant.split(',');
					this.userName = splits[0];
					this.userId = splits[1];
					break;
				case 'pzsp':
				default:
					that.title = '拍照识票';
					break;
			}
			uni.setNavigationBarTitle({
				title: that.title
			});
		},
		methods: {
			handlePreviewImage(e) {
				var current = e.target.dataset.src;
				uni.previewImage({
					current: current,
					urls: this.images
				});
			},
			handleChooseImage(flag) {
				if (this.images.length >= 9) {
					uni.showToast({
						icon: 'none',
						title: '您最多可选择9张图片',
						duration: 2000
					});
					return;
				}
				let types;

				switch (flag) {
					case 0:
						types = ['camera'];
						break;
					case 1:
					default:
						types = ['album'];
						break;
				}
				uni.chooseImage({
					sourceType: types,
					sizeType: ['original'],
					count: (9 - this.images.length),
					success: (res) => {
						this.images = this.images.concat(res.tempFilePaths);
					},
					fail: (err) => {
						console.log("授权失败或取消..", err);
						// uni.getSetting({
						// 	success: (res) => {
						// 		let authStatus = false;
						// 		switch (flag) {
						// 			case 0:
						// 				authStatus = res.authSetting['scope.camera'];
						// 				break;
						// 			case 1:
						// 			default:
						// 				 authStatus = res.authSetting['scope.album'];
						// 				break;
						// 		}
						// 		if (!authStatus) {
						// 			uni.showModal({
						// 				title: '授权失败',
						// 				content: '多啦收票宝需要从您的相机或相册获取图片，请在设置界面打开相关权限',
						// 				success: (res) => {
						// 					if (res.confirm) {
						// 						uni.openSetting();
						// 					}
						// 				}
						// 			})
						// 		}
						// 	}
						// });
					}
				})
			},
			// 处理取消操作
			handleCancel() {
				if (this.images.length > 0) {
					uni.showModal({
						content: '您确定放弃上传票据吗？',
						cancelText: '继续',
						confirmText: '放弃',
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack({});
							} else if (res.cancel) {
								console.log('继续选择/拍照上传票据..');
							}
						}
					});
				} else {
					uni.navigateBack({});
				}
			},
			// 处理删除图片
			handleDelete(index) {
				this.images.splice(index, 1);
			},
			// 处理提交操作
			handleSubmit() {
				let that = this;

				if (that.images.length == 0) {
					uni.showModal({
						title: '提示',
						content: '没有可识别的图片，请增加后再提交！',
						showCancel: false,
						success: function(res) {}
					});
					return;
				}
				that.recgzs = [];
				that.$refs.progress.open();
				let userId = store.state.userInfo.userId;
				if (that.biz == 'dksp') {
					userId = that.userId;
				}
				let percent = Math.ceil(100 / that.images.length);
				that.images.forEach((item, index) => {
					setTimeout(() => {
						that.singleSubmit(userId, item, percent);
					}, index * 1500);
				});
			},
			singleSubmit(userId, imageSrc, percent) {
				let that = this;
				console.log('请求上传识别图片..', imageSrc);
				uni.uploadFile({
					url: `${BaseUrl}collect/invoice/OCRCheck`,
					filePath: imageSrc,
					fileType: 'image',
					name: 'image',
					formData: {
						userId: userId,
						biz: that.biz
					},
					success: (rsp) => {
						console.log('上传识别图片响应..', imageSrc, rsp)
						if (rsp.statusCode == 200) {
							console.log('上传识别图片成功..', imageSrc)
							let res = JSON.parse(rsp.data);
							console.log(JSON.stringify(res));
							if (res.success) {
								let invoices = [];
								res.data.forEach((invoice, index) => {
									invoice.recgzStatus = invoice.duplicate ? 2 : 1;
									invoice.localImageSrc = imageSrc;
									invoice.idReiterated = false;
									invoices.push(invoice);
								});
								that.recgzs.push(invoices);
								return;
							}
						}
						// 设置识别失败的默认发票对象
						let empty = Clone(InvoiceModel);
						let deftType = "GenerInvoice";
						switch (that.biz) {
							case 'dksp':
								deftType = 'SpecInvoice';
								empty.source = 'DKSP';
								break;
							case 'pzsp':
							default:
								deftType = 'GenerInvoice';
								empty.source = 'YXSP';
								break;
						}
						empty.invoiceType = deftType;
						empty.idReiterated = false;
						that.recgzs.push([empty]);
					},
					fail: (err) => {
						console.log('上传失败!!', err);
						uni.showToast({
							icon: 'none',
							title: '抱歉，上传图片时出错',
							duration: 2000
						});
					},
					complete: () => {
						console.log('识别的进度条累加..')
						that.submitPercent += percent;
						console.log('判断是否全部完成..');
						// 判断是否全部完成
						if (that.submitPercent >= 100) {
							// 缓存已识别的数据
							console.log('缓存已识别的数据..');
							uni.setStorage({
								key: "RECGZED_IMAGES",
								data: that.recgzs,
								success: () => {
									console.log('缓存数据成功跳转..');
									that.images = [];
									that.submitPercent = 0;
									uni.navigateTo({
										url: `../recgz-images/recgz-images?biz=${that.biz}`
									});
								},
								fail: () => {
									console.log('缓存数据出错提示..');
									uni.showToast({
										icon: 'none',
										title: '缓存已识别数据时出错！',
										duration: 2000
									});
								},
								complete: () => {
									console.log('延迟后关闭进度条..');
									// 延迟1.5秒后关闭进度条
									setTimeout(() => {
										that.closeProgressPopup();
									}, 1500)
								}
							});
						}
					}
				});
			},
			openProgressPopup() {
				this.$refs.progress.open();
			},
			closeProgressPopup() {
				this.$refs.progress.close();
			}
		}
	}
</script>

<style lang="scss">
	.ci-main {
		background-color: #FFFFFF;
	}

	.ci-body {
		position: absolute;
		bottom: 0rpx;
		top: 0rpx;
		left: 0rpx;
		right: 0rpx;
		padding: 0rpx 0rpx 120rpx 0rpx;

		.head-section {
			padding: 30rpx 30rpx 0rpx 30rpx;

			.head-cont {
				border-radius: 15rpx;
				background-image: linear-gradient(90deg, #2377EB, #5D01C8);
				letter-spacing: 2rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 150rpx;
				color: #FFFFFF;
				font-size: 34rpx;
				font-weight: 600;
			}
		}

		.body-section {
			padding: 0rpx 30rpx;

			.title-block {
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0rpx 10rpx;

				.label {
					color: #333333;
					font-size: 28rpx;
				}

				.value {
					color: #999999;
					font-size: 32rpx;
					font-weight: 600;
				}
			}

			.image-block {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				flex-direction: row;
				padding: 15rpx 0rpx;
				border-top: 1rpx solid #CCCCCC;
				border-bottom: 1rpx solid #CCCCCC;

				.image-item {
					width: 210rpx;
					height: 210rpx;
					background-color: #FAFAFA;
					margin: 10rpx 10rpx;
					position: relative;

					icon {
						position: absolute;
						top: 5rpx;
						right: 5rpx;
					}

					image {
						width: 210rpx;
						height: 210rpx;
					}
				}
			}
		}

		.oprt-section {
			display: flex;
			justify-content: space-around;
			padding: 0rpx 30rpx;
			margin-top: 20rpx;

			.oprt-item {
				width: 270rpx;
				height: 200rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				background-color: #FAFAFA;
				border-radius: 12rpx;

				image {
					width: 100rpx;
					height: 80rpx;
				}

				text {
					color: #666666;
					font-size: 28rpx;
				}
			}
		}
	}

	.ci-foot {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		height: 120rpx;
		border-top: 1rpx solid #E5E5E5;
		background-color: #FFFFFF;

		.foot-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 120rpx;
			padding: 0rpx 30rpx;

			button {
				width: 48%;
				margin: 0rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
		}
	}

	.prog-body {
		display: flex;
		justify-content: center;
		padding: 0rpx 30rpx 200rpx 30rpx;
		flex-direction: column;
		align-items: center;

		.prog-cont {
			font-size: 36rpx;
			font-weight: 600;
			color: #09BA07;
			display: flex;
			align-items: center;
		}
	}
</style>
