<template>
	<view class="body">
		<view class="info" v-if="flag">
			<div class="dele_edit" @click="handleE_DInvoice(rise_data)">
				<image src="../../static/rise/edit_icon.png" mode=""></image>
				<view class="text">编辑/删除</view>
			</div>
			<div class="share" @click="handleShareInvoice()">
				<image src="../../static/rise/share_icon.png" mode=""></image>
				<view class="text">分享抬头</view>
			</div>
		</view>
		<view class="rise_info">
			<image src="../../static/rise/default-avatar.jpg" mode=""></image>
			<view class="line">
				<div class="l_text">开票时出示</div>
			</view>
			<view class="r_info">
				<view class="props-item">
					<view class="prop-label">名称</view>
					<view class="prop-value">{{rise_data.title}}</view>
				</view>
				<view class="props-item">
					<view class="prop-label">税号</view>
					<view class="prop-value">{{rise_data.companyTaxNo}}</view>
				</view>
				<view class="props-item">
					<view class="prop-label">电话</view>
					<view class="prop-value">{{rise_data.companyPhone}}</view>
				</view>
				<view class="props-item">
					<view class="prop-label">地址</view>
					<view class="prop-value">{{rise_data.companyAddress}}</view>
				</view>
				<view class="props-item">
					<view class="prop-label">银行</view>
					<view class="prop-value">{{rise_data.blankName}}</view>
				</view>
				<view class="props-item">
					<view class="prop-label">账号</view>
					<view class="prop-value">{{rise_data.blankAccount}}</view>
				</view>
			</view>
		</view>
		<view class="btn-group" v-if="!flag">
			<button type="default" @click="handleCancel">保存到我的抬头</button>
		</view>
	</view>
</template>

<script>
	import copyRiseInfo from '@/service/service.js';
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				flag: true,
				rise_data: {}
			}
		},
		onLoad(option) {
			// let that = this;
			console.log(option)
			this.rise_data = JSON.parse(option.rise_data);
			console.log(this.rise_data)
		},
		methods: {
			// 新增抬头
			handleAddInvoice() {
				uni.navigateTo({
					url: './invoice-add_tt'
				})
			},
			//编辑或删除
			handleE_DInvoice(rise_data) {
				let that = this;
				that.rise_data.type = true;
				rise_data = JSON.stringify(rise_data);
				console.log(rise_data);
				uni.redirectTo({
					url: './invoice-add_tt?rise_data=' + rise_data
				})
			},
			//分享抬头
			handleShareInvoice() {
				let that = this;
				let tenantKey = store.state.userInfo.tenantKey;
				//#ifdef MP-TOUTIAO
				tt.chooseContact({
					multi: false,
					success(res) {
						console.log(res.data)
						let users = [];
						res.data.map((ev) => {
							users.push({
								source:"MP-FEISHU",
								userId: ev.openId
							})
						})
						console.log(32332,users)
						let userId = res.data.openId;
						copyRiseInfo({
							id: that.rise_data.id,
							users: users
						}).then((sres) => {
							// xxCord({
							// 	openId:userId,
							// 	tenantKey:tenantKey
							// }).then((xres) => {
							// 	console.log(222222,xres)
							// });
							// that.flag = false;
							console.log(444,sres)
						});
					},
					fail(res) {
						console.log(`获取联系人失败`);
					}
				});
				//#endif
			}
		}
	}
</script>

<style lang="scss">
	.body {
		background-color: #3D94FF;
		height: 100%;
	}

	.info {
		padding-top: 80rpx;
		padding-bottom: 32rpx;
		display: flex;

		div {
			flex: 1;
			text-align: center;
		}

		image {
			width: 80rpx;
			height: 80rpx;
		}

		.text {
			color: #fff;
		}
	}

	.rise_info {
		background-color: #fff;
		margin: 32rpx 40rpx;
		margin-top: 0;
		border-radius: 20rpx;
		text-align: center;
		border-bottom: 1rpx solid;

		image {
			width: 320rpx;
			height: 320rpx;
			margin-top: 60rpx;
			margin-bottom: 40rpx;
		}

		.line {
			height: 1rpx;
			background-color: #d8d8d8;
			position: relative;

			.l_text {
				position: absolute;
				top: -20rpx;
				left: 40%;
				height: 40rpx;
				line-height: 40rpx;
				padding: 0 8rpx;
				background-color: #fff;
				color: #999;
				font-size: 28rpx;
			}
		}

		.r_info {
			margin: 40rpx 32rpx;
		}

		.props-item:first-child {
			border: none;
		}

		.props-item {
			height: 60rpx;
			line-height: 60rpx;
			// border-top: 1rpx solid #E5E5E5;
			margin: 0rpx 20rpx;
			display: flex;

			.prop-label {
				text-align: left;
			}

			.prop-value,
				{
				width: 60%;
				color: #666;
				font-size: 28rpx;
				text-align: right;
				overflow: hidden;
			}

			.prop-label {
				color: #999;
				font-size: 28rpx;
				width: 40%;
			}
		}
	}

	.btn-group {
		height: 120rpx;
		align-items: center;
		padding: 0 36rpx;

		button {
			color: #999;
			font-size: 32rpx;
		}
	}
</style>
