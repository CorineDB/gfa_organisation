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
        icon: "FolderIcon",
        pageName: "projets",
        title: "Outils de collecte",
        subMenu: [
          {
            icon: "FolderKanbanIcon",
            pageName: "typeGouvernance",
            title: "Type de Gouvernance",
          },
          {
            icon: "GlobeIcon",
            pageName: "PrincipeGouvernance",
            title: "Principes de Gouvernance",
          },
          {
            icon: "GlobeIcon",
            pageName: "critereGouvernance",
            title: "Criteres de Gouvernance",
          },
          {
            icon: "SettingsIcon",
            pageName: "ToolsFactuel",
            title: "Formulaire Factuel",
          },

          {
            icon: "SettingsIcon",
            pageName: "ToolsPerception",
            title: "Formulaire de Perception",
          },
        ],
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
