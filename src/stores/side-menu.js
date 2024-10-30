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
            pageName: "Indicateurs",
            title: "Indicateurs",
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
      {
        icon: "ServerIcon",
        pageName: "audit",
        title: "Audit",
      },
      {
        icon: "ArchiveIcon",
        pageName: "rapport",
        title: "Rapport",
      },
      {
        icon: "ZapIcon",
        pageName: "finances_suivi",
        title: "Suivi Financier",
      },

      {
        icon: "CpuIcon",
        pageName: "Ongs",
        title: "Organisations",
      },

      // {
      //   icon: "BarChart2Icon",
      //   pageName: "indicateursDeGouvernance",
      //   title: "Indicateurs de gouvernance",
      // },
      {
        icon: "FolderIcon",
        pageName: "projets",
        title: "Outils de collecte",
        subMenu: [
          // {
          //   icon: "FolderKanbanIcon",
          //   pageName: "typeGouvernance",
          //   title: "Type de Gouvernance",
          // },
          // {
          //   icon: "GlobeIcon",
          //   pageName: "PrincipeGouvernance",
          //   title: "Principes de Gouvernance",
          // },
          // {
          //   icon: "GlobeIcon",
          //   pageName: "critereGouvernance",
          //   title: "Criteres de Gouvernance",
          // },
          {
            icon: "SettingsIcon",
            pageName: "create_form_factuel",
            title: "Création Formulaire Factuel",
          },
          {
            icon: "SettingsIcon",
            pageName: "create_form_perception",
            title: "Création Formulaire de Perception",
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
        title: "Évaluations & Résulats",
      },

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
