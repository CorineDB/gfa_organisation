<template>
  <div class="flex w-full gap-2">
    <section class="w-1/3 max-h-screen min-h-screen pr-1 overflow-auto border-r-2 pt-7">
      <AccordionGroup :selectedIndex="0" class="space-y-6">
        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponse />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponse />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class=""></section>
  </div>
</template>

<script setup>
import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
</script>

<style scoped></style>
