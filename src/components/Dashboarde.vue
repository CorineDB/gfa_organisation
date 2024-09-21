<template>

  <div class="w-full">
    <!--Modal de filtre -->
    <div v-if="showModal ">
      <vmodal title="Filtre projet" v-on:close="showModal = false">
        <div class="px-6" style="width: 60vw !important">
          <vform template="default" isAllPairSaufDescrip="true" :champs="champsRecherche" submitText="Rechercher"
            @sendForm="filtre"></vform>
        </div>
      </vmodal>
    </div>
    <div v-if="showUpdateImage">
      <vmodal title="changer la couverture" v-on:close="showUpdateImage = false">
        <div style="width:500px" title="cliquer pour changer" @click="isChange = true" v-if="!isChange"
          class="cursor-pointer">
          <img v-if="images != null || images != undefined"
            class=" max-h-52 w-full object-cover transition-transform duration-300 transform group-hover:scale-100"
            :src="`${base_url}${images.url}`">
          <img v-else
            class=" max-h-52 w-full object-cover transition-transform duration-300 transform group-hover:scale-100"
            src="@/assets/images/login/logo-gouv.webp" alt="">
        </div>
        <div v-else class="px-6" style="width: 60vw !important">
          <vform template="default" :champs="champs" @getImage="getImage" submitText="Changer"
            :sendRequest="sendRequest" @sendForm="updateProjet">
          </vform>
        </div>
      </vmodal>
    </div>
    <div v-if="showUpdateFile">
      <vmodal title="televerser des documents" v-on:close="showUpdateFile = false">

        <div class="px-6" style="width: 60vw !important">
          <vform :sendRequest="sendRequest" template="default" :champs="champsFile" @getFile="getFile"
            submitText="Televerser" @sendForm="updateFile"></vform>
        </div>
      </vmodal>
    </div>
    <vmodal v-if="showPreview" @close="showPreview = false">
      <div style="width:60vw">
        <preview template="details-projet" :datas="datas" @previewFile="previewFile"></preview>
      </div>
    </vmodal>
    <!--Fin Modal de filtre -->

    

    <!--La navigation  -->
    <nav v-if="currentRole!='bailleur'" class="flex flex-row justify-between text-sm font-semibold"
      aria-label="Breadcrumb">
      <div>
        <ol class="inline-flex py-2 list-none">
          <li class="flex items-center text-blue-500">
            <router-link to="#" class="text-gray-600">dashboard</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center text-blue-500">
            <router-link to="/dashboard/projets" class="text-gray-600">projets</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center text-blue-500">
            <router-link to="/dashboard/projets" class="">projet</router-link>
          </li>
        </ol>
      </div>
      <div class="border border-gray-300 py-2 px-4 bg-white shadow text-xs">
        <router-link class="font-semibold" to="/dashboard/projets/composantes-globale">Composantes /
        </router-link>
        <router-link class="font-semibold" to="/dashboard/projets/activites-globale">Activités /</router-link>
        <router-link class="font-semibold" to="/dashboard/projets/taches-globale">Taches</router-link>
      </div>
    </nav>

    <!--Fin navigation -->

    <!--filte et button de modification  -->

    <div class="flex mt-5 items-center justify-between ">
      <div class="flex relative space-x-8">
        <!-- divide company -->
        <div :class="projet.couleur" :style="`background-color:${projet.couleur}`"
          class="font-bold px-4 text-white py-2 z-10">
          Bailleur : <span class="uppercase">{{projet.bailleur.sigle}}</span></div>
        <button  class="bg-nohot-orange-dark uppercase px-4 py-2 outiline-none z-10" @click="gotoCadreLogique">cadre logique</button>
        <span :class="projet.couleur" :style="`border-color:${projet.couleur}`"
          class="z-0 w-full absolute top-5 border-b-2"></span>
      </div>

      <div class="flex space-x-8">
        <div v-if="currentRole!='bailleur'" class="flex space-x-2 items-center">

          <button title="filtre" @click="showModal = true" class="bg-primary text-white p-2 hover:bg-gray-800"><i
              class="bx bxs-filter-alt bx-sm p-0" alt="Filtre"></i></button>

          <button @click="showUpdateImage=true" class="bg-blue-500 text-white outline-none p-2 hover:bg-gray-800"><i
              class="bx bx-image-add bx-sm p-0" alt="Changer image" aria-label="changer"></i></button>

          <button @click="showUpdateFile=true"
            class="bg-blue-500 text-white p-2 uppercase outline-none hover:bg-gray-800"><i
              class="bx bx-archive-out bx-sm p-0"></i></button>
        </div>

        <button @click="showPreview = true"
          class="text-white flex space-x-2 items-center bg-blue-500 px-4 py-2 hover:bg-gray-800">
          <i class="bx bx-folder bx-sm p-0" aria-label="Documents du projet"></i>
          <span>Dossiers</span>
        </button>
      </div>
      <!-- <div class="border border-gray-300 p-2 bg-white shadow">
          <router-link class="text-sm font-semibold" to="/dashboard/projets/composantes-globale">Composantes /</router-link>
          <router-link class="text-sm font-semibold" to="/dashboard/projets/activites-globale">Activités /</router-link>
          <router-link class="text-sm font-semibold" to="/dashboard/projets/taches-globale">Taches</router-link>
        </div> -->
    </div>

   

    <!-- <div class="flex justify-end">
        <button @click="showPreview = true" class="text-white flex space-x-2 items-center bg-blue-500 px-4 py-2 rounded-md">
          <span class="h-5 w-5  "><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"></path></svg></span>
          <span>Mes documents</span>
        </button>
      </div> -->

    <!--fin filte et button de modification  -->

    <!-- partie description et budgetaire  -->
    
    <div class="stat gap-2 mb-6 mt-8">
      <description :image="images" :projet="projet"></description>
      <budgetaire :projet="projet"></budgetaire>
    </div>
    <!-- fin partie description et budgetaire -->

    <!--  graphe et indicateurs -->
    <div class="stat2 my-6 gap-2 ">
      <graphes :projet="projet"></graphes>
      <indicateurs :suivis_indicateurs="projet.suivis_indicateurs"></indicateurs>
    </div>

    <!-- graphe et indicateurss -->

    <!--  partie env -->
    <div>
      <!-- <environnement></environnement> -->
    </div>
    <!-- fin  partie  env -->

    <!--  autre partie et map  -->
    <div class="grid my-3 grid-cols-2">
      <other-graphe></other-graphe>
      <div class="bg-white  p-2 shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31720.122491100385!2d2.470358215345265!3d6.3920254790700195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbj!4v1661191892386!5m2!1sen!2sbj"
          class="w-full h-full" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>


    <!--  fin autre partie et map  -->

  </div>

