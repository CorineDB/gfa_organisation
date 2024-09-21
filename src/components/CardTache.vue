<template>
  <!-- cards Tâches -->
  <div @mouseenter="showValidate = true" @mouseleave="showValidate = false" class="relative cursor-pointer mb-4 sm:mb-0">
    <!-- dot -->
    <div class="absolute flex space-x-1 right-1 top-2 z-10  cursor-pointer">
      <span v-if="(this.statut.code == -2)" title="Tâche non valider" class="text-red-300"><svg stroke="currentColor"
          fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="2em" width="2em"
          xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M0 0h24v24H0z" stroke="none" />
          <path d="M21 19.1H3V5h18v14.1zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
            stroke="none" />
          <path fill="none"
            d="M21 19.1H3V5h18v14.1zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
            stroke="none" />
          <path
            d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41z"
            stroke="none" />
        </svg></span>
      <span v-else title="Tâche valider" class="text-green-500"><svg stroke="currentColor"
          fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="2em" width="2em"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M2 15.5V2a2 2 0 012-2h8a2 2 0 012 2v13.5a.5.5 0 01-.74.439L8 13.069l-5.26 2.87A.5.5 0 012 15.5zm8.854-9.646a.5.5 0 00-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 10-.708.708l1.5 1.5a.5.5 0 00.708 0l3-3z"
            stroke="none" />
        </svg></span>
      <dropdown v-if="isDelete && isUpdate" @commentaire="$emit('commentaire')" @supprimer="$emit('supprimer')"
        @modifier="$emit('modifier')" @suivre="$emit('suivre')" @suivreOld="$emit('suivreOld')" @prolonger="$emit('prolonger')" :option="option">
      </dropdown>
      <dropdown v-if="isDelete && !isUpdate" @commentaire="$emit('commentaire')" @supprimer="$emit('supprimer')"
        @suivre="$emit('suivre')" @suivreOld="$emit('suivreOld')" @prolonger="$emit('prolonger')" :option="optionD"></dropdown>
      <dropdown v-if="!isDelete && !isUpdate" @commentaire="$emit('commentaire')" @modifier="$emit('modifier')"
        @suivre="$emit('suivre')" @suivreOld="$emit('suivreOld')" @prolonger="$emit('prolonger')" :option="optionUpdate"></dropdown>
    </div>
    <!-- dot -->
    <div class="relative bg-white sm:rounded-lg overflow-hidden ">
      <div class="p-2">
        <div class="uppercase flex space-x-2 items-center ">
          <div class="bg-primary rounded-lg text-sm text-white px-3 py-1 font-semibold ">
            <i class='bx bx-coin-stack mr-1'></i>
            <span> {{ bailleur }} </span>
          </div>

          <div v-if="((this.statut.code == -2) && showValidate)">
            <button title="Valider la tâche"  @click="validation(id)"
              class="bg-green-500 rounded-lg text-sm px-3 py-1 font-semibold text-white">
              Valider
            </button>
          </div>
          <div v-else>
             <!--
            <button v-if="(statut.code == 1 || statut.code == 0 || statut.code== -1)  && !isSuivi && !isDone" title="suivre tache"
              @click="validerSuivi(id)"
              class="bg-purple-500 text-white animation rounded-lg text-sm px-3 py-1 font-semibold ">
              suivre
            </button>
            <button v-if="(statut.code == 1 || statut.code == 0 || statut.code== -1)  && !isSuivi && !isDone" title="suivre tache anterieur"
            @click="$emit('suivreOld')"
              class="bg-red-500 text-white animation rounded-lg text-sm px-3 py-1 font-semibold ">
            suivie anterieur
            </button>
            -->
            <button title="suivre tache" v-if="statut.code == 2"
              class="bg-gray-500 text-gray-300  rounded-lg text-sm px-3 py-1 font-semibold ">
              effectuée
            </button>
          </div>
        </div>
         
        <!--  -->
        <div class="cursor-pointer text-sm">
          <p class="my-2 uppercase text-sm font-medium text-gray-600 mt-8 line-clamp-2 ">{{ libelle }}
          </p>
          <!-- <div class="flex items-center mt-2 pt-2 text-gray-600 dark:text-gray-400 border-t-2">
            <i class='bx bxs-wallet bx-sm'></i>
            <div class="ml-4 text-sm tracking-wide font-semibold w-4/6 truncate">EMP :
              <span class="font-bold italic text-lg"> {{ montantEPM }} </span><span
                class="ml-2 uppercase font-bold">fcfa</span>
            </div>
          </div>
          <div class="flex items-center mt-1 text-gray-600 dark:text-gray-400 mb-2">
            <i class='bx bxs-wallet bx-sm'></i>
            <div class="ml-4 text-sm tracking-wide font-semibold w-4/6 truncate">BN :
              <span class="font-bold italic text-lg"> {{ montantNE }} </span>
              <span class="ml-2 uppercase font-bold">fcfa</span>
            </div>
          </div> -->
          <div v-for="(duree, index) in durees" :key="index">
            <p class=" mt-1 text-gray-600 dark:text-gray-400 mb-6">
              <span class="text-xs font-bold"><i class="bx bxs-calendar mr-1"></i> {{ duree.debut }}</span> au
              <span class="text-xs font-bold"><i class="bx bxs-calendar mr-1"></i> {{ duree.fin }} </span>
            </p>
          </div>       
        </div>
      </div>
      <div v-if="statut.code >= -1 && statut.code <= 2" class="text-right">
        <span class="text-white  px-2 py-1 text-sm font-semibold"
          :class="statut.couleur"><i class="bx bx-time-five"></i>
          {{ statut.libelle }} </span>
      </div>
      <div class="flex text-xs">
        <div title="suivre une activité"
          class="w-full _cursor-pointer bg-primary text-white font-bold px-4 py-1 text-left">Code:
          {{ codePta }} 
        </div>
        <div title="suivre une activité"
          class="w-full _cursor-pointer bg-primary text-white font-bold px-4 py-1 text-right">Poids:
          {{ poids }} 
        </div>
      </div>
    </div>
  </div>
  <!-- End cards Tâches -->
