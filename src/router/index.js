import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import DashboardOverview1 from "../views/dashboard-overview-1/Main.vue";
import Bsd from "../views/dashboard/bsd.vue";
import Profil from "../views/dashboard/profil.vue";
import Roles from "../views/dashboard/roles.vue";
import Promotions from "../views/dashboard/promotions.vue";
import Packs from "../views/dashboard/packs.vue";
import Sites from "../views/dashboard/sites.vue";
import Principes from "../views/dashboard/principes.vue";
import CHOIX from "../views/dashboard/choix.vue";
import Gouvernance from "../views/dashboard/gouvernement.vue";
import Qr_Code from "../views/dashboard/qr_code.vue";
import Api_client from "../views/dashboard/api_client.vue";
import Campagnes from "../views/dashboard/campagnes.vue";
import Tarifications from "../views/dashboard/tarifications.vue";
import CampagnesByBsd from "../views/dashboard/campagne-bsd.vue";
import Resolution from "../views/dashboard/resolution.vue";
import Indicateurs from "../views/dashboard/indicateurs.vue";
import Principe from "../views/dashboard/principe.vue";
import Critere from "../views/dashboard/critere.vue";
import Utilisateur from "../views/dashboard/utilisateur.vue";
import Login from "../views/login/Main.vue";
import ResetPassword from "../views/reset-password/Main.vue"
import NewPassword from "../views/reset-password/_mails/newPassword.vue";
import ResetPasswordFromDashboard from "../views/dashboard/resetPasswordFromDashboard.vue"
import Feedback from "../views/dashboard/feedback.vue";
import ErrorPage from "../views/error-page/Main.vue";
import ProgramationRapport from "../views/dashboard/programmation_rapport.vue";
import { Indent, QrCode } from "lucide-vue-next";
import Voter from "../views/voter/voter.vue"
import FormulaireFactuel from "../views/voter/formulaireFactuel.vue"
import ToolsFactuel from "../views/gfa/ToolsFactuel.vue";
import ToolsPerception from "../views/gfa/ToolsPerception.vue";
import FicheFactuel from "../views/gfa/FicheFactuel.vue";
import FichePerception from "../views/gfa/FichePerception.vue";
import FicheSynthese from "../views/gfa/FicheSynthese.vue";
import DashboardGfa from "../views/gfa/Dashboard.vue"





const routes = [
  {
    path: "/dashboard",
    component: SideMenu,
    name: 'dashboard',
    children: [
      {
        path: "dashboard-overview-1",
        name: "side-menu-dashboard-overview-1",
        component: DashboardOverview1,
      },
      {
        path: "Dashboard",
        name: "DashboardGfa",
        component: DashboardGfa,
      },
      {
        path: "toolsFactuel",
        name: "ToolsFactuel",
        component: ToolsFactuel,
      },
      {
        path: "ToolsPerception",
        name: "ToolsPerception",
        component: ToolsPerception,
      },
      {
        path: "/ficheFactuel",
        name: "FicheFactuel",
        component: FicheFactuel,
      },
      {
        path: "/fichePerception",
        name: "FichePerception",
        component: FichePerception,
      },
      {
        path: "/synthese",
        name: "FicheSynthese",
        component: FicheSynthese,
      },
      {
        path: "bsd",
        name: "Bsd",
        component: Bsd,
      },
      {
        path: "profil",
        name: "Profil",
        component: Profil,
      },

      {
        path: "roles",
        name: "Roles",
        component: Roles,
      },
      {
        path: "resetPassword",
        name: "ResetPasswordFromDashboard",
        component: ResetPasswordFromDashboard,
      },
      {
        path: "feedback",
        name: "Feedback",
        component: Feedback,
      },
      {
        path: "qr_code",
        name: "Qr_Code",
        component: Qr_Code,
      },
      {
        path: "resolution",
        name: "Resolution",
        component: Resolution
      },
      {
        path: "utilisateurs",
        name: "Utilisateur",
        component: Utilisateur,
      },
      {
        path: "promotions",
        name: "Promotions",
        component: Promotions,
      },
      {
        path: "programmation_rapport",
        name: "ProgrammationRapport",
        component: ProgramationRapport,
      },
      {
        path: "packs",
        name: "Packs",
        component: Packs,
      },
      {
        path: "sites",
        name: "Sites",
        component: Sites,
      },
      {
        path: "principes",
        name: "Principes",
        component: Principes,
      },
      {
        path: "choix",
        name: "CHOIX",
        component: CHOIX,
      },
      {
        path: "gouvernance",
        name: "Gouvernance",
        component: Gouvernance,
      },
      {
        path: "gouvernance/:id/principe",
        name: "Principe",
        component: Principe,
      },
      {
        path: "gouvernance/:id/principe/:id/critere",
        name: "Critere",
        component: Critere,
      },
      {
        path: "gouvernance/:id/principe/:id/critere/:id/indicateur",
        name: "Indicateurs",
        component: Indicateurs,
      },
      // {
      //   path: "groupe/:id/indicateur",
      //   name: "Indicateurs",
      //   component: Indicateurs,
      // },
      {
        path: "campagnes",
        name: "Campagnes",
        component: Campagnes,
      },
      {
        path: "tarifications",
        name: "Tarifications",
        component: Tarifications,
      },
      {
        path: "api_client",
        name: "Api Client",
        component: Api_client,
      },
      {
        path: "campagne/:id/bsd",
        name: "CampagnesByBsd",
        component: CampagnesByBsd,
      },


      // {
      //   path: "campagne/:id/vote",
      //   name: "Votes",
      //   component: Votes
      // },

    ],
  },

  {
    path: "/voter/:code",
    name: "Voter",
    component: Voter,
  },
  {
    path: "/formulaireFactuel/:code",
    name: "FormulaireFactuel",
    component: FormulaireFactuel,
  },
  {
    path: "/ok/:code/ok",
    name: "ok",
    component: Voter,
  },

  {
    path: "/",
    name: "login",
    component: Login,
  },

  {
    path: "/reset-password",
    name: "resetPassword",
    component: ResetPassword,
  },
  {
    path: "/password_update",
    name: "NewPassword",
    component: NewPassword,
  },
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});





router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('bsdInfo') && to.path !== '/') {
    next('/')
  } else {
    next()
  }

  // next()
})


export default router;
