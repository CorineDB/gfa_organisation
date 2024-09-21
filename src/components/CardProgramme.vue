<template>
  <div>
    <div class=" flex" >
      <div  class="bg-white relative  shadow-lg border hover:border hover:border-gray-300 w-full hover:shadow-inner transition-shadow duration-300" style="max-height:350px" >
        <div class="p-2">
          <div class="flex justify-between items-center">
            <div class="">
              <h1 class="font-2xl font-bold uppercase text-gray-900">{{libelle}}</h1>
            </div>
          </div>
          <p class="text-sm font-semibold py-1">{{description}} </p>
          <div class="my-2">
            <p class="text-sm font-semibold py-1"> <span class="font-bold">Montant BN :</span>  <span class="text-gray-700">{{montantBN | formatNumber}} FCFA </span> </p>
            <p class="text-sm font-semibold py-1"> <span class="font-bold">Code PTA :</span> <span class="text-gray-700"> {{code}} </span> </p>
            <p class="text-sm font-semibold py-1"><span class="font-bold pr-2">De</span> {{dateDeb}} <span class="font-bold px-2">Au</span> {{dateFin}} </p>  
          </div>

          <div class="my-2 flex justify-end space-x-3">
            <span v-if="programmeUpdate" @click="$emit('modifier')" class="text-blue-500 cursor-pointer ">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
            </span>
            <span v-if="programmeDelete" @click="$emit('supprimer')" title="Supprimer" class="text-red-500 cursor-pointer"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M292.7 840h438.6l24.2-512h-487z"></path><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z"></path></svg></span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: ['libelle','description','code','montantBN','dateDeb','dateFin','programmeDelete','programmeUpdate'],
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