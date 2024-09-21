<template>
  <div>
    <div class="relative flex" >
      <div class="bg-white relative  shadow-lg border hover:border hover:border-gray-300 w-full hover:shadow-inner transition-shadow duration-300" style="max-height:350px" >
        <div class=" p-2">
          <div class="flex justify-between items-center p-2">
            <div class="flex space-x-2 items-center" >
              <span class="border bg-primary text-white p-1 text-sm font-semibold">{{sigleBailleur}}</span>
              <h1 @click.stop="gotoNext" class="cursor-pointer font-base font-bold text-gray-900">{{libelle}}</h1>
            </div>
            <div>
              <dropdown @gotoNext="gotoNext" @modifier="modifier" :option="option"></dropdown>
            </div>
          </div>
          <div class="border-b border-gray-300 relative">
            <p class="text-justify p-2 font-semibold leading-6 text-sm my-2">{{description}}</p>
              <div class="absolute bottom-0 right-0">
                <span v-if="!isStateChange" @click.stop="isStateChange = true" :class="{'bg-green-500':status==='en cours','bg-red-500':status==='terminer','bg-yellow-500':status==='en attente'}"  class="text-white cursor-pointer  p-1">{{status}}</span>
                <select v-else  @change.stop="isStateChange = false" class="outine-none" name="" id="">
                  <option value="">cree</option>
                  <option value="">en attente</option>
                  <option value="">en cours</option>
                  <option value="">en terminer</option>
                </select>
            </div>
          </div> 
          <div class="my-2 p-2">
            <p class="text-sm font-semibold py-1 flex justify-between items-center"> 
              <span class="font-bold  ">Montant BN :</span> 
              <span class="text-gray-700">{{montantBN | formatNumber}}</span> 
            </p>
            <p class="text-sm font-semibold py-1 flex justify-between items-center"> 
              <span class="font-bold">Montant EPM-PRET :</span> 
              <span class="text-gray-700">{{montantEPM | formatNumber}}</span>
            </p>
            <div class="text-sm font-semibold py-1 flex justify-between items-center">
              <span class="font-bold pr-2">Durée :</span> 
              <p><span class="text-white bg-primary p-1 text-sm">{{dateDeb}}</span> Au   <span class="text-white border bg-primary p-1 text-sm">{{dateFin}} </span></p>  
            </div>
            <p class="text-sm font-semibold py-1 flex justify-between items-center "> 
              <span class="font-bold">Pays :</span> 
              <span class="text-gray-700">{{pays}}</span>
            </p>
          </div>
        </div>
        <div v-if="color !=undefined" class=" bottom-0 left-0 right-0 " :class="`${color} p-1`"></div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props:['color','sigleBailleur','libelle','description','status','montantBN','montantEPM','dateDeb','dateFin','pays'],
  data() {
    return {
      option:[
        {name:'details'},
        {name:'supprimer'},
        {name:'modifier'},
        {name:'dupliquer'},
        {name:'continuer'},
      ],
    }
  }
}
</script>

<style>

</style>