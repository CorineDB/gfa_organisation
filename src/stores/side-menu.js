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
      },
      {
        icon: "ListIcon",
        pageName: "programme",
        title: "Programme",
      },

      {
        icon: "CpuIcon",
        pageName: "Ongs",
        title: "Ongs",
      },

      {
        icon: "BarChart2Icon",
        pageName: "indicateurs",
        title: "Indicateurs",
      },

      {
        icon: "GlobeIcon",
        pageName: "Principes",
        title: "Principes",
      },
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
      // {
      //   icon: "GlobeIcon",
      //   pageName: "choix",
      //   title: "Choix",
      // },
      {
        icon: "SettingsIcon",
        pageName: "ToolsFactuel",
        title: "Outil Factuel",
      },
      // {
      //   icon: "SettingsIcon",
      //   pageName: "Structure",
      //   title: "Structure",
      // },
      {
        icon: "SettingsIcon",
        pageName: "ToolsPerception",
        title: "Outil de Perception",
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
