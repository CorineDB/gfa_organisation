<template>
    <button @click="downloadPDF" class="ml-2 btn btn-primary text-left">Télécharger PDF</button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { helper as $h } from "@/utils/helper";
  
  const props = defineProps({
    tableIds: {
      type: Array,
      required: true,
    },
    pageName: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: 'a4',
    },
  });
  
  const downloadPDF = () => {
    $h.generatePDF(props.tableIds, props.pageName, props.format);
  };
  </script>