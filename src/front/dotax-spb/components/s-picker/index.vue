<template>
  <s-popup
    :value="visible"
    :position="position"
    :custom-class="'s-picker '+customClass"
    :effect="effect"
    :effect-duration="effectDuration"
    :mask="mask"
    :mask-opacity="maskOpacity"
    :mask-close="maskClose"
    :before-show="beforeShow"
    @hide="hideCallback"
  >
    <div class="s-picker-header s-hairline-bottom">
      <div class="cancel-btn" :style="{color:cancelColor}" @click="hide">{{cancelText}}</div>
      <span class="title">{{title}}</span>
      <div class="confirm-btn" :style="{color:confirmColor}" @click="confirm">{{confirmText}}</div>
    </div>
    <div class="s-picker-content">
      <picker-view v-if="showContent" :value="selectedIndexList" @change="slideChage">
        <picker-view-column v-for="(listItem,listIndex) of list" :key="listIndex">
          <view
            class="s-picker-item"
            v-for="(item,index) of listItem"
            :key="index"
          >{{formatText(item)}}</view>
        </picker-view-column>
      </picker-view>
    </div>
  </s-popup>
</template>

<script>
import sPopup from '../uni-popup/uni-popup.vue';
export default {
  name: 's-picker',
  components: {
    sPopup
  },
  props: {
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
  },
  data () {
    return {
      selectedIndexList: [],
      showContent: false
    };
  },
  watch: {
    value () {
      this.setIndex(this.value);
    }
  },
  methods: {
    beforeShow () {
      setTimeout(() => {
        this.setIndex(this.value);
        this.showContent = true;
      }, 50);
    },
    hideCallback () {
      this.hide();
      this.showContent = false;
    },
    hide () {
      this.$emit('update:visible', false);
    },
    formatText (item) {
      return (typeof item === 'object' && item) ? item[this.textKey] : item;
    },
    slideChage (e) {
      this.setIndex(e.detail.value);
    },
    setIndex (indexList) {
      const prevSelectedIndexList = this.selectedIndexList.slice(0);
      this.selectedIndexList = indexList;
      this.selectedIndexList.some((selectedIndex, i) => {
        if (selectedIndex != prevSelectedIndexList[i]) {
          this.$emit('change', i, this.selectedIndexList);
          return true;
        }
      });
    },
    confirm () {
      this.$emit('input', this.selectedIndexList);
      this.hide();
    }
  }
};
</script>

<style lang="scss">
.s-picker {
  &-header {
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .cancel-btn,
    .confirm-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 28rpx;
      padding: 0 30rpx;
      cursor: pointer;
    }
    .title {
      flex: 1;
      font-size: 36rpx;
      color: #333;
      text-align: center;
    }
  }
  &-content {
    height: 400rpx;
    picker-view {
      height: 100%;
    }
  }
  &-item {
    display: flex;
    font-size: 30rpx;
    align-items: center;
    justify-content: center;
  }
}
</style>
