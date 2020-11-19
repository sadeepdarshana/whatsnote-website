

var Vue = require('vue-resource');
import { uuid } from 'vue-uuid'
var glob = require('./glob');
var sql = require('sql.js');

var VueCookie = require('vue-cookie');

export function post(path,data) {
    data.requestGuid = generateGuid();
    data.jwt = "web_"+ VueCookie.get('uid');

    return  Vue.Http.post(glob.host+path,data,{timeout:8000});
}

export function get(path,data,progress) {


    data.requestGuid = generateGuid();
    data.jwt = "web_"+ VueCookie.get('uid');
    console.log(33)
    console.log(data)
    console.log(44)
    return  Vue.Http.get(glob.hostfiles+data.contentName,{responseType: 'blob',body:data,params:data,headers:data,downloadProgress:progress});
    //classic return  Vue.Http.get(glob.host+path,{responseType: 'blob',body:data,params:data,headers:data,downloadProgress:progress});
}
export function downloadFile(contentName,progress) {

    return  Vue.Http.get(glob.fileHost+contentName,{responseType: 'blob',downloadProgress:progress});
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

export function allocateSpace() {

    try {
        const requestedBytes = 1024 * 1024 * 1024;

        navigator.webkitPersistentStorage.requestQuota(requestedBytes, ()=>{}, ()=>{});
    }catch (e) {
        alert("WhatsNote works only on Chrome. To ensure best experience please open this site on the latest version of Chrome")
    }

}

export function saveBlob(contentName,blob){



    return new Promise((resolve, reject) => {

        window.webkitRequestFileSystem(window.PERSISTENT,1024*1024*1024,s=>{
            s.root. getFile(contentName,{create:true, exclusive:false},x=>{
                    x.createWriter(function(fileWriter) {

                        fileWriter.onwriteend = function(e) {
                            localStorage[contentName] = true;
                            resolve();
                        };

                        fileWriter.onerror = function(e) {
                        };

                        // Create a new Blob and write it to log.txt.
                        //var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

                        fileWriter.write(blob);

                    });
                }
            );
        },s=>{});

    });
}
export function readBlob(contentName){

    return new Promise((resolve, reject) => {

        window.webkitRequestFileSystem(window.PERSISTENT,1024*1024*1024,s=>{
            s.root. getFile(contentName,{create:false},x=>{


                    x.file(function(file) {
                        var reader = new FileReader();

                        reader.onloadend = function(e) {
                            resolve(this.result);
                        };

                        reader.readAsArrayBuffer(file);
                    });



                },

                x=>{resolve(-1)}
            );
        },s=>{});

    });
}
export function readArrayBufferFromFile(contentName){

    return new Promise((resolve, reject) => {

        window.webkitRequestFileSystem(window.PERSISTENT,1024*1024*1024,s=>{
            s.root. getFile(contentName,{create:false},x=>{


                    x.file(function(file) {
                        var reader = new FileReader();

                        reader.onloadend = function(e) {
                            resolve(this.result);
                        };

                        reader.readAsArrayBuffer(file);
                    });



                },

                x=>{resolve(-1)}
            );
        },s=>{});

    });
}
export async function filesList(){

    return new Promise((resolve, reject) => {

        window.webkitRequestFileSystem(window.PERSISTENT,1024*1024*1024,x=>{

            function toArray(list) {
                return Array.prototype.slice.call(list || [], 0);
            }

            var dirReader = x.root.createReader();
            var entries = [];

            // Call the reader.readEntries() until no more results are returned.
            var readEntries = function() {
                dirReader.readEntries (function(results) {
                    if (!results.length) {

                        let dict = [];
                        for(let entry of entries){
                            dict[entry.name] = true;
                        }

                        resolve(dict);
                    } else {
                        entries = entries.concat(toArray(results));
                        readEntries();
                    }
                });
            };

            readEntries();

        },s=>{});

    });
}

export function fileExists(contentName){

    return new Promise((resolve, reject) => {

        window.webkitRequestFileSystem(window.PERSISTENT,1024*1024*1024,s=>{
            s.root. getFile(contentName,{create:false},x=>{resolve(true)},x=>{resolve(false)});
        },s=>{});

    });
}


export function openInNewTab(contentName) {



    var win = window.open("#/?file="+contentName, '_blank');
    console.log(window);
    win.focus();


}

export function openPdf(contentName) {



    var win = window.open("pdfviewer/web/viewer.html?pdf="+contentName, '_blank');
    console.log(window);
    win.focus();


}
export function openMp3(contentName,title) {

    var win = window.open("audio/player.html?mp3="+contentName +"&title="+title , '_blank');
    console.log(window);
    win.focus();


}


export function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

export function openYtb(linku,title) {

    var id = ""
    try {
        id = youtube_parser(linku);
    }
    catch(err) {
        id = "";
    }

    if (id == null)id="";

    var win = window.open("ytb/player.html?ytb="+id +"&title="+title , '_blank');
    console.log(window);
    win.focus();


}

export function binaryImageto64(uint8Array) {
    return 'data:image/jpeg;base64,' + btoa(
        uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}
export async function readBinaryImagesFromSqlite(contentName) {

    var Uints = new Uint8Array(await readArrayBufferFromFile(contentName));
    let db = new SQL.Database(Uints);

    var res = db.exec("SELECT * FROM objectTable");


    let images = [];

    for(let row of res[0].values){
        images.push(binaryImageto64(row[1]));
    }

    return images;
}
