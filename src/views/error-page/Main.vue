<template>
  <div>
    <DarkModeSwitcher />
    <div class="custom-bg">
      <!-- BEGIN: Error Page -->
      <div
        class="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left"
      >
        <div class="-intro-x lg:mr-20">
          <img
            alt="Midone Tailwind HTML Admin Template"
            class="h-48 lg:h-auto"
            src="@/assets/images/3828537.jpg"
          />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">404</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
            Oops. Cette page a disparu ou n'avez pas le droit d'y accéder.
          </div>
          <div class="intro-x text-lg mt-3">
            Vous avez peut-être mal tapé l'adresse ou la page a peut-être été déplacée.
          </div>
          <router-link to="/"
            class="intro-x btn py-3 px-4 text-white border-white dark:border-darkmode-400 dark:text-slate-200 mt-10"
          >
            Retour à la page d'acceuil
          </router-link>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";

onMounted(() => {
  dom("body").removeClass("main").removeClass("login").addClass("error-page");
});
</script>

<style scoped >
.custom-bg{
  background-color: #0f3460;
}
</style>
