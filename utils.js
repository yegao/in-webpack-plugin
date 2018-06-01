const fs = require('fs');

let templates = {};
let styles = {};
let scripts = {};
let index = 0;
function add(){
  return ++index;
}

function template(data,id){
  const reg = /<template>([\s\S]*?)<\/template>/;
  if(reg.test(data)){
    var content = reg.exec(data)[1];
    // templates[id] = content;
    console.log(content);
    return replace(`<!--ins-${id}-begin-->${content}<!--ins-${id}-end-->`);
  }
  return data;
}

function style(data,id){
  const reg = /^([\s\S]*?)<style[\s\S]*?>([\s\S]*?)<\/style>([\s\S]*?)$/;
  if(reg.test(data)){
    var list = data.match(reg);
    styles[id] = list[2];
    return `${list[1]}${list[3]}`;
  }
  return data
}

function script(data,id){
  const reg = /^([\s\S]*?)<script[\s\S]*?>([\s\S]*?)<\/script>([\s\S]*?)$/;
  if(reg.test(data)){
    var list = data.match(reg);
    scripts[id] = list[2];
    return `${list[1]}${list[3]}`;
  }
  return data
}

function combine(o){
  var res = '';
  for(var k in o){
    res += o[k];
  }
  return res;
}

function replace (buffer){
  var insource = buffer.toString();
  if(/<in>(.*?)<\/in>/.test(insource)){
    insource = insource.replace(/<in>(.*?)<\/in>/g,function(match,path){
      let buffer = fs.readFileSync(path);
      return replace(buffer);
    });
  }
  if(/<ins>(.*?)<\/ins>/.test(insource)){
    insource = insource.replace(/<ins>(.*?)<\/ins>/g,function(match,path){
      let innerBuffer = fs.readFileSync(path);
      innerBuffer = innerBuffer.toString();
      let id = add();
      innerBuffer = style(innerBuffer,id);
      innerBuffer = script(innerBuffer,id);
      return template(innerBuffer,id);
    });
  }
  return insource
}

const utils = {
  add,
  template,
  script,
  style,
  replace,
  combine,
  source:{
    templates,
    scripts,
    styles
  }
}
module.exports = utils;
