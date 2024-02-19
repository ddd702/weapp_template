// 增加外部复写样式
Component({
  properties: {
    picSrc: {
      type: String,
      value: 'https://cdn.zcxnb.cn/cloud/2022/06/30/IRCt2iHN_emptybox.png',
    },
    desc: {
      type: String,
      value: '暂无记录',
    },
  },
  options: {
    styleIsolation: 'isolated',
  },
  externalClasses: ['my-class'],
});
