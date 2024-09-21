<template>
   <th   @mouseenter="isHover = true" @mouseleave="isHover = false"  class="py-4 cursor-pointer px-6 font-medium text-gray-900  dark:text-white">
        <span v-if="!isHover">{{ code }}</span> 
        <span v-else class="">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores, autem?</span> 
    </th>
</template>

<script>
export default {
    props:['code','libelle'],
    data() {
    return {
      isHover:false
    }
  }
}
</script>

<style>

</style>