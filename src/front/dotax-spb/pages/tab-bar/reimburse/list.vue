<template>
	<view class="">
		<view class="index-list">
			
			<view class="index-list1">
				<view class="">
					<!-- widthFix 图片自适应属性-->
					<image src="../../../static/default-avatar.jpg" mode="" lazy-load></image>
					昵称
				</view>
				<view class="gz">
						<!-- 图标 -->
						<text class="icon iconfont icon-tongyong_tianjia"></text>
						关注
				</view>
			</view>
			<view class="index-list2">近来还有一些研究认为，新冠病毒理论上可能会影响生殖系统。</view>
			<view class="index-list3">
				<image src="../../../static/sy/banner.jpg" mode="" lazy-load></image>
			</view>
			<view class="index-list4">
				<view class="lds">
					<view class=""><view class="icon iconfont icon-gerenyouxiang_cebianlan_shoujianxiang"></view>10</view>
					<view class=""><view class="icon iconfont icon-gerenyouxiang_cebianlan_shoujianxiang"></view>10</view>
				</view>
				<view class="lds">
					<view class=""><view class="icon iconfont icon-gerenyouxiang_cebianlan_shoujianxiang"></view>10</view>
					<view class=""><view class="icon iconfont icon-gerenyouxiang_cebianlan_shoujianxiang"></view>10</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			
		},
		onLoad(option) {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	.index-list {
		margin: 0 32rpx;
		.index-list1 {
			// display: flex;
			// justify-content: space-between;
			clear: both;
			view {
				float: left;
				height: 96rpx;
				line-height: 96rpx;
				image {
					width: 96rpx;
					height: 96rpx;
					vertical-align: middle;
					margin-right: 16rpx;
				}
			}
			.gz {
				float: right;
				margin-left: 340rpx;
				text {
					margin-right: 10rpx;
				}
			}
		}
		.index-list2 {
			padding: 14rpx;
			width: 100%;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.index-list3 {
			image {
				width: 100%;
				height: 360rpx;
				background-size: cover;
			}
		}
		.index-list4 {
			clear: both;
			.lds {
				float: left;
				view {
					float: left;
					margin-right: 10rpx;
					color: #999;
					view {
						color: #000;
					}
				}
			}
			.lds:last-child {
				float: right;
			}
		}
	}
</style>
