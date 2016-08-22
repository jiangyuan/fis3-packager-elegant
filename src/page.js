/**
 * 管理页面的所有资源
 * @author jero
 * @date 2016-08-19
 */

export default class Page {
  constructor(file, retMap, config, project) {
    this.file = file;
    this.retMap = retMap;
    this.config = config;
    this.project = project;

    this.checkPlaceholder();
    this.analyzeHtmlDepsAndAsync();
  }

  /**
   * 检查页面是否有资源的 placeholder ，没有默认则插到各自底部
   * 保证 script 在 resource 之前
   */
  checkPlaceholder() {
    const { stylePlaceHolder, scriptPlaceHolder, resourcePlaceHolder } = this.config;
    const file = this.file;
    let content = file.getContent();

    if (content.indexOf(stylePlaceHolder) === -1) {
      content = content.replace('</head>', `${stylePlaceHolder}\n</head>`);
    }

    // 保证在 scriptPlaceHolder 之前
    if (content.indexOf(resourcePlaceHolder) === -1) {
      if (content.indexOf(scriptPlaceHolder) > -1) {
        content = content.replace(scriptPlaceHolder, `${resourcePlaceHolder}\n${scriptPlaceHolder}`);
      } else {
        content = content.replace('</body>', `${resourcePlaceHolder}\n</body>`);
      }
    }

    if (content.indexOf(scriptPlaceHolder) === -1) {
      content = content.replace('</body>', `${stylePlaceHolder}\n</body>`);
    }

    file.setContent(content);
  }

  /**
   * 分析页面的同步和异步依赖
   *  每个依赖就是一个包
   *  allInOne 当然另说
   *
   *  @todo js 文件的异步依赖 ，智能计算包的依赖次数？
   */
  analyzeHtmlDepsAndAsync() { // requires, asyncs
    const project = this.project;
    const retMap = this.retMap;
    const {
      id, // 文件的 id
      requires, // 同步依赖
      asyncs // 异步依赖
    } = this.file;

    requires.forEach((modId) => {
      project.addPkg('sync', modId, retMap.ids[modId]);
    });

    asyncs.forEach((modId) => {
      project.addPkg('async', modId, retMap.ids[modId]);
    });
  }
}
