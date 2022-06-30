<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-button>
          <el-link href="/index" style="display: block">index</el-link>
        </el-button>
        <el-button>
          <el-link href="/about">about</el-link>
        </el-button>
        <el-button>
          <el-link href="/login">login</el-link>
        </el-button>
        <el-button>
          <el-link href="/test">test</el-link>
        </el-button>
      </el-header>
      <el-container>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>
