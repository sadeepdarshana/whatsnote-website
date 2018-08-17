<template>
    <div class="page">
            <md-card class="mdd md-elevation-5">
                <div class="divx">
                    <p class="headdd">To use WhatsNote on your computer</p>
                    <ol class="nor">
                        <li>Open WhatsNote on your phone</li>
                        <li>Select <b>Webs</b> from the menu in the main screen</li>
                        <li>Scan this code</li>
                    </ol>
                </div>
                <qr-code draggable="false" class="qrr" style="display: inline-block" color="#124" error-level="H"	 :text="qrToken" :options="{ size: 256 }"/>

            </md-card>
    </div>
</template>

<script>
import VJstree from 'vue-jstree'
import VueQRCodeComponent from 'vue-qrcode-component'
var Vue = require('vue-resource');
var glob = require('../glob');

export default {
    name: 'QRPage',
    components:{
        VueQRCodeComponent:VueQRCodeComponent
    },
    props: {
        msg: String
    },
    created: async function () {
        let x = await Vue.Http.post(glob.host+'webGetToken');
        this.timer = setInterval(this.checkLogin,1000);
        this.qrToken = x.data.token;
    },
    methods: {
        async checkLogin () {
            let x = await Vue.Http.post(glob.host+'webCheckLogin',{token:this.qrToken});
            if(x.body.uid!=="no") {
                clearInterval(this.timer);
                this.$parent.setUser(x.body.uid);
            }
        },

    },
    data() {
        return {
            qrToken:""
        }
    }
}
</script>


<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Raleway|Roboto:500');

    .headdd {
        display: inline-block;


        font-size: xx-large;
    }
    .nor {
        font-size: large;
    }
    ul {
        padding: 0;
        font-family: 'Roboto', sans-serif;

    }
    li {
        margin: 14px -10px;

        display: list-item;
    }
    a {
        color: #42b983;
    }
    span {
        font-size:large;
        margin-top:4px;
    }
    .qrr{

        float:right;
        margin: 72px 72px 0px -0px;
    }

    .divx{

        float:left;

        line-height: 200%;

        width: 400px;
        height: 400px;

        padding: 40px 0 0 72px;

        color: #444444;

        font-family: 'Raleway', sans-serif;


    }

    .mdd{


        position:fixed;
        top: 50%;
        left: 50%;


        margin-top: -200px; /*set to a negative number 1/2 of your height*/
        margin-left: -400px;

        width: 800px;
        height: 400px;

        background-color: white;
    }

    .page{

        background: linear-gradient(0deg, #d6dbd7 50%, #1ebea5 50%);


        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        overflow: hidden;
        position: fixed;
    }

</style>

<style>
    img{-webkit-user-drag: none;}
</style>