import { createWebHistory, createRouter } from "vue-router";
import NotFound from "/src/views/404View.vue";
import UnAuthRoutes from "../const/UnauthRoutes.js";
import LoginView from "../views/LoginView.vue";
import DashboardView from '../views/DashboardView.vue';
import UserCatalogView from '../views/UserCatalogView.vue';

const routes = [
    {
        path: "",
        name: "login",
        component: LoginView
    },
    {
        path: "/404",
        name: "404",
        component: NotFound
    },
	{
		path: "/dashboard",
		name: "dashboard",
		component: DashboardView
	},
	{
		path: "/usercatalog",
		name: "usercatalog",
		component: UserCatalogView
	},
];
export default function () {
    const router = createRouter({
        history: createWebHistory(),
        routes,
        scrollBehavior (to, from, savedPosition) {
            return { top: 0 }
        }
    });

    router.beforeEach((to, from, next) => {
        if(UnAuthRoutes.includes(to.name)) {
            return next();
        } else {
            return next({ name: '404' });
        }
    });
    return router;
}

//export default router;