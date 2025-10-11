<template>
  <button @click="downloadPDF" :disabled="isGenerating" class="ml-2 btn btn-primary text-left">
    <span v-if="!isGenerating">📥 Télécharger PDF</span>
    <span v-else>⏳ Génération en cours...</span>
  </button>
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

const isGenerating = ref(false);

const downloadPDF = async () => {
  isGenerating.value = true;

  try {
    // Utilise la nouvelle méthode avec html2canvas pour capturer les styles CSS
    await $h.generatePDFWithStyles(props.tableIds, props.pageName, props.format);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
  } finally {
    isGenerating.value = false;
  }
};
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
