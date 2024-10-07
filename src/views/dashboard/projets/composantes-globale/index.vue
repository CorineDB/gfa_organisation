<template>
  <dashboard>
    <div  class="w-full">
     <!--  <div v-if="currentRole ==='bailleur'" class="w-full">
      <nav class="text-sm font-semibold flex justify-between items-center " aria-label="Breadcrumb">
        <div>
          <ol class="inline-flex p-0 list-none">
            <li class="flex items-center ">
              <router-link to="#" class="text-gray-600">dashboard</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center text-blue-500 ">
              <router-link to="/dashboard/projets" class="text-gray-600">projets</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center text-blue-500 ">
              <router-link to="/dashboard/projets/composantes-globale" class="">composantes</router-link>
            </li>
          </ol>
        </div>
        <div>
          <search-bar ></search-bar>
        </div>
      </nav>
      <div class="mb-0">
        <titre>Mes composantes</titre>
      </div>
       <div  class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
        <div v-for="(composante, index) in composantes" :key="index">
          <card-composante
            :libelle="composante.nom"
            :code="composante.code"
            :statut="getStatus(composante.statut)"
            :montantEPM="composante.pret"
            :position="composante.position"
            :poids="composante.poids"
            :bailleur="composante.sigle"
            @validation="validation(composante)"
            :isDelete = "false"
            :isUpdate="false"
          ></card-composante>
        </div>

      </div>
      </div> -->
      <div>
         <div v-if="composanteReVisible" class="select w-52 mb-2" >
          <select id="choice" v-model="version" @change="choiceVersion(version)" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg  focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2 ">
            <option value="" selected>Version actuelle</option>
            <option v-for="(scopePtab, index) in scopes" :key="index" :value="scopePtab.id"> {{scopePtab.nom}}</option>
          </select>
        </div>
        <div class="">
          <composante-current :valueProfondeur="null" v-if="currentPage"></composante-current>
          <revisite v-else :version="version"></revisite>
        </div>
      </div>
     
    </div>

  </dashboard>
</template>

<script>
import ComposanteCurrent from "@/components/ComposanteCurrent";
import Revisite from "@/components/revisiteC/revisite.vue";
import Dashboard from "@/layouts/Dashboard";
import { mapGetters, mapActions } from "vuex";
import CardComposante from '@/components/CardComposante.vue'
import SearchBar from '@/components/SearchBar.vue'
import Titre from '@/components/Titre.vue'
import  { getStringValueOfStatutCode }  from '@/utils/index'
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from '@/services/modules/composante.service';
export default {
  components: {
    Dashboard,
    ComposanteCurrent,
    CardComposante,
    SearchBar,
    Revisite,
    Titre,
  },
  data() {
    return {
      currentPage:true,
      version:'current',
      composanteVisible:false,
      version: "",
      scopes: [],
      currentRole:'',
      composantes:[],
      idProjet:'',
      composanteReVisible:false
     
    }
  },
  computed: {
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
  },

  methods: {

    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    validation(data) {
      const id = data.id
      const datas = {
        statut:-1,
        projetId:this.idProjet
      }
      ComposantesService.update(id,datas).then(() => {
       this.$toast.success('validation effectué')
      
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
              }
       
      })
    },
    getComposante(id) {
      this.active()
      ProjetService.composantes(id).then((data) => {
        const datas = data.data.data
        this.composantes = datas
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
    
    getStatus(status){
      return getStringValueOfStatutCode(status);
    },

    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),
      
      getPermission() {
        this.currentUser.role[0].permissions.forEach(element => {
            if(element.slug ==='voir-une-composante') {
              this.composanteVisible = true
            }
            if(element.slug ==='faire-revision-ptab') {
              this.composanteReVisible = true
            }
          });
      },

      choiceVersion(version) {
        if (this.scopes.length > 0) {
          if ("" === version) {
            this.currentPage = true;
          } else {
            this.currentPage = false;
          }
        } else {
          this.currentPage = true;
        }
      },
  },

  created() {
    
    if(this.currentUser.programme.id){
      this.currentRole = this.currentUser.type
      const bailleurInfo = JSON.parse(localStorage.getItem("bailleurInfo"));
      if (bailleurInfo) {
        const idProjet = bailleurInfo.id
        this.idProjet = idProjet
        this.getComposante(idProjet) 
      }else {
        this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
          this.scopes = response.data.data
        });
      }
     
    }
  },
  mounted() {
    this.getPermission()
    if(!this.composanteVisible) {
      this.$router.push('/401-non-autorise')
    } 
  }
};
</script>

<style></style>
