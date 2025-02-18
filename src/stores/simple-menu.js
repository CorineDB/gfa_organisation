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
        title: "Gestion Financière",
        subMenu: [
          {
            icon: "BarChart2Icon",
            pageName: "plan_de_decaissement",
            title: "Plan De decaissement",
          },
          {
            icon: "BarChart2Icon",
            pageName: "finances_suivi",
            title: "Suivi financier",
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
          },
          {
            icon: "BarChart2Icon",
            pageName: "suivi_indicateur",
            title: "Suivis Indicateur",
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
        title: "Enquête personnalisé",
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
    ],
  }),
  actions: {
    setMenu() {
      const haveProject = JSON.parse(localStorage.getItem("authenticateUser")).projet;
      // const haveProject = null;
      this.menu = [
        {
          icon: "GridIcon",
          pageName: "DashboardGfa",
          title: "Dashboard GFA",
        },

        {
          icon: "FolderIcon",
          title: "Gestion Financière",
          subMenu: [
            {
              icon: "BarChart2Icon",
              pageName: "plan_de_decaissement",
              title: "Plan De decaissement",
            },
            {
              icon: "BarChart2Icon",
              pageName: "finances_suivi",
              title: "Suivi financier",
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
            },
            {
              icon: "BarChart2Icon",
              pageName: "suivi_indicateur",
              title: "Suivis Indicateur",
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
          title: "Enquête personnalisé",
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
      ];

      if (haveProject !== null) {
        this.menu.splice(1, 0, {
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
        });
      }
    },
  },
});
