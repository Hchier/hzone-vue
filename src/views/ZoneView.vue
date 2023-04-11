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
            <div class="contentButton" tabindex="1" @click="getPublishedList">发布列表</div>
            <div class="contentButton" tabindex="1" @click="getFavorList">点赞列表</div>
            <div class="contentButton" tabindex="1" @click="getFollowUserList">关注用户</div>
            <div class="contentButton" tabindex="1" @click="getFollowTopicList">关注列表</div>
            <div class="contentButton" tabindex="1" @click="getFansList">粉丝列表</div>
            <div class="contentButton" tabindex="1" @click="showWall">留言墙</div>

            <div v-for="item in publishedList" v-bind:key="item.id" v-show="showPublishedList">
                <Blog :blogVO="item" :autoUnfold="false"></Blog>
            </div>

            <div v-for="item in favorList" :key="item.id" v-show="showFavorList">
                <Blog :blogVO="item" :autoUnfold="false"></Blog>
            </div>

            <el-dialog v-model="showFollowUserList" title="关注用户" style="width: 390px;">
                <div id="followUserList">
                    <div v-for="item in followUserList" :key="item.id">
                        <FollowUser id="followUserVO" :followUserVO="item" :showFollower="false"></FollowUser>
                    </div>
                    <el-button @click="loadMoreFollowUserList" type="primary">加载更多</el-button>
                </div>
            </el-dialog>

            <el-dialog v-model="showFollowTopicList" title="关注话题" style="width: 390px">
                <div id="followTopicList">
                    <div v-for="item in followTopicList" :key="item.id">
                        <FollowTopic id="followTopicVO" :followTopicVO="item"></FollowTopic>
                    </div>
                    <el-button @click="loadMoreFollowTopicList" type="primary">加载更多</el-button>
                </div>
            </el-dialog>

            <el-dialog v-model="showFansList" title="粉丝列表" style="width: 390px">
                <div id="fansList">
                    <div v-for="item in fansList" :key="item.id">
                        <FollowUser id="followUserVO" :followUserVO="item" :showFollower="true"></FollowUser>
                    </div>
                    <el-button @click="loadMoreFansList" type="primary">加载更多</el-button>
                </div>
            </el-dialog>

            <Wall :username="userVO.username" v-if="showMsgWall"></Wall>
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
import Wall from "@/components/WallComponent.vue";


export default defineComponent({
    name: "ZoneView",
    components: {
        Blog,
        FollowUser,
        FollowTopic,
        Wall,
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
            showFollowUserList = ref(false),
            showFollowTopicList = ref(false),
            showFansList = ref(false),
            showMsgWall = ref(false);

        function setVisible(item: Ref) {
            showPublishedList.value = false;
            showFavorList.value = false;
            showFollowUserList.value = false;
            showFollowTopicList.value = false;
            showFansList.value = false;
            showMsgWall.value = false;
            item.value = true;
        }

        let publishedList: Array<BlogVO> = reactive([]);
        let publishedListPageNum = 0;


        function sleep(d: number) {
            return new Promise((resolve) => setTimeout(resolve, d));
        }


        async function getPublishedList() {
            while (userVO.username === "") {
                await sleep(100);
            }
            setVisible(showPublishedList);
            if (publishedListPageNum === 0 && publishedList.length > 0) {
                return;
            }
            BlogApis.getPublishedList(userVO.username, publishedListPageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<BlogVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多内容");
                        return;
                    }
                    publishedList.push(...list);
                } else {
                    ElMessage.error("查找失败：" + res.data.message);
                }
            });
        }

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
                        return;
                    }
                    favorList.push(...list);
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
            setVisible(showFollowUserList);
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
                    followUserList.push(...list);
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
            setVisible(showFollowTopicList);
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

        let fansList: Array<FollowUserVO> = reactive([]);
        let fansListPageNum = 0;

        function getFansList() {
            setVisible(showFansList);
            if (fansListPageNum === 0 && fansList.length > 0) {
                return;
            }
            FollowApis.getFollowerList(userVO.username, FollowType.User, fansListPageNum).then(res => {
                if (res.data.code === 200) {
                    let list = res.data.body as Array<FollowUserVO>;
                    if (list.length === 0) {
                        ElMessage.error("暂无更多");
                        return;
                    }
                    ElMessage.success("查找粉丝列表成功");
                    fansList.push(...list);
                } else {
                    ElMessage.error("查找粉丝列表失败：" + res.data.message);
                }
            });
        }

        function loadMoreFansList() {
            fansListPageNum++;
            getFansList();
        }

        function showWall() {
            setVisible(showMsgWall);
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
            showFollowUserList,
            showFollowTopicList,
            showFansList,
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
            fansList,
            getFansList,
            loadMoreFansList,
            showWall,
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
    box-sizing: border-box;
    width: 700px;
    background-color: white;
}

#userInfo {
    box-sizing: border-box;
    width: 700px;
    height: 130px;
    margin: 0 0 20px 0;
    background-color: white;
}


#avatar {
    position: absolute;
    left: 10px;
    top: 10px;
}

#username {
    position: absolute;
    left: 130px;
    top: 0;
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
    box-sizing: border-box;
    height: 50px;
    width: 116px;
    line-height: 50px;
    display: inline-block;
    text-align: center;
    background-color: white;
}

.contentButton:focus {
    color: #42b983;
    background-color: #e6f0fd;
}

.contentButton:hover {
    background-color: #e6f0fd;
    cursor: pointer;
}


#followUserList {
    box-sizing: border-box;
    width: 350px;
    background-color: white;
}

#followUserVO {
    border: 1px solid #f0f2f7;
}

#followTopicList {
    box-sizing: border-box;
    width: 350px;
    background-color: white;
}

#followTopicVO {
    border: 1px solid #f0f2f7;
}

#fansList {
    width: 300px;
    margin: 0 auto;
}

</style>