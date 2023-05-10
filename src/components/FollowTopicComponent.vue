<template>
    <div id="follow" class="clear">
        <!--        <a id="followee" href="">{{ followTopicVO.followee }}</a>-->
        <router-link id="followee" :to="'/topic?name=' + followTopicVO.followee">
            {{ followTopicVO.followee }}
        </router-link>

        <p id="totalReadNum">总阅读量: {{ followTopicVO.totalReadNum }}</p>

        <div id="followButton">
            <el-button v-show="followTopicVO.followed" type="primary" @click="followCancel">已关注</el-button>
            <el-button v-show="!followTopicVO.followed" plain @click="follow">未关注</el-button>
        </div>
    </div>
</template>

<script lang=ts>
import {defineComponent} from "vue";
import {FollowCancelDTO, FollowDTO} from "@/common/dtos/FollowDTOs";
import {FollowType} from "@/common/consts/Enums";
import FollowApis from "@/common/apis/FollowApis";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: "FollowTopicComponent",
    props: ["followTopicVO"],
    setup(props) {
        function follow() {
            let followDTO: FollowDTO = {
                type: FollowType.TOPIC,
                followee: props.followTopicVO.followee,
            };
            FollowApis.follow(followDTO).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("关注成功");
                    Object.assign(props.followTopicVO, {
                        followed: true,
                    });
                } else {
                    ElMessage.error("关注失败: " + res.data.message);
                }
            });
        }

        const followCancel = () => {
            let followCancelDTO: FollowCancelDTO = {
                type: FollowType.TOPIC,
                followee: props.followTopicVO.followee,
            };
            FollowApis.followCancel(followCancelDTO).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("取关成功");
                    Object.assign(props.followTopicVO, {
                        followed: false,
                    });
                } else {
                    ElMessage.error("取关失败: " + res.data.message);
                }
            });
        };

        return {
            follow,
            followCancel,
        };
    },
});
</script>

<style scoped>
.clear::before, .clear::after {
    content: '';
    display: table;
    clear: both;
}

#follow {
    width: 300px;
    height: 50px;
}

#followee {
    float: left;
    margin-left: 15px;
    line-height: 50px;
    font-size: 23px;
    color: #fc5431;
}

#totalReadNum {
    float: left;
    margin: 0 0 0 30px;
    line-height: 50px;
    color: #8590a6;
}

#followButton {
    float: right;
}

#followButton {
    float: right;
    margin: 8px 20px 0 0;
}
</style>