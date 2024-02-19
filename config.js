import defaultEnv from './env';
const environment = {
  RELEASE: 'release', // 正式环境
  ALPHA: 'alpha', // 预发布环境
  DEVELOPMENT: 'development', // 测试环境
  DEBUG: 'debug', // 调试环境
};

const table = {
  [environment.RELEASE]: {
    baseUrl: 'https://api.zcxnb.cn',
    apiVersion: 1,
  },
  [environment.ALPHA]: {
    baseUrl: 'https://api.zcxnb.cn',
    apiVersion: 1,
  },
  [environment.DEVELOPMENT]: {
    baseUrl: 'http://localhost:7003',
    apiVersion: 1,
  },
  [environment.DEBUG]: {
    // baseUrl: 'https://api.xiaochatai.com',
    // baseUrl: 'https://api.chali.tech',
    baseUrl: 'http://localhost:7001',
    // baseUrl: 'http://192.168.88.157:8902',
    // baseUrl: 'https://d262-204-124-181-13.ngrok.io', // ngrok拦截调试地址
    apiVersion: 1,
  },
};
console.warn('defaultEnv', defaultEnv);
const tabBarData = {
  //自定义tabbar是原生的，所以用app的globalData来管理其状态
  border_color: '#eee',
  bg_color: '#fff',
  list: [
    {
      icon_style: true,
      pos_index: '0',
      icon_selected: 'wap-home',
      link: '',
      link_name: '首页',
      is_default: true,
      icon_unselected: 'wap-home-o',
      color_unselected: '#100101',
      color_selected: '#f70',
      wxlink: '/pages/index/index',
    },
    {
      icon_style: true,
      pos_index: '0',
      icon_selected: 'fire',
      link: '',
      link_name: 'Demo',
      is_default: true,
      icon_unselected: 'fire-o',
      color_unselected: '#100101',
      color_selected: '#f70',
      wxlink: '/pages/demo/index',
    },
    {
      pos_index: '1',
      icon_style: true,
      icon_selected: 'user',
      link_name: '我的',
      is_default: true,
      icon_unselected: 'user-o',
      color_unselected: '#100101',
      color_selected: '#f70',
      wxlink: '/pages/me/index',
    },
  ],
};
class Config {
  static DEFAULT_ENVIRONMENT = defaultEnv.environment || environment.RELEASE;
  static DEBUG = false;
  static ENVIRONMENT = environment;
  static current = Config.DEFAULT_ENVIRONMENT;
  static tabBarData = tabBarData;
  static init(env = Config.DEFAULT_ENVIRONMENT, debug = false) {
    Config.current = env;
    Config.DEBUG = debug;
    this.load();
  }
  static load() {
    const env = table[this.current];
    Object.keys(env).forEach(key => {
      this[key] = env[key];
    });
  }
  static clear() {
    const env = wx.getStorageSync('env');
    wx.clearStorage();
    wx.setStorageSync('env', env);
  }
}

export default Config;
export { Config, table, tabBarData };
