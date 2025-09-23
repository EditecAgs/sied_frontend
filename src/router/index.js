import { createWebHistory, createRouter } from "vue-router";


import NotFound from "../views/404View.vue";
import LandingPage from '../views/LandingPage/LandingPage.vue';
import Signin from '../views/Auth/Signin.vue';
import Signup from '../views/Auth/Signup.vue';
import EcommerceView from '../views/EcommerceView.vue';
import Profile from '../views/Others/UserProfile.vue';
import UsersView from '../views/Tables/UsersView.vue';
import LineChart from '../views/Chart/LineChart/LineChart.vue';
import BarChart from '../views/Chart/BarChart/BarChart.vue';
import Alerts from '../views/UiElements/Alerts.vue';
import Avatars from '../views/UiElements/Avatars.vue';
import Badges from '../views/UiElements/Badges.vue';
import Buttons from '../views/UiElements/Buttons.vue';
import Images from '../views/UiElements/Images.vue';
import Videos from '../views/UiElements/Videos.vue';
import BlankPage from '../views/Pages/BlankPage.vue';
import FormDual from '../views/Forms/FormularioDualView.vue';
import InstitutionsView from '../views/Tables/InstitutionsView.vue';
import SubsystemsView from '../views/Tables/SubsystemsView.vue';
import AcademicView from '../views/Tables/AcademicView.vue';
import OrganizationsView from '../views/Tables/OrganizationsView.vue';
import DualAreasView from '../views/Tables/DualAreasView.vue';
import CareersView from '../views/Tables/CareersView.vue';
import ClustersView from '../views/Tables/ClustersView.vue';
import DocumentView from '../views/Tables/DocumentView.vue';
import EconomicView from '../views/Tables/EconomicView.vue';
import SectorsView from '../views/Tables/SectorsView.vue';
import SpecialtiesView from '../views/Tables/SpecialtiesView.vue';
import TypesView from '../views/Tables/TypesView.vue';
import MicroCredentialView from '../views/Tables/MicroCredentialView.vue';
import StudentView from '../views/Tables/StudentView.vue';
import DualTypesView from '../views/Tables/DualTypesView.vue';

import UnAuthRoutes from "../const/UnauthRoutes.js";
import AuthRoutes from '../const/AuthRoutes';

const routes = [
    { path: '/', name: 'LandingPage', component: LandingPage },
    { path: '/signin', name: 'signin', component: Signin },
    { path: '/signup', name: 'signup', component: Signup },
    { path: "/404", name: "404", component: NotFound },
    { path: '/dashboard', name: 'dashboard', component: EcommerceView, meta: { title: 'eCommerce Dashboard' } },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/form-elements', name: 'FormElements', component: FormDual },
    { path: '/basic-tables', name: 'BasicTables', component: UsersView },
    { path: '/institution-table', name: 'InstitutionTable', component: InstitutionsView },
    { path: '/subsystem-table', name: 'SubsystemTable', component: SubsystemsView },
    { path: '/periods_Academic-table', name: 'AcademicTable', component: AcademicView },
    { path: '/Organization-table', name: 'OrganizationTable', component: OrganizationsView },
    { path: '/dual_Area-table', name: 'Dual_AreaTable', component: DualAreasView },
    { path: '/careers-table', name: 'CareersTable', component: CareersView },
    { path: '/clusters-table', name: 'ClustersTable', component: ClustersView },
    { path: '/document-table', name: 'DocumentTable', component: DocumentView },
    { path: '/economic-table', name: 'EconomicTable', component: EconomicView },
    { path: '/sectors-table', name: 'SectorsTable', component: SectorsView },
    { path: '/specialties-table', name: 'SpecialtiesTable', component: SpecialtiesView },
	{ path: '/micro-credentials-table', name: 'MicroCredentialsTable', component: MicroCredentialView },
	{ path: '/student-table', name: 'StudentsTable', component: StudentView },
    { path: '/type-table', name: 'TypeTable', component: TypesView },
	{ path: '/dual_type-table', name: 'Dual_TypeTable', component: DualTypesView },
    { path: '/line-chart', name: 'LineChart', component: LineChart },
    { path: '/bar-chart', name: 'BarChart', component: BarChart },
    { path: '/alerts', name: 'Alerts', component: Alerts },
    { path: '/avatars', name: 'Avatars', component: Avatars },
    { path: '/badge', name: 'Badge', component: Badges },
    { path: '/buttons', name: 'Buttons', component: Buttons },
    { path: '/images', name: 'Images', component: Images },
    { path: '/videos', name: 'Videos', component: Videos },
    { path: '/blank', name: 'Blank', component: BlankPage },
];

export default function () {
    const router = createRouter({
        history: createWebHistory(),
        routes,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        scrollBehavior(_to, _from, _savedPosition) {
            return { top: 0 };
        },
    });

    router.beforeEach((to, from, next) => {
        const token = localStorage.getItem("token");

        if (UnAuthRoutes.includes(to.name)) {
            localStorage.removeItem('token');
            return next();
        }

        if (AuthRoutes.includes(to.name)) {
            if (token) {
                return next();
            } else {
                localStorage.removeItem('token');
                return next({ name: 'signin' });
            }
        }

        localStorage.removeItem('token');
        return next({ name: 'signin' });
    });

    return router;
}
