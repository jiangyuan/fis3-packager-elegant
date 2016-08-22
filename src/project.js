/**
 * 管控整个项目的资源
 * @author jero
 * @date 2016-08-19
 */

import Page from './page';


export default class Project {
  htmlFilePkg = {
    // page1: [ {'js/base': {type: 'sync', deps: ['baba']}}, {'js/page1': {type: 'async', deps: ['baba']}} ] // 严格按照顺序？
  }; // 所有 html 文件，包含递归的依赖信息
  pkg = {
    async: {},
    sync: {}
  }; // 整个项目将要打的包
  jsModule = {}; // 整个项目的 js 模块

  constructor(files, retMap, settings) {
    // this.allFiles = files;
    this.files = files;
    this.retMap = retMap;
    this.settings = settings;

    this.filterFile();
    this.setPkg();
  }

  filterFile() {
    Object.keys(this.files).forEach((subpath) => {
      const file = this.files[subpath];

      if (file.isHtmlLike && !file.elegantPage) {
        file.elegantPage = new Page(file, this.retMap, this.settings, this);
      }
    });
  }

  setPkg(id, value) {
    this.htmlFilePkg[id] = value;
  }

  addPkg(type, id, file) {
    const pkg = this.pkg[type] && this.pkg[type][id];

    if (id && file && !pkg) {
      this.pkg[type][id] = file;
    }
  }

  addHtmlFile() {

  }

  addJsModule(id, file) {
    if (id && file && !this.jsModule[id]) {
      this.jsModule[id] = file;
    }
  }
}
