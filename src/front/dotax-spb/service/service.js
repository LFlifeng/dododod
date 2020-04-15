import {
	http
} from '@/utils/luch-request/index.js';
import store from '@/store/index.js';

/**
 * 授权-微信
 */
export const authWechatSign = (params) => {
	params.anonymous = true;
	return http.get('collect/auth/wechat', {
		params: params
	}).then(res => res.data);
};
/**
 * 授权-飞书
 */
export const authTouTiaoSign = (params) => {
	params.anonymous = true;
	return http.get('/collect/auth/feishu', {
		params: params
	}).then(res => res.data);
};
/**
 * 企业-加入
 */
export const groupJoinGroup = (data) => {
	return http.post('collect/group/joinGroup', data).then(res => res.data);
};
/**
 * 企业-列表
 */
export const groupListGroup = () => {
	return http.post('collect/group/getList', {
		'params': {
			checkouts: true
		}
	}).then(res => res.data);
};
/**
 * 企业-退出
 */
export const groupQuitGroup = (data) => {
	return http.post('collect/group/quitGroup', data).then(res => res.data);
};
/**
 * 企业-切换
 */
export const groupSetDefault = (data) => {
	return http.post('collect/group/setDefault', data).then(res => res.data);
};

/**
 * 微信-同步发票
 */
export const wechatSyncInvoice = (data) => {
	return http.post('collect/wechat-invoice/add2InvoiceWallet', data).then(res => res.data);
};

/**
 * 发票-查询发票
 */
export const invoiceQueryInvoices = (data) => {
	return http.post('collect/invoice/groupByInvoiceData', data).then(res => res.data);
};

/**
 * 发票-删除发票
 */
export const invoiceDelInvoice = (data) => {
	return http.post('collect/invoice/deleteInvoiceById', data).then(res => res.data);
};

/**
 * 发票-获取发票
 */
export const invoiceGetInvoice = (data) => {
	return http.post('collect/invoice/queryInvoiceById', data).then(res => res.data);
};

/**
 * 发票-是否存在 
 */
export const invoiceIsExisted = (data) => {
	return http.post('collect/invoice/invoiceIsExisted', data).then(res => res.data);
};

/**
 * 发票-保存发票
 */
export const invoiceAddInvoice = (data) => {
	return http.post('collect/invoice/addInvoiceWallets', data).then(res => res.data);
};

/**
 * 报销-保存报销
 */
export const reimburseAddReimburse = (data) => {
	return http.post('collect/reimburseManagement/addReimburse', data).then(res => res.data);
};

/**
 * 报销-费用列表
 */
export const reimburseListRimbsTags = (groupId) => {
	return http.get('saas/getReimburseSettings/' + groupId, {}).then(res => res.data);
};

/**
 * 报销-查询报销
 */
export const reimburseGetReimburse = (reimburseId) => {
	return http.get('collect/reimburseManagement/selectReimburse/' + reimburseId, {}).then(res => res.data);
};

/**
 * 报销-查询报销
 */
export const reimburseQueryReimburses = (data) => {
	return http.post('collect/reimburseManagement/groupByReimburseData', data).then(res => res.data);
};

/**
 * 报销-删除报销
 */
export const reimburseDeleteReimburse = (id) => {
	return http.delete('collect/reimburseManagement/deleteReimburse/' + id).then(res => res.data);
};

/**
 *报销--生成明细
 */
export const reimburseCreateReceipt = (data) => {
	return http.post('collect/reimburseManagement/createReceipt', data).then(res => res.data);
}

/**
 *报销--发送明细
 */
export const reimburseSendReceipt = (data) => {
	return http.post('collect/reimburseManagement/sendReceipt', data).then(res => res.data);
}

/**
 * 首页-查询数据
 */
export const indexQueryData = () => {
	let userId = store.state.userInfo.userId;
	return http.post('collect/index/groupByIndexData', {}, {
		params: {
			'userId': userId
		}
	}).then(res => res.data);
}

/**
 * 抵扣-推送票据
 */
export const deductionPushInvoices = (data) => {
	return http.post('collect/invoice/deductionCollect', data).then(res => res.data);
};
/**
 * 绑定手机号
 */
export const getBindPhone = (data) => {
	let userId = store.state.userInfo.userId;
	return http.post('/apis/bind-phone/bind', data).then(res => res.data);
};
/**
 * 获取验证码
 */
export const getAuthCode = (data) => {
	let userId = store.state.userInfo.userId;
	return http.post('apis/bind-phone/send', data, {
		params: {
			'userId': userId
		}
	}).then(res => res.data);
};
/**
 * 获取抬头信息
 */
export const getRiseInfo = () => {
	let userId = store.state.userInfo.userId;
	return http.get('apis/invoice-title/all').then(res => res.data);
};
/**
 * 新增抬头信息
 */
export const addRiseInfo = (data) => {
	return http.post('apis/invoice-title/add', data).then(res => res.data);
};
/**
 * 更新抬头信息
 */
export const updateRiseInfo = (data) => {
	return http.post('apis/invoice-title/upd', data).then(res => res.data);
};
/**
 * 分享抬头信息
 */
export const copyRiseInfo = (data) => {
	return http.post('apis/invoice-title/share', data).then(res => res.data);
};
/**
 * 删除抬头信息
 */
export const delRiseInfo = (data) => {
	return http.post('apis/invoice-title/del', data).then(res => res.data);
};
/**
 * 抬头检索
 */
export const searchRiseInfo = (params) => {
	return http.get('apis/invoice-title/search', {
		params: params
	}).then(res => res.data);
};
/**
 * 添加报销单
 */
export const addReimburse = (data) => {
	return http.post('apis/reimburse/instance/add',data).then(res => res.data);
};
/**
 * 查询报销单详情
 */
export const getReimburse = (data) => {
	return http.post('apis/reimburse/instance/get',data).then(res => res.data);
};
/**
 * 报销列表--待审批的
 */
export const dspReimburse = (data) => {
	return http.post('apis/reimburse/instance/pending',data).then(res => res.data);
};
/**
 * 报销列表--已审批的
 */
export const yspReimburse = (data) => {
	return http.post('apis/reimburse/instance/approved',data).then(res => res.data);
};
/**
 * 报销列表--抄送我的
 */
export const csMeReimburse = (data) => {
	return http.post('apis/reimburse/instance/ccme',data).then(res => res.data);
};
/**
 * 报销列表--我发起的
 */
export const meDoReimburse = (data) => {
	return http.post('apis/reimburse/instance/mine',data).then(res => res.data);
};
/**
 * 审批通过
 */
export const spTG = (data) => {
	return http.post('apis/reimburse/approval/approve',data).then(res => res.data);
};
/**
 * 审批拒绝
 */
export const spJJ = (data) => {
	return http.post('apis/reimburse/approval/reject',data).then(res => res.data);
};
/**
 * 审批抄送
 */
export const spCC = (data) => {
	return http.post('apis/reimburse/approval/ccUsers',data).then(res => res.data);
};
/**
 * 消息卡片
 */
export const xxCord = (data) => {
	return http.post('collect/messageCard/send',data).then(res => res.data);
};