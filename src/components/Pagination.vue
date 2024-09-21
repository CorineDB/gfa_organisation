<template>
  <ul class="pagination flex items-center space-x-1">
    <!-- <li class="pagination-item">
      <button @click="onClickFirstPage" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" :disabled="isInFirstPage">Premier</button>
    </li> -->
    <li class="pagination-item">
      <button @click="onClickPreviousPage"  class="relative inline-flex items-center px-2 py-2  border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" :disabled="isInFirstPage">
         <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </li>
    <!-- visible button Start -->
    <li class="pagination-item" v-for="page in pages" :key="page.name">
      <button @click="onClickPage(page.name)" class=" relative inline-flex items-center  px-2 py-2  border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" :class="{active:isPageActive(page.name)}" :disabled="page.isDisabled"> {{page.name}} </button>
    </li>

    <!-- visible button End -->

   <li class="pagination-item">
      <button @click="onClickNextPage" class="-ml-px relative inline-flex items-center px-2 py-2  border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" :disabled="isInLastPage">
         <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </li> 
    <!-- <li class="pagination-item">
      <button @click="onClickLastPage"  class="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" :disabled="isInLastPage" >Dernier</button>
    </li> -->

  </ul>
</template>

<script>
export default {
  props:{
    maxVisibleButtons: {
      type:Number,
      required:false,
      default:3
    },
    totalPages:{
      type:Number,
      required:true
    },
    perPage: {
      type:Number,
      required:true
    },
    currentPage:{
      type:Number,
      required:true
    }
  },
  computed: {
    isInFirstPage() {
      return this.currentPage === 1
    },
    isInLastPage() {
      this.currentPage === this.totalPages
    },
    startPage() {
      //when on the first page
      if(this.currentPage === 1) {
        return 1
      }

      //when on the last page

      if(this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons
      }

      return this.currentPage - 1
    },
    pages() {
      const range = []
      for (let index = this.startPage; index < Math.min(this.startPage + this.maxVisibleButtons - 1,this.totalPages); index++) {
        range.push({name:index,isDisabled:index === this.currentPage})
        
      }
      return range
    }
  },
  methods: {
    isPageActive(page) {
      return this.currentPage === page
    },
    onClickFirstPage() {
      this.$emit('pagechanged',1)
    },
    onClickPreviousPage() {
      this.$emit('pagechanged',this.currentPage - 1)
    },
    onClickPage(page) {
      this.$emit('pagechanged',page)
    },
    onClickNextPage() {
      if(this.currentPage <= Math.round(this.totalPages / this.perPage) ) {
        this.$emit('pagechanged',this.currentPage + 1)
      }
     
    },
    onClickLastPage() {
      this.$emit('pagechanged',this.totalPages)
    }
  }
}
</script>

<style scoped>
.pagination {
  list-style-type: none;
}
.pagination-item {
  display:inline-block
}
.active {
  background-color: #4aae9b;
  color:#fff
}
</style>