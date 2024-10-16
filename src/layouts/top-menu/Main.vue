<template>
  <div class="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 bg-black/[0.15] dark:bg-transparent">
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <MobileMenu />
    <!-- BEGIN: Top Bar -->
    <div class="top-bar-boxed border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:mx-0 px-3 sm:px-8 md:px-6 mb-10 md:mb-8">
      <div class="flex items-center h-full">
        <!-- BEGIN: Logo -->
        <router-link :to="{ name: 'top-menu-dashboard-overview-1' }" tag="a" class="hidden -intro-x md:flex">
          <!-- <img
            alt="Tinker Tailwind HTML Admin Template"
            class="w-6"
            src="@/assets/images/logo.svg"
          /> -->
          <span class="ml-3 text-lg text-white"> Tinker </span>
        </router-link>
        <!-- END: Logo -->
        <!-- BEGIN: Breadcrumb -->
        <nav aria-label="breadcrumb" class="h-full mr-auto -intro-x">
          <ol class="breadcrumb breadcrumb-light">
            <li class="breadcrumb-item"><a href="#">Application</a></li>
            <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
          </ol>
        </nav>
        <!-- END: Breadcrumb -->
        <!-- BEGIN: Search -->

        <div class="relative mr-3 intro-x sm:mr-6">
          <div class="hidden search sm:block">
            <input type="text" class="border-transparent search__input form-control" placeholder="Search..." @focus="showSearchDropdown" @blur="hideSearchDropdown" />
            <SearchIcon class="search__icon dark:text-slate-500" />
          </div>
          <a class="notification notification--light sm:hidden" href="">
            <SearchIcon class="notification__icon dark:text-slate-500" />
          </a>
          <div class="search-result" :class="{ show: searchDropdown }">
            <div class="search-result__content">
              <div class="search-result__content__title">Pages</div>
              <div class="mb-5">
                <a href="" class="flex items-center">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success">
                    <InboxIcon class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Mail Settings</div>
                </a>
                <a href="" class="flex items-center mt-2">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-pending/10 text-pending">
                    <UsersIcon class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Users & Permissions</div>
                </a>
                <a href="" class="flex items-center mt-2">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary/80">
                    <CreditCardIcon class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Transactions Report</div>
                </a>
              </div>
              <div class="search-result__content__title">Users</div>
              <div class="mb-5">
                <a v-for="(faker, fakerKey) in $_.take($f(), 4)" :key="fakerKey" href class="flex items-center mt-2">
                  <div class="w-8 h-8 image-fit">
                    <img alt="Tinker Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" />
                  </div>
                  <div class="ml-3">{{ faker.users[0].name }}</div>
                  <div class="w-48 ml-auto text-xs text-right truncate text-slate-500">
                    {{ faker.users[0].email }}
                  </div>
                </a>
              </div>
              <div class="search-result__content__title">Products</div>
              <a v-for="(faker, fakerKey) in $_.take($f(), 4)" :key="fakerKey" href class="flex items-center mt-2">
                <div class="w-8 h-8 image-fit">
                  <img alt="Tinker Tailwind HTML Admin Template" class="rounded-full" :src="faker.images[0]" />
                </div>
                <div class="ml-3">{{ faker.products[0].name }}</div>
                <div class="w-48 ml-auto text-xs text-right truncate text-slate-500">
                  {{ faker.products[0].category }}
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- END: Search -->
        <!-- BEGIN: Notifications -->
        <Dropdown class="mr-4 intro-x sm:mr-6">
          <DropdownToggle tag="div" role="button" class="cursor-pointer notification notification--light notification--bullet">
            <BellIcon class="notification__icon dark:text-slate-500" />
          </DropdownToggle>
          <DropdownMenu class="pt-2 notification-content">
            <DropdownContent tag="div" class="notification-content__box">
              <div class="notification-content__title">Notifications</div>
              <div v-for="(faker, fakerKey) in $_.take($f(), 5)" :key="fakerKey" class="relative flex items-center cursor-pointer" :class="{ 'mt-5': fakerKey }">
                <div class="flex-none w-12 h-12 mr-1 image-fit">
                  <img alt="Tinker Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" />
                  <div class="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success"></div>
                </div>
                <div class="ml-2 overflow-hidden">
                  <div class="flex items-center">
                    <a href="javascript:;" class="mr-5 font-medium truncate">{{ faker.users[0].name }}</a>
                    <div class="ml-auto text-xs text-slate-400 whitespace-nowrap">
                      {{ faker.times[0] }}
                    </div>
                  </div>
                  <div class="w-full truncate text-slate-500 mt-0.5">
                    {{ faker.news[0].shortContent }}
                  </div>
                </div>
              </div>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        <!-- END: Notifications -->
        <!-- BEGIN: Account Menu -->
        <Dropdown class="w-8 h-8 intro-x">
          <DropdownToggle tag="div" role="button" class="w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in">
            <img alt="Tinker Tailwind HTML Admin Template" :src="$f()[9].photos[0]" />
          </DropdownToggle>
          <DropdownMenu class="w-56">
            <DropdownContent class="bg-primary/70 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <DropdownHeader tag="div" class="!font-normal">
                <div class="font-medium">
                  {{ $f()[0].users[0].name }}
                </div>
                <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                  {{ $f()[0].jobs[0] }}
                </div>
              </DropdownHeader>
              <DropdownDivider class="border-white/[0.08]" />
              <DropdownItem class="hover:bg-white/5"> <UserIcon class="w-4 h-4 mr-2" /> Profile </DropdownItem>
              <DropdownItem class="hover:bg-white/5"> <EditIcon class="w-4 h-4 mr-2" /> Add Account </DropdownItem>
              <DropdownItem class="hover:bg-white/5"> <LockIcon class="w-4 h-4 mr-2" /> Reset Password </DropdownItem>
              <DropdownItem class="hover:bg-white/5"> <HelpCircleIcon class="w-4 h-4 mr-2" /> Help </DropdownItem>
              <DropdownDivider class="border-white/[0.08]" />
              <DropdownItem class="hover:bg-white/5">
                <ToggleRightIcon class="w-4 h-4 mr-2" />
                Logout
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        <!-- END: Account Menu -->
      </div>
    </div>
    <!-- END: Top Bar -->
    <!-- BEGIN: Top Menu -->
    <nav class="top-nav">
      <ul>
        <li v-for="(menu, menuKey) in formattedMenu" :key="menuKey">
          <a
            :href="menu.subMenu ? 'javascript:;' : router.resolve({ name: menu.pageName }).path"
            class="top-menu"
            :class="{
              'top-menu--active': menu.active,
            }"
            @click="linkTo(menu, router, $event)"
          >
            <div class="top-menu__icon">
              <component :is="menu.icon" />
            </div>
            <div class="top-menu__title">
              {{ menu.title }}
              <ChevronDownIcon v-if="menu.subMenu" class="top-menu__sub-icon" />
            </div>
          </a>
          <!-- BEGIN: Second Child -->
          <ul v-if="menu.subMenu">
            <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
              <a :href="subMenu.subMenu ? 'javascript:;' : router.resolve({ name: subMenu.pageName }).path" class="top-menu" @click="linkTo(subMenu, router, $event)">
                <div class="top-menu__icon">
                  <ActivityIcon />
                </div>
                <div class="top-menu__title">
                  {{ subMenu.title }}
                  <ChevronDownIcon v-if="subMenu.subMenu" class="top-menu__sub-icon" />
                </div>
              </a>
              <!-- BEGIN: Third Child -->
              <ul v-if="subMenu.subMenu">
                <li v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu" :key="lastSubMenuKey">
                  <a :href="lastSubMenu.subMenu ? 'javascript:;' : router.resolve({ name: lastSubMenu.pageName }).path" class="top-menu" @click="linkTo(lastSubMenu, router, $event)">
                    <div class="top-menu__icon">
                      <component :is="'zap-icon'" />
                    </div>
                    <div class="top-menu__title">
                      {{ lastSubMenu.title }}
                    </div>
                  </a>
                </li>
              </ul>
              <!-- END: Third Child -->
            </li>
          </ul>
          <!-- END: Second Child -->
        </li>
      </ul>
    </nav>
    <!-- END: Top Menu -->
    <!-- BEGIN: Content -->
    <div class="content content--top-nav">
      <router-view />
    </div>
    <!-- END: Content -->
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTopMenuStore } from "@/stores/top-menu";
import { helper as $h } from "@/utils/helper";
import MobileMenu from "@/components/mobile-menu/Main.vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import MainColorSwitcher from "@/components/main-color-switcher/Main.vue";
import { searchDropdown, showSearchDropdown, hideSearchDropdown } from "./index";
import { nestedMenu, linkTo } from "@/layouts/side-menu";
import dom from "@left4code/tw-starter/dist/js/dom";

const route = useRoute();
const router = useRouter();
const formattedMenu = ref([]);
const topMenuStore = useTopMenuStore();
const topMenu = computed(() => nestedMenu(topMenuStore.menu, route));

provide("forceActiveMenu", (pageName) => {
  route.forceActiveMenu = pageName;
  formattedMenu.value = $h.toRaw(topMenu.value);
});

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu;
    formattedMenu.value = $h.toRaw(topMenu.value);
  }
);

onMounted(() => {
  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  formattedMenu.value = $h.toRaw(topMenu.value);
});
</script>
