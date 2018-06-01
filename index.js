/**
 * InPlugin depends on html-webpack-plugin
 */
const utils = require('./utils.js');

class InPlugin{
  apply(compiler){
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
          // console.log(compilation);
          let source = compilation.assets['index.html'].source();
          compilation.assets['index.html'].source = function(){
            return`${utils.replace(source)}
            <style>${utils.combine(utils.source.styles)}</style>
            <script type="text/javascript">${utils.combine(utils.source.scripts)}</script>`;
          };
          callback();
      })
    }
    else{
        throw new Error('in-webpack-plugin need webpack which version gt 4.0.0 !');
    }
  }
}

module.exports = InPlugin;
