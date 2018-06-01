/**
 * InPlugin depends on html-webpack-plugin
 */
const utils = require('./utils.js');

class InPlugin{
  constructor(options){
    this.options = options;
  }
  apply(compiler){
    let that = this;
    if(compiler.hooks){
      compiler.hooks.make.tapAsync('in-webpack-plugin',function(compilation,callback){
        callback();
      });
      compiler.hooks.compilation.tap('in-webpack-plugin',function (compilation) {
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('in-webpack-plugin',function (data, callback) {
            callback(null, data);
          }
        );
      });
      compiler.hooks.emit.tapAsync('in-webpack-plugin',function(compilation,callback){
          let ext = that.options.ext;
          let assets = compilation.assets;
          for(let key in assets){
            let reg = new RegExp("\\."+ext+"(\\?|$)");
            if(reg.test(key)){
              let source = compilation.assets[key].source();
              compilation.assets[key].source = function(){
                  return utils.replace(source).replace('</html>',`<style>${utils.combine(utils.source.styles)}</style>
                  <script type="text/javascript">${utils.combine(utils.source.scripts)}</script></html>`);
              };
            }
          }
          callback();
      })
    }
    else{
        throw new Error('in-webpack-plugin need webpack which version gt 4.0.0 !');
    }
  }
}

module.exports = InPlugin;
