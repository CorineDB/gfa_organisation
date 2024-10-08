<template>

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
