import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [
      {
        icon: "GridIcon",
        pageName: "DashboardGfa",
        title: "Dashboard GFA",
      },
      {
        icon: "FolderIcon",
        pageName: "projets",
        title: "Projets",
        subMenu: [
          {
            icon: "FolderIcon",
            pageName: "projets",
            title: "Projets",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_composantes_globale",
            title: "OutComes",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_sous_composantes_globale",
            title: "OutPut",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_activites_globale",
            title: "Activités",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_taches_globale",
            title: "Taches",
          },
        ],
      },
      {
        icon: "FolderIcon",
        title: "Cadre Mesure Rendement",
        subMenu: [
          {
            icon: "BarChart2Icon",
            pageName: "create_indicateur",
            title: "Indicateurs",
          },/* 
          {
            icon: "BarChart2Icon",
            pageName: "UniteDeMesure",
            title: "Unité de Mesure",
          },
          {
            icon: "BarChart2Icon",
            pageName: "KeyValue",
            title: "Clé Valeur Indicateur",
          },
          {
            icon: "BarChart2Icon",
            pageName: "CategoriesIndicateurs",
            title: "Catégories d'indicateurs",
          },
          {
            icon: "BarChart2Icon",
            pageName: "Sites",
            title: "Sites",
          },
          {
            icon: "BarChart2Icon",
            pageName: "TypeResultat",
            title: "Résultats Cadre de rendement",
          }, */
        ],
      },
      {
        icon: "BarChart2Icon",
        pageName: "Programmation_enquete",
        title: "Évaluations & Résulats",
      },

      {
        icon: "BarChart2Icon",
        pageName: "EnqueteIndividuel",
        title: "Enquête individuelle",
      },
      {
        icon: "UsersIcon",
        pageName: "personnel",
        title: "Personnel",
        subMenu: [
          {
            icon: "UsersIcon",
            pageName: "Utilisateur",
            title: "Membres",
          },
          {
            icon: "KeyIcon",
            pageName: "Roles",
            title: "Roles",
          },
        ],
      },
      {
        icon: "SettingsIcon",
        pageName: "setting",
        title: "Paramètres",
        subMenu: [
          {
            icon: "BarChart2Icon",
            pageName: "sources_verification",
            title: "Sources de vérification",
          },
          {
            icon: "BarChart2Icon",
            pageName: "UniteDeMesure",
            title: "Unité de Mesure",
          },
          {
            icon: "BarChart2Icon",
            pageName: "KeyValue",
            title: "Clé Valeur Indicateur",
          },
          {
            icon: "BarChart2Icon",
            pageName: "CategoriesIndicateurs",
            title: "Catégories d'indicateurs",
          },
          {
            icon: "BarChart2Icon",
            pageName: "Sites",
            title: "Sites",
          },
          {
            icon: "BarChart2Icon",
            pageName: "TypeResultat",
            title: "Résultats Cadre de rendement",
          },
        ],
      },
    ],
  }),
});
