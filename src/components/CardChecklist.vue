<template>
  <div>
    <div class="flex" >
      <div @click.stop="$emit('gotoDetails')" class="bg-white relative cursor-pointer  shadow-lg border hover:border hover:border-gray-300 w-full hover:shadow-inner transition-shadow duration-300" style="max-height:350px" >
        <div class="p-2 relative">
          <div class="flex justify-between items-center relative">
            <div class="flex space-x-2 items-center" >
              <span class="border bg-gray-700 text-white border-gray-700 p-1 text-sm font-semibold">{{code}}</span>
              <h1 class="font-base font-bold text-gray-900">{{libelle}}</h1>
              <span  v-if="activite != undefined && isGotoLink " @click.stop="$emit('onlink')" title="obtenir le lien" class="text-green-500 absolute right-2 top-1"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" stroke="none"/></svg></span>
            </div>
          </div>
          <div class="my-2">
            <p v-if="activite != undefined" class="text-sm font-semibold py-1"> <span class="font-bold">Auteur :</span>  <span class="text-gray-700">{{activite}} </span> </p>
            <p v-if="activite != undefined" class="text-sm font-semibold py-1"> <span class="font-bold"></span> <span v-for="unite in unites" :key="unite.id" class="text-gray-700"> {{unite}} <i>/</i> </span>  </p>
          </div>
          <div class="my-2 flex justify-end absolute bottom-2 right-2 space-x-3">
            
            <span v-if="activite == undefined && activite == undefined " @click.stop="$emit('onlink')" title="obtenir le lien" class="text-green-500 "><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" stroke="none"/></svg></span>

            <span v-if="isUpdate" @click.stop="$emit('modifier')" class="text-blue-500 cursor-pointer ">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
            </span>
            <span v-if="isDelete" @click.stop="$emit('supprimer')" title="Supprimer" class="text-red-500 cursor-pointer"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M292.7 840h438.6l24.2-512h-487z"></path><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z"></path></svg></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['libelle','unites','code','activite','isDelete','isUpdate','isGotoLink'],
  data() {
    return {
      option:[
        {name:'supprimer'},
        {name:'modifier'},
        {name:'dupliquer'},
      ],
    }
  },
  methods: {
   
  }
}
</script>

<style>

</style>