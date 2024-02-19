/**
 * @description 发布小程序用的脚本，配合jenkins使用的,构建结果通过企业微信机器人发送到开发群中
 * @use node publish.js type=preview branch=main desc=hellowork robot=2 env=release
 */
const ci = require('miniprogram-ci');
const fs = require('fs-extra');
const path = require('path');
const packageConf = require('./package.json');
const projectConf = require('./project.config.json');

/**
 * 获取node命令行参数
 * @param {array} options 命令行数组
 */
function getEnvParams(options) {
  let envParams = {};
  // 从第三个参数开始,是自定义参数
  for (let i = 2, len = options.length; i < len; i++) {
    let arg = options[i].split('=');
    envParams[arg[0]] = arg[1];
  }
  return envParams;
}

let {
  type = '',
  robot = 2,
  branch = '',
  env = 'release',
  version = packageConf.version,
  desc = 'hello world',
  appid = projectConf.appid,
} = getEnvParams(process.argv);
(async () => {
  console.warn('version', version);
  console.warn('开始修改本地env.js文件：', env);
  fs.writeFileSync(path.join(__dirname, 'env.js'), `export default {environment:'${env}'}`);
  const setting = {
    es6: true,
    es7: true,
    minify: true,
    minifyJS: true,
    minifyWXML: true,
    minifyWXSS: true,
    autoPrefixWXSS: true,
    ignoreUploadUnusedFiles: true,
  };
  const project = new ci.Project({
    appid,
    type: 'miniProgram',
    projectPath: './',
    privateKeyPath: `./keys/private.${appid}.key`,
    ignores: [
      //不上传的文件
      'babel.config.js',
      'publish.js',
      'project.private.config.json',
      'package-lock.json',
      'package.json',
      'node_modules/**/*',
      'keys/**/*',
      'previewDist/**/*',
      '__test__/**/*',
      'script/**/*',
      '.vscode/**/*',
      '*.md',
      '*.lock',
    ],
  });
  //构建npm
  const warning = await ci.packNpm(project, {
    reporter: infos => {
      console.log(infos);
    },
  });
  console.warn('构建npm完成，结果如下：', warning);
  desc += `---版本:${version},分支:${branch},ENV:${env}`;
  if (type === 'upload') {
    const uploadResult = await ci.upload({
      project,
      version,
      desc,
      robot,
      setting,
      onProgressUpdate: console.log,
    });
    console.log(uploadResult);
  } else {
    let previewDest = './previewDist';
    fs.ensureDir(previewDest);
    const previewResult = await ci.preview({
      project,
      version,
      desc, // 此备注将显示在“小程序助手”开发版列表中
      setting,
      robot,
      qrcodeFormat: 'image',
      qrcodeOutputDest: `${previewDest}/qr-view.jpg`,
      onProgressUpdate: console.log,
      // pagePath: 'pages/index/index', // 预览页面
      // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
    });
    console.log(previewResult);
  }
})();
