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
import audit from "../views/dashboard/audit/index.vue";

import FichePerception from "../views/dashboard/FichePerception.vue";
import FicheSynthese from "../views/dashboard/FicheSynthese.vue";
import DashboardGfa from "../views/dashboard/Dashboard.vue";
import indicateurs from "../views/dashboard/indicateurs/index.vue";
import SuiviIndicateurs from "../views/dashboard/indicateurs/suivi.vue";
import rapport from "../views/dashboard/rapport/index.vue";

import typeGouvernance from "../views/dashboard/type_gouvernance/index.vue";
import Programmation_enquete from "../views/dashboard/programmation_enquete/index.vue";
import EnqueteAppreciations from "../views/dashboard/programmation_enquete/appreciations.vue";
import SoumissionsEnqueteDeCollete from "../views/dashboard/programmation_enquete/soumissions.vue";
import OptionReponse from "@/views/dashboard/OptionReponse.vue";
import UniteDeMesure from "@/views/dashboard/uniteDeMesure.vue";
import KeyValue from "@/views/dashboard/keyValue.vue";
import CategorieIndicateurs from "@/views/dashboard/categoriesIndicateurs.vue";
import Sites from "@/views/dashboard/sites.vue";
import TypeResultat from "@/views/dashboard/typeResultat.vue";
import finances_suivi from "../views/dashboard/finances/suivi.vue";
import indicateurs_suivi_details from "../views/dashboard/indicateurs/_id/suivi.vue";

//Projet/Outcomes/Activité/Taches
import dashboard_projets_composantes_globale from "../views/dashboard/projets/composantes-globale/index.vue";
import projets from "../views/dashboard/projets/index.vue";
import dashboard_projets_activites_globale from "../views/dashboard/projets/activites-globale/index.vue";
import dashboard_projets_taches_globale from "../views/dashboard/projets/taches-globale/index.vue";
import dashboard_projets_sous_composantes_globale from "../views/dashboard/projets/sous-composantes-globale/index.vue";
import projets_id_details from "../views/dashboard/projets/_id/details.vue";
import EnqueteIndividuel from "../views/dashboard/enqueteIndividuel.vue";
import FicheResultat from "../views/dashboard/FicheResultat.vue";
import Marqueur from "../views/dashboard/marqueur.vue";
import CreateFormFactuel from "../views/dashboard/CreateFormFactuel.vue";
import CreateFormPerception from "../views/dashboard/CreateFormPerception.vue";
import EvaluationFactuel from "@/views/dashboard/EvaluationFactuel.vue";
import EvaluationPerception from "@/views/dashboard/EvaluationPerception.vue";
import SourceVerification from "../views/dashboard/SourceVerification.vue";
import SendMailPerception from "../views/dashboard/SendMailPerception.vue";
import Organisations from "../views/dashboard/organisations.vue";
import FicheMarqueur from "../views/dashboard/FicheMarqueur.vue";

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
        component: Organisations,
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
        path: "enquetes/:id/soumissions",
        name: "SoumissionsEnqueteDeCollecte",
        component: SoumissionsEnqueteDeCollete,
      },
      {
        path: "tools-factuel/:id",
        name: "ToolsFactuel",
        component: EvaluationFactuel,
      },
      {
        path: "audit",
        name: "audit",
        component: audit,
      },
      {
        path: "indicateurs/:id/suivi",
        component: indicateurs_suivi_details,

        name: "indicateurs_suivi_details",
      },
      {
        path: "rapport",
        name: "rapport",
        component: rapport,
      },
      {
        path: "/dashboard/finances/suivi",
        component: finances_suivi,

        name: "finances_suivi",
      },

      {
        path: "tools-perception/:id",
        name: "ToolsPerception",
        component: EvaluationPerception,
      },
      {
        path: "create-factuel",
        name: "create_form_factuel",
        component: CreateFormFactuel,
      },
      {
        path: "create-perception",
        name: "create_form_perception",
        component: CreateFormPerception,
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
        path: "/synthese/:e",
        name: "FicheSynthese",
        component: FicheSynthese,
      },
      {
        path: "/marqueur/:e",
        name: "FicheMarqueur",
        component: FicheMarqueur,
      },
      {
        path: "/marqueur",
        name: "marqueur",
        component: Marqueur,
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
        path: "unite_de_mesure",
        name: "UniteDeMesure",
        component: UniteDeMesure,
      },
      {
        path: "cle_valeurs",
        name: "KeyValue",
        component: KeyValue,
      },
      {
        path: "categories_indicateurs",
        name: "CategoriesIndicateurs",
        component: CategorieIndicateurs,
      },
      {
        path: "typeResultat",
        name: "TypeResultat",
        component: TypeResultat,
      },
      {
        path: "sites_indicateurs",
        name: "Sites",
        component: Sites,
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
      // {
      //   path: "gouvernance/:id/principe/:idp/critere/:idc/indicateur",
      //   name: "Indicateurs",
      //   component: indicateurs,
      // },
      {
        path: "resultat-collecte",
        name: "resultat_collecte",
        component: FicheResultat,
      },
      {
        path: "indicateurs",
        name: "Indicateurs",
        component: indicateurs,
      },
      {
        path: "suiviIndicateurs",
        name: "SuiviIndicateurs",
        component: SuiviIndicateurs,
      },
      {
        path: "sources-verification",
        name: "sources_verification",
        component: SourceVerification,
      },
      {
        path: "add-participant",
        name: "add_participant",
        component: SendMailPerception,
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
  // Permettre l'accès à la route "toolsPerception" quel que soit l'état d'authentification
  if (to.name === "ToolsPerception") {
    next();
  }
  // Rediriger vers "/" si non authentifié et que la route n'est pas la page d'accueil
  else if (!localStorage.getItem("authenticateUser") && to.path !== "/") {
    next("/");
  } else {
    next();
  }
});

export default router;
