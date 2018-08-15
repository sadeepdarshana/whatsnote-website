<template>
    <div class="hello">
        <v-jstree :data="datam"  no-dots  @item-click="itemClick">
            <template scope="_">
                <div class="myGallery">
                    <img src="../assets/folder.png" style="height: 26px" >
                    ​<span>&nbsp&nbsp{{_.model.text}}</span>
                </div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
                <div></div>
            </template>

        </v-jstree>

        <p>fgds</p>
    </div>
</template>

<script>
import VJstree from 'vue-jstree'
export default {
    name: 'HelloWorld',
    components:{
        VJstree
    },
    props: {
        msg: String
    },
    methods: {
        itemClick (node) {
            node.model.opened = !node.model.opened;
        }
    },
    data() {
        return {
            datam:  [
                {
                    "id": 0,
                    "text": "Same but eeeewith checkboxes",
                    "value": "Same but with wwwcheckboxes",
                    "icon": "card icon",
                    "opened": true,
                    "selected": false,
                    "disabled": false,
                    "loading": false,
                    "children": [
                        {
                            "id": 5,
                            "text": "custom icon",
                            "value": "custom icon",
                            "icon": ".pog",
                            "opened": true,
                            "selected": false,
                            "disabled": false,
                            "loading": false,
                            "children": []
                        },
                        {
                            "id": 6,
                            "text": "disabled node",
                            "value": "disabled node",
                            "icon": "fa fa-check icon-state-success",
                            "opened": true,
                            "selected": false,
                            "disabled": false,
                            "loading": false,
                            "children": [
                                {
                                    "id": 23,
                                    "text": "newNode",
                                    "value": "newNode",
                                    "icon": "",
                                    "opened": false,
                                    "selected": false,
                                    "disabled": false,
                                    "loading": false,
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

    .myGallery img {
        display: inline-block;
        vertical-align: middle;
        margin-top:-8px;
    }

</style>
