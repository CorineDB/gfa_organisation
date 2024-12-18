<template>
  <div class="px-3 py-5 -mx-3 md:py-0 sm:-mx-8 sm:px-8">
    <!-- <DarkModeSwitcher /> -->
    <!-- <MainColorSwitcher /> -->
    <MobileMenu v-if="!isToolsPerception" />
    <div class="flex mt-[4.7rem] md:mt-0 relative overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav v-if="!isToolsPerception" class="fixed h-screen overflow-scroll side-nav navColor scrollbar-hidden">
        <router-link :to="{ name: 'DashboardGfa' }" tag="a" class="flex flex-wrap items-center justify-center mt-3 intro-x">
          <h1 class="font-semibold text-white">Programme de redevabilité</h1>
          <!-- <img alt="Programme de redevabilité" class="w-[5rem] sm:w-[7rem]" :src="usersProfileImage" /> -->
        </router-link>
        <div class="my-6 side-nav__devider"></div>
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li v-if="menu == 'devider'" :key="menu + menuKey" class="my-6 side-nav__devider"></li>
            <li v-else :key="menu + menuKey + 0">
              <SideMenuTooltip
                tag="a"
                :content="menu.title"
                :href="menu.subMenu ? 'javascript:;' : router.resolve({ name: menu.pageName }).path"
                class="side-menu"
                :class="{
                  'side-menu--active': menu.active,
                  'side-menu--open': menu.activeDropdown,
                }"
                @click="linkTo(menu, router, $event)"
              >
                <div class="side-menu__icon">
                  <component :is="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div v-if="menu.subMenu" class="side-menu__sub-icon" :class="{ 'transform rotate-180': menu.activeDropdown }">
                    <ChevronDownIcon />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.activeDropdown">
                  <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                    <SideMenuTooltip tag="a" :content="subMenu.title" :href="subMenu.subMenu ? 'javascript:;' : router.resolve({ name: subMenu.pageName }).path" class="side-menu" :class="{ 'side-menu--active': subMenu.active }" @click="linkTo(subMenu, router, $event)">
                      <div class="side-menu__icon">
                        <ActivityIcon />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div
                          v-if="subMenu.subMenu"
                          class="side-menu__sub-icon"
                          :class="{
                            'transform rotate-180': subMenu.activeDropdown,
                          }"
                        >
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </SideMenuTooltip>
                    <!-- BEGIN: Third Child -->
                    <transition @enter="enter" @leave="leave">
                      <ul v-if="subMenu.subMenu && subMenu.activeDropdown">
                        <li v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu" :key="lastSubMenuKey">
                          <SideMenuTooltip tag="a" :content="lastSubMenu.title" :href="lastSubMenu.subMenu ? 'javascript:;' : router.resolve({ name: lastSubMenu.pageName }).path" class="side-menu" :class="{ 'side-menu--active': lastSubMenu.active }" @click="linkTo(lastSubMenu, router, $event)">
                            <div class="side-menu__icon">
                              <ZapIcon />
                            </div>
                            <div class="side-menu__title">
                              {{ lastSubMenu.title }}
                            </div>
                          </SideMenuTooltip>
                        </li>
                      </ul>
                    </transition>
                    <!-- END: Third Child -->
                  </li>
                </ul>
              </transition>
              <!-- END: Second Child -->
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div class="pl-0 content" :class="[isToolsPerception ? '' : 'xl:pl-64 md:pl-32']">
        <TopBar v-if="!isToolsPerception" />
        <router-view />
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { helper as $h } from "@/utils/helper";
import { useSideMenuStore } from "@/stores/side-menu";
import TopBar from "@/components/top-bar/Main.vue";
import MobileMenu from "@/components/mobile-menu/Main.vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import MainColorSwitcher from "@/components/main-color-switcher/Main.vue";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main.vue";
import { linkTo, nestedMenu, enter, leave } from "./index";
import dom from "@left4code/tw-starter/dist/js/dom";
import { API_BASE_URL } from "@/services/configs/environment";

const route = useRoute();
const router = useRouter();
const formattedMenu = ref([]);
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));
const updateMenu = reactive([]);

const lastMenu = computed(() => nestedMenu(updateMenu, route));
const isToolsPerception = computed(() => ["tools-perception", "form-individuel", "request-password"].some((path) => route.path.includes(path)) && !localStorage.getItem("authenticateUser"));

provide("forceActiveMenu", (pageName) => {
  route.forceActiveMenu = pageName;
  formattedMenu.value = $h.toRaw(lastMenu.value);
});

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu;
    formattedMenu.value = $h.toRaw(lastMenu.value);
  }
);

