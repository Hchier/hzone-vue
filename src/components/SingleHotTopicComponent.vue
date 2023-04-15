<template>
    <div id="topic" class="clear">
        <span id="rank" class="font">{{ rank }}</span>
        <span id="name" class="font">{{ name }}</span>
        <span id="readNum" class="font">{{ readNum }}</span>
        <span id="fire" class="font">🔥</span>
    </div>
</template>

<script lang=ts>
import {defineComponent} from "vue";

export default defineComponent({
    name: "SingleHotTopicComponent",
    props: ["rank", "name", "readNum"],
    setup(props) {
        return {};
    },
});
</script>

<style scoped>
.clear::before, .clear::after {
    content: '';
    display: table;
    clear: both;
}


#topic {
    margin-top: 5px;
    height: 35px;
}

#topic:hover {
    background-color: rgba(64, 158, 255, 0.8);
    cursor: pointer;
}

#rank {
    float: left;
    margin: 0 15px 0 15px;
    color: red;
    font-style: italic;

}

#name {
    float: left;
    height: 35px;
    max-width: 110px;
    margin: 0 10px 0 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
}

#readNum {
    float: left;
    color: #8590a6;
    font-size: 15px;
    max-width: 50px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
}

#fire{
    float: right;
    margin-right: 10px;
}

.font {
    line-height: 35px;
    font-size: 17px;
}
</style>