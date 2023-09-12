import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [
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
        icon: "GiftIcon",
        pageName: "Api Client",
        title: "API Client",
      },
      {
        icon: "GlobeIcon",
        pageName: "Principes",
        title: "Principes",
      },
      {
        icon: "GlobeIcon",
        pageName: "Gouvernement",
        title: "Gouvernement",
      },
      {
        icon: "SettingsIcon",
        pageName: "ToolsFactuel",
        title: "Outil Factuel",
      },
      {
        icon: "SettingsIcon",
        pageName: "ToolsPerception",
        title: "Outil de Perception",
      },
      {
        icon: "WatchIcon",
        pageName: "ProgrammationRapport",
        title: "Programmation des Rapports",
      },
      {
        icon: "LinkIcon",
        pageName: "Sites",
        title: "Sites",
      },
      {
        icon: "MehIcon",
        pageName: "Feedback",
        title: "Feedbacks",
      },
       
      {
        icon: "CodepenIcon",
        pageName: "Resolution",
        title: "Resolution",
      },

      {
        icon: "UnlockIcon",
        pageName: "Roles",
        title: "Roles & Permissions",
      },
      {
        icon: "UsersIcon",
        pageName: "Utilisateur",
        title: "Utilisateurs",
      },

    ],
  }),
});
