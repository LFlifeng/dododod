// 发票类型
const InvoiceTypes = [{
		label: '增值税专用发票',
		value: 'SpecInvoice'
	},
	{
		label: '增值税普通发票',
		value: 'GenerInvoice'
	},
	{
		label: '增值税电子普通发票',
		value: 'EleInvoice'
	},
	{
		label: '增值税电普票(通行票)',
		value: 'EleTollInvoice'
	},
	{
		label: '增值税普通发票(卷票)',
		value: 'VolInvoice'
	},
	{
		label: '机动车销售统一发票',
		value: 'VehInvoice'
	},
	{
		label: '定额发票',
		value: 'QuotaInvoice'
	},
	{
		label: '飞机票',
		value: 'PlaneInvoice'
	},
	{
		label: '火车票',
		value: 'TrainInvoice'
	},
	{
		label: '客运票',
		value: 'PassengerInvoice'
	},
	{
		label: '通用机打发票',
		value: 'GenerMachineInvoice'
	},
	{
		label: '出租车票',
		value: 'TaxiInvoice'
	},
	{
		label: '过路费发票',
		value: 'TollInvoice'
	}
];

export {
	InvoiceTypes
};

// 格式化发票类型
export const FmtInvoiceType = (itype) => {
	let its = InvoiceTypes;
	let c = its.length;
	for (let i = 0; i < c; i++) {
		let t = its[i];
		if (t.value == itype) {
			return t.label;
		}
	}
	return 'Unknow';
};

