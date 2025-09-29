<template>
  <div class="_px-3 _py-5 _-mx-3 _md:py-0 _sm:-mx-8 _sm:px-8">
    <!-- <DarkModeSwitcher /> -->
    <!-- <MainColorSwitcher /> -->
    <MobileMenu v-if="!isToolsPerception" />
    <div class="flex mt-[4.7rem] md:mt-0 overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav v-if="!isToolsPerception" class="fixed h-screen overflow-scroll side-nav navColor scrollbar-hidden">
        <router-link :to="{ name: 'DashboardGfa' }" tag="a" class="flex flex-col items-center justify-center mt-3 intro-x">
          <h1 class="font-semibold text-white text-center lg:text-left">test {{ nomProgramme }}</h1>

          <!-- <h1 class="font-semibold text-white">Programme de redevabilité</h1> -->
          <p class="block">{{ currentUsers.role }}</p>
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
        <button v-show="showButton" @click="scrollToTop" class="fixed z-50 bottom-5 right-5 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-pending transition-opacity duration-300">↑</button>
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script setup>
import AuthService from "@/services/modules/auth.service";
import { computed, onMounted, provide, ref, watch, reactive, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { helper as $h } from "@/utils/helper";
import { useSideMenuStore } from "@/stores/side-menu";
import TopBar from "@/components/top-bar/Main.vue";
import MobileMenu from "@/components/mobile-menu/Main.vue";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main.vue";
import { linkTo, nestedMenu, enter, leave } from "./index";
import dom from "@left4code/tw-starter/dist/js/dom";


// back to top

const showButton = ref(false);

const handleScroll = () => {
  showButton.value = window.scrollY > 300; // Affiche le bouton après 300px
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

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
  });
};
const usersProfileImage = ref("");

const users = reactive();
const currentUsers = reactive({});
const nomProgramme = ref("");

function getUser() {
  AuthService.getCurrentUser()
    .then((data) => {
      users.value = data.data.data;

      localStorage.setItem("authenticateUser", JSON.stringify(users.value));

      const usersInfo = JSON.parse(localStorage.getItem("authenticateUser"));

      if (usersInfo) {
        nomProgramme.value = usersInfo.programme.nom;

        let permissions = usersInfo.role[0].permissions;

        sideMenuStore.setTabPermission(permissions);

        sideMenuStore.addToMenuIfPermissionGranted();

        currentUsers.nom = usersInfo.nom;

        currentUsers.role = usersInfo.role[0].nom;
      }
    })
    .catch((e) => {
      // disabled()
      // alert(e);
    });
}



onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  getUser();

  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  updatedMenu();
  formattedMenu.value = $h.toRaw(sideMenu.value);
});
</script>
<style scoped>
.navColor {
  background: rgb(8, 10, 34);
  color: rgb(165, 126, 126);
}
</style>
