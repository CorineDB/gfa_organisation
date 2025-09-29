import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    dashboard: {
      icon: "GridIcon",
      pageName: "DashboardGfa",
      title: "Dashboard GFA",
    },
    projets: {
      icon: "FolderIcon",
      pageName: "projets",
      title: "Projets",
      subMenu: [],
    },
    planAction: {
      icon: "WatchIcon",
      pageName: "pta",
      title: "Plan d'action Global",
    },
    projet: {
      icon: "FolderIcon",
      pageName: "projets",
      title: "Projets",
    },
    outcome: {
      icon: "FolderIcon",
      pageName: "composantes_globale",
      title: "OutComes",
    },
    output: {
      icon: "FolderIcon",
      pageName: "sous_composantes_globale",
      title: "OutPut",
    },
    activite: {
      icon: "FolderIcon",
      pageName: "activites_globale",
      title: "Activités",
    },
    tache: {
      icon: "FolderIcon",
      pageName: "taches_globale",
      title: "Taches",
    },
    cadreMesureRendements: {
      icon: "LayoutIcon",
      title: "Cadre Mesure Rendement",
      subMenu: [],
    },
    indicateurs: {
      icon: "BarChart2Icon",
      pageName: "indicateur",
      title: "Indicateurs",
    },
    suiviIndicateurs: {
      icon: "BarChart2Icon",
      pageName: "suivi_indicateur",
      title: "Suivi Indicateurs",
    },
    // audit: {
    //   icon: "ServerIcon",
    //   pageName: "audit",
    //   title: "Audit",
    // },
    // rapport: {
    //   icon: "ArchiveIcon",
    //   pageName: "rapport",
    //   title: "Rapport",
    // },
    gestionFinancier: {
      icon: "DollarSignIcon",
      title: "Gestion Financière",
      subMenu: [],
    },
    suiviFinancier: {
      icon: "ZapIcon",
      pageName: "finances_suivi",
      title: "Suivi Financier",
    },
    planDecaissement: {
      icon: "DollarSignIcon",
      pageName: "plan_de_decaissement",
      title: "Plan de Décaissement",
    },

    programmationEnquete: {
      icon: "BarChart2Icon",
      pageName: "Programmation_enquete",
      title: "Évaluations & Résulats",
    },

    enqueteIndividuel: {
      icon: "BarChart2Icon",
      pageName: "EnqueteIndividuel",
      title: "Enquête personnalisée",
    },
    personnel: {
      icon: "UsersIcon",
      pageName: "personnel",
      title: "Personnel",
      subMenu: [],
    },

    utilisateur: {
      icon: "UsersIcon",
      pageName: "Utilisateur",
      title: "Membres",
    },
    roles: {
      icon: "UnlockIcon",
      pageName: "Roles",
      title: "Rôles",
    },

    menu: [],
  }),
  actions: {
    setTabPermission(newTabPermission) {
      this.tabPermission = newTabPermission;
    },
    addToMenuIfPermissionGranted() {
      const haveProject = JSON.parse(localStorage.getItem("authenticateUser")).projet;

      console.log(haveProject);

      this.menu = [];

     
      if (this.tabPermission.some((permission) => permission.slug === "voir-un-projet" || permission.slug === "voir-ptab" || permission.slug === "voir-un-outcome" || permission.slug === "voir-un-output" || permission.slug === "voir-une-activite" || permission.slug === "voir-une-tache") && haveProject !== null) {
        this.menu.push(this.dashboard);
        this.menu.push(this.projets);
        this.projets.subMenu = [];
        if (this.tabPermission.some((permission) => permission.slug === "voir-ptab")) {
          this.projets.subMenu.push(this.planAction);
        }

        if (this.tabPermission.some((permission) => permission.slug === "voir-un-projet")) {
          this.projets.subMenu.push(this.projet);
        }
        if (this.tabPermission.some((permission) => permission.slug === "voir-un-output")) {
          this.projets.subMenu.push(this.outcome);
        }
        if (this.tabPermission.some((permission) => permission.slug === "voir-un-output")) {
          this.projets.subMenu.push(this.output);
        }
        if (this.tabPermission.some((permission) => permission.slug === "voir-une-activite")) {
          this.projets.subMenu.push(this.activite);
        }
        if (this.tabPermission.some((permission) => permission.slug === "voir-une-tache")) {
          this.projets.subMenu.push(this.tache);
        }

        if (this.tabPermission.some((permission) => permission.slug === "voir-un-indicateur" || permission.slug === "voir-suivi-indicateur")) {
          this.menu.push(this.cadreMesureRendements);
          this.cadreMesureRendements.subMenu = [];
          if (this.tabPermission.some((permission) => permission.slug === "voir-un-indicateur")) {
            this.cadreMesureRendements.subMenu.push(this.indicateurs);
          }
          if (this.tabPermission.some((permission) => permission.slug === "voir-un-suivi-indicateur")) {
            this.cadreMesureRendements.subMenu.push(this.suiviIndicateurs);
          }
        }

        if (this.tabPermission.some((permission) => permission.slug === "voir-un-suivi-financier" || permission.slug === "voir-un-plan-de-decaissement")) {
          this.menu.push(this.gestionFinancier);
          this.gestionFinancier.subMenu = [];
          if (this.tabPermission.some((permission) => permission.slug === "voir-un-suivi-financier")) {
            this.gestionFinancier.subMenu.push(this.suiviFinancier);
          }
          if (this.tabPermission.some((permission) => permission.slug === "voir-un-plan-de-decaissement")) {
            this.gestionFinancier.subMenu.push(this.planDecaissement);
          }
        }
      }

      if (this.tabPermission.some((permission) => permission.slug === "voir-resultats-evaluation")) {
        this.menu.push(this.programmationEnquete);
      }

      if (this.tabPermission.some((permission) => permission.slug === "voir-une-enquete-individuelle")) {
        this.menu.push(this.enqueteIndividuel);
      }

      if (this.tabPermission.some((permission) => permission.slug === "voir-un-utilisateur" || permission.slug === "voir-un-role")) {
        this.menu.push(this.personnel);
        this.personnel.subMenu = [];
        if (this.tabPermission.some((permission) => permission.slug === "voir-un-utilisateur")) {
          this.personnel.subMenu.push(this.utilisateur);
        }

        if (this.tabPermission.some((permission) => permission.slug === "voir-un-role" && permission.slug === "voir-une-permission")) {
          this.personnel.subMenu.push(this.roles);
        }
      }
    },
  },
});
