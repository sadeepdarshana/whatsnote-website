<template>

    <div>

        <v-jstree :data="datam"  no-dots size = "large" @item-click="itemClick" v-if="shown">
            <template  scope="_" >
                <div class="myGallery">
                    <span >
                        <img :src="_.model.opened? arrowdown:arrowright " style="height: 31px" v-if="_.model.type==='dir'">
                        <img :src="_.model.opened? arrowdown:arrowright " style="height: 31px; opacity: 0" v-if="_.model.type!=='dir'">
                        <img :src="getIcon(_.model.type)" style="height: 31px" >
                        ​<span >&nbsp&nbsp{{_.model.text}}</span>
                        ​<span style="color: transparent">&nbsp&nbsp{{spaces(30 -_.model.text.length)}}</span>
                        ​<p v-if="_.model.type!=='dir'" class="filesize">&nbsp&nbsp{{_.model.size}}</p>
                        ​<p v-if="_.model.type!=='dir'" class="author"><img   style="vertical-align: -3px; height: 14px" src="../assets/author.png"/>&nbsp&nbsp{{_.model.authorTitle.split(" ")[0].toLowerCase()}}</p>
                        ​<p v-if="_.model.type!=='dir'" class="downloads"><img   style="vertical-align: -1px; height: 14px" src="../assets/users.png"/>&nbsp&nbsp x {{_.model.downloads}}</p>

                    </span>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
                    ​<span class="openButton" v-if="localFiles[_.model.contentName]" >&nbsp open  &nbsp</span>
                </div>
            </template>
        </v-jstree>

    </div>


</template>

<script>
import VJstree from 'vue-jstree'
import VueQRCodeComponent from 'vue-qrcode-component'
import {fileExists, openInNewTab, openPdf, readsql} from "../utils"
import { get, post, downloadFile} from "../utils"
import * as utils from "../utils";
var Vue = require('vue-resource');
var glob = require('../glob');


