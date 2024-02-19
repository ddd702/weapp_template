import Config, { table, tabBarData } from './config';
import { getDataByCode } from './api/index';
import Session from './base/session';
import Bus from './utils/event';
import Util from './utils/util';
import { getTabBarInstance } from './utils/helper';
import { TABBAR_CODE, PRIVACY_CODE } from './constants/index';
import ENV from './env';
console.$util = Util;
/**
 * 初始化环境
 * 正式版不能手动改环境，环境默认为正式
 * 体验版和开发版可以手动更改环境，默认为对应环境，
 */
function reloadConfig() {
  const {
    miniProgram: { envVersion },
  } = wx.getAccountInfoSync();

  if (envVersion === 'release') {
    Config.init(Config.ENVIRONMENT.RELEASE, false);
  } else {
    const env =
      wx.getStorageSync('env') ||
      ENV.environment ||
      (envVersion === 'trial' ? Config.ENVIRONMENT.ALPHA : Config.ENVIRONMENT.DEVELOPMENT);
    Config.init(env, true);
  }
}

const Conf = reloadConfig();
console.warn('Conf', Conf);
App({
  tabBarData,
  globalData: {
    privacy: 1,
    title: '新的小程序',
    Conf,
    loginFromUrl: '', //记录那个页面跳去的登录，会回跳到该页面
    debug: Config.DEBUG,
    statusBarHeight: 0,
    toolbarHeight: 0,
    navbarHeight: 0,
    screenWidth: 0,
  },
  Bus,
  onLaunch() {
    if (this.globalData.debug) {
      this._printConfig();
    }
    this.checkForUpdate();
    this.getStatusbarInfo();
    Session.login();
  },
  // 检测是否有小程序更新, 若有则提示更新
  checkForUpdate() {
    const updateManager = wx.getUpdateManager();

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
  },
  // 初始化状态栏相关变量, 便于各个页面自定义状态栏
  getStatusbarInfo() {
    const sysinfo = wx.getSystemInfoSync();
    const statusBarHeight = sysinfo.statusBarHeight;
    const isiOS = sysinfo.system.indexOf('iOS') > -1;
    const toolbarHeight = isiOS ? 44 : 48;
    this.globalData.screenWidth = sysinfo.screenWidth;
    this.globalData.statusBarHeight = statusBarHeight; // 系统状态栏(包括时间等这些信息)
    this.globalData.toolbarHeight = toolbarHeight; // 小程序顶部标题栏(包括标题以及胶囊等组件)
    this.globalData.navbarHeight = statusBarHeight + toolbarHeight;
  },
  reload() {
    reloadConfig();
    this.onLaunch();
  },
  // 路由引导
  /**
   *
   * @param {string} path 初始路径
   * @returns
   */
  _printConfig() {
    console.log('>============================================<');
    console.log('[info] config: env =>  ', Config.current);
    Object.keys(table[Config.current]).forEach(key => {
      console.log('[info] config: ', `${key} => ${table[Config.current][key]}`);
    });
    const storage = wx.getStorageInfoSync();
    storage.keys.forEach(key => {
      console.log('[info] storage: ', `${key} => ${wx.getStorageSync(key)}`);
    });
    console.log('>============================================<');
  },
});
