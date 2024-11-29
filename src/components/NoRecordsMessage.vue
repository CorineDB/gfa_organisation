<template>
    <div 
      class="flex flex-col items-center justify-center text-center space-y-4 py-8"
    >
      <slot name="icon">
        <!-- Default Icon -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-16 w-16 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          stroke-width="2"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M9.172 16.172a4 4 0 005.656 0M4.828 9.828a4 4 0 000 5.656m14.344-5.656a4 4 0 010 5.656M15 12H9m0 0V9m0 3v3"
          />
        </svg>
      </slot>
  
      <h2 class="text-lg font-semibold text-gray-600">
        {{ title }}
      </h2>
  
      <p class="text-sm text-gray-500">
        {{ description }}
      </p>
  
      <slot name="action">
        <!-- Optional Action Button -->
      </slot>
    </div>
  </template>
  
  <script>
  export default {
    name: "NoRecordsMessage",
    props: {
      title: {
        type: String,
        default: "No Records Found",
      },
      description: {
        type: String,
        default: "There are no results matching your search. Try adjusting your filters or criteria.",
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here, if needed */
  </style>  