<template>
	<view class="ci-main">
		<scroll-view class="ci-body" scroll-y="true">
			<view class="body-section">
				<view class="title-block">
					<text class="label">点击已选图片后可预览</text>
					<text class="value">{{images.length}}/9</text>
				</view>
				<view class="image-block">
					<block v-for="(image,index) in images" :key="index">
						<view class="image-item">
							<image @click="handleDelete(index)" class="icon" src="../../../static/dislike_new.png" mode=""></image>
							<image class="photo" :src="image" :data-src="image" @click="handlePreviewInvoiceImage(image)" @error="handleInvoiceImageError"></image>
						</view>
					</block>
					<view class="image-item add" v-if="isImage">
						<image class="add_img" src="../../../static/add.png" mode="" @click="handleAddImage()"></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="ci-foot">
			<view class="foot-section">
				<button @click="handleSubmit" type="primary">提交</button>
			</view>
		</view>
		<uni-popup ref="btn" type="bottom" class="btn">
			<view class="camera alum ">
				<view class="camera_" @tap="handleChooseImage(0)">拍照</view>
				<view class="camera_" @tap="handleChooseImage(1)">从相册选择</view>
			</view>
			<view class="camera" @tap="handleNaddImage()">取消</view>
		</uni-popup>
		<uni-popup ref="progress" type="bottom" :animation="true" :maskClick="false" >
			<view class="prog-body">
				<view class="prog-cont">
					<text>上传识别中，请稍候...</text>
				</view>
				<progress :percent="submitPercent" border-radius="10" font-size="20" active-mode="forwards" show-info="true" active="true"
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
				userId: "",
				isImage: true
			};
		},
		onShow() {
			
		},
		onReady(){
			
		},
		beforeMount() {
			// this.handleChooseImage(0);
		},
		beforeCreate() {
			
		},
		onLoad(option) {
			this.submitPercent = 0;
			this.handleChooseImage(0);
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
									url: '/pages/tab-bar/home/home_tt'
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
			//打开相机
			handleChooseImage(flag) {
				var that = this;
				if (this.images.length >= 9) {
					uni.showToast({
						icon: 'none',
						title: '您最多可选择9张图片',
						duration: 2000
					});
					this.isImage = false;
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
					// sizeType: ['original'],
					count: (9 - this.images.length),
					success: (res) => {
						this.images = this.images.concat(res.tempFilePaths);
						that.handleNaddImage();
						if (that.images.length >= 9) {
							that.isImage = false;
						}
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
				if (this.images.length < 9) {
					this.isImage = true;
				}
			},
			// 处理提交操作
			handleSubmit() {
				let that = this;
				// uni.navigateTo({
				// 	url: '../recgz-images/recgz-images_tt'
				// })
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
				that.openProgressPopup();
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
			//上传识别图片
			singleSubmit(userId, imageSrc, percent) {
				let that = this;
				// console.log('请求上传识别图片..', imageSrc);
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
						// console.log(rsp)
						// console.log('上传识别图片响应..', imageSrc, rsp)
						if (rsp.statusCode == 200) {
							// console.log('上传识别图片成功..', imageSrc)
							let res = JSON.parse(rsp.data);
							console.log(JSON.stringify(rsp));
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
						// console.log('识别的进度条累加..')
						that.submitPercent += percent;
						// console.log(that.submitPercent)
						// console.log('判断是否全部完成..');
						// 判断是否全部完成
						if (that.submitPercent >= 100) {
							// 缓存已识别的数据
							// console.log('缓存已识别的数据..');
							uni.setStorage({
								key: "RECGZED_IMAGES",
								data: that.recgzs,
								success: () => {
									console.log('缓存数据成功跳转..');
									that.images = [];
									that.submitPercent = 0;
									uni.navigateTo({
										url: `../recgz-images/recgz-images_tt?biz=${that.biz}`
									});
									that.closeProgressPopup();
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
			//打开进度条
			openProgressPopup() {
				this.$refs.progress.open();
			},
			//关闭进度条
			closeProgressPopup() {
				this.$refs.progress.close();
			},
			//添加照片
			handleAddImage() {
				this.$refs.btn.open();
			},
			//取消添加照片
			handleNaddImage() {
				this.$refs.btn.close();
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
			handlePreviewInvoiceImage(images) {
				uni.previewImage({
					urls: [images],
					indicator: 'default'
				});
			},
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
					color: #646a73;
					font-size: 32rpx;
				}
			}

			.image-block {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				flex-direction: row;
				padding: 15rpx 0rpx;

				.image-item {
					width: 210rpx;
					height: 210rpx;
					background-color: #ccc;
					margin: 10rpx 10rpx;
					position: relative;
					text-align: center;
					line-height: 210rpx;

					.icon {
						position: absolute;
						top: 10rpx;
						right: 10rpx;
						width: 24rpx;
						height: 24rpx;
						z-index: 100;
					}

					.photo {
						width: 210rpx;
						height: 210rpx;
					}
				}

				.add {
					background-color: #000;
					opacity: 0.4;

					.add_img {
						width: 98rpx;
						height: 98rpx;
						margin-top: 60rpx;
					}
				}

				.a {
					background-color: #fff;
				}
			}
		}

	}

	//提交按钮
	.ci-foot {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		height: 120rpx;
		// border-top: 1rpx solid #E5E5E5;
		// background-color: #FFFFFF;

		.foot-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 120rpx;
			padding: 0rpx 40rpx;

			button {
				width: 100%;
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
			color: #fff;
			display: flex;
			align-items: center;
		}
	}

	.btn {
		.camera {
			width: 95%;
			height: 132rpx;
			background-color: #fff;
			color: #1f2329;
			font-size: 32rpx;
			line-height: 132rpx;
			text-align: center;
			margin: 0 20rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
		}

		.alum {
			height: 264rpx;

			.camera_ {
				height: 132rpx;
				color: #1f2329;
				font-size: 32rpx;
				line-height: 132rpx;
			}

			.camera_:last-child {
				border-top: 1rpx solid #ccc;
			}
		}
	}
</style>
