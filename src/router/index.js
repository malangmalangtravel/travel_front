import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "@/views/MainPage.vue";
// 여행 게시판
import TravelListComponents from "@/views/travelBoard/travelComponents/TravelListComponents.vue";
import TravelList from "@/views/travelBoard/TravelList.vue";
import TravelInfoList from "@/views/travelBoard/TravelInfoList.vue";
import TravelDetail from "@/views/travelBoard/TravelDetail.vue";
import TravelWrite from "@/views/travelBoard/TravelWrite.vue";
// 유머 게시판
import HumorListComponents from "@/views/humorBoard/humorComponents/HumorListComponents.vue";
import HumorList from "@/views/humorBoard/HumorList.vue";
import HumorDetail from "@/views/humorBoard/HumorDetail.vue";
import HumorWrite from "@/views/humorBoard/HumorWrite.vue";
// 기타 설정
import NickNameSetup from "@/views/etc/NickNameSetup.vue";

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },

  // 여행
  {
    path: '/travelBoard/travelComponents/TravelListComponents',
    name: 'TravelListComponents',
    component: TravelListComponents,
  },
  {
    path: '/travelBoard/TravelList',
    name: 'TravelList',
    component: TravelList,
  },
  {
    path: '/travelBoard/:countryCode/TravelInfoList',
    name: 'TravelInfoList',
    component: TravelInfoList,
    props: true,  // props로 countryCode 전달
  },
  {
    path: '/travelBoard/travelDetail/:id',
    name: 'travelDetail',
    component: TravelDetail,
    props: route => ({ id: route.params.id, boardCode: route.query.boardCode }) // query로 전달된 boardCode를 props로 전달
  },
  {
    path: '/travelBoard/TravelDetail',
    name: 'TravelDetail',
    component: TravelDetail,
  },
  {
    path: '/travelBoard/TravelWrite',
    name: 'TravelWrite',
    component: TravelWrite,
  },

  // 유머톡
  {
    path: '/travelBoard/humorComponents/HumorListComponents',
    name: 'HumorListComponents',
    component: HumorListComponents,
  },
  {
    path: '/humorBoard/HumorList',
    name: 'HumorList',
    component: HumorList,
  },
  {
    path: '/humorBoard/humorDetail/:id',
    name: 'humorDetail',
    component: HumorDetail,
    props: route => ({ id: route.params.id, boardCode: route.query.boardCode }) // query로 전달된 boardCode를 props로 전달
  },
  {
    path: '/humorBoard/HumorDetail',
    name: 'HumorDetail',
    component: HumorDetail,
  },
  {
    path: '/humorBoard/HumorWrite',
    name: 'HumorWrite',
    component: HumorWrite,
  },

  // 기타 설정
  {
    path: '/etc/NickNameSetup',
    name: 'NickNameSetup',
    component: NickNameSetup,
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        // 페이지 이동 시 스크롤을 맨 위로 이동
        if (savedPosition) {
            // 이전 페이지에서 저장된 위치가 있으면 해당 위치로 복원
            return savedPosition;
        } else {
            // 페이지 이동 시 항상 맨 위로 스크롤
            return { top: 0 };
        }
    }
});

router.beforeEach((to, from, next) => {
  if (to.path === '/ads.txt' || to.path === '/sitemap.xml' || to.path === '/robots.txt') {
    // '/ads.txt', '/sitemap.xml', '/robots.txt' 경로일 경우 처리하지 않음
    return next(false);
  }
  // 다른 모든 경우에는 다음 단계로 진행
  next();
});

export default router