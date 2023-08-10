import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import AccountView from '../views/AccountView.vue'
import CalendarView from '../views/CalendarView.vue'
import ListView from '../views/ListView.vue'
import SigninView from '../views/Signin.vue'
import RecipeInfosView from '../views/RecipeInfosView.vue'
import RepasOfTheDay from '../views/RepasOfDayInfosView.vue'
import RepasInfos from '../views/RepasInfosView.vue'
import CreateGroup from '../views/CreateGroup.vue'
import CreateRepas from '../views/CreateRepas.vue'
import CreateCustomRecette from '../views/CreateCustomRecette.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: (route) => ({ id: route.query.id, group_id : route.query.group_id })
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      props: route => ({ id: route.query.id, group_id : route.query.group_id })
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      props: (route) => ({ id: route.query.id, group_id : route.query.group_id })
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      props: (route) => ({ id: route.query.id, group_id : route.query.group_id })
    },
    {
      path: '/list',
      name: 'list',
      component: ListView,
      props: (route) => ({ id: route.query.id, group_id : route.query.group_id })
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninView,
      props: (route) => ({ id: route.query.id, group_id : route.query.group_id })
    },
    {
      path: '/recipe_infos',
      name: 'recipe_infos',
      component: RecipeInfosView,
      props: route => ({ id: route.query.id, group_id : route.query.group_id, id_recipe : route.query.id_recipe })
    },
    {
      path: '/repas_of_the_day_info',
      name: 'repas_of_the_day_info',
      component: RepasOfTheDay,
      props: route => ({ id: route.query.id, group_id : route.query.group_id, day : route.query.day })
    },
    {
      path: '/repas_infos',
      name: 'repas_infos',
      component: RepasInfos,
      props: route => ({ id: route.query.id, group_id : route.query.group_id, id_repas : route.query.id_repas })
    },
    {
      path: '/create_group',
      name: 'create_group',
      component: CreateGroup,
      props: route => ({ id: route.query.id, group_id : route.query.group_id, id_repas : route.query.id_repas })
    },
    {
      path: '/create_repas',
      name: 'create_repas',
      component: CreateRepas,
      props: route => ({ id: route.query.id, group_id : route.query.group_id, id_recette : route.query.id_recette })
    },
    {
      path: '/create_recipe',
      name: 'create_recipe',
      component: CreateCustomRecette,
      props: route => ({ id: route.query.id, group_id : route.query.group_id })
    },
  ]
})

export default router
