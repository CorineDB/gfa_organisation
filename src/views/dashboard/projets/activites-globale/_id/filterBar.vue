<template>
  <div>
    <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
      <div class="flex items-center justify-between flex-wrap">
        <!--Filtre sur projet -->
        <div class="w-2/5 flex items-center space-x-2">
          <multiselect
            v-model="projetFiltre"
            :options="projets"
            :preselect-first="true"
            placeholder="selectionnez un projet"
            label="nom"
            track-by="id"
          ></multiselect>

          <multiselect
            v-model="composanteFiltre"
            :options="composantes"
            :preselect-first="true"
            placeholder="selectionnez une composante"
            label="nom"
            track-by="id"
          ></multiselect>

          <multiselect
            v-model="valueFiltre"
            :options="sousComposantes"
            :preselect-first="true"
            placeholder="selectionnez une sous composante"
            label="nom"
            track-by="id"
          ></multiselect>

          <button
            v-if="!showFiltre"
            title="filtre"
            @click="showFiltre = true"
            class="bg-primary flex items-center space-x-3 text-white px-2 py-1 text-sm"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
              ></polygon>
            </svg>
            <span>filtre</span>
          </button>
          <div v-else class="px-6 w-full">
            <div class="bg-gray-300 h-2 w-full rounded-full relative">
              <span
                class="bg-white h-4 w-4 absolute top-0 -ml-2 -mt-1 z-10 shadow rounded-full cursor-pointer"
                :style="`left:${rangeValue}%`"
              ></span>
              <span
                class="bg-green-500 h-2 absolute left-0 top-0 rounded-full"
                :style="`width:${rangeValue}%`"
              ></span>
            </div>
            <div class="flex justify-between mt-2 text-xs text-gray-600">
              <span @click="$emit('filtreRange', 0)" class="w-8 cursor-pointer text-left"
                >0%</span
              >
              <span
                @click="$emit('filtreRange', 25)"
                class="w-8 cursor-pointer text-center"
                >25%</span
              >
              <span
                @click="$emit('filtreRange', 50)"
                class="w-8 cursor-pointer text-center"
                >50%</span
              >
              <span
                @click="$emit('filtreRange', 75)"
                class="w-8 cursor-pointer text-center"
                >75%</span
              >
              <span
                @click="$emit('filtreRange', 100)"
                class="w-8 cursor-pointer text-right"
                >100%</span
              >
              <button
                @click="showFiltre = false"
                class="text-white bg-blue-300 p-1"
              >
                revenir
              </button>
            </div>
          </div>
        </div>
        <!--Filtre sur projet -->
        <nav class="flex text-sm align-middle justify-evenly">
          <span
            @click="filterData(0)"
            :class="{ 'border-yellow-600 text-yellow-600': pending }"
            class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
          >
            attentes
            <span
              class="px-2 text-base text-yellow-600 border border-yellow-600 rounded-full undefined "
            >
              5
            </span>
          </span>
          <span
            @click="filterData(1)"
            :class="{ 'border-green-600 text-green-600': success }"
            class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
          >
            validés
            <span
              class="px-2 text-base text-green-600 border border-green-600 rounded-full undefined"
            >
              9
            </span>
          </span>
          <span
            @click="filterData(-1)"
            :class="{ 'border-red-600 text-red-600': rejected }"
            class="inline-block px-4 py-2 font-semibold text-gray-700 uppercase border-b-8 border-transparent cursor-pointer"
          >
            rejetés
            <span
              class="px-2 text-base text-red-600 border border-red-600 rounded-full undefined"
            >
              8
            </span>
          </span>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["showFiltre", "rangeValue", "valueFiltre", "projets", "projetFiltre", "composantes", "composanteFiltre", "sousComposantes", "sousComposanteFiltre"],

  data() {
    return {};
  },

  methods: {
    filterData(value){
      this.$emit('filterData', value)
    }
  },

  created() {},
};
</script>

<style></style>
