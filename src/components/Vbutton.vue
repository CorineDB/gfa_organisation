<template>
  <div>
    <button v-if="template === 'none'" :class="`${padding} ${aroundi} ${textsize} ${graissage} ${size} ${bordere} ${bgcolore} ${textcolor} `" :type="type" class=" hover:opacity-80 transition-all flex space-x-4 duration-500  " >
      <span><slot></slot></span>
    </button>
    <button v-if="template==='default'" class="bg-gray-500 py-2 px-4 border text-white border-gray-500 rounded-md font-semibold outline-none">
     <span v-if="!isloading">
        <slot></slot>
      </span>
      <span v-else class="flex space-x-2">
        <svg  xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
         <div class="opacity-25">
           <slot></slot>
         </div>
      </span>
    </button>
    <button v-if="template==='success'" type="submit" class="bg-primary py-2 px-4 border text-white border-primary rounded-md font-semibold outline-none text-sm">
      <span v-if="!isloading">
        <slot></slot>
      </span>
      <span v-else class="flex space-x-2">
        <svg  xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
         <div class="opacity-25">
           <slot></slot>
         </div>
      </span>
    </button>
    <button v-if="template==='danger'" type="reset" v-on:click="$emit('close')" class=" bg-red-500 py-2 px-4 border text-white border-red-500 rounded-md font-semibold outline-none text-sm">
      <span v-if="!isloading">
        <slot></slot>
      </span>
      <span v-else class="flex space-x-2">
        <svg  xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
         <div class="opacity-25">
           <slot></slot>
         </div>
      </span>
    </button>
  </div>
  
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props:['type','padding', 'aroundi','textcolor', 'textsize','graissage','size','bordere','bgcolore','label','template','isloading','iconne'],
  data() {
    return { 
      
    }
  }

}
</script>

<style>

</style>