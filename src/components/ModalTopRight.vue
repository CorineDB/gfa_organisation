<template><!-- give the sidebar z-50 class so its higher than the navbar if you want to see the logo -->
  <!-- you will need to add a little "X" button next to the logo in order to close it though -->
  <div style="width: 30%" class="relative z-20">
    <div
      class="w-2/7  sm:w-2/5 md:w-1/3 fixed z-20 top-20  overflow-auto bg-white border-r shadow-lg bottom-0 right-0 scrollbar-thumb-blue scrollbar-thumb-rounded lg:block"
      id="main-nav">
      <div class="flex justify-between items-center w-full px-4  py-2 bg-gray-100 border-b relative">
        <p class="font-bold text-sm md:text-lg text-primary uppercase">{{ title }}</p>
        <div @click="closeModal" class="w-10 h-10  md:w-12 z-50 flex justify-center items-center bg-red-500 ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
            <path
              d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z">
            </path>
          </svg>
          <!-- <span
          @click="closeModal"
          class="absolute w-6 h-6 text-white bg-red-600 rounded-full shadow-sm cursor-pointer flex justify-center items-center"
        >
         
          ></span
        > -->
        </div>
      </div>

      <slot></slot>
    </div>

</div>
</template>

<script>

import { mapState } from "vuex";

export default {
  name: "modalTopRight",
  props: ["title"],
  data() {
    return {};
  },

  computed: {
    ...mapState(["sideBarOpen1"]),
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped></style>
