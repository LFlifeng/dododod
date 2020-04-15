if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
  self.getCurrentPages = AFAppX.getCurrentPages;
  self.getApp = AFAppX.getApp;
  self.Page = AFAppX.Page;
  self.App = AFAppX.App;
  self.my = AFAppX.bridge || AFAppX.abridge;
  self.abridge = self.my;
  self.Component = AFAppX.WorkerComponent || function(){};
  self.$global = AFAppX.$global;
  self.requirePlugin = AFAppX.requirePlugin;
          

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../components/uni-swipe-action/uni-swipe-action?hash=591ac642b6f57a184fac9330fa292ccf33c32471');
require('../../components/uni-swipe-action-item/uni-swipe-action-item?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-transition/uni-transition?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-popup/uni-popup?hash=63f3d097e78ac04213190ce4a92c81860617f7b4');
require('../../components/uni-tag/uni-tag?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-collapse/uni-collapse?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-icons/uni-icons?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-collapse-item/uni-collapse-item?hash=993ca45dec9dcdb8f19451ba17e5ec831eb613a0');
require('../../components/uni-combox/uni-combox?hash=993ca45dec9dcdb8f19451ba17e5ec831eb613a0');
require('../../components/ms-tabs/ms-tabs?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../pages/tab-bar/home/home_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/tab-bar/ticket/ticket_tt?hash=66f6703ffcdb7557c751a10d68de178b9ba6bf7f');
require('../../pages/tab-bar/reimburse/reimburse?hash=66f6703ffcdb7557c751a10d68de178b9ba6bf7f');
require('../../pages/dd/dd?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/tab-bar/mine/mine_tt?hash=ad82157d09e84b6bbdab74ed2243970531fabba1');
require('../../pages/mine/about-us/about-us_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/income/submitPage/submitPage?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/result/choose-invoice-result/choose-invoice-result_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/result/submit-reimburse-result/submit-reimburse-result_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/ticket/detail/detail_tt?hash=1eea8201ba2532395f12a7a67a09ba897ca7f1c6');
require('../../pages/ticket/choose/choose_tt?hash=66f6703ffcdb7557c751a10d68de178b9ba6bf7f');
require('../../pages/rise/invoice-rise_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/rise/invoice-detail_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/rise/invoice-add_tt?hash=2574d6ebea313b6b9a87fba0052a756c2c985b85');
require('../../pages/reimburse/detail/detail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/authorize/authorize?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/reimburse/print/print?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/ticket/choose-image/choose-image_tt?hash=ad82157d09e84b6bbdab74ed2243970531fabba1');
require('../../pages/ticket/recgz-images/recgz-images_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/tab-bar/home/home_tt?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/reimburse/detail/detail_tt?hash=ad82157d09e84b6bbdab74ed2243970531fabba1');
require('../../pages/tab-bar/reimburse/reimburse_tt?hash=f2eef61829358faa577ee641ec5f9aea0b791e88');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}