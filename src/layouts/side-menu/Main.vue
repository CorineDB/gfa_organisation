<template>
  <div class="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 ">
    <!-- <DarkModeSwitcher /> -->
    <!-- <MainColorSwitcher /> -->
    <MobileMenu />
    <div class="flex mt-[4.7rem] md:mt-0 relative  overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav class="side-nav fixed  navColor  h-screen overflow-scroll scrollbar-hidden ">
        <router-link :to="{ name: 'side-menu-dashboard-overview-1' }" tag="a"
          class="intro-x flex flex-wrap items-center    justify-center  mt-3">
          <img alt="Tinker Tailwind HTML Admin Template" class="w-[5rem] sm:w-[7rem]" :src="usersProfileImage" />
        </router-link>
        <div class="side-nav__devider my-6"></div>
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li v-if="menu == 'devider'" :key="menu + menuKey" class="side-nav__devider my-6"></li>
            <li v-else :key="menu + menuKey + 0">
              <SideMenuTooltip tag="a" :content="menu.title" :href="menu.subMenu
                  ? 'javascript:;'
                  : router.resolve({ name: menu.pageName }).path
                " class="side-menu" :class="{
    'side-menu--active': menu.active,
    'side-menu--open': menu.activeDropdown,
  }" @click="linkTo(menu, router, $event)">
                <div class="side-menu__icon">
                  <component :is="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div v-if="menu.subMenu" class="side-menu__sub-icon"
                    :class="{ 'transform rotate-180': menu.activeDropdown }">
                    <ChevronDownIcon />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.activeDropdown">
                  <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                    <SideMenuTooltip tag="a" :content="subMenu.title" :href="subMenu.subMenu
                        ? 'javascript:;'
                        : router.resolve({ name: subMenu.pageName }).path
                      " class="side-menu" :class="{ 'side-menu--active': subMenu.active }"
                      @click="linkTo(subMenu, router, $event)">
                      <div class="side-menu__icon">
                        <ActivityIcon />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div v-if="subMenu.subMenu" class="side-menu__sub-icon" :class="{
                          'transform rotate-180': subMenu.activeDropdown,
                        }">
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </SideMenuTooltip>
                    <!-- BEGIN: Third Child -->
                    <transition @enter="enter" @leave="leave">
                      <ul v-if="subMenu.subMenu && subMenu.activeDropdown">
                        <li v-for="(
                                    lastSubMenu, lastSubMenuKey
                                  ) in subMenu.subMenu" :key="lastSubMenuKey">
                          <SideMenuTooltip tag="a" :content="lastSubMenu.title" :href="lastSubMenu.subMenu
                              ? 'javascript:;'
                              : router.resolve({ name: lastSubMenu.pageName })
                                .path
                            " class="side-menu" :class="{ 'side-menu--active': lastSubMenu.active }"
                            @click="linkTo(lastSubMenu, router, $event)">
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
      <div class="content xl:pl-64 md:pl-32 pl-0 ">
        <TopBar />
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
const updateMenu = reactive([])

const lastMenu = computed(() => nestedMenu(updateMenu, route));

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
  sideMenu.value.forEach(element => {
    if (element.title == 'Dashboard') {
      if ($h.getPermission('read.statistique')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Association') {
      if ($h.getPermission('read.equipement') || $h.getPermission('write.equipement')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Campagne') {
      if ($h.getPermission('read.campagne') || $h.getPermission('write.campagne')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'API Client') {
      if ($h.getPermission('read.api.client') || $h.getPermission('write.api.client')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Principes') {
      if ($h.getPermission('read.indicateur') || $h.getPermission('write.indicateur')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Outil Factuel') {
      if ($h.getPermission('read.indicateur') || $h.getPermission('write.indicateur')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Outil de Perception') {
      if ($h.getPermission('read.indicateur') || $h.getPermission('write.indicateur')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Programmation des Rapports') {
      if ($h.getPermission('read.rapport') || $h.getPermission('write.rapport')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Sites') {
      if ($h.getPermission('read.site') || $h.getPermission('write.site')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Feedbacks') {
      if ($h.getPermission('read.feedback') || $h.getPermission('write.feedback')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Resolution') {
      if ($h.getPermission('read.resolution') || $h.getPermission('write.resolution')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Roles & Permissions') {
      if ($h.getPermission('read.role') || $h.getPermission('write.role')) {
        updateMenu.push(element);
      }
    }

    else if (element.title == 'Utilisateurs') {
      if ($h.getPermission('read.utilisateur') || $h.getPermission('write.utilisateur')) {
        updateMenu.push(element);
      }
    }
  });
}
const usersProfileImage = ref('')

onMounted(() => {
  const usersInfo = JSON.parse(localStorage.getItem("bsdInfo"));

  if (usersInfo) {
    usersProfileImage.value = API_BASE_URL + usersInfo.users.profil
  }

  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  updatedMenu();
  formattedMenu.value = $h.toRaw(lastMenu.value);
});
</script>
<style scoped>
.navColor {
  background: rgb(0, 9, 110);
  color: rgb(165, 126, 126)
}
</style>
