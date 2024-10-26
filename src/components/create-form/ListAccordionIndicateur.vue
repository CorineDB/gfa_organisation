<script setup>
defineProps({
  indicateursArray: Array,
});
</script>

<template>
  <div class="w-full max-w-full mx-auto">
    <div v-if="indicateursArray.length > 0" class="">
      <AccordionGroup :selectedIndex="null" class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
        <AccordionItem v-for="(indicateur, index) in indicateursArray" :key="index" class="">
          <Accordion class="text-lg !p-3 font-semibold bg-primary !text-white flex items-center justify-between">
            <p class="truncate">{{ indicateur.indicateur.nom }}</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2 bg-white">
            <div class="w-full space-y-0.5">
              <div class="text-black border-yellow-200 border-l-2 shadow rounded bg-white px-2 py-2.5 text-base font-medium truncate transition-all">{{ indicateur.critere.nom }}</div>
              <div class="text-black border-yellow-200 border-l-2 shadow rounded bg-white px-2 py-2.5 text-base font-medium truncate transition-all">{{ indicateur.principe.nom }}</div>
              <div class="text-black border-yellow-200 border-l-2 shadow rounded bg-white px-2 py-2.5 text-base font-medium truncate transition-all">{{ indicateur.type.nom }}</div>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </div>
    <div v-else class="flex justify-center py-3">
      <p class="text-lg font-medium text-gray-600">Ajouter des indicateurs pour voir la liste ici.</p>
    </div>
    <!-- <AccordionGroup>
      <AccordionItem>
        <Accordion> OpenSSL Essentials: Working with SSL Certificates, Private Keys </Accordion>
        <AccordionPanel class="leading-relaxed text-slate-600 dark:text-slate-500"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Accordion> Understanding IP Addresses, Subnets, and CIDR Notation </Accordion>
        <AccordionPanel class="leading-relaxed text-slate-600 dark:text-slate-500"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Accordion> How To Troubleshoot Common HTTP Error Codes </Accordion>
        <AccordionPanel class="leading-relaxed text-slate-600 dark:text-slate-500"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Accordion> An Introduction to Securing your Linux VPS </Accordion>
        <AccordionPanel class="leading-relaxed text-slate-600 dark:text-slate-500"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </AccordionPanel>
      </AccordionItem>
    </AccordionGroup> -->
  </div>
</template>

<style scoped></style>
