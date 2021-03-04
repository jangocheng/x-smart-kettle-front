<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider"
           :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="activeName" :collapsed="collapsed" @on-select="turnToPage"
                 :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con" style="width: 20px;">
          <img v-show="collapsed" :src="maxLogo"  style="margin: auto auto auto 7px;" key="max-logo"/>
          <img v-show="!collapsed" :src="minLogo"  style="    width: 76px;
    height: 39px;
    margin: 4px auto auto auto;"   key="min-logo"/>
        </div>
        <div style="    width: 115px;
    color: rgba(52, 223, 215, 0.5);
    font-size: 18px;
    font-weight: bold;
    position: absolute;
    margin: -58px auto auto 95px;
}">
          <span>Smart Kettle调度监控平台</span>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-name="userName" :user-avatar="userAvatar"/>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import {getNewTagList, routeEqual} from '@/libs/platformUtil'
import minLogo from '../../../public/logo-min.png'
import maxLogo from '../../../public/logo.png'
import './main.less'

export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      activeName: ''
    }
  },
  computed: {
    tagNavList() {
        return this.$store.state.app.tagNavList
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    userName() {
      return this.$store.state.user.userName
    },
    cacheList() {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    local () {
      return this.$store.state.app.local
    },
    menuList() {

      return this.$store.getters.menuList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage(route) {
      let {name, params, query,tag} = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query,
          tag=route.meta.tag
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query,
        tag
      })
    },
    handleCollapsedChange(state) {
      this.collapsed = state
    },
    handleCloseTag(res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick(item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route'(newRoute) {
      const self = this
      const {name, query, params, meta,tag} = newRoute
      this.addTag({
        route: {name, query, params, meta,tag},
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      //对于明细页面的激活菜单特殊处理
      let activeName = name
      const crumbs = meta.crumbs
      if (crumbs) {
        crumbs.forEach(item => {
          if (item.type === 2) {
            self.activeName = item.name
          }
        })
      }
      this.$refs.sideMenu.updateOpenName(activeName)
    }
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    const self = this
    this.setTagNavList()
    this.setHomeRoute()
    const {name, params, query, meta} = this.$route
    this.addTag({
      route: {name, params, query, meta}
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    const crumbs = meta.crumbs
    if (crumbs) {
      crumbs.forEach(item => {
        if (item.type === 2) {
          this.$nextTick(() => {
            self.activeName = item.name
          })
        }
      })
    }
  }
}
</script>
