<template>
  <!-- This is an example component -->
  <div class="w-full flex text-gray-600">
    <input @input="$emit('search',$event.target.value)" class="h-8 w-full px-5 pr-16 text-sm bg-white border-2 border-gray-300 rounded-lg focus:outline-none" type="text" name="search" placeholder="Rechercher">
    <button type="submit" class="relative  right-10 ">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path></svg>
    </button>
  </div>
</template>

<script>
export default {
  methods:{
    filtre(e){
      this.$emit("search",e.target.value)

    }
  }
}
</script>

<style>

</style>