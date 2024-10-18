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
        pageName: "projets",
        title: "Cadre de rendement",
        subMenu: [
          {
            icon: "FolderKanbanIcon",
            pageName: "cadreDeRendement",
            title: "Cadre de rendement",
          },
          {
            icon: "GlobeIcon",
            pageName: "resultats",
            title: "Résultats Escomptés",
          },
          {
            icon: "GlobeIcon",
            pageName: "Indicateur",
            title: "Indicateurs",
          },
          {
            icon: "FolderKanbanIcon",
            pageName: "categorie",
            title: "Categorie",
          },
        ],
      },

      {
        icon: "CpuIcon",
        pageName: "Ongs",
        title: "Organisations",
      },
      // {
      //   icon: "CpuIcon",
      //   pageName: "pta",
      //   title: "PTAB",
      // },
      {
        icon: "BarChart2Icon",
        pageName: "indicateursDeGouvernance",
        title: "Indicateurs de gouvernance",
      },
      {
        icon: "BarChart2Icon",
        pageName: "Programmation_enquete",
        title: " Enquête & résulats",
      },
      // {
      //   icon: "FileIcon",
      //   pageName: "FicheSynthese",
      //   title: "Fiche de Synthèse",
      // },
      {
        icon: "BarChart2Icon",
        pageName: "EnqueteIndividuel",
        title: "Enquête individuelle",
      },

      {
        icon: "UsersIcon",
        pageName: "Utilisateur",
        title: "Utilisateurs",
      },
      {
        icon: "SettingsIcon",
        pageName: "setting",
        title: "Paramètres",
        subMenu: [
          {
            icon: "BarChart2Icon",
            pageName: "optionReponse",
            title: "Option de réponse",
          },
        ],
      },
    ],
  }),
});
