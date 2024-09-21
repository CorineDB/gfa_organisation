<template>
  <div>
    <div v-if="template==='none'">
      <label v-if="labelposition" :class="{'block py-2':labelposition==='y','inline px-2':labelposition==='x'}" class=" text-sm font-semibold " for="">
      {{label}}
      </label>
      <input  v-model='inputValue'  :placeholder="placeholdere" :class="`${padding} ${aroundi} ${textsize} ${graissage} ${size} ${bordere} ${bgcolor} ${textcolor} `" :type="type" class="outline-none " :required="required"  @keyup="$emit('update', inputValue)"  >
    </div>
    <div v-if="template==='default'">
      <label v-if="labelposition" :class="{'block py-2':labelposition==='y','inline px-2':labelposition==='x'}" class=" text-sm font-semibold " for="">
      {{label}}
      </label>
      <input required v-model='inputValue'  :placeholder="placeholdere" :type="type"    @keyup="$emit('update', inputValue)" class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm"  />
    </div>
    
  </div>
</template>

<script>
export default {

 // eslint-disable-next-line vue/require-prop-types
 props:['vmodel','type','padding', 'aroundi','textcolor', 'textsize','graissage','placeholdere','placeholderecolor','size','bordere','bgcolor','label','labelposition','required','template'],
  data() {
    return {
      localValue: null,
      inputValue: this.vmodel,
    }
  },
   watch: {
    value: {
      handler(vmodel){
        this.localValue = vmodel
        this.inputValue = vmodel
      },
      immediate: true,
    },
  },
  methods: {
    
  }
}
</script>

<style>

</style>