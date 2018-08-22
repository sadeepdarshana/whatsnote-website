

var Vue = require('vue-resource');
import { uuid } from 'vue-uuid'
var glob = require('./glob');

var VueCookie = require('vue-cookie');

export function post(path,data) {
    data.requestGuid = generateGuid();
    data.jwt = "web_"+ VueCookie.get('uid');

    return  Vue.Http.post(glob.host+path,data,{timeout:3000});
}

export function get(path,data,progress) {
    data.requestGuid = generateGuid();
    data.jwt = "web_"+ VueCookie.get('uid');

    return  Vue.Http.get(glob.host+path,{responseType: 'blob',body:data,params:data,headers:data,downloadProgress:progress});
}

export function generateGuid(){
    return uuid.v4();
}

export function humanFileSize(bytes) {
    let si = true;
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}