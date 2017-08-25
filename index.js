var loaderUtils = require("loader-utils");

module.exports = function(content) {
    this.cacheable && this.cacheable();
	
    // 使用 loader-utils 1.0.1版本以上的getOptions方法，支持webpack query及webpack2的option写法
    var query = loaderUtils.getOptions(this) || {};
    var tpl = content || '';

    tpl = cleanRedundantCode(tpl, query);// remove redundant code
    
    return "module.exports = " + JSON.stringify(tpl);
};

// pure regEx to resolve it, not via a parser;
function cleanRedundantCode(str, opts){
    opts = opts || {};
    var minimize = opts.minimize || true;
    var comments = opts.comments || {};
    var htmlComments = comments.html,
        rglComments = comments.rgl;
    
    if(minimize && typeof str === 'string'){
        var SINGLE_SPACE = '';
        var EMPTY = '';

        // remove html-comments <!-- xxx -->
        str = !htmlComments ? str.replace(/<!-[\s\S]*?-->/g, EMPTY) : str;

        // remove regular-comments {! xxx !}
        str = !rglComments ? str.replace(/{![\s\S]*?!}/g, EMPTY) : str;

        // 暴力全局替换\s，副作用：内容里面有带空格或回车的字符串会被替换截掉
        str = str.replace(/[\s]{2,}/g, SINGLE_SPACE);

        str = str.trim();
    }
    return str;
};
