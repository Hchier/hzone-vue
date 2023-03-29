<template>
    <div id="zone" class="clear">
        <div id="userInfo">
            <el-avatar id="avatar" :size="90"
                       src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
            <p id="username"><strong>{{ userVO.username }}</strong></p>
            <p id="signature">{{ userVO.signature }}</p>
            <div id="numDiv">
                <span id="faveredNum" class="num">{{ userVO.favoredNum }}获赞</span>
                <span id="faveredNum" class="num">{{ userVO.favorNum }}点赞</span>
                <span id="followNum" class="num">{{ userVO.followNum }}关注</span>
                <span id="followedNum" class="num">{{ userVO.followedNum }}粉丝</span>
            </div>

            <div id="followed">
                <el-button v-show="userVO.followed" type="primary">已关注</el-button>
                <el-button v-show="!userVO.followed" plain>未关注</el-button>
            </div>
        </div>

        <div id="content">
            <div class="contentButton" @click="getPublishedList">发布列表</div>
            <div class="contentButton" @click="getFavorList">点赞列表</div>
            <div class="contentButton" @click="getFollowUserList(); getFollowTopicList()">关注列表</div>
            <div class="contentButton">粉丝列表</div>
            <div class="contentButton">留言墙</div>

            <div v-for="item in publishedList" v-bind:key="item.id" v-show="showPublishedList">
                <Blog :blogVO="item" :autoUnfold="false"></Blog>
            </div>

            <div v-for="item in favorList" :key="item.id" v-show="showFavorList">
                <Blog :blogVO="item" :autoUnfold="false"></Blog>
            </div>

            <div id="followUserList" v-show="showFollowList">
                <p style="font-size: 30px;margin: 0 0 10px">关注用户：</p>
                <div v-for="item in followUserList" :key="item.id">
                    <FollowUser id="followUserVO" :followUserVO="item"></FollowUser>
                </div>
                <el-button @click="loadMoreFollowUserList" type="primary">加载更多</el-button>
            </div>

            <div id="followTopicList" v-show="showFollowList">
                <p style="font-size: 30px;margin: 0 0 10px">关注话题：</p>
                <div v-for="item in followTopicList" :key="item.id">
                    <FollowTopic id="followTopicVO" :followTopicVO="item"></FollowTopic>
                </div>
                <el-button @click="loadMoreFollowTopicList" type="primary">加载更多</el-button>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {UserVO} from "@/common/vos/UserVO";
import UserApis from "@/common/apis/UserApis";
import {ElMessage} from "element-plus";
import {deepCopy} from "@/utils/copy";
import {BlogVO} from "@/common/vos/BlogVO";
import BlogApis from "@/common/apis/BlogApis";
import Blog from "@/components/BlogComponent.vue";
import {Ref} from "@vue/reactivity";
import FollowApis from "@/common/apis/FollowApis";
import {FollowType} from "@/common/consts/Enums";
import FollowUser from "@/components/FollowUserComponent.vue";
import FollowTopic from "@/components/FollowTopicComponent.vue";
import {FollowUserVO} from "@/common/vos/FollowUserVO";
import {FollowTopicVO} from "@/common/vos/FollowTopicVO";