// 发票可编辑属性
const InvoiceEditableProps = {
	// 出租车票
	'TaxiInvoice': [
		'invoiceCode', 'invoiceNum', 'city', 'invoiceOpenDate',
		'getOnTime', 'getOffTime', 'kilometre', 'sumAmount'
	],
	// 通用机打发票
	'GenerMachineInvoice': ['invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'sumAmount'],
	// 定额发票
	'QuotaInvoice': ['invoiceCode', 'invoiceNum', 'sumAmount'],
	// 过路费发票
	'TollInvoice': ['invoiceCode', 'invoiceNum', 'sumAmount'],
	// 客运票
	'PassengerInvoice': [
		'invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'getOnTime',
		'rider', 'departure', 'destination', 'ticketPrice'
	],
	// 火车票
	'TrainInvoice': ['rider', 'setOutDate', 'departure', 'destination', 'flight', 'ticketPrice'],
	// 飞机票
	'PlaneInvoice': [
		'rider', 'eleTicktNo', 'departure', 'destination', 'flight', 'seatClass',
		'invoiceOpenDate', 'surcharge', 'ticketPrice', 'planeTicketAmount'
	],
	// 增值税普通发票
	'GenerInvoice': ['invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'verifyCode'],
	// 增值税电子普通发票
	'EleInvoice': ['invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'verifyCode'],
	// 增值税卷式发票
	'VolInvoice': ['invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'verifyCode'],
	// 机动车销售统一发票
	'VehInvoice': ['invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'amount'],
	// 增值税专用发票
	'SpecInvoice': ['invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'amount'],
	// 增值税电子发票（通行费）
	'EleTollInvoice': ['invoiceCode', 'invoiceNum', 'invoiceOpenDate', 'verifyCode']
}

// 发票属性是否可编辑
export const InvoicePropEditable = (type, prop) => {
	let props = InvoiceEditableProps[type];
	if (props == undefined) {
		return false;
	}
	return (props.indexOf(prop) > -1);
};

// 获取发票的属性名称
export const GetInvoicePropName = (type, prop) => {
	switch (prop) {
		case 'flight':
			switch (type) {
				case 'TrainInvoice':
					return '车次';
				case 'PlaneInvoice':
					return '航班号';
			}
		case 'invoiceOpenDate':
			switch (type) {
				case 'PlaneInvoice':
					return '填开日期';
				case 'TaxiInvoice':
				case 'PassengerInvoice':
					return '日期';
				default:
					return '开票日期';
			}
		case 'rider':
			switch (type) {
				case 'TrainInvoice':
					return '乘车人';
				case 'PlaneInvoice':
					return '乘机人';
				case 'PassengerInvoice':
					return '乘车人';
			}
		case 'getOnTime':
			switch (type) {
				case 'TaxiInvoice':
					return '上车时间';
				case 'PassengerInvoice':
					return '时间';
			}
	}
	return 'Unset';
}

// 发票类型是否可查验
export const InvoiceVerifiable = (type) => {
	let types = ['GenerInvoice', 'EleInvoice', 'VolInvoice', 'VehInvoice', 'SpecInvoice', 'EleTollInvoice'];
	return (types.indexOf(type) != -1);
};

// 发票类型是否可抵扣
export const InvoiceDeductible = (type) => {
	let types = ['VehInvoice', 'SpecInvoice', 'EleTollInvoice'];
	return (types.indexOf(type) != -1);
}

// 格式输出发票查验状态
export const FmtInvoiceVerifyStatus = (istate) => {
	switch (istate) {
		case '0':
			return '无需查验';
		case '1':
			return '查验成功';
		case '2':
			return '查验失败';
		case '3':
		default:
			return '正在查验';
	}
}

// 解析发票二维码的内容
export const ParseInvoiceQrcode = (cont) => {
	// 增值税电子普通发票:01,00,00152846,011001500111,3,20170414,47752652920636820604,7983
	// 增值税电子普通发票（通行费）:01,10,013001700112,08570096,42.54,20180116,12907514978959073016,15BD,
	// 增值税专用发票:01,01,3400161130,00640203,99099.10,20160919,,C0DB
	// 增值税普通发票:01,04,032001800105,07751825,100.00,20180704,01936508246467520270,3C4F,
	// 

	let res = {
		content: cont,
		invoice: {},
		success: true
	}
	try {
		let invoice = res.invoice;
		let itype = 'Unknow';
		let props = cont.split(',');
		let values = /\,(\d{10}|\d{12})\,/.exec(cont);
		if (values == null) {
			success = false;
			return res;
		}
		//发票代码
		invoice.invoiceCode = values[1];

		values = /\,(\d{8}),/.exec(cont);
		if (values == null) {
			res.success = false;
			return res;
		}
		//发票号码
		invoice.invoiceNum = values[1];

		switch (props[1]) {
			case '14':
				itype = 'EleInvoice';
				break;
			case '11':
				itype = 'VolInvoice';
				break;
			case '03':
				itype = 'VehInvoice';
				break;
			case '00':
				itype = 'EleInvoice'
				break;
			case '04':
				itype = 'GenerInvoice'
				break;
			case '01':
				itype = 'SpecInvoice';
				break;
			case '10':
				itype = 'EleTollInvoice';
				break;
			case '15':
			default:
				itype = 'GenerInvoice';
				break;
		}
		//发票类型
		invoice.invoiceType = itype;
		//发票金额
		invoice.amount = parseFloat(props[4]).toFixed(2);
		let dateStr = props[5];
		let dateArr = [];
		dateArr.push(dateStr.substring(0, 4));
		dateArr.push(dateStr.substring(4, 6));
		dateArr.push(dateStr.substring(6, 8));
		//开票日期
		invoice.invoiceOpenDate = dateArr.join('-');
		let vcode = props[6];
		let vclen = vcode.length;
		if (vclen != 0 && vclen != 20) {
			res.success = false;
			return res;
		}
		if (vclen == 20) {
			invoice.verifyCode = vcode.substring(vclen - 6, vclen);
		}
	} catch (err) {
		console.log('解析发票二维码出错..', err);
		res.success = false;
	}
	return res;
};

// 判断属性是否是空值
export const PropIsEmpty = (prop) => {
	return (prop == undefined || prop == null || prop == '');
};

// 报销状态
const ReimburseStatuses = [{
		label: '待审批',
		value: 'Auditing'
	},
	{
		label: '待收票',
		value: 'WaitingTickets'
	},
	{
		label: '待付款',
		value: 'WaitingPayment'
	},
	{
		label: '已驳回',
		value: 'Rejected'
	},
	{
		label: '已付款',
		value: 'Paid'
	},
	{
		label: '无',
		value: undefined
	}
];
// 格式化报销状态
export const FmtReimburseStatus = (istatus) => {
	let rss = ReimburseStatuses;
	let c = rss.length;
	for (let i = 0; i < c; i++) {
		let t = rss[i];
		if (t.value == istatus) {
			console.log(212,t.label)
			return t.label;
		}
	}
	return 'Unknow';
};
// 报销状态以及颜色
const ReimburseColorStatuses = [{
		label: '待审批',
		value: 'Auditing',
		color: '#3d94ff'
	},
	{
		label: '待收票',
		value: 'WaitingTickets',
		color: '#3d94ff'
	},
	{
		label: '待付款',
		value: 'WaitingPayment',
		color: '#3d94ff'
	},
	{
		label: '已驳回',
		value: 'Rejected',
		color: '#b60000'
	},
	{
		label: '已付款',
		value: 'Paid',
		color: '#09bb07'
	}
];

// 格式化报销状态,颜色
export const FmtReimburseColorStatus = (istatus) => {
	let rss = ReimburseColorStatuses;
	let c = rss.length;
	for (let i = 0; i < c; i++) {
		let t = rss[i];
		if (t.value == istatus) {
			return t;
		}
	}
	return 'Unknow';
};


// 克隆对象
export const Clone = (source) => {
	let target = JSON.parse(JSON.stringify(source));
	return target;
}

// 扩展属性
export const ExtendProps = (source, props) => {
	if ((typeof source) == 'object') {
		if (source instanceof Array) {
			source.forEach(item => {
				item = Object.assign(item, Clone(props));
			});
		} else if (source instanceof Object) {
			return Object.assign(source, Clone(props));
		}
	}
	return source;
}

// 识别状态
const RecgzStatuses = [{
	label: '识别失败',
	value: '0'
}, {
	label: '识别成功',
	value: '1'
}, {
	label: '识别重复',
	value: '2'
}];

export {
	RecgzStatuses
};

// 格式化识别状态
export const FmtRecgzStatus = (istatus) => {
	let rss = RecgzStatuses;
	let c = rss.length;
	for (let i = 0; i < c; i++) {
		let t = rss[i];
		if (t.value == istatus) {
			return t.label;
		}
	}
	return 'Unknow';
};

// 发票模型
export const InvoiceModel = {
	"id": 0,
	"createTime": '',
	"creator": '',
	"updateTime": '',
	"updater": '',
	"userId": '',
	"invoiceType": "GenerInvoice",
	"city": '',
	"receiveDate": '',
	"receiveMonth": '',
	"taxAmount": 0.00,
	"amount": 0.00,
	"sumAmount": 0.00,
	"capSumAmount": 0.00,
	"invoiceOpenDate": "",
	"getOnTime": '',
	"getOffTime": '',
	"kilometre": "",
	"invoiceCode": "",
	"invoiceNum": "",
	"customerName": "",
	"customerTaxNo": "",
	"customerAddrTel": "",
	"customerBankAccount": "",
	"departure": "",
	"destination": "",
	"setOutDate": "",
	"eleTicktNo": "",
	"flight": "",
	"seatClass": "",
	"surcharge": "",
	"checkCode": "",
	"verifyCode": "",
	"saleName": "",
	"saleTaxNo": "",
	"saleAddrTel": "",
	"saleBankAccount": "",
	"picture": "",
	"checkNum": "",
	"machineNo": "",
	"saleAddr": "",
	"saleTel": "",
	"saleBankName": "",
	"saleBankAcc": "",
	"carType": "",
	"brandModel": "",
	"place": "",
	"certificate": "",
	"instruction": "",
	"commodity": "",
	"engineNum": "",
	"vin": "",
	"rate": "",
	"competentCode": "",
	"paymentNum": "",
	"tonnage": "",
	"passengers": "",
	"checkState": "0",
	"failedMessage": "",
	"isExistenceList": "",
	"remark": "",
	"rider": "",
	"ticketPrice": 0,
	"planeTicketAmount": 0,
	"invoiveState": "0",
	"items": [],
	"recgzStatus": '0'
};

// 日期格式化
export const DateFormat = (date, fmt) => {
	if (fmt == undefined) fmt = 'YYYY-mm-dd';
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
};

// 校验发票信息
export const ValidateInvoice = (invoice) => {
	let itype = invoice.invoiceType;
	if (InvoicePropEditable(itype, 'invoiceCode') &&
		(PropIsEmpty(invoice.invoiceCode) ||
			!(/^\d{10}$|^\d{12}$/.test(invoice.invoiceCode)))) {
		return '请输入10或12位发票代码哦';
	}
	if (InvoicePropEditable(itype, 'invoiceNum') &&
		(PropIsEmpty(invoice.invoiceNum) ||
			!(/^\d{8}$/.test(invoice.invoiceNum)))) {
		return '请输入8位正确的发票号码哦';
	}
	if (InvoicePropEditable(itype, 'invoiceOpenDate') &&
		(PropIsEmpty(invoice.invoiceOpenDate))) {
		return `请选择${GetInvoicePropName(itype,'invoiceOpenDate')}哦`;
	}
	if (InvoicePropEditable(itype, 'city') &&
		(PropIsEmpty(invoice.city) ||
			!(/^\S{2,30}$/.test(invoice.city)))) {
		return '请输入2-30位城市名称哦';
	}
	if (InvoicePropEditable(itype, 'rider') &&
		(PropIsEmpty(invoice.rider) ||
			!(/^\S{2,20}$/.test(invoice.rider)))) {
		return `请输入2-20位{GetInvoicePropName(itype,'rider')}哦`;
	}
	if (InvoicePropEditable(itype, 'eleTicktNo') &&
		(PropIsEmpty(invoice.eleTicktNo) ||
			!(/^\S{1,20}$/.test(invoice.eleTicktNo)))) {
		return '请输入1-20位电子客票号码哦';
	}
	if (InvoicePropEditable(itype, 'departure') &&
		(PropIsEmpty(invoice.departure) ||
			!(/^\S{2,20}$/.test(invoice.departure)))) {
		return '请输入2-20位出发站名称哦';
	}
	if (InvoicePropEditable(itype, 'destination') &&
		(PropIsEmpty(invoice.destination) ||
			!(/^\S{2,20}$/.test(invoice.destination)))) {
		return '请输入2-20位到达站名称哦';
	}
	if (InvoicePropEditable(itype, 'setOutDate') &&
		(PropIsEmpty(invoice.setOutDate) ||
			!(/^\S{2,20}$/.test(invoice.setOutDate)))) {
		return '请选择出发时间哦';
	}
	if (InvoicePropEditable(itype, 'getOnTime') &&
		(PropIsEmpty(invoice.getOnTime) ||
			!(/^\S{2,20}$/.test(invoice.getOnTime)))) {
		return `请选择${GetInvoicePropName(itype,'getOnTime')}哦`;
	}
	if (InvoicePropEditable(itype, 'getOffTime') &&
		(PropIsEmpty(invoice.getOffTime) ||
			!(/^\S{2,20}$/.test(invoice.getOffTime)))) {
		return '请选择下车时间哦';
	}
	if (InvoicePropEditable(itype, 'kilometre') &&
		(PropIsEmpty(invoice.kilometre) ||
			!(/^\S{2,20}$/.test(invoice.kilometre)))) {
		return '请输入2-20位里程(公里)哦';
	}
	if (InvoicePropEditable(itype, 'sumAmount') &&
		(PropIsEmpty(invoice.sumAmount) ||
			!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(invoice.sumAmount)))) {
		return '请输入正确的金额哦';
	}
	if (InvoicePropEditable(itype, 'ticketPrice') &&
		(PropIsEmpty(invoice.ticketPrice) ||
			!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(invoice.ticketPrice)))) {
		return '请输入正确的票价(元)哦';
	}
	if (InvoicePropEditable(itype, 'flight') &&
		(PropIsEmpty(invoice.flight) ||
			!(/^\S{2,20}$/.test(invoice.flight)))) {
		return `请输入2-20位${GetInvoicePropName(itype,'flight')}哦`;
	}
	if (InvoicePropEditable(itype, 'seatClass') &&
		(PropIsEmpty(invoice.seatClass) ||
			!(/^\S{1,10}$/.test(invoice.seatClass)))) {
		return '请输入1-10位座位等级哦';
	}
	if (InvoicePropEditable(itype, 'surcharge') &&
		(PropIsEmpty(invoice.surcharge) ||
			!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(invoice.surcharge)))) {
		return '请输入正确的燃油附加费哦';
	}
	if (InvoicePropEditable(itype, 'planeTicketAmount') &&
		(PropIsEmpty(invoice.planeTicketAmount) ||
			!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(invoice.planeTicketAmount)))) {
		return '请输入正确的合计金额(元)哦';
	}
	if (InvoicePropEditable(itype, 'verifyCode') &&
		(PropIsEmpty(invoice.verifyCode) ||
			!(/^\d{6}$/.test(invoice.verifyCode)))) {
		return '请输入正确的校验码后6位哦';
	}
	if (InvoicePropEditable(itype, 'amount') &&
		(PropIsEmpty(invoice.amount) ||
			!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(invoice.amount)))) {
		return '请输入正确的不含税金额哦';
	}

	return '';
}

/**
 * 所对象的属性 null转空
 */
export const setObjPropNullToEmpty = (obj) => {
	for (var item in obj) {
		if ('invoiceType' == item) {
			obj[item] = 'GenerInvoice';
		} else if (obj[item] == null) {
			console.log(item + ":" + obj[item]);
			obj[item] = '';
		}
	}
};
