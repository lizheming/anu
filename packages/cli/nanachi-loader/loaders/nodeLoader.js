const path = require('path');

const isReact = function(sourcePath){
    return /React\w+\.js$/.test(path.basename(sourcePath));
};

module.exports = async function(code, map, meta) {
    const callback = this.async();
    let relativePath = '';
    let queues;
    // 如果不是业务目录下的资源，直接返回空
    if (!this.resourcePath.startsWith(process.cwd())) {
        queues = [];
        callback(null, {
            queues,
            exportCode: code
        }, map, meta);
        return;
    }
    if (isReact(this.resourcePath)) {
        relativePath = this.resourcePath.match(/React\w+\.js$/)[0];
        queues = [{
            code,
            path: relativePath
        }];
        callback(null, {
            queues,
            exportCode: ''
        }, map, meta);
        return;
    }
    
    relativePath = path.join('npm', this.resourcePath.replace(/^.+?\/node_modules\//, ''));
    queues = [{
        code,
        path: relativePath
    }];
    callback(null, {
        queues,
        exportCode: code
    }, map, meta);
};