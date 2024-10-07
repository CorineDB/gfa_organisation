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
                <router-link to="" class="text-gray-600">Suivi indicateur </router-link>
              </li>
            </ol>
          </div>
          <div>
            <div class="w-full flex text-gray-600">
              <input @input="$emit('search',$event.target.value)" class="h-8 w-full px-5 text-sm bg-white border-2 border-gray-300 rounded-lg focus:outline-none relative -mr-9 block sm:block" v-model="search" type="text" name="search" placeholder="Rechercher" >
              <button type="submit" class="relative  p-2 rounded-lg">
              <svg class="w-4 h-4 text-gray-600 fill-current" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
                    viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve"
                    width="512px" height="512px">
                 <path
                    d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
             </button>
           </div>          </div>
        </nav> 
        
        <div v-if="showModal2">
          <modal-top-right  title="Filtre de suivi"  v-on:close="showModal2 = false">
            <div class="w-full">
              <vform template="default" isAllPairSaufDescrip="true" :champs="champsRecherche" :cols="cols" submitText="Rechercher" @sendForm="filtre" ></vform>
            </div>
          </modal-top-right>
        </div>

        <div class="flex items-center justify-between my-4">
          <titre>Suivi des indicateurs  </titre>
          <div class="flex items-center space-x-4">
            <json-excel :data="json_data" header="INDICATEUR SUIVI" type="xlsx" :name="title_csv()"  >
          <button  title="exporter en excel"   class="py-2  px-4 overflow-hidden  space-x-2 items-center text-xs font-semibold text-white uppercase bg-indigo-500 focus:outline-none focus:shadow-outline">
            <svg class="inline" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M11 16h2V7h3l-4-5-4 5h3z"></path><path d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z"></path></svg>
            <span class="mx-2 text-xs  md:text-sm font-semibold">Export Excel</span>
          </button>
          </json-excel>
         <!--  <button @click="showModal2 = true" title="filtre" class="bg-primary text-white px-2 py-1"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg></button> -->
           
          </div>
        </div>
       
        <div class="flex mt-12 space-x-4 ">
          <div class=" w-1/3 bg-white shadow p-2">
            <div class="w-full">
              <div>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Indicateur</span> : {{indicateur.nom}} </p>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Description</span> : {{indicateur.description}} </p>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Bailleur</span> : {{indicateur.bailleur.nom}} </p>
                <p v-if="indicateur.categorie != null" class=" text-sm   py-2"><span class="font-bold uppercase px-1">Categorie</span> : {{indicateur.categorie.nom}} </p>
                <p v-else class=" text-sm   py-2"><span class="font-bold uppercase px-1">Categorie</span> : Non definit </p>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Valeur de base </span>:{{indicateur.valeurDeBase}} </p>
                <p class=" text-sm   py-2"><span class="font-bold uppercase px-1">Unité de mesure  </span>:{{indicateur.unitee_mesure.nom}} </p>
              </div>
            </div>
          </div>
          <div class="datatable w-2/3 bg-white shadow p-2 ">
            <vtable :headers="headers" :datas="filteredSuivis"></vtable>
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
import IndicateurSuiviService from "@/services/modules/indicateur.suivi.service.js";
import IndicateurService from "@/services/modules/indicateur.service.js";
import JsonExcel from "vue-json-excel";
import forEach from 'ramda/src/forEach'

export default {
  components: {
    Vtable,
    Dashboard,
    Vmodal,
    Vform,
    Titre,
    SearchBar,
    ModalTopRight,
    JsonExcel
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
          { name: "Valeur realisé", cle: "valeurRealise",edit:false},
          { name: "Valeur cible", cle:'valeurCible',edit:false},
          { name: "Ecart", cle:'valeurEcart',edit:false},
          { name: "Valeur cumulée", cle:'valeurCumul',edit:false},
          { name: "Trimestre", cle:'trimestre',edit:false},
          { name: "Année suivi", cle:'anneeSuivi',edit:false},
          { name: "date de creation", cle:'created_at',edit:false},
        ],
        indicateur:[],
        dataTable:[],
        suivis:[],
        search:'',
      });
  },

  methods: {
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    getSuivi() {
      this.active()
      IndicateurSuiviService.mySuivis(this.$route.params.id).then((data) => {
        const datas = data.data.data
         datas.forEach(element => {
          const valeurRealise = element.valeurRealise[0]
          const valeurCible = element.valeurCible.valeurCible[0]
          const valeurCumul = element.valeurCible.valeurCible[0]
          const trimestre = element.trimestre
          const anneeSuivi = element.valeurCible.annee
          const valeurEcart =valeurRealise - valeurCible
          const created_at = element.created_at
          this.dataTable.push({valeurRealise:valeurRealise,valeurCible:valeurCible,valeurEcart:valeurEcart,valeurCumul:valeurCumul,trimestre:trimestre,anneeSuivi:anneeSuivi, created_at:created_at})
        }) 
       
        this.disabled()
      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
        this.disabled()
      })
    },
    
      title_csv() {
        return "suivi-indicateur-" + this.indicateur.nom + "-" + new Date()
      },
 
    currentTache() {
      IndicateurService.get(this.$route.params.id).then((data) => {
        this.indicateur= data.data.data
      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
      })
    }
  },
  computed:{
    json_data() { 
      const data = []
      if(this.dataTable != undefined || this.dataTable != null) {
        this.filteredSuivis.forEach(element => {
          if(this.indicateur != undefined || this.indicateur != null) {
           
            const indicateurs = this.indicateur
            const valeurRealise = element.valeurRealise
            const valeurCible = element.valeurCible
            const valeurCumul = ''
            const trimestre = element.trimestre
            const annee_de_Suivi = element.anneeSuivi
            const ecart =element.valeurEcart
            const date_de_creation = element.created_at
            const indicateur = indicateurs.nom
            const bailleurs = indicateurs.bailleur.nom
            const unitee_de_mesure = indicateurs.unitee_mesure.nom
            const commentaire = ""
            data.push({bailleurs,indicateur,unitee_de_mesure,valeurCible,valeurRealise,ecart,commentaire,date_de_creation})
          }
          
        });
        return data
        
      }
    },
    filteredSuivis(){
        var self = this;
        return this.dataTable.filter(function (suivi){
          return suivi.created_at.toLowerCase().indexOf(self.search.toLowerCase()) >= 0;
        });
    },
  },
  mounted() {
    this.currentTache()
    this.getSuivi()
    
  },
}
</script>

<style scoped>

</style>