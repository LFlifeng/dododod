import Request from '@/utils/luch-request/request.js';
import store from '@/store/index.js';
import {
	ActionJcdl
} from '@/utils/actions.js';

// const BaseUrl = 'http://127.0.0.1:8101/';http://192.168.1.5:8101/ https://www.shoupiaobao.net/
const BaseUrl = 'https://www.shoupiaobao.net/';
export {
	BaseUrl
};
const http = new Request();
http.setConfig((config) => {
	config.baseUrl = BaseUrl;
	config.header = {
		...config.header
	}
	return config;
});

http.validateStatus = (statusCode) => {
	return statusCode === 200;
};

http.interceptor.request((config, cancel) => {
	config.header = {
		...config.header
	};
	let params = config.params;
	let hasLogin = store.state.hasLogin;
	// 是否检查登录
	if (params.checkouts) {
		let dl = ActionJcdl();
		if (dl) {
			cancel('请求已取消,检查登录-请用户登录!', config);
			return;
		}
	}
	// 是否匿名访问
	let anonymous = false;
	if (params.anonymous) anonymous = true;
	if (!anonymous) {
		if (!hasLogin) {
			cancel('请求已取消,授权访问-请用户登录!', config);
			return;
		}
		let userId = store.state.userInfo.userId;
		if (config.method == 'GET') {
			params.userId = userId;
		} else {
			if (typeof(config.data) == "object") {
				config.data.userId = userId;
			}
		}
	}
	uni.showLoading({
		title: '',
		mask: true
	});
	console.log('发起请求..', config);
	
	return config;
});

// 必须使用异步函数，注意
http.interceptor.response(async (rsp) => {
	uni.hideLoading();
	console.log('响应成功..', rsp);
	uni.showToast({
		title: rsp.message,
		icon: 'none',
		duration: 5000
	});
	if (rsp.statusCode != 200) {
		uni.showToast({
			// 网络连接错误！
			title: '网络开小差了，请检查是否联网哦~',
			icon: 'none',
			duration: 5000
		});
	} else {
		
		let res = rsp.data;
		if (res && !res.success) {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 3000
			});
		}
	}
	return rsp;
}, (rsp) => {
	uni.hideLoading();
	console.log('响应错误!!', rsp);
	uni.showToast({
		title: '服务出错了，请稍后再试吧~',
		icon: 'none',
		duration: 5000
	});
	return rsp;
});

export {
	http
};
