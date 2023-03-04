<template>
    
    <el-container>
        <el-header id="header">
            <router-link to="/">Home</router-link>
            |
            <router-link to="/blog">blog</router-link>
            |
            <router-link to="/login">login</router-link>
        </el-header>
        <el-main>
            <router-view />
        </el-main>
        <el-footer id="footer">Footer</el-footer>
    </el-container>

</template>

<style lang="scss">
#app {
    text-align: center;

}

#header {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

#footer{
    position: fixed;
    bottom: 0;
    display: block;
}
</style>
