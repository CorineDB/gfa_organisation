<template>
  <div>
    <div class="relative flex" >
      
      <div  class="bg-white relative  shadow-lg border hover:border hover:border-gray-300 w-full hover:shadow-inner transition-shadow duration-300" style="max-height:350px" >
       <slot></slot>
       <div v-if="color !=undefined" class=" bottom-0 left-0 right-0 " :class="`${color} p-1`"></div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props:['color']
}
</script>

<style>

</style>