</template>

<script>
import TacheService from "@/services/modules/tache.service.js";
import Dropdown from '@/components/Dropdown.vue'
export default {
  props: [
    "bailleur",
    "poids",
    "poidsActuel",
    "libelle",
    "montantNE",
    "montantEPM",
    "structureResponsable",
    "debut",
    "fin",
    "codePta",
    "statut",
    "durees",
    "id",
    "isDelete",
    "isUpdate",
    "isSuivi"
  ],
  components: { Dropdown },
  data() {
    return {
      option: [
        { name: "supprimer" },
        { name: "modifier" },
        { name: "prolonger" },
        { name: "commenter" },
      ],
      optionUpdate: [
        { name: "modifier" },
        { name: "prolonger" },
        { name: "commenter" },

      ],
      optionD: [
        { name: "modifier" },
        { name: "prolonger" },
        { name: "commenter" },
        /*  { name: "mes suivis" }, */
      ],
      showValidate: false,
      delay: 700,
      clicks: 0,
      timer: null,
      showInput: false,
      isDone: false,
      isValidate: null,
    }
  },
  methods: {

    /* suivreTache(poids) {
      this.clicks++;
      if (this.clicks === 1) {
        this.timer = setTimeout( () => {
        this.clicks = 0
      }, this.delay);
      } else {
        clearTimeout(this.timer);  
        this.showInput = true
        this.clicks = 0;
      }      
    }, */

    validerSuivi(id) {

      const data = {
        tacheId: id
      }
      this.isDone = true
      TacheService.suiviTache(data).then((data) => {
       
      }).catch((e) => {
        if (e.response) {
          const errors = {}
          // Requête effectuée mais le serveur a répondu par une erreur.
          //const message = error.response.data.message
          const errorMessage = e.response.data.errors
          if (errorMessage != undefined) {
            alert(errorMessage.poidsActuel[0])
          }

        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }
      })

    },
    validation(id) {
      const params = {
        statut: -1
      }
      TacheService.update(id, params).then((data) => {
        this.$emit('validation')
      }).catch((e) => {
        if (e.response) {
          this.$toast.error('erreur de validation')

        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }
      })
    },

    gotoDetail() {
      this.$router.push({ name: '/dashboard/projets/taches-globale/:id/details', params: { id: 1 } })
    }
  },
  mounted() {
    this.isValidate = this.statut.code >= -1
  }
}
</script>

<style scoped >
.animation {
  animation: vibration infinite .3s;
}

@keyframes vibration {
  to {
    transform: rotate(0deg);
    transition: all 0.3s ease-in-out;
  }

  from {
    transform: rotate(3deg);
    transition: all 0.3s ease-in-out;
  }
}
</style>