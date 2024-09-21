<template>
  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500"> 
                
    <p v-if="!depliment" class="cursor-pointer"> {{data? data.substring(0,60) : ''}} <span @click="deplier" class=" cursor-pointer font-black text-xl px-1 rounded-md" v-if="data ? data.length > 60 : 0" :title="data" >...</span></p>
    <p v-else class="cursor-pointer  flex space-x-2"> 
        <span> {{ data }}</span>
        <span @click="depliment=false" >
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"></path></g></svg>
        </span>
    </p>
        
    </td>
</template>

<script>
export default {
    props:['data'],
    data() {
        return {
            depliment:false,
        }
    },
    methods: {
        deplier() {
            this.depliment = true
        },
    }
}
</script>

<style>

</style>