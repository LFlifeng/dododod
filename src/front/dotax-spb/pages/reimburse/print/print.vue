<template>
	<view class="print-page">
		<view class="print-page-show">
			<view>
				<image :src="receiptImg" @click="handleReceiptPreview"></image>
			</view>
		</view>
		<view class="print-page-send">
			<view class="print-page-send-email">
				<view class="print-page-send-email-remark">
					<text>请将报销单发送至邮箱进行下载打印</text>
				</view>
				<view class="print-page-send-email-form">
					<label>邮箱地址：</label>
					<input type="text" placeholder="请输入邮箱" name="receiveEmail" v-model="receiveEmail" />
					<view style="float:none; clear:both;"></view>
				</view>
			</view>
			<button class="print-page-send-ok" size="default" @click="handleSendReceipt">确定</button>
		</view>
	</view>
</template>

<script>
	import {
		reimburseCreateReceipt,
		reimburseSendReceipt
	} from '@/service/service.js';
	
	export default {
		data() {
			return {
				receiveEmail: "",
				receiptImg: "",
				receiptPdf: "",
				receiptId: ""
			}
		},
		onLoad(option) {
			this.receiptId = option.id;
			this.reqCreateReceipt();
		},
		methods: {
			// 报销单预览
			handleReceiptPreview() {
				let that = this;
				debugger
				let receiptImg = that.receiptImg;
				if (receiptImg == "") return;
				uni.downloadFile({
					url: that.receiptPdf,
					success(dfFes) {
						let filePath = dfFes.tempFilePath;
						console.log('触发打开报销单据PDF..', dfFes);
						uni.openDocument({
							filePath: filePath,
							fileType: 'pdf',
							success: () => {
								console.log('成功打开报销单据PDF..');
							}
						});
					},
					fail(err) {
						uni.showToast({
							title: err.errMsg,
							icon: 'none'
						});
					}
				});
			},
			// 发送报销单
			handleSendReceipt() {
				var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (this.receiveEmail == "" || !reg.test(this.receiveEmail)) {
					uni.showToast({
						title: '邮箱地址格式不正确',
						icon: 'none'
					});
					return;
				}
				let args = {
					receiptId: this.receiptId,
					receiveEmail: this.receiveEmail
				};
				console.log('请求发送报销单..');
				reimburseSendReceipt(args).then((srRes) => {
					console.log('发送报销单结果..', srRes);
					if (srRes && srRes.success) {
						uni.showModal({
							showCancel: false,
							content: '邮件已发送成功'
						});
					}
				});
			},
			// 请求生成报销单据
			reqCreateReceipt() {
				let that = this;
				console.log('请求生成报销单据..');
				reimburseCreateReceipt({
					receiptId: that.receiptId
				}).then((crRes) => {
					console.log('生成报销单据结果..', crRes);
					if (crRes && crRes.success) {
						that.receiptImg = crRes.data.receiptImg;
						that.receiptPdf=crRes.data.receiptPdf;
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.print-page {
		background-color: #F6F7F9;
	}

	.print-page-show {
		background-color: #FFFFFF;
		margin-top: 10rpx;
		padding: 20rpx 0rpx 30rpx 0rpx;
	}

	.print-page-show view {
		width: 520rpx;
		height: 718rpx;
		margin: 0rpx auto;
		background-color: #EEEEEE;
	}

	.print-page-show image {
		width: 480rpx;
		margin: 20rpx;
		height: 678rpx;
		background-color: initial;
	}

	.print-page-send {
		background-color: #FFFFFF;
		position: absolute;
		left: 0rpx;
		right: 0rpx;
		width: 100%;
		bottom: 0rpx;
		padding: 40rpx auto 60rpx 60rpx;
		margin-top: 30rpx;
	}

	.print-page-send-email-remark {
		margin: 60rpx auto 50rpx auto;
		width: 630rpx;
	}

	.print-page-send-email-remark text {
		font-size: 30rpx;
		color: #333333;
	}

	.print-page-send-email-form {
		width: 630rpx;
		margin: 0rpx auto 0rpx auto;
	}

	.print-page-send-email-form label {
		font-size: 30rpx;
		color: #999999;
		line-height: 60rpx;
		float: left;
	}

	.print-page-send-email-form input {
		margin-left: 20rpx;
		border: 1px solid #999999;
		height: 60rpx;
		width: 350rpx;
		float: left;
		padding: 0rpx 10rpx;
	}

	.print-page-send-ok {
		width: 630rpx;
		height: 80rpx;
		margin: 50rpx auto 60rpx auto;
		line-height: 80rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 36rpx;
		background-color: #FF7A08;
		border-radius: 12rpx;
	}
</style>
