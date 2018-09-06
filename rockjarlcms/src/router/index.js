import Vue from 'vue'
import Router from 'vue-router'
import OverView from '@/views/over-view'
import NewsUp from '@/views/news-up'
import Headers from '@/components/headers'
import Aside from '@/components/aside'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'NewsUp',
      component: NewsUp
    },
    {
      path: '/headers',
      name: 'Headers',
      component: Headers
    },
    {
      path: '/aside',
      name: 'Aside',
      component: Aside
    },
    {
      path: '/overView',
      name: 'OverView',
      component: OverView
    }
  ]
})
