<template>
    <div class="page">
            <md-card class="maincard md-elevation-5">


                <div class="catalog  md-s" >


                    <div v-for="item in catalog.body.data" v-if="!catalog.catalogLoading">
                        <div class="catalogItem clickable" :isCurrentRepo = "currentRepo._id===item._id" @click="clickCatalogItem(item)">
                            <img src="../assets/snow.png" class="catalogItemIcon" >
                            <span class="catalogItemText">{{item.title}}</span>
                        </div>
                        <md-divider  />
                    </div>


                    <ring-loader v-if="catalog.catalogLoading===true" color="#3AB982" size="50px" style="left: calc(50% - 25px);position: absolute;top: calc(50% - 25px);"></ring-loader>

                </div>



                <div class="signOutBox clickable"  @click="signOut">
                    <img src="../assets/signout.png" class="singOutIcon" style="display:inline-block;vertical-align: middle">

                    <p style="display:inline-block;vertical-align: middle">Sign Out</p>
                </div>

                <div class="repoTitle">
                    <span class="display:inline-block;vertical-align: middle">{{"&nbsp&nbsp&nbsp&nbsp&nbsp"+(currentRepo.title!=null?currentRepo.title:"")}}</span>
                </div>
                <div class="dspace">
                    <DirectoryStructure class="ds" :repo="currentRepo._id"  />
                    <ring-loader v-if="!dsLoaded===true && currentRepo._id!=null " color="#3AB982" size="50px" style="left: calc(50% - 25px);position: absolute;top: calc(50% - 25px);"></ring-loader>

                </div>
            </md-card>
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
    name: 'ThePage',
    components:{
        DirectoryStructure,RingLoader

    },
    props: {

    },
    created: async function () {

        this.catalog = await post("fetchCatalog",{});
        this.catalog.catalogLoading = false;
    },
    methods: {
        clickCatalogItem(item){
            this.currentRepo = item;
        },
        signOut(){
            this.$parent.clearUser();
        },
        dsLoadingChanged(loaded){
            this.dsLoaded = loaded;
        }
    },
    data() {
        return {
            catalog:{body:{data:[]},catalogLoading:true},
            currentRepo:{},
            dsLoaded:false
        }
    }
}
</script>


<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Raleway|Roboto:500');

    .maincard{

        background: #fbfbfb;

        margin: 1% 5%;

        height: 96%;
        width: 90%;
        left: 0;
        top: 0;
        position: relative;

        float: left;
    }

    .page{

        background: linear-gradient(0deg, #d6dbd7 70%, #1ebea5 30%);


        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        overflow: hidden;
        position: fixed;
    }

    .catalog{


        float:left;

        width: 400px;
        height: calc(100% - 60px);


        overflow: auto;

        position: relative;


        background-color: #f8f8f8;



    }
    .catalogItem {
        text-align:left;
        background:#fff;
        width: 100%;
        min-height: 80px;
    }
    .catalogItemText {
        color: #5f5f6e;
        width: 300px;
        vertical-align: middle;
        font-family: 'M PLUS 1p', sans-serif;
        font-size: medium;
    }
    .catalogItem:hover {
        background:#f5f5f5;
    }
    [isCurrentRepo=true] {
        background:#eee!important;
    }

    .catalogItemIcon {
        display: inline-block;
        margin: 10px 10px 10px 10px ;
        height: 60px;
        width: 60px;
    }

    .singOutIcon {

        opacity: .4;
        display: inline-block;
        margin: 10px 10px 10px 10px ;
        height: 30px;
        width: 30px;
    }

    .signOutBox{


        cursor:hand;
        float:left;
        clear: both;

        padding-top: 5px;
        padding-left: 5px;

        text-align: left;

        width: 400px;
        height: 60px;


        background-color: #f8f8f8;

    }
    .repoTitle{


        width: 100%;
        height: 60px;

        padding-top: 16px;


        font-family: 'Roboto', sans-serif;

        background-color: #a9b9ab;

        color: white;

    }
    .dspace{

        overflow:auto;

        width: calc(100% - 400px);
        height: calc(100% - 60px);

        position: relative;

        padding-top: 16px;

        margin-left: 400px;


        font-family: 'Roboto', sans-serif;

        background-color: white;


    }
    .signOutBox:hover {
        background:#eee;
    }

    .clickable{
        cursor: pointer;
    }

    .ds{
        margin-top: 30px;
    }
    hr {
        display: block;
    }

</style>

<style>
    img{-webkit-user-drag: none;}


    /* width */
    ::-webkit-scrollbar {
        width: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #ddd;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #bbb;
    }
</style>