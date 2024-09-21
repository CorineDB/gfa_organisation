<template>
  <div>
    <!-- <div class=" flex" >
      <div  class="bg-white relative  shadow-lg border hover:border hover:border-gray-300 w-full hover:shadow-inner transition-shadow duration-300" style="max-height:350px" >
        <div class="p-2">
          <div class="flex justify-between items-center">
            <div class="">
              <h1 class="font-2xl font-bold uppercase text-gray-900">{{libelle}}</h1>
            </div>
            <div class="text-green-500 cursor-pointer" title="à un contrat">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path fill-rule="nonzero" d="M10.414 3l2 2H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414zm-.828 2H4v14h16V7h-8.414l-2-2zM12 9a2 2 0 0 1 1.001 3.732L13 17h-2v-4.268A2 2 0 0 1 12 9z"></path></g></svg>
            </div>
          </div>
          <div class="my-2">
            <p class="text-sm font-semibold py-1"> <span class="font-bold">Email :</span>  <span class="text-gray-700">{{email}}  </span> </p>
            <p class="text-sm font-semibold py-1"> <span class="font-bold">Contact :</span> <span class="text-gray-700"> {{contact}} </span> </p>
          
          </div>
          <div class="my-2 flex justify-end space-x-3">
            <span v-if="isDelete" @click="$emit('modifier')" class="text-blue-500 cursor-pointer ">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
            </span>
            <span v-if="isUpdate" @click="$emit('supprimer')" title="Supprimer" class="text-red-500 cursor-pointer"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M292.7 840h438.6l24.2-512h-487z"></path><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z"></path></svg></span>
          </div>
        </div>
      </div>
    </div> -->
    

    <div class="relative mb-4 sm:mb-0 hover:shadow-lg ">
                <!-- <div class="absolute right-0 top-3 z-10 cursor-pointer">
                  <dropdown v-if="institutionDelete && institutionUpdate " @gotoNext="gotoNext" @supprimer="supprimerInstitution(institution)"  @modifier="modifierInstitution(institution)" @duplicate='dupliquerInstitution(institution)' :option="option"></dropdown>
                  <dropdown v-if="!institutionDelete && institutionUpdate " @gotoNext="gotoNext"   @modifier="modifierInstitution(institution)" @duplicate='dupliquerInstitution(institution)' :option="optionUpdate"></dropdown>
                  <dropdown v-if="institutionDelete && !institutionUpdate " @gotoNext="gotoNext" @supprimer="supprimerInstitution(institution)"   @duplicate='dupliquerInstitution(institution)' :option="optionD"></dropdown>
                </div>
                 -->
                <div class="relative p-4 min-w-full bg-white sm:rounded-lg overflow-hidden shadow-md">
                    <!-- <span class="relative text-xl sm:text-xl text-white tracking-tight font-bold bg-primary p-2 rounded-lg uppercase flex no-wrap w-auto justify-start items-center"></span> -->
                    
                    <p class="my-2 text-normal text-sm sm:text-base font-medium text-gray-600 mt-4 truncate">{{libelle}}</p>
        
          
                    <div class="flex items-center  text-gray-600 dark:text-gray-400 mt-4">
                      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" class="w-8 h-8 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div class="ml-4 text-xs  md:text-md tracking-wide font-semibold w-full truncate">{{contact}}</div>
                    </div>
          
                    <div class="flex items-center  text-gray-600 dark:text-gray-400">
                      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" class="w-8 h-8 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div class="ml-4 text-xs  md:text-md tracking-wide font-semibold w-full truncate">{{email}}</div>
                    </div>
                    <div class="flex _items-end justify-end _mb-4 text-gray-600 dark:text-gray-400 space-x-2">
                          <div  v-if="isDelete" @click="$emit('modifier')"> <svg  class=" text-gray-400 hover:text-blue-500" fill="currentColor" stroke="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" ><path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"></path></svg>  </div>
                          <div v-if="isUpdate" @click="$emit('supprimer')">
                            <svg class="text-gray-400 hover:text-red-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" ><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path></svg>
                          </div>
                    </div>
                </div>
                
            </div>
  </div>
</template>

<script>
export default {
  props: ['libelle','email','contact','isDelete','isUpdate'],
  data() {
    return {
      option:[
        {name:'supprimer'},
        {name:'modifier'},
        {name:'dupliquer'},
      ],
    }
  }
}
</script>

<style>

</style>