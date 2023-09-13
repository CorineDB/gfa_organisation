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
        icon: "GridIcon",
        pageName: "side-menu-dashboard-overview-1",
        title: "Dashboard",
      },
      {
        icon: "CpuIcon",
        pageName: "Bsd",
        title: "Association",
      },
      {
        icon: "CreditCardIcon",
        pageName: "Campagnes",
        title: "Campagne",
      },
    
      {
        icon: "GlobeIcon",
        pageName: "Principes",
        title: "Principes",
      },
      {
        icon: "GlobeIcon",
        pageName: "Gouvernance",
        title: "Gouvernance",
      },
      {
        icon: "GlobeIcon",
        pageName:"CHOIX",
        title: "Choix",
      },
      {
        icon: "SettingsIcon",
        pageName:"ToolsFactuel",
        title: "Outil Factuel",
      },
      {
        icon: "SettingsIcon",
        pageName:"ToolsPerception",
        title: "Outil de Perception",
      },
      {
        icon: "FileIcon",
        pageName:"FicheSynthese",
        title: "Fiche de Synthèse",
      },
      {
        icon: "WatchIcon",
        pageName:"ProgrammationRapport",
        title: "Programmation des Rapports",
      },
      {
        icon: "LinkIcon",
        pageName:"Sites",
        title: "Sites",
      },    
      {
        icon: "CodepenIcon",
        pageName:"Resolution",
        title: "Resolution",
      },

      {
        icon: "UnlockIcon",
        pageName:"Roles",
        title: "Roles & Permissions",
      },
      {
        icon: "UsersIcon",
        pageName:"Utilisateur",
        title: "Utilisateurs",
      },

    ],
  }),
});
