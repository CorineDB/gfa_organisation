<script setup>
defineProps({
  type: String,
  principe: String,
  critere: String,
  indicateur: String,
});
</script>
<template>
  <div class="flex flex-col-reverse items-start w-full gap-2">
    <div :class="[type ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[91%] px-2 py-2.5 text-base font-medium truncate transition-all">{{ type || type?.length < 0 ? type : "Type de gouvernance" }}</div>
    <div :class="[principe ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[94%] px-2 py-2.5 text-base truncate font-medium transition-all">{{ principe || principe?.length < 0 ? principe : "Principe" }}</div>
    <div :class="[critere ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[97%] px-2 py-2.5 text-base truncate font-medium transition-all">{{ critere || critere?.length < 0 ? critere : "Critère" }}</div>
    <div :class="[indicateur ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-full px-2 py-2.5 text-base truncate font-medium transition-all">{{ indicateur || indicateur?.length < 0 ? indicateur : "Indicateur" }}</div>
  </div>
</template>

<style scoped></style>