export default {
    name: 'DirectoryStructure',
    components:{
        VJstree:VJstree,VueQRCodeComponent:VueQRCodeComponent
    },
    props: {
        repo: String,
        loading:Boolean

    },
    created: async function () {
        this.loading = true;
        console.log(this.localFiles);
        this.refreshLocalFiles();
    },
    methods: {

        async refreshLocalFiles(){

            this.localFiles = await utils.filesList();
        },

        humanFileSize(bytes){
            return utils.humanFileSize(bytes)
        },

        async itemClick (node) {
            node.model.opened = !node.model.opened;


            if(this.localFiles[node.model.contentName] && node.model.type === 'wn0')openInNewTab(node.model.contentName);
            if(this.localFiles[node.model.contentName] && node.model.type === 'pdf')openPdf(node.model.contentName);

            if(!await fileExists(node.model.contentName)) {
                if(this.fileDownloading[node.model._id])return;
                this.fileDownloading[node.model._id] = true;
                let bloc = await downloadFile(node.model.contentName,function (p) {
                    node.model.size = utils.humanFileSize(p.loaded) + " / " + utils.humanFileSize(node.model.legacySize)
                });
                this.fileDownloading[node.model._id] = false;
                let binaryResult = await bloc.blob();
                await utils.saveBlob(node.model.contentName,binaryResult);
                this.refreshLocalFiles();
            }

            console.log(node.model.type);
            if(node.model.type!=='pdf' && node.model.type!=='wn0') {
                require("downloadjs")(await utils.readBlob(node.model.contentName), node.model.title + "." + node.model.type, "image/jpeg");
            }
            else {
            }

        }
        ,
        getIcon(ext){
            if(["doc","docx","odt","rtf","txt"].includes(ext))return this.doc;
            if(["wn0"].includes(ext))return this.wn0;
            if(["dir"].includes(ext))return this.dir;
            if(["avi","mp4","wmv","flv","mov","3gp","m4v"].includes(ext))return this.avi;
            if(["pdf"].includes(ext))return this.pdf;
            if(["mp3","wav","aac","ogg","wma","flac","aif","m3u","m4a","mid","mpa","amr"].includes(ext))return this.mp3;
            if(["ppt","pptx","odp","pps","ppsx"].includes(ext))return this.ppt;
            if(["xls","xlsx","xlsm","ods","csv"].includes(ext))return this.xls;
            if(["png","jpg","jpeg","bmp","gif","tiff","webp","psd","svg","wmf"].includes(ext))return this.png;
            return this.file
        },

        spaces(l){
            let v = "";
            for(let i = 0; i<l;i++)v+="m";
            return v;
        }

    },
    watch:{
         async repo (val) {
            this.repoGuid = val;

            this.$parent.$parent.dsLoadingChanged(false);
             this.shown = false
            this.repoContent = await post("fetchRepo",{guid:this.repoGuid});
            this.$parent.$parent.dsLoadingChanged(true);

            let arr = this.repoContent.body.data;

            let mmap = [];
             for (let i of arr) {
                 mmap[i._id] = i;
                 i.children = []
             }
             for (let i of arr){
                 if(i._id==="root")continue;
                 if(mmap[i.parent]==null)continue;;
                 mmap[i.parent].children.push(i)
             }
             for (let i of arr){
                 i.text = i.title
                 i.legacySize = i.size
                 i.size = utils.humanFileSize(i.size)
                 mmap[i._id].children.sort(function(a, b){return b.timestamp - a.timestamp});
             }

             this.datam = mmap["root"].children;
             this.shown = true
        }
    },
    data() {
        return {
            repoGuid:"",
            shown:false,
            repoContent:{},
            arrowdown: require('../assets/arrowdown.png'),
            arrowright: require('../assets/arrowright.png'),

            localFiles:[],
            fileDownloading:[],


            file:require('../assets/file_type_icon_file.png'),
            avi: require('../assets/file_type_icon_avi.png'),
            dir: require('../assets/file_type_icon_dir.png'),
            doc: require('../assets/file_type_icon_doc.png'),
            mp3: require('../assets/file_type_icon_mp3.png'),
            pdf: require('../assets/file_type_icon_pdf.png'),
            png: require('../assets/file_type_icon_png.png'),
            ppt: require('../assets/file_type_icon_ppt.png'),
            xls: require('../assets/file_type_icon_xls.png'),
            wn0: require('../assets/file_type_icon_wn0.png'),

            datam:[],
            sample:  [
                {

                    "title": "vsdfwfsdfs",
                    "children": [
                        {

                            "text": "custom icon",
                            "children": []
                        },
                        {
                            "text": "disabled node",
                            "children": [
                                {
                                    "text": "newNode",
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import url('https://fonts.googleapis.com/css?family=Rajdhani|Kalam');
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
    span {
        font-size:large;
        display: inline-block;
    }

    .filesize{
        top: 6px;
        color: #464646;
        left: 70px;
        position: absolute;
        display: inline-block;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 500;

    }

    .author{

        font-family: 'Kalam', cursive;
        top: 6px;
        color: #767676;
        left: 200px;
        position: absolute;
        display: inline-block;
        font-weight: 500;
        opacity: 0.6;

    }

    .downloads{

        font-family: 'Rajdhani', sans-serif;
        top: 6px;
        color: #767676;
        left: 330px;
        position: absolute;
        display: inline-block;
        font-weight: 500;
        opacity: 0.6;

    }

    .openButton{

        font-family: 'Rajdhani', sans-serif;
        color: #04a615;
        border-color: #04a615;
        border: 2px solid;
        border-radius: 20px;

        height:25px;
        align-content: center;
        width: 100px;
        vertical-align: middle;

        display: inline;

    }

    .myGallery {
        position: relative;
        display: block;
        vertical-align: middle;
        margin-top:-12px;
        height: 60px;
    }

    img {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-top:-8px;
    }
</style>
