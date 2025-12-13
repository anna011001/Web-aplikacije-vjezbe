import PizzaList from '@/components/PizzaList.vue'
import PojedinaPizza from '@/components/PojedinaPizza.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      component: PizzaList
    },
    {
      path: "/pizze/:naziv",
      component: PojedinaPizza
    }
  ],
})

export default router
