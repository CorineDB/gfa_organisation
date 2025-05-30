<script setup>
defineProps({
  typesGouvernance: Array,
});
</script>
<template>
  <div>
    <div>
      <div v-for="(type, indexType) in typesGouvernance" :key="indexType">
        <!-- Type de gouvernance -->
        <div class="text-lg !p-3 font-semibold bg-primary !text-white flex items-center justify-between">
          <p class="truncate">{{ type.nom }}</p>
          <ChevronDownIcon />
        </div>
        <div class="p-2 bg-white">
          <div v-for="(principe, indexPrincipe) in type.principes_de_gouvernance" :key="indexPrincipe">
            <div class="text-lg !p-3 font-semibold bg-primary !text-white flex items-center justify-between">
              <p class="truncate">{{ principe.nom }}</p>
              <!-- <ChevronDownIcon /> -->
            </div>
            <div class="p-2 bg-white">
              <div v-for="(critere, indexCritere) in principe.criteres_de_gouvernance" :key="indexCritere">
                <div class="text-lg !p-3 font-semibold bg-primary !text-white flex items-center justify-between">
                  <p class="truncate">{{ critere.nom }}</p>
                  <!-- <ChevronDownIcon /> -->
                </div>
                <div class="p-2 bg-white">
                  <div class="w-full space-y-2">
                    <div v-for="(indicateur, indexIndicateur) in critere.indicateurs_de_gouvernance" :key="indexIndicateur" class="px-2 py-3 text-base font-normal text-black truncate transition-all bg-white border-l-2 border-yellow-200 rounded shadow">{{ indexIndicateur + 1 }} - {{ indicateur.nom }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
