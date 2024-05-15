<template>
  <div>
    <router-link to="/index/home">查看</router-link> |
    <router-link to="/index/fund09">今日收益</router-link> |
    <router-link to="/index/fund10">累计净值</router-link> |
    <router-link to="/index/fund05">业绩表现</router-link> |
    <!-- <router-link to="/index/selfHome">自选查看</router-link> |
    <router-link to="/index/fund08">均线</router-link> | -->
    <router-link to="/index/fund06">综合观察</router-link> |
    <router-link to="/index/fund02">评测</router-link> |
    <router-link to="/index/fund03">历史收益</router-link> |
    <router-link to="/index/fund04">历史净值</router-link> |
    <router-link to="/index/fund07">地址导航</router-link> |
    <router-link to="/index/edit">编辑</router-link>
    <!-- <router-link to="/index/edit">编辑</router-link> | -->
    <!-- <router-link to="/index/selfEdit">自选编辑</router-link> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Index',
};
</script>

<style>
a {
  text-decoration: none;
}

a.router-link-active.router-link-exact-active {
  color: #f00;
}
</style>
