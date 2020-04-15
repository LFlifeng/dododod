<template>
	<view class="">
		<view class="info">
			<view class="tt_info">
				<view class="tt_cont" v-for="(item,index) in rise" :key="index">
					<view class="cont" @click="handleRiseDetail(index)">
						<view class="cont_title"><view>{{item.title}}</view> <text v-if="item.defaulted == true">默认</text></view>
						<view class="cont_code">税号：{{item.companyTaxNo}}</view>
					</view>
					<view class="copy" @click="copyRiseInfo(index)">复制</view>
				</view>
			</view>
		</view>
		<view class="ci-foot">
			<view class="foot-section">
				<button @click="handleAddInvoice()" type="primary">新增抬头</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getRiseInfo,
		copyRiseInfo
	} from '@/service/service.js';
	export default {
		data() {
			return {
				rise: [],
				navigateToNextDelta: false
			}
		},
		onLoad(option) {
			this.showRiseInfo(); //获取抬头
			console.log(3121,option)
			this.navigateToNextDelta = option.navigateToNextDelta;
		},
		onShow() {
			// this.showRiseInfo(); //获取抬头
			
		},
		methods: {
			// 进入抬头详情
			handleRiseDetail(idx) {
				console.log(idx)
				let rise_data = this.rise[idx];
				rise_data = JSON.stringify(rise_data);
				console.log(this.rise[idx])
				uni.navigateTo({
					url: './invoice-detail_tt?rise_data=' + rise_data
				});
			},			
			//复制到剪切板
			copyRiseInfo(index) {
				console.log(index)
				let info = this.rise[index];
				let str = info.title + '\n' + info.companyTaxNo;
				uni.setClipboardData({
				    data: str,
				    success: function () {
				        // console.log('success');
						uni.showToast({
							title: "已复制到剪切板",
							icon: 'none',
							duration: 2000
						});
				    }
				});
			},
			//获取抬头
			showRiseInfo() {
				getRiseInfo().then((res) => {
					if (res.statusCode === 1) {
						var flag = false;
						res.data.map((ev) => {
							if(flag) {
								ev.defaulted = false;
							}
							this.rise.push(ev)
							if(ev.defaulted) {
								flag = true;
							}
						})
					}
				})
			},
			// 新增抬头
			handleAddInvoice() {
				uni.navigateTo({
					url: './invoice-add_tt'
				})
			}
		}
	}
</script>

<style lang="scss">
	/* 发票抬头 */
	.tt_info {
		margin-top: 20upx;
		background-color: #fff;
		border-top: 1px solid #fff;
		border-bottom: 1px solid #fff;
	}

	.tt_cont {
		width: 688upx;
		height: 128upx;
		background-color: #f4f4f4;
		margin: 32upx;
		border-radius: 8upx;
		clear: both;
	}

	.cont {
		float: left;
		margin-left: 24upx;
		width: 520rpx;
	}

	.cont .cont_title {
		font-size: 28upx;
		color: #666;
		margin-top: 24upx;
	}
	.cont .cont_title text {
		display: inline-block;
		vertical-align: middle;
	}
	.cont .cont_title view:first-child {
		display: inline-block;
		vertical-align: middle;
		width: 60%;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
    .cont .cont_title text:last-child {
		margin-left: 10rpx;
		color: #c91702;
	}
	.cont .cont_code {
		font-size: 24upx;
		color: #999;
		margin-top: 8upx;
	}

	.copy {
		float: right;
		width: 120upx;
		height: 60upx;
		background-image: repeating-linear-gradient(to right, #3D94FF 50%, #2782F3 50%);
		font-size: 28upx;
		color: #fff;
		line-height: 60upx;
		text-align: center;
		border-radius: 30upx;
		margin-right: 24upx;
		margin-top: 38upx;
	}

	.ci-foot {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		border-top: 1rpx solid #fff;
		border-bottom: 1rpx solid #fff;
		background-color: #FFFFFF;

		.foot-section {
			padding: 0rpx 32rpx;
			margin: 40rpx 0;

			button {
				width: 100%;
				margin: 0rpx;
				height: 96rpx;
				line-height: 96rpx;
				background-color: #3D94FF;
				border-radius: 8rpx;
				font-size: 32rpx;
			}
		}
	}
</style>
