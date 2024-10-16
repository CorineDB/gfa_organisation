import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import Profil from "../views/dashboard/profil.vue";
import Roles from "../views/dashboard/roles.vue";

import Principes from "../views/dashboard/principes.vue";

import Gouvernance from "../views/dashboard/gouvernement.vue";

import IndicateursDeGouvernance from "../views/dashboard/indicateurs.vue";

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
import pta from "../views/dashboard/organisation/pta.vue";

import Ong from "../views/dashboard/organisation/ong.vue";

import FichePerception from "../views/dashboard/FichePerception.vue";
import FicheSynthese from "../views/dashboard/FicheSynthese.vue";
import DashboardGfa from "../views/dashboard/Dashboard.vue";
import indicateurs from "../views/dashboard/indicateurs/index.vue";

import typeGouvernance from "../views/dashboard/type_gouvernance/index.vue";
import Programmation_enquete from "../views/dashboard/programmation_enquete/index.vue";
import EnqueteAppreciations from "../views/dashboard/programmation_enquete/appreciations.vue";
import OptionReponse from "@/views/dashboard/OptionReponse.vue";

//Projet/Outcomes/Activité/Taches
import dashboard_projets_composantes_globale from "../views/dashboard/projets/composantes-globale/index.vue";
import projets from "../views/dashboard/projets/index.vue";
import dashboard_projets_activites_globale from "../views/dashboard/projets/activites-globale/index.vue";
import dashboard_projets_taches_globale from "../views/dashboard/projets/taches-globale/index.vue";
import dashboard_projets_sous_composantes_globale from "../views/dashboard/projets/sous-composantes-globale/index.vue";
import projets_id_details from "../views/dashboard/projets/_id/details.vue";
import EnqueteIndividuel from "../views/dashboard/enqueteIndividuel.vue";

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
        path: "/organisation",
        name: "Ongs",
        component: Ong,
      },

      {
        path: "indicateursDeGouvernance",
        component: IndicateursDeGouvernance,
        name: "indicateursDeGouvernance",
      },
      {
        path: "/projets/:id/details",
        component: projets_id_details,

        name: "projets_id_details",
      },
      {
        path: "projets/composantes-globale",
        component: dashboard_projets_composantes_globale,
        name: "dashboard_projets_composantes_globale",
      },
      {
        path: "/dashboard/projets/sous-composantes-globale",
        component: dashboard_projets_sous_composantes_globale,
        name: "dashboard_projets_sous_composantes_globale",
      },
      {
        path: "projets/activites-globale",
        component: dashboard_projets_activites_globale,

        name: "dashboard_projets_activites_globale",
      },
      {
        path: "projets/taches-globale",
        component: dashboard_projets_taches_globale,
        name: "dashboard_projets_taches_globale",
      },
      {
        path: "enquetes",
        name: "Programmation_enquete",
        component: Programmation_enquete,
      },
      {
        path: "apprreciations",
        name: "EnqueteAppreciations",
        component: EnqueteAppreciations,
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
        path: "pta/:ongId",
        name: "pta",
        component: pta,
      },
      {
        path: "type-gouvernance",
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
        path: "principe-gouvernance",
        name: "PrincipeGouvernance",
        component: Principes,
      },
      {
        path: "projets",
        name: "projets",
        component: projets,
      },
      {
        path: "critere-gouvernance",
        name: "critereGouvernance",
        component: Critere,
      },
      {
        path: "option-reponse",
        name: "optionReponse",
        component: OptionReponse,
      },
      {
        path: "gouvernance/:id/principe",
        name: "Principe",
        component: Principe,
      },
      {
        path: "gouvernance/:id/principe/:idc/critere",
        name: "Critere",
        component: Critere,
      },
      {
        path: "enquete-individuel",
        name: "EnqueteIndividuel",
        component: EnqueteIndividuel,
      },
      {
        path: "gouvernance/:id/principe/:idp/critere/:idc/indicateur",
        name: "Indicateurs",
        component: indicateurs,
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
  if (!localStorage.getItem("authenticateUser") && to.path !== "/") {
    next("/");
  } else {
    next();
  }

  // next()
});

export default router;
