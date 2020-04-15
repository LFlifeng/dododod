# 提示

[s-ui github地址](https://github.com/sldt/s-ui)
[s-ui 查看演示](https://sldt.github.io/s-ui/unpackage/dist/build/h5/)

# s-picker

## 参数说明

``` js
{
  customClass: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'bottom'
  },
  // 双向绑定picker显示隐藏
  visible: {
    type: Boolean,
    default: false
  },
  // 是否使用过渡效果
  effect: {
    type: Boolean,
    default: true
  },
  // 过渡时间
  effectDuration: {
    type: Number,
    default: 300
  },
  // 是否显示遮罩
  mask: {
    type: Boolean,
    default: true
  },
  // 遮罩透明度
  maskOpacity: {
    type: Number,
    default: 0.7
  },
  // 点击遮罩是否关闭弹框
  maskClose: {
    type: Boolean,
    default: true
  },
  // 数据
  list: {
    type: Array,
    default () {
      return [];
    }
  },
  // item文本key
  textKey: {
    type: String,
    default: 'text'
  },
  // v-model双向绑定选中的下标数组
  value: {
    type: Array,
    default () {
      return [];
    }
  },
  title: {
    type: String,
    default: 'picker'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  cancelColor: {
    type: String,
    default: '#999'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  confirmColor: {
    type: String,
    default: '#007bff'
  }
}
```

## 使用方式

#### template

``` html
<div
  class="btn btn-primary btn-block"
  style="height:80rpx;font-size:30rpx"
  @click="showOnePicker=true"
>一级：{{oneSelectedText}}</div>

<s-picker :visible.sync="showOnePicker" :list="onePickerList" v-model="oneSelected"></s-picker>

<div
  class="btn btn-primary btn-block"
  style="height:80rpx;font-size:30rpx;margin-top:40rpx"
  @click="showTwoPicker=true"
>二级联动：{{twoSelectedText}}</div>

<s-picker
  :visible.sync="showTwoPicker"
  :list="twoPickerList"
  @change="twoChange"
  v-model="twoSelected"
></s-picker>
```

#### script
``` js
import sPicker from '@/s-ui/s-picker';

export default {
  components: {
    sPicker
  },
  computed: {
    oneSelectedText () {
      return this.listData[this.oneSelected[0]].text;
    },
    twoSelectedText () {
      return this.listData[this.twoSelected[0]].text + '-' + this.listData[this.twoSelected[0]].child[this.twoSelected[1]];
    }
  },
  data () {
    return {
      listData: [
        {
          text: '山西',
          child: ['太原', '运城', '临汾', '吕梁']
        },
        {
          text: '河北',
          child: ['石家庄', '邯郸']
        },
        {
          text: '陕西',
          child: ['西安']
        }
      ],
      // 一级
      onePickerList: [],
      showOnePicker: false,
      oneSelected: [0],
      // 二级
      twoPickerList: [],
      showTwoPicker: false,
      twoSelected: [0, 0]
    };
  },
  methods: {
    twoChange (i, indexList) {
      if (i == 0) {
        this.twoPickerList = [this.listData, this.listData[indexList[0]].child];
      }
    }
  },
  onLoad () {
    this.onePickerList = [this.listData];
    this.twoPickerList = [this.listData, this.listData[0].child];
  }
};
```