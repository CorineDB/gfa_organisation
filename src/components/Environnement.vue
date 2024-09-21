<template>
  <div>
    <!--Modal de filtre -->
      <div v-if="showModal ">
        <vmodal title="Filtre données environnementale" v-on:close="showModal = false">
          <div class="px-6" style="width: 60vw !important">
            <vform
              template="default"
              isAllPairSaufDescrip="true"
              :champs="champs"
              :cols="cols"
              submitText="Rechercher"
              @sendForm="filtre"
            ></vform>
          </div>
        </vmodal>
      </div>
    <!--Fin Modal de filtre -->
    <div class="p-3 bg-primary  flex justify-between  ">
      <h2 class="uppercase text-white ">Données environnementales et sources   </h2>
      <div class="flex space-x-2 items-center">
        <button title="filtre" @click="showModal = true" class="bg-primary cursor-pointer text-white px-2 py-1">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
        <div>
          <input type="text"  placeholder="Rechercher..." class="px-2 text-sm  py-1 outline-none">
        </div>
        
      
      </div>
    </div>
      <div style="" class="relative  overflow-auto ">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase border-b border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="p-6">
                ENTREPRISE
              </th>
              <th scope="col" class="p-6">
                CHECKLIST
              </th>

              <th scope="col" class="p-6">
                STATUS
              </th>
              <th scope="col" class="p-6">
                  JUSTIFICATION
              </th>     
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td>
                entreprise {{i}}
              </td>
              <hover-ligne code="5555" libelle="lorem ipsum dolor"></hover-ligne>
              <td class="py-4 whitespace-nowrap text-green-500 px-6">
                  en cours
              </td>
              <td class="py-4 px-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, assumenda! 
              </td>
            </tr>
                      
          </tbody>
        </table>
      </div>
  </div>
</template>

<script>
import HoverLigne from "@/components/HoverLigne";
import Vform from "@/components/Vform";
import Vmodal from "@/components/Vmodal";
export default {
  components:{HoverLigne,Vform,Vmodal},
  data() {
    return {
      showModal:false,
       champs:[
          {name:'Bailleurs',key:'bailleurId',type:'',placeholdere:"Selectionnez le bailleur",isSelect:true,isTextArea:false,data:'',required:true,options:['BM'], cle: 'id', value: 'sigle',errors : []},
          {name:'Unite de mesure',key:'uniteeMesureId',type:'',placeholdere:"Selectionnez une unité de mesure",isSelect:true,isTextArea:false,data:'',options:['cm','mm'],required:true,cle: 'id', value:'nom',errors : []},
         
        ],
    }
  }
}
</script>


<style>

</style>