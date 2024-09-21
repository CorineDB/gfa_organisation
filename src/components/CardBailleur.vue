<template>
  <div>
    <div class=" flex" >
      <div  class="bg-white relative  shadow-lg border hover:border hover:border-gray-300 w-full hover:shadow-inner transition-shadow duration-300" style="max-height:350px" >
        <div class="p-2">
          <div class="flex justify-between items-center">
              <div class="flex space-x-2 items-center" >
                <span class="border bg-gray-700 text-white border-gray-700 p-1 text-sm font-semibold">{{sigle}}</span>
                <h1 class="font-base font-bold text-gray-900">{{libelle}}</h1>
              </div>
              <div>
                <dropdown @supprimer="$emit('supprimer')" @couverture="$emit('couverture')"  @modifier="$emit('modifier')"  @duplicate="$emit('dupliquer')" :option="option"></dropdown>
              </div>
          </div>
          <p class="text-justify font-semibold leading-6 text-sm my-2">{{description}}</p>
          <div class="my-2 flex justify-between">
            <p class="text-sm font-semibold bg-gray-700 text-white p-2 border border-gray-700 "> <span class="font-bold">Pays:</span> <span class="text-white">{{pays}}</span> </p>
            <p class="text-sm font-semibold bg-gray-700 text-white p-2 border border-gray-700 "> <span class="font-bold">Code :</span> <span class="text-white">{{codePTA}}</span> </p>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Dropdown from '@/components/Dropdown'
export default {
  props: ['sigle','libelle','description','pays','codePTA'],
  data() {
    return {
      option:[
        {name:'supprimer'},
        {name:'modifier'},
        {name:'couverture'},
        {name:'dupliquer'},
      ],
    }
  },
  components: {Dropdown}

}
</script>

<style>

</style>