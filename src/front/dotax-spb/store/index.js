import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: true,
		hasGroup: false,
		userInfo: {
			//olheg4rN29tqA1Wj7CLqr6uRLxPA
			//ou_77340195ef407e7a0851c7c67d3a5f77   ou_5a9fcdc19a8c04f8f5985d29ddd9931d
			//2088502875215584
			userId: 'ou_77340195ef407e7a0851c7c67d3a5f77',
			//MP-WECHAT
			source: 'MP-FEISHU',
			avatarUrl: '../../../static/me/me_icon.png',
			nickName: 'liiii',
			tel: '',
			tenantKey: '2d3b9eb68bce175d'
		},
		invoice: {},
		// 报销模块
		reimburse: {
			// 所有已选发票 Item={fpId:0}
			allChosenInvoice: [],
			// 当前已选发票 发起选择发票时Item={fpId:0};确认选择发票时Item={fpId:0,fplx:'',kprq:'',je:0}
			crtChosenInvoice: [],
			// 过滤审核状态
			audit: ''
		},
		// 我的模块
		mine: {
			// 弹出扫码加入企业窗口
			popupScan: false,
			// 用户已加入的企业列表
			addedGroups: []
		},
		// 首页模块
		home: {
			// 报销数据
			reimburse: {
				auditingCount: 0,
				waitingTicketscount: 0,
				waitingPaymentCount: 0,
				paidCount: 0,
				rejectedCount: 0
			}
		}
	},
	mutations: {
		login(state, userInfo) {
			state.hasLogin = true;
			state.userInfo = userInfo;
		},
	},
	getters: {

	},
	actions: {

	}
});

export default store;
