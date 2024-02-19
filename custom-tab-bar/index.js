import Helper from '../utils/helper';
Component({
  data: {
    bg_color: '#fff',
    border_color: '#eee',
    selected: 0,
    list: [],
  },
  attached() {
    console.$tabbar = this;
    this.init();
  },
  detached() {
    appInstance.Bus.off('setRedDot');
    appInstance.Bus.off('setBadge');
  },
  ready() {
    console.log('tabar ready');
    this.setSelected();
  },
  methods: {
    setSelected(index = -1) {
      if (index >= 0) {
        this.setData({ selected: index });
        return;
      }
      let { selected } = this.data;
      let nowPath = '/' + Helper.getPageInstance().route;
      this.data.list.map((item, index) => {
        if (item.wxlink === nowPath) {
          selected = index;
        }
      });
      this.setData({ selected });
    },
    init() {
      //初始化tabbar数据
      const appInstance = getApp();
      this.setData({
        border_color: appInstance.tabBarData.border_color || '#eee',
        bg_color: appInstance.tabBarData.bg_color || '#fff',
        list: appInstance.tabBarData.list,
      });
      appInstance.Bus.on('setBadge', this, e => {
        this.setBadge(e);
      });
      appInstance.Bus.on('setRedDot', this, e => {
        this.setRedDot(e);
      });
    },
    setBadge(params = { index: 0, badge: 0 }) {
      let { index, badge } = params;
      console.warn('tabbar badge', index, badge);
      let list = this.data.list;
      list[index].badge = badge;
      this.setData({
        list,
      });
    },
    setRedDot(params = { index: 0, show: false }) {
      let { index, show } = params;
      console.warn('tabbar showRedDot', index, show);
      let list = this.data.list;
      list[index].redDot = show;
      this.setData({
        list,
      });
    },
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      // const index = data.index;
      // this.setSelected(index);
      wx.switchTab({ url });
    },
  },
});