const updatedMenu = () => {
  sideMenu.value.forEach((element) => {
    updateMenu.push(element);
    // if ($h.getPermission("voir-un-ano") && element.title == "Anos") {
    //   updateMenu.push(element);
    // }
    // if () {
    //   updateMenu.push(element);
    // }

    // if (element.title == "Dashboard") {
    //   updateMenu.push(element);
    // }

    // if ($h.getPermission("voir-un-utilisateur")) {
    //   // this.utilisateurVisible = true;
    // }
    // if ($h.getPermission("voir-un-audit")) {
    //   // this.auditVisible = true;
    // }
    // if ($h.getPermission("voir-une-institution")) {
    //   // this.institutionVisible = true;
    // }
    // if ($h.getPermission("voir-ptab")) {
    //   // this.voirPtaVisible = true;
    // }
    // if ($h.getPermission("voir-ppm")) {
    //   // this.voirPpmVisible = true;
    // }

    // if ($h.getPermission("voir-un-decaissement")) {
    //   // this.decaissementVisible = true;
    // }
    // if ($h.getPermission("voir-un-pap")) {
    //   // this.papVisible = true;
    // }
    // if ($h.getPermission("voir-un-programme")) {
    //   // this.programmeVisible = true;
    // }
    // if ($h.getPermission("voir-un-suivi-financier")) {
    //   // this.pointFinancierVisible = true;
    // }
    // if ($h.getPermission("voir-une-checklist")) {
    //   // this.checklistVisible = true;
    // }
    // if ($h.getPermission("voir-une-unitee-de-gestion")) {
    //   // this.uniteeDeGestionVisible = true;
    // }
    // if ($h.getPermission("voir-un-mod")) {
    //   // this.modVsisible = true;
    // }
    // if ($h.getPermission("voir-une-mission-de-controle")) {
    //   // this.missionControleVisible = true;
    // }
    // if ($h.getPermission("voir-une-entreprise-executante")) {
    //   // this.entrepriseExecutanteVisible = true;
    // }
    // if ($h.getPermission("voir-un-suivi-financier")) {
    //   // this.suiviFinancierVisible = true;
    // }
    // if ($h.getPermission("voir-un-bailleur")) {
    //   // this.bailleursVsisible = true;
    // }

    // if ($h.getPermission("voir-un-role")) {
    //   // this.roleVisible = true;
    // }
    // if ($h.getPermission("voir-un-projet")) {
    //   // this.projetVisible = true;
    // }
    // if ($h.getPermission("voir-une-composante")) {
    //   // this.composanteVisible = true;
    // }
    // if ($h.getPermission("voir-une-composante-revise")) {
    //   // this.composanteReVisible = true;
    // }
    // if ($h.getPermission("voir-une-activite")) {
    //   // this.activiteVisible = true;
    // }
    // if ($h.getPermission("voir-une-activite-revise")) {
    //   // this.activiteReVisible = true;
    // }
    // if ($h.getPermission("voir-une-tache")) {
    //   // this.tacheVisible = true;
    // }
    // if ($h.getPermission("voir-un-suivi-tache")) {
    //   // this.suiviTacheVisible = true;
    // }
    // if ($h.getPermission("voir-une-tache-revise")) {
    //   // this.tacheReVisible = true;
    // }
    // if ($h.getPermission("voir-un-suivi-tache-revise")) {
    //   // this.suiviTacheReVisible = true;
    // }
    // if ($h.getPermission("voir-un-indicateur")) {
    //   // this.indicateurVisible = true;
    // }
    // if ($h.getPermission("voir-un-indicateur-mod")) {
    //   // this.indicateurModVisible = true;
    // }

    // if ($h.getPermission("voir-un-suivi-indicateur")) {
    //   // this.suiviIndicateurVisible = true;
    // }
    // if ($h.getPermission("voir-un-suivi-indicateur-mod")) {
    //   // this.suiviIndicateurModVisible = true;
    // }

    // if ($h.getPermission("voir-un-plan-de-decaissement")) {
    //   // this.planDecaissementVisible = true;
    // }
    // if ($h.getPermission("voir-un-dashboard")) {
    //   // this.dashboardProjetVisible = true;
    // }
    // if ($h.getPermission("voir-raccourcir-composante-activite-tache")) {
    //   // this.raccourcieElementVisible = true;
    // }
    // if ($h.getPermission("voir-une-statistique")) {
    //   // this.statistiqueActiviteVisible = true;
    // }
    // if ($h.getPermission("voir-une-statistique-revise")) {
    //   // this.statistiqueActiviteReVisible = true;
    // }
    // if ($h.getPermission("voir-un-decaissement")) {
    //   // this.decaissementVisible = true;
    // }
    // if ($h.getPermission("voir-revision-ptab")) {
    //   // this.revisionVisible = true;
    // }
    // if ($h.getPermission("voir-un-decaissement")) {
    //   // this.decaissementVisible = true;
    // }
    // if ($h.getPermission("voir-une-liste-entreprise-mod")) {
    //   // this.listeEntrepriseModVisible = true;
    // }
    // if ($h.getPermission("voir-une-liste-entreprise-mission-de-controle")) {
    //   // this.listeEntrepriseMoVisible = true;
    // }
    // if ($h.getPermission("voir-activite-environnementale-mission-de-controle")) {
    //   // this.activiteEnvMoVisible = true;
    // }
    // if ($h.getPermission("voir-activite-environnementale-mission-de-controle")) {
    //   // this.activiteEnvMoVisible = true;
    // }
    // if ($h.getPermission("voir-une-liste-entreprise-entreprise-exec")) {
    //   // this.listeEntrepriseExecVisible = true;
    // }
    // if ($h.getPermission("voir-passation-mission-de-controle")) {
    //   // this.passationMissionVisible = true;
    // }
    // if ($h.getPermission("voir-passation-entreprise-executante")) {
    //   // this.passationEntrepriseVisible = true;
    // }
    // if ($h.getPermission("voir-passation-mod")) {
    //   // this.passationModVisible = true;
    // }
    // if ($h.getPermission("voir-une-checklist-mod")) {
    //   // this.checklistModVisible = true;
    // }
    // if ($h.getPermission("voir-un-gouvernement")) {
    //   // this.gouvernementVisible = true;
    // }
    // if ($h.getPermission("voir-une-activite-environnementale")) {
    //   // this.activiteEnVisible = true;
    // }
    // if ($h.getPermission("voir-un-formulaire")) {
    //   // this.formulaireVisible = true;
    // }
    // if ($h.getPermission("voir-une-configuration-alerte")) {
    //   // this.alertVisible = true;
    // }
    // if ($h.getPermission("voir-un-site")) {
    //   // this.siteVisible = true;
    // }
    // if ($h.getPermission("voir-une-categorie")) {
    //   // this.categorieVisible = true;
    // }
    // if ($h.getPermission("voir-une-unite-de-mesure")) {
    //   // this.uniteDeMesureVisible = true;
    // }
    // if ($h.getPermission("voir-un-historique")) {
    //   // this.historiqueVisible = true;
    // }
    // if ($h.getPermission("faire-un-backup")) {
    //   // this.backupVisible = true;
    // }
    // if ($h.getPermission("voir-une-maitrise-oeuvre")) {
    //   // this.maitriseOeuvreVisible = true;
    // }

    // if (element.title == "Dashboard") {
    //   if ($h.getPermission("read.statistique")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Dashboard GFA") {
    //   if ($h.getPermission("read.equipement") || $h.getPermission("write.equipement")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Association") {
    //   if ($h.getPermission("read.equipement") || $h.getPermission("write.equipement")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Campagne") {
    //   if ($h.getPermission("read.campagne") || $h.getPermission("write.campagne")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "API Client") {
    //   if ($h.getPermission("read.api.client") || $h.getPermission("write.api.client")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Choix") {
    //   if ($h.getPermission("read.indicateur") || $h.getPermission("write.indicateur")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Principes") {
    //   if ($h.getPermission("read.indicateur") || $h.getPermission("write.indicateur")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Structure") {
    //   if ($h.getPermission("read.indicateur") || $h.getPermission("write.indicateur")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Gouvernance") {
    //   if ($h.getPermission("read.indicateur") || $h.getPermission("write.indicateur")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Outil Factuel") {
    //   if ($h.getPermission("read.indicateur") || $h.getPermission("write.indicateur")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Outil de Perception") {
    //   if ($h.getPermission("read.indicateur") || $h.getPermission("write.indicateur")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Fiche de Synthèse") {
    //   if ($h.getPermission("read.indicateur") || $h.getPermission("write.indicateur")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Programmation des Rapports") {
    //   if ($h.getPermission("read.rapport") || $h.getPermission("write.rapport")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Sites") {
    //   if ($h.getPermission("read.site") || $h.getPermission("write.site")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Feedbacks") {
    //   if ($h.getPermission("read.feedback") || $h.getPermission("write.feedback")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Resolution") {
    //   if ($h.getPermission("read.resolution") || $h.getPermission("write.resolution")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Roles & Permissions") {
    //   if ($h.getPermission("read.role") || $h.getPermission("write.role")) {
    //     updateMenu.push(element);
    //   }
    // } else if (element.title == "Utilisateurs") {
    //   if ($h.getPermission("read.utilisateur") || $h.getPermission("write.utilisateur")) {
    //     updateMenu.push(element);
    //   }
    // }
  });
};
const usersProfileImage = ref("");

onMounted(() => {
  const usersInfo = JSON.parse(localStorage.getItem("authenticateUser"));
  //console.log(usersInfo);

  if (usersInfo) {
    // usersProfileImage.value = API_BASE_URL + usersInfo.users.profil;
  }

  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  updatedMenu();
  formattedMenu.value = $h.toRaw(lastMenu.value);
});
</script>
<style scoped>
.navColor {
  background: rgb(8, 10, 34);
  color: rgb(165, 126, 126);
}
</style>
