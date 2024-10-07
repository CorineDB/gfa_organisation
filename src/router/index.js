import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import Profil from "../views/dashboard/profil.vue";
import Roles from "../views/dashboard/roles.vue";

import Principes from "../views/dashboard/principes.vue";

import Gouvernance from "../views/dashboard/gouvernement.vue";

import Indicateurs from "../views/dashboard/indicateurs.vue";

import Principe from "../views/dashboard/principe.vue";
import Critere from "../views/dashboard/critere.vue";
import Utilisateur from "../views/dashboard/utilisateur.vue";
import Login from "../views/login/Main.vue";
import ResetPassword from "../views/reset-password/Main.vue";
import NewPassword from "../views/reset-password/_mails/newPassword.vue";
import ResetPasswordFromDashboard from "../views/dashboard/resetPasswordFromDashboard.vue";
import Feedback from "../views/dashboard/feedback.vue";
import ErrorPage from "../views/error-page/Main.vue";
import ProgramationRapport from "../views/dashboard/programmation_rapport.vue";
import { Indent, QrCode } from "lucide-vue-next";

import FormulaireFactuel from "../views/voter/formulaireFactuel.vue";
import ToolsFactuel from "../views/dashboard/ToolsFactuel.vue";
import ToolsPerception from "../views/dashboard/ToolsPerception.vue";
import FicheFactuel from "../views/dashboard/FicheFactuel.vue";

import Ong from "../views/dashboard/ong.vue";
import FichePerception from "../views/dashboard/FichePerception.vue";
import FicheSynthese from "../views/dashboard/FicheSynthese.vue";
import DashboardGfa from "../views/dashboard/Dashboard.vue";
import indicateurs from "../views/dashboard/indicateurs/index.vue";
import projets from "../views/dashboard/projets/index.vue";
import programme from "../views/dashboard/programme/index.vue"
import typeGouvernance from "../views/dashboard/type_gouvernance/index.vue"



const routes = [
  {
    path: "/dashboard",
    component: SideMenu,
    name: "dashboard",
    children: [
      {
        path: "gfa",
        name: "DashboardGfa",
        component: DashboardGfa,
      },
        {
        path: "ong",
        name: "Ongs",
        component: Ong,
      },
      {
        path: "/dashboard/indicateurs",
        component: indicateurs,
        name: "indicateurs",
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
        path: "typeGouvernance",
        name: "typeGouvernance",
        component: typeGouvernance,
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
        path: "utilisateurs",
        name: "Utilisateur",
        component: Utilisateur,
      },
     
      {
        path: "programmation_rapport",
        name: "ProgrammationRapport",
        component: ProgramationRapport,
      },
    
      
      {
        path: "principes",
        name: "Principes",
        component: Principes,
      },
      {
        path: "projets",
        name: "projets",
        component: projets,
      },
      {
        path: "programme",
        name: "programme",
        component: programme,
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
     
    ],
  },

 
  {
    path: "/formulaireFactuel/:code",
    name: "FormulaireFactuel",
    component: FormulaireFactuel,
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
    if (!localStorage.getItem('authenticateUser') && to.path !== "/") {
        next("/");
    } else {

        next();
    }

    // next()
});

export default router;