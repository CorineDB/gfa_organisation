<template>
  <div>
    <select name="" v-model="attribute"  class="border  block my-1 border-primary py-1 px-2 text-xs " @change="$emit('getData', attribute,index)"  id="">
      <option  value="KM"> KM </option>
      <option  value="Mettre"> Metre </option>
      <option  value="CM"> CM </option>
      <option  value="pourcentage"> pourcentage </option>
      <option  value="personnes"> personnes </option>
      <option  value="unite"> unité </option>
    </select>
  </div>
</template>

<script>
export default {
  props:['attribute','index']
}
</script>

<style>

</style>