export default defineComponent({
    name: "ZoneView",
    components: {
        Blog,
        FollowUser,
        FollowTopic,
    },
    setup() {
        let userVO: UserVO = reactive({
            username: "",
            signature: "",
            blogNum: 0,
            favorNum: 0,
            favoredNum: 0,
            followNum: 0,
            followedNum: 0,
            followed: false,
        });

        function getUserVO() {
            let username = useRoute().query.username as string | undefined;
            if (username === undefined) {
                username = "";
            }
            UserApis.getUserVO(username).then(res => {
                if (res.data.code === 200) {
                    let vo = res.data.body as UserVO;
                    deepCopy(vo, userVO);
                    getPublishedList();
                } else {
                    ElMessage.error("查找失败：" + res.data.body);
                }
            });
        }

        let showPublishedList = ref(true),
            showFavorList = ref(false),
            showFollowList = ref(false),
            showFollowedList = ref(false),
            showMsgWall = ref(false);

        function setVisible(item: Ref) {
            showPublishedList.value = false;
            showFavorList.value = false;
            showFollowList.value = false;
            showFollowedList.value = false;
            showMsgWall.value = false;
            item.value = true;
        }

        let publishedList: Array<BlogVO> = reactive([]);
        let publishedListPageNum = 0;
        const getPublishedList = () => {
            setVisible(showPublishedList);
            if (publishedListPageNum === 0 && publishedList.length > 0) {
                return;
            }
            BlogApis.getPublishedList(userVO.username, publishedListPageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<BlogVO>;
                    list.forEach(value => {
                        publishedList.push(value);
                    });
                } else {
                    ElMessage.error("查找失败：" + res.data.message);
                }
            });
        };

        function loadMorePublishedList() {
            publishedListPageNum++;
            getPublishedList();
        }

        let favorList: Array<BlogVO> = reactive([]);
        let favorListPageNum = 0;

        function getFavorList() {
            setVisible(showFavorList);
            if (favorListPageNum === 0 && favorList.length > 0) {
                return;
            }
            BlogApis.getFavorList(userVO.username, favorListPageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<BlogVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多内容");
                    }
                    list.forEach(value => {
                        favorList.push(value);
                    });
                    ElMessage.success("查找成功");
                } else {
                    ElMessage.error("查找失败：" + res.data.message);
                }
            });
        }

        const loadMoreFavorList = () => {
            favorListPageNum++;
            getFavorList();
        };


        let followUserList: Array<FollowUserVO> = reactive([]);
        let followUserListPageNum = 0;

        function getFollowUserList() {
            setVisible(showFollowList);
            //只允许第一次点击‘关注列表’时调用该函数
            if (followUserListPageNum === 0 && followUserList.length > 0) {
                return;
            }
            FollowApis.getUserList(userVO.username, followUserListPageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<FollowUserVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    list.forEach(value => {
                        followUserList.push(value);
                    });
                } else {
                    ElMessage.error("查找关注情况失败：" + res.data.message);
                }
            });
        }

        function loadMoreFollowUserList() {
            followUserListPageNum++;
            getFollowUserList();
        }

        let followTopicList: Array<FollowTopicVO> = reactive([]);
        let followTopicListPageNum = 0;

        function getFollowTopicList() {
            setVisible(showFollowList);
            if (followTopicListPageNum === 0 && followTopicList.length > 0) {
                return;
            }

            FollowApis.getTopicList(userVO.username, followTopicListPageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<FollowTopicVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    list.forEach(value => {
                        followTopicList.push(value);
                    });
                } else {
                    ElMessage.error("查找关注情况失败：" + res.data.message);
                }
            });
        }

        function loadMoreFollowTopicList() {
            followTopicListPageNum++;
            getFollowTopicList();
        }

        function created() {
            getUserVO();
            getPublishedList();
        }

        created();

        return {
            userVO,
            showPublishedList,
            showFavorList,
            showFollowList,
            showFollowedList,
            showMsgWall,
            publishedList,
            getPublishedList,
            loadMorePublishedList,
            favorList,
            getFavorList,
            loadMoreFavorList,
            followUserList,
            getFollowUserList,
            loadMoreFollowUserList,
            followTopicList,
            getFollowTopicList,
            loadMoreFollowTopicList,

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

#zone {
    position: relative;
    margin: 0 auto;
    border: 1px solid red;
    box-sizing: border-box;
    width: 700px;
}

#userInfo {
    border: 1px solid red;
    box-sizing: border-box;
    width: 700px;
    height: 130px;
    margin: 0 0 20px 0;
}


#avatar {
    position: absolute;
    left: 10px;
    top: 10px;
}

#username {
    position: absolute;
    left: 130px;
    top: 0px;
    font-size: 25px;
}

#signature {
    position: absolute;
    left: 130px;
    top: 45px;
    font-size: 20px;
}

#numDiv {
    position: absolute;
    left: 130px;
    top: 100px;
    font-size: 18px;
}

.num {
    padding: 0 40px 0 0;
}

#followed {
    position: absolute;
    left: 360px;
    top: 30px;
}

#content {
    position: relative;
}

.contentButton {
    border: 1px solid red;
    box-sizing: border-box;
    height: 50px;
    width: 139px;
    line-height: 50px;
    display: inline-block;
    text-align: center;
}

.contentButton:hover {
    background-color: #e6f0fd;
    cursor: pointer;
}

#followUserList {
    float: left;
    border: 1px solid blue;
    box-sizing: border-box;
    width: 300px;
}

#followTopicList {
    float: right;
    border: 1px solid blue;
    box-sizing: border-box;
    width: 300px;
}


</style>