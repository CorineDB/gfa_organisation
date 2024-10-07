<template>
  <dashboard>
    <div class="w-full">
        <nav class="mb-2 mt-4 text-sm font-semibold flex justify-between items-center 	" aria-label="Breadcrumb">
          <div>
            <ol class="inline-flex p-0 list-none">
              <li class="flex items-center text-blue-500">
                <router-link to="#" class="text-gray-600">dashboard</router-link>
                <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li class="flex items-center ">
                <router-link to="" class="text-gray-600">Suivi tache </router-link>
              </li>
            </ol>
          </div>
          <div>
            <search-bar ></search-bar>
          </div>
        </nav> 
        
        <div v-if="showModal2">
          <modal-top-right  title="Filtre de suivi"  v-on:close="showModal2 = false">
            <div class="w-full">
              <vform template="default" isAllPairSaufDescrip="true" :champs="champsRecherche" :cols="cols" submitText="Rechercher" @sendForm="filtre" ></vform>
            </div>
          </modal-top-right>
        </div>

        <div class="flex items-center justify-between my-4">
          <titre>Le suivi tache  </titre>
          <div class="flex items-center space-x-4">
            <button @click="showModal2 = true" title="filtre" class="bg-primary text-white px-2 py-1"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg></button>
           
          </div>
        </div>
       
        <div class="flex mt-12 space-x-4 ">
          <div class=" w-1/3 bg-white shadow p-2">
            <div class="w-full">
              <div>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Tache</span> : {{taches.nom}} </p>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Bailleur</span> : {{taches.bailleur.sigle}} </p>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Code PTA</span> : {{taches.codePta}} </p>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Poids initial</span>:{{taches.poids}} </p>
     
              </div>
            </div>
          </div>
          <div class="datatable w-full bg-white shadow p-2 ">
            <vtable :headers="headers" :datas="dataTable"  ></vtable>
          </div>
        </div>    
    </div>
  </dashboard>

</template>

<script>
import ModalTopRight from '@/components/ModalTopRight'
import SearchBar from '@/components/SearchBar'
import Titre from '@/components/Titre'
import Vtable from '@/components/Vtable'
import Vform from '@/components/Vform'
import Vmodal from '@/components/Vmodal'
import Dashboard from '@/layouts/Dashboard'
import TacheService from "@/services/modules/tache.service.js";

export default {
  components: {
    Vtable,
    Dashboard,
    Vmodal,
    Vform,
    Titre,
    SearchBar,
    ModalTopRight
  },
  data() {
      return ({
        showModal2:false,
       
        champsRecherche:[
          {name:'Date de suivi',type:'date',placeholdere:"",isSelect:false,isTextArea:false,data:'',required:false,},
        ],
        cols:2,
        title:'',
        suivis:[],
        headers: [
          { name: "Tache", cle: "tache"},
          { name: "code pta", cle: "codePta"},
          { name: "poids initial", cle:'poidsInitial'},
          { name: "poids actuel", cle:'poidsActuel'},
          { name: "date de creation", cle:'created_at'},
        ],
        taches:[],
        dataTable:[],
        suivis:[],
      });
  },
 
  computed: {
   
    
  },
  
  methods: {
    getSuivi() {
      TacheService.mySuivis(this.$route.params.id).then((data) => {
        const datas = data.data.data
         datas.forEach(element => {
          const tache = element.tache.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({tache:tache,codePta:codePta,poidsInitial:poidsInitial,poidsActuel:poidsActuel,created_at:created_at})
        })
        console.log("les suiivs",this.dataTable)
      }).catch((e) => {
        console.log(e)
      })
    },
    currentTache() {
      TacheService.get(this.$route.params.id).then((data) => {
        this.taches= data.data.data
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  mounted() {
    this.getSuivi()
    this.currentTache()
  },
}
</script>

<style scoped>

</style>