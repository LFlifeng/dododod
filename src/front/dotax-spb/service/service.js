import {
	http
} from '@/utils/luch-request/index.js';
import store from '@/store/index.js';

/**
 * ��Ȩ-΢��
 */
export const authWechatSign = (params) => {
	params.anonymous = true;
	return http.get('collect/auth/wechat', {
		params: params
	}).then(res => res.data);
};
/**
 * ��Ȩ-����
 */
export const authTouTiaoSign = (params) => {
	params.anonymous = true;
	return http.get('/collect/auth/feishu', {
		params: params
	}).then(res => res.data);
};
/**
 * ��ҵ-����
 */
export const groupJoinGroup = (data) => {
	return http.post('collect/group/joinGroup', data).then(res => res.data);
};
/**
 * ��ҵ-�б�
 */
export const groupListGroup = () => {
	return http.post('collect/group/getList', {
		'params': {
			checkouts: true
		}
	}).then(res => res.data);
};
/**
 * ��ҵ-�˳�
 */
export const groupQuitGroup = (data) => {
	return http.post('collect/group/quitGroup', data).then(res => res.data);
};
/**
 * ��ҵ-�л�
 */
export const groupSetDefault = (data) => {
	return http.post('collect/group/setDefault', data).then(res => res.data);
};

/**
 * ΢��-ͬ����Ʊ
 */
export const wechatSyncInvoice = (data) => {
	return http.post('collect/wechat-invoice/add2InvoiceWallet', data).then(res => res.data);
};

/**
 * ��Ʊ-��ѯ��Ʊ
 */
export const invoiceQueryInvoices = (data) => {
	return http.post('collect/invoice/groupByInvoiceData', data).then(res => res.data);
};

/**
 * ��Ʊ-ɾ����Ʊ
 */
export const invoiceDelInvoice = (data) => {
	return http.post('collect/invoice/deleteInvoiceById', data).then(res => res.data);
};

/**
 * ��Ʊ-��ȡ��Ʊ
 */
export const invoiceGetInvoice = (data) => {
	return http.post('collect/invoice/queryInvoiceById', data).then(res => res.data);
};

/**
 * ��Ʊ-�Ƿ���� 
 */
export const invoiceIsExisted = (data) => {
	return http.post('collect/invoice/invoiceIsExisted', data).then(res => res.data);
};

/**
 * ��Ʊ-���淢Ʊ
 */
export const invoiceAddInvoice = (data) => {
	return http.post('collect/invoice/addInvoiceWallets', data).then(res => res.data);
};

/**
 * ����-���汨��
 */
export const reimburseAddReimburse = (data) => {
	return http.post('collect/reimburseManagement/addReimburse', data).then(res => res.data);
};

/**
 * ����-�����б�
 */
export const reimburseListRimbsTags = (groupId) => {
	return http.get('saas/getReimburseSettings/' + groupId, {}).then(res => res.data);
};

/**
 * ����-��ѯ����
 */
export const reimburseGetReimburse = (reimburseId) => {
	return http.get('collect/reimburseManagement/selectReimburse/' + reimburseId, {}).then(res => res.data);
};

/**
 * ����-��ѯ����
 */
export const reimburseQueryReimburses = (data) => {
	return http.post('collect/reimburseManagement/groupByReimburseData', data).then(res => res.data);
};

/**
 * ����-ɾ������
 */
export const reimburseDeleteReimburse = (id) => {
	return http.delete('collect/reimburseManagement/deleteReimburse/' + id).then(res => res.data);
};

/**
 *����--������ϸ
 */
export const reimburseCreateReceipt = (data) => {
	return http.post('collect/reimburseManagement/createReceipt', data).then(res => res.data);
}

/**
 *����--������ϸ
 */
export const reimburseSendReceipt = (data) => {
	return http.post('collect/reimburseManagement/sendReceipt', data).then(res => res.data);
}

/**
 * ��ҳ-��ѯ����
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
 * �ֿ�-����Ʊ��
 */
export const deductionPushInvoices = (data) => {
	return http.post('collect/invoice/deductionCollect', data).then(res => res.data);
};
/**
 * ���ֻ���
 */
export const getBindPhone = (data) => {
	let userId = store.state.userInfo.userId;
	return http.post('/apis/bind-phone/bind', data).then(res => res.data);
};
/**
 * ��ȡ��֤��
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
 * ��ȡ̧ͷ��Ϣ
 */
export const getRiseInfo = () => {
	let userId = store.state.userInfo.userId;
	return http.get('apis/invoice-title/all').then(res => res.data);
};
/**
 * ����̧ͷ��Ϣ
 */
export const addRiseInfo = (data) => {
	return http.post('apis/invoice-title/add', data).then(res => res.data);
};
/**
 * ����̧ͷ��Ϣ
 */
export const updateRiseInfo = (data) => {
	return http.post('apis/invoice-title/upd', data).then(res => res.data);
};
/**
 * ����̧ͷ��Ϣ
 */
export const copyRiseInfo = (data) => {
	return http.post('apis/invoice-title/share', data).then(res => res.data);
};
/**
 * ɾ��̧ͷ��Ϣ
 */
export const delRiseInfo = (data) => {
	return http.post('apis/invoice-title/del', data).then(res => res.data);
};
/**
 * ̧ͷ����
 */
export const searchRiseInfo = (params) => {
	return http.get('apis/invoice-title/search', {
		params: params
	}).then(res => res.data);
};
/**
 * ��ӱ�����
 */
export const addReimburse = (data) => {
	return http.post('apis/reimburse/instance/add',data).then(res => res.data);
};
/**
 * ��ѯ����������
 */
export const getReimburse = (data) => {
	return http.post('apis/reimburse/instance/get',data).then(res => res.data);
};
/**
 * �����б�--��������
 */
export const dspReimburse = (data) => {
	return http.post('apis/reimburse/instance/pending',data).then(res => res.data);
};
/**
 * �����б�--��������
 */
export const yspReimburse = (data) => {
	return http.post('apis/reimburse/instance/approved',data).then(res => res.data);
};
/**
 * �����б�--�����ҵ�
 */
export const csMeReimburse = (data) => {
	return http.post('apis/reimburse/instance/ccme',data).then(res => res.data);
};
/**
 * �����б�--�ҷ����
 */
export const meDoReimburse = (data) => {
	return http.post('apis/reimburse/instance/mine',data).then(res => res.data);
};
/**
 * ����ͨ��
 */
export const spTG = (data) => {
	return http.post('apis/reimburse/approval/approve',data).then(res => res.data);
};
/**
 * �����ܾ�
 */
export const spJJ = (data) => {
	return http.post('apis/reimburse/approval/reject',data).then(res => res.data);
};
/**
 * ��������
 */
export const spCC = (data) => {
	return http.post('apis/reimburse/approval/ccUsers',data).then(res => res.data);
};
/**
 * ��Ϣ��Ƭ
 */
export const xxCord = (data) => {
	return http.post('collect/messageCard/send',data).then(res => res.data);
};