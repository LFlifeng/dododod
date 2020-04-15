<template>
	<web-view :src="url"></web-view>
</template>

<script>
	import hmacSHA256 from 'crypto-js/hmac-sha256';
	import Base64 from 'crypto-js/enc-base64';
	import MD5 from 'crypto-js/md5';
	import Hex from 'crypto-js/enc-hex';

	export default {
		data() {
			return {
				// timestamp: '',
				url: ''
			}
		},
		onLoad() {
			let timestamp = (new Date()).getTime(); //时间戳
			// this.timestamp = timestamp;
			//签名原串
			var str = 'appId=5007&thirdUserId=BXSDK33444&timestamp=' + timestamp;
			console.log(Hex.stringify(hmacSHA256(str, '5B81BCA6F52C7C4D4603212A27AE7663')))
			//加密后转大写的签名5B81BCA6F52C7C4D4603212A27AE7663
			const hmacDigest = Hex.stringify(hmacSHA256(str, '5B81BCA6F52C7C4D4603212A27AE7663')).toUpperCase();
			console.log(hmacDigest);
			var str1 =
				'https://page.xiaojukeji.com/m/dataplatformtest.html#/authorization?appId=5007&authStatus=true&cityId=123&lang=zh-hk&sign=' +
				hmacDigest + '&thirdUserId=BXSDK33444&timestamp=' + timestamp;
			this.url = str1;
			console.log(this.url)
		},
		methods: {
			
		}
	}
</script>

<style>
</style>