</template>

<script>
import SearchBar from "@/components/SearchBar";
import Titre from "@/components/Titre";
import Vtable from "@/components/Vtable";
import Vform from "@/components/Vform";
import Vmodal from "@/components/Vmodal";
import Budgetaire from '@/components/Budgetaire.vue';
import Description from '@/components/Description.vue';
import Preview from '@/components/Preview.vue';
import Graphes from '@/components/Graphes.vue';
import Indicateurs from '@/components/Indicateurs.vue';
import Environnement from '@/components/Environnement.vue';
import OtherGraphe from '@/components/OtherGraphe.vue';
import ProjetService from "@/services/modules/projet.service.js";
import FichierService from "@/services/modules/fichier.service.js";
import { API_BASE_URL } from "@/services/configs/environment.js";
import { mapGetters, mapActions, mapMutations, mapState} from "vuex";
export default {
  props: ['projet'],
  components: {
    Vtable,
    Vmodal,
    Vform,
    Titre,
    SearchBar,
    Description,
    Budgetaire,
    Graphes,
    Indicateurs,
    Environnement,
    OtherGraphe,
    Preview
  },
  data() {
    return {
      base_url: API_BASE_URL,
      showModal: false,
      sendRequest: false,
      showUpdateImage: false,
      showUpdateFile: false,
      isChange: false,
      currentRole: '',
      champs: [
        { name: 'couverture du projet', type: 'file', placeholdere: 'Choississez une couverture', isImage: true, isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
      ],
      champsFile: [
        { name: 'Televerser un document', type: 'file', placeholdere: 'televerser des fichiers', isSelect: false, isImage: false, isTextArea: false, data: '', required: false, errors: [] },
      ],
      image: {},
      fichiers: [],
      showPreview: false
    }
  },

  computed: {
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' }),
    datas() {
      if (this.projet != null || this.projet != undefined) {
        return this.projet.fichiers
      }
    },
    images() {
      if (this.projet != null || this.projet != undefined) {
        return this.projet.image
      }
    }
  },
  methods: {
    ...mapActions('projets', {
      detailsProjet: "GET_DETAILS_PROJET"
    }),
    gotoCadreLogique() {
      this.$router.push({name:'projets_id_cadreLogique',params:{id:this.$route.params.id}})
    },
    getFile(data) {
      for (const property in data) {
        this.fichiers.push(data[property])
      }
      this.fichiers.pop()
      this.fichiers.pop()
      this.fichiers = this.fichiers[0]
    },
    getImage(data) {
      this.image = data
      
    },
    updateProjet() {
      if (this.sendRequest === false) {
        this.sendRequest = true
        const id = this.projet.id
        const formData = new FormData();
        formData.append('image', this.image)
        ProjetService.update(id, formData).then(() => {
          this.$toast.success('La couverture à éte bien changer')
          this.sendRequest = false
          this.detailsProjet(this.projet.id).then((response) => {
            this.projet = response.data.data
            
          })
          this.showUpdateImage = false
        }).catch((error) => {
          if (error.response) {
            this.sendRequest = false
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
      }

    },
    updateFile() {
      if (this.sendRequest === false) {
        this.sendRequest = true
        const id = this.projet.id
        const formData = new FormData();
        formData.append('fichier', this.fichiers);
        formData.append('projetId', id)
        FichierService.create(formData).then(() => {
          this.$toast.success('televersement reuissi')
          this.sendRequest = false
         
          this.showUpdateFile = false
        }).catch((error) => {
          this.sendRequest = false
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
      }

    },
    save() {
     
      this.value.forEach(element => {
        this.usersId.push(element.id)
      })
      
      const formData = new FormData();
      formData.append('fichier', this.datasFiles)
      for (let i = 0; i < this.usersId.length; i++) {
        let file = this.usersId[i];
        formData.append('sharedId[]', file);
      }

      formData.append('autre', 'autre')
      if (this.chargement == false) {
        this.chargement = true
        FichierService.create(formData).then((data) => {
          this.chargement = false
          this.$toast.success('televersement reuissi')
          this.showModal = false
          this.getFiles()

        }).catch((e) => {
          this.chargement = false
          this.$toast.error(e)
        })
      }

    },
  },
  mounted() {
    if (this.currentUser != undefined) {
      this.currentRole = this.currentUser.type
     
    }

   
  }
};



</script>
<style scoped>
.stat {
  display: grid;
  grid-template-columns: 6fr 4fr;
}

.stat2 {
  display: grid;
  grid-template-columns: 7fr 5fr;
}
</style>