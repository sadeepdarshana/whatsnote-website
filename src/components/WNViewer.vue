<template>
    <div class="scrollablePage">
        <img v-for="image in images"  :src="image" class="bookImage"/>
        <ring-loader v-if="images===[]" color="#3AB982" size="50px" style="left: calc(50% - 25px);position: absolute;top: calc(50% - 25px);"></ring-loader>
    </div>
</template>

<script>


var Vue = require('vue-resource');
var glob = require('../glob');
var utils = require('../utils');

import { post} from "../utils"
import DirectoryStructure from "./DirectoryStructure";
import RingLoader from 'vue-spinner/src/RingLoader.vue'


export default {
    name: 'WNViewer',
    components:{
        RingLoader
    },
    props: {
        contentName: String
    },
    created: async function () {
        this.loadImages();
    },
    methods: {
        async loadImages(){
            this.images = await utils.readBinaryImagesFromSqlite(this.contentName);
        }

    },
    data() {
        return {
            images:[]
        }
    }
}
</script>


<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Raleway|Roboto:500');

    .bookImage
    {

        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1%;
        width: 70%;
        z-index: 0;
    }

    .scrollablePage{

        overflow: visible;
        background-color: #888;
    }

    img{-webkit-user-drag: none;}


    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #555;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #10210c;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #b2bb9f;
    }
</style>

<style scoped>
</style>