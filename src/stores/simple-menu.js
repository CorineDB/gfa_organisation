import { defineStore } from "pinia";

export const useSimpleMenuStore = defineStore("simpleMenu", {
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
        pageName: "indicateurs",
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
            pageName: "Gouvernance",
            title: "Gouvernance",
          },
          {
            icon: "GlobeIcon",
            pageName: "Principes",
            title: "Principes",
          },
          {
            icon: "FolderKanbanIcon",
            pageName: "Programmation_enquete",
            title: "Programmation d'enquête",
          },
        ],
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
      {
        icon: "FileIcon",
        pageName: "FicheSynthese",
        title: "Fiche de Synthèse",
      },

      {
        icon: "UsersIcon",
        pageName: "Utilisateur",
        title: "Utilisateurs",
      },
    ],
  }),
});
