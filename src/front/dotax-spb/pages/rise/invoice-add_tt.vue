<template>
	<view class="body">
		<view class="props-item title">
			<view class="prop-label">抬头名称<text>*</text></view>
			<view class="edit-value">
				<input v-if="!isEdit" class="uni-input" placeholder="请输入您的公司名称" v-model="title" @input="handleSearchRiseInfo(title)" />
				<input v-else class="uni-input" placeholder="请输入您的公司名称" v-model="rise.title" @input="handleSearchRiseInfo(rise.title)" />
			</view>
			<view class="mask" v-if='isSearch'>
				<view class="chackName"  v-for="(item,index) in searchRise" :key="index">
					<text class="spb-navi-text" @click="handleSearchRiseName(item)">{{item.name}}</text>
				</view>
			</view>
		</view>
		<view class="props-item">
			<view class="prop-label">税号<text>*</text></view>
			<view class="edit-value">
				<input v-if="!isEdit" class="uni-input" placeholder="请输入纳税人识别号" v-model="companyTaxNo" />
				<input v-else class="uni-input" placeholder="请输入纳税人识别号" v-model="rise.companyTaxNo" />
			</view>
		</view>
		<view class="props-item">
			<view class="prop-label">电话号码</view>
			<view class="edit-value">
				<input v-if="!isEdit" type="number" class="uni-input" placeholder="公司电话" v-model="companyPhone" />
				<input v-else class="uni-input" placeholder="公司电话" v-model="rise.companyPhone" />
			</view>
		</view>
		<view class="props-item">
			<view class="prop-label">单位地址</view>
			<view class="edit-value">
				<input v-if="!isEdit" class="uni-input" placeholder="公司地址" v-model="companyAddress" />
				<input v-else class="uni-input" placeholder="公司地址" v-model="rise.companyAddress" />
			</view>
		</view>
		<view class="props-item">
			<view class="prop-label">开户银行</view>
			<view class="edit-value">
				<input v-if="!isEdit" class="uni-input" placeholder="开户银行" v-model="blankName" />
				<input v-else class="uni-input" placeholder="开户银行" v-model="rise.blankName" />
			</view>
		</view>
		<view class="props-item">
			<view class="prop-label">银行账号</view>
			<view class="edit-value">
				<input v-if="!isEdit" class="uni-input" placeholder="银行账号" v-model="blankAccount" />
				<input v-else class="uni-input" placeholder="银行账号" v-model="rise.blankAccount" />
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db">设为默认抬头</view>
				<switch v-if="!isEdit" :checked="defaulted" @change="switch1Change" />
				<switch v-else  :checked="rise.defaulted" @change="switch1Change" />
			</view>
		</view>
		<view class="ci-foot">
			<view class="foot-section">
				<button v-if="!isEdit" @click="showaddRiseInfo" type="primary">保存</button>
				<button v-else @click="showeditRiseInfo" type="primary">保存</button>
			</view>
			<view class="foot-section">
				<button v-if="isEdit" @click="handledelInvoice()" type="default">删除</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCombox from "@/components/uni-combox/uni-combox"
	import {
		addRiseInfo,
		updateRiseInfo,
		delRiseInfo,
		searchRiseInfo
	} from '@/service/service.js'
	export default {
		components: {uniCombox},
		data() {
			let defaulted;
			return {
				title: '',
				companyPhone: '',
				companyAddress: '',
				companyTaxNo: '',
				blankName: '',
				blankAccount: '',
				defaulted: false,
				isEdit: false,
				rise: {},
				isSearch: false,
				searchRise: []
			}
		},
		onLoad(option) {
			if (option != null) {
				this.rise = JSON.parse(option.rise_data);
				console.log(this.rise)
				// this.rise.defaulted = option.rise_data.defaulted;
				this.isEdit = this.rise.type;
				console.log(this.rise.defaulted)
			}
				
			// if(!this.isEdit){
			// 	console.log(defaulted)
			// }else {
			// 	console.log(defaulted)
			// }
		},
		
		methods: {
			switch1Change: function(e) {
				if (!this.isEdit) {
					this.defaulted = e.detail.value;
				} else {
					this.rise.defaulted = e.detail.value;
				}

			},
			// 新增抬头信息
			showaddRiseInfo() {
				// console.log(this.companyPhone.length)
				var patrn=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;  //非法字符校验
				if(this.title.length == 0 || patrn.test(this.title)) {
					uni.showToast({
						title: "请输入正确的发票抬头",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(!((this.companyTaxNo.length == 15 || this.companyTaxNo.length == 18 || this.companyTaxNo.length == 20) && !patrn.test(this.companyTaxNo))) {
					uni.showToast({
						title: "请输入正确的税号",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(!((this.companyPhone.length == 11 || this.companyPhone.length == 0) && !patrn.test(this.companyPhone))) {
					uni.showToast({
						title: "请输入11位电话号码",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(patrn.test(this.blankAccount)){
					uni.showToast({
						title: "请输入正确的银行账号",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(patrn.test(this.blankName)){
					uni.showToast({
						title: "请输入正确的开户银行",
						icon: 'none',
						duration: 1500
					});
					return;
				}
				addRiseInfo({
					title: this.title,
					companyPhone: this.companyPhone,
					companyAddress: this.companyAddress,
					companyTaxNo: this.companyTaxNo,
					blankName: this.blankName,
					blankAccount: this.blankAccount,
					defaulted: this.defaulted
				}).then((res) => {
					console.log(res)
					if (res.success) {
						uni.showModal({
							title: '提示',
							content: "保存成功",
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
									uni.redirectTo({
										url: './invoice-rise_tt'
									})
								}
							}
						});
					} else {
						// uni.showModal({
						// 	title: '提示',
						// 	content: '保存成功',
						// 	showCancel: false,
						// 	success: function(res) {
						// 	}
						// });
					}

				})
			},
			//编辑抬头信息
			showeditRiseInfo() {
				console.log(this.rise.companyTaxNo.length)
				var patrn=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;  //非法字符校验
				if(this.rise.title.length == 0 || patrn.test(this.rise.title)) {
					uni.showToast({
						title: "请输入正确的发票抬头",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(!((this.rise.companyTaxNo.length == 15 || this.rise.companyTaxNo.length == 18 || this.rise.companyTaxNo.length == 20) && !patrn.test(this.rise.companyTaxNo))) {
					uni.showToast({
						title: "请输入正确的税号",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(!((this.rise.companyPhone.length == 11 || this.rise.companyPhone.length == 0) && !patrn.test(this.rise.companyPhone))) {
					uni.showToast({
						title: "请输入11位电话号码",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(patrn.test(this.rise.blankAccount)){
					uni.showToast({
						title: "请输入正确的银行账号",
						icon: 'none',
						duration: 1500
					});
					return;
				} else if(patrn.test(this.rise.blankName)){
					uni.showToast({
						title: "请输入正确的开户银行",
						icon: 'none',
						duration: 1500
					});
					return;
				}
				
				updateRiseInfo({
					id: this.rise.id,
					title: this.rise.title,
					companyTaxNo: this.rise.companyTaxNo,
					companyPhone: this.rise.companyPhone,
					companyAddress: this.rise.companyAddress,
					blankName: this.rise.blankName,
					blankAccount: this.rise.blankAccount,
					defaulted: this.rise.defaulted
				}).then((res) => {
					uni.showModal({
						title: '提示',
						content: '保存成功',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								uni.redirectTo({
									url: './invoice-rise_tt'
								})
							}
						}
					});
				})
			},
			//删除
			handledelInvoice() {
				delRiseInfo({
					id: this.rise.id
				}).then((res) => {
					uni.showModal({
						title: '提示',
						content: '删除成功',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								uni.redirectTo({
									url: './invoice-rise_tt'
								})
							}
						}
					});
				})
			},
			//抬头检索
			handleSearchRiseInfo(title) {
				// this.isSearch = true;
				if (this.isEdit) {
					title = this.rise.title;
				} else {
					title = this.title;
				}
				if(title.length == 0) {
					this.searchRise = [];
					return;
				}
				searchRiseInfo({
					keyword: title
				}).then((res) => {
					console.log(res)
					if (res.success) {
						// if(res.data.length == 0) {
						// 	this.searchRise = []
						// }
						this.searchRise = res.data;
						console.log(this.searchRise)
						this.isSearch = true;
					}
				})
			},
			//点击检索名称
			handleSearchRiseName(item){
				if (this.isEdit) {
					this.rise.title = item.name;
					this.rise.companyTaxNo = item.taxCode;
					this.rise.companyPhone = item.addressPhone.split(' ')[1];
					this.rise.companyAddress = item.addressPhone.split(' ')[0];
					this.rise.blankName = item.bankAccount.split(' ')[0];
					this.rise.blankAccount = item.bankAccount.split(' ')[1];
					
				} else {
					this.title = item.name;
					this.companyTaxNo = item.taxCode;
					this.companyPhone = item.addressPhone.split(' ')[1];
					this.companyAddress = item.addressPhone.split(' ')[0];
					this.blankName = item.bankAccount.split(' ')[0];
					this.blankAccount = item.bankAccount.split(' ')[1];
				}
				this.isSearch = false;
			}
		}
	}
</script>

<style lang="scss">
	.body {
		background-color: #f4f4f4;
	}

	.props-item {
		background-color: #fff;
		height: 98rpx;
		line-height: 98rpx;
		font-size: 36rpx;
		display: flex;
		margin-top: 4rpx;
		.uni-input {
			height: 80rpx;
		}

		.edit-value {
			padding: 10rpx;
			width: 66%;
			margin-left: 40rpx;
		}

		.prop-label {
			font-size: 34rpx;
			color: #333333;
			width: 30%;
			height: 98rpx;
			line-height: 98rpx;
			text-align: left;
			margin-left: 32rpx;
			text {
				color: #b60000;
			}
		}
		.edit-value {
			color: #999;
		}
	}
	.props-item:nth-child(2) .prop-label {
		letter-spacing: 34rpx;
	}
	.title {
		position: relative;
		.mask {
			width: 100%;
			position: absolute;
			top: 90rpx;
			z-index: 100000;
			background-color: #fff;
			.chackName {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
			}
			.spb-navi-text {
				width: 100%;
				height: 100%;
			}
		}
	}

	.uni-list::before {
		background-color: #fff;
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
			padding: 0rpx 40rpx;
			margin: 40rpx 0;
			button {
				width: 100%;
				margin: 0rpx;
				height: 96rpx;
				color: #fff;
				background-color: #3D94FF;
				border-radius: 8rpx;
				font-size: 32rpx;
				line-height: 96rpx;
			}
		}
		
	}
	.foot-section:nth-child(2) {
		button {
			color: #333;
			background-color: #ddd;
		}
	}
	.uni-input-placeholder {
		text-align: left;
		font-size: 30rpx;
	}
	.uni-list-cell-db {
		text-align: right;
	}
	switch {
		margin-left: 16rpx;
	}
</style>
