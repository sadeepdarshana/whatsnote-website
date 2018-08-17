<template>

    <div>

        <v-jstree :data="datam"  no-dots size = "large" @item-click="itemClick" v-if="shown">
            <template  scope="_" >
                <div class="myGallery">
                    <img :src="_.model.opened? arrowdown:arrowright " style="height: 31px" v-if="_.model.type==='dir'">
                    <img :src="_.model.opened? arrowdown:arrowright " style="height: 31px; opacity: 0" v-if="_.model.type!=='dir'">
                    <img :src="getIcon(_.model.type)" style="height: 31px" >
                    ​<span >&nbsp&nbsp{{_.model.text}}</span>
                    ​<p v-if="_.model.type!=='dir'" class="filesize">&nbsp&nbsp{{_.model.size}}</p>
                    ​<p v-if="_.model.type!=='dir'" class="author"><img   style="vertical-align: -3px; height: 14px" src="../assets/author.png"/>&nbsp&nbsp{{_.model.authorTitle.split(" ")[0].toLowerCase()}}</p>
                    ​<p v-if="_.model.type!=='dir'" class="downloads"><img   style="vertical-align: -1px; height: 14px" src="../assets/users.png"/>&nbsp&nbsp x {{_.model.downloads}}</p>
                </div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
            </template>
        </v-jstree>

    </div>


</template>

<script>
import VJstree from 'vue-jstree'
import VueQRCodeComponent from 'vue-qrcode-component'
import { post} from "../utils"
import { get} from "../utils"
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
    },
    methods: {

        humanFileSize(bytes){
            return utils.humanFileSize(bytes)
        },

        async itemClick (node) {
            node.model.opened = !node.model.opened;

            let bloc = await get("fileDownload",{repoGuid:this.repoGuid,diGuid:node.model._id},function (p) {
                console.log(p.loaded+" "+p.total);
                node.model.size = utils.humanFileSize(p.loaded)+" / "+ utils.humanFileSize(node.model.legacySize)
            });
            let r = await bloc.blob();
            require("downloadjs")(r,utils.generateGuid()+"."+node.model.type,"image/jpeg");
        }
        ,
        getIcon(ext){
            if(["doc","docx","odt","rtf","txt"].includes(ext))return this.doc;
            if(["dir"].includes(ext))return this.dir;
            if(["avi","mp4","wmv","flv","mov","3gp","m4v"].includes(ext))return this.avi;
            if(["pdf"].includes(ext))return this.pdf;
            if(["mp3","wav","aac","ogg","wma","flac","aif","m3u","m4a","mid","mpa","amr"].includes(ext))return this.mp3;
            if(["ppt","pptx","odp","pps","ppsx"].includes(ext))return this.ppt;
            if(["xls","xlsx","xlsm","ods","csv"].includes(ext))return this.xls;
            if(["png","jpg","jpeg","bmp","gif","tiff","webp","psd","svg","wmf"].includes(ext))return this.png;
            return this.file
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

            let mmap = []
             for (let i of arr) {
                 mmap[i._id] = i
                 i.children = []
             }
             for (let i of arr){
                 if(i._id==="root")continue;
                 mmap[i.parent].children.push(i)
             }
             for (let i of arr){
                 i.text = i.title
                 i.legacySize = i.size
                 i.size = utils.humanFileSize(i.size)
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


            file: require('../assets/file_type_icon_file.png'),
            avi: require('../assets/file_type_icon_avi.png'),
            dir: require('../assets/file_type_icon_dir.png'),
            doc: require('../assets/file_type_icon_doc.png'),
            mp3: require('../assets/file_type_icon_mp3.png'),
            pdf: require('../assets/file_type_icon_pdf.png'),
            png: require('../assets/file_type_icon_png.png'),
            ppt: require('../assets/file_type_icon_ppt.png'),
            xls: require('../assets/file_type_icon_xls.png'),

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
        margin-top:4px;
        display: inline-block;
    }

    .filesize{
        top: 10px;
        color: #464646;
        left: 70px;
        position: absolute;
        display: inline-block;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 500;

    }

    .author{

        font-family: 'Kalam', cursive;
        top: 10px;
        color: #767676;
        left: 200px;
        position: absolute;
        display: inline-block;
        font-weight: 500;
        opacity: 0.6;

    }

    .downloads{

        font-family: 'Rajdhani', sans-serif;
        top: 10px;
        color: #767676;
        left: 330px;
        position: absolute;
        display: inline-block;
        font-weight: 500;
        opacity: 0.6;

    }

    .myGallery {
        position: relative;
        display: block;
        vertical-align: middle;
        margin-top:-8px;
    }

    img {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-top:-8px;
    }
</style>
