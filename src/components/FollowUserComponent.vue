<template>
    <div id="follow" class="clear">
        <el-avatar id="avatar" :size="45"
                   :src="avatarPrefix + showFollower?followUserVO.follower:followUserVO.followee +'.png'" @error="true">
            <img :src="avatarPrefix+Math.floor(Math.random()*10)+'.png'" alt=""/>
        </el-avatar>

        <a id="username" v-show="!showFollower">{{ followUserVO.followee }}</a>
        <a id="username" v-show="showFollower">{{ followUserVO.follower }}</a>

        <div id="followButton">
            <el-button v-show="followUserVO.followed" type="primary" @click="followCancel">已关注</el-button>
            <el-button v-show="!followUserVO.followed" plain @click="follow">未关注</el-button>
        </div>
    </div>
</template>

<script lang=ts>
import {defineComponent} from "vue";
import {FollowType} from "@/common/consts/Enums";
import {FollowDTO, FollowCancelDTO} from "@/common/dtos/FollowDTOs";
import FollowApis from "@/common/apis/FollowApis";
import {ElMessage} from "element-plus";
import {AVATAR_PREFIX} from "@/common/consts/const";

export default defineComponent({
    name: "FollowComponent",
    props: ["followUserVO", "showFollower"],
    setup(props) {
        let avatarPrefix = AVATAR_PREFIX;
        function follow() {
            let followDTO: FollowDTO = {
                type: FollowType.User,
                followee: props.showFollower ? props.followUserVO.follower : props.followUserVO.followee,
            };
            FollowApis.follow(followDTO).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("关注成功");
                    Object.assign(props.followUserVO, {
                        followed: true,
                    });
                } else {
                    ElMessage.error("关注失败: " + res.data.message);
                }
            });
        }

        const followCancel = () => {
            let followCancelDTO: FollowCancelDTO = {
                type: FollowType.User,
                // followee: props.followUserVO.followee,
                followee: props.showFollower ? props.followUserVO.follower : props.followUserVO.followee,
            };
            FollowApis.followCancel(followCancelDTO).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success("取关成功");
                    Object.assign(props.followUserVO, {
                        followed: false,
                    });
                } else {
                    ElMessage.error("取关失败: " + res.data.message);
                }
            });
        };

        return {
            FollowType,
            follow,
            followCancel,
            avatarPrefix
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
    box-sizing: border-box;
    border: 1px solid #f0f2f7;
    width: 300px;
    height: 50px;
}

#avatar {
    float: left;
    margin: 0 20px 0 0;
}

#username {
    margin: 0;
    float: left;
    font-size: 23px;
    line-height: 50px;
}

#followButton {
    float: right;
    margin: 8px 20px 0 0;
}
</style>