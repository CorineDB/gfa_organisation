<template>
  <!-- cards Tâches -->
  <div @mouseenter="showValidate = true" @mouseleave="showValidate = false" style="height:250px" class="relative mb-4 lg:mb-0 ">
    <!-- dots -->
    
    <div class="absolute right-1 flex space-x-3 top-2 z-10 cursor-pointer">
      <span v-if="(this.statut.code == -2)" title="Activite non valider" class="text-red-300"><svg stroke="currentColor"
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

      <span v-else title="Activite valider" class="text-green-500"><svg stroke="currentColor"
          fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="2em" width="2em"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M2 15.5V2a2 2 0 012-2h8a2 2 0 012 2v13.5a.5.5 0 01-.74.439L8 13.069l-5.26 2.87A.5.5 0 012 15.5zm8.854-9.646a.5.5 0 00-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 10-.708.708l1.5 1.5a.5.5 0 00.708 0l3-3z"
            stroke="none" />
        </svg></span>

      <dropdown v-if="isDelete && isUpdate" @supprimer="$emit('supprimer')" @modifier="$emit('modifier')"
        @prolonger="$emit('prolonger')" @gotoNext="$emit('gotoNext')" :option="option"></dropdown>
      <dropdown v-if="isDelete && isUpdate == false" @supprimer="$emit('supprimer')" @modifier="$emit('modifier')"
        @prolonger="$emit('prolonger')" @gotoNext="$emit('gotoNext')" :option="optionD"></dropdown>
      <dropdown v-if="isUpdate && isDelete == false" @supprimer="$emit('supprimer')" @modifier="$emit('modifier')"
        @prolonger="$emit('prolonger')" @gotoNext="$emit('gotoNext')" :option="option"></dropdown>
    </div>

    <!-- dots -->
    <!-- cards Activités -->
    <div class="relative p-2 max-w-80 h-full bg-white sm:rounded-lg overflow-hidden">
      <!-- ./dots -->
      <div class="absolute uppercase flex space-x-2 items-center">
        <div class="bg-primary rounded-lg text-sm text-white px-3 py-1 font-semibold">
          <i class="bx bx-coin-stack mr-1"></i>
          <span>{{ bailleur }}</span>
        </div>

        <div v-if="((this.statut.code == -2) && showValidate)">
          <button title="Valider l' activite"  @click="validation(id)"
            class="bg-green-500 rounded-lg text-sm px-3 py-1 font-semibold text-white">
            Valider
          </button>
        </div>
      </div>
      <div class="cursor-pointer">

       

        <div v-if="statut.code >= -1 && statut.code <= 2">
          <span class="absolute bottom-7 right-0 _rounded-lg text-sm text-white  px-2 py-1 font-semibold"
            :class="statut.couleur">
            {{ statut.libelle }} <i class="bx bx-time-five ml-1"></i></span>
        </div>
        <p class=" text-normal text-sm font-medium text-gray-600 mt-16 mb-2 line-clamp-2 normal-case">
          {{ libelle }}
        </p>

        <div class="flex items-center  pt-2 text-gray-600 dark:text-gray-400 mb-1 border-t-2">
          <i class="bx bxs-pin bx-sm"></i>
          <div class="ml-4 text-sm  md:text-base tracking-wide font-semibold w-full truncate">
            S. Responsable :
            <span class="font-bold italic text-sm uppercase">
              {{ structureResponsable }}
            </span>
          </div>

        <div class="flex text-xs absolute cursor-pointer bottom-0  left-0 w-full bg-primary text-white font-bold px-8 py-1">
            <div title="suivre une activité"
              class="w-full cursor-pointer bg-primary text-white font-bold -ml-4  py-1 text-left">Code:
              {{code}}
            </div>
            <div title="suivre une activité"
              class="w-full cursor-pointer bg-primary text-white font-bold -mr-4 py-1 text-right">Poids:
              {{ poids }} 
            </div>
       </div>
      </div>

     
      <div v-for="(duree, index) in durees" :key="index">
        <p class=" mt-1 text-gray-600 dark:text-gray-400 mb-6">
          <span class="text-xs font-bold"><i class="bx bxs-calendar mr-1"></i> {{ duree.debut }}</span> au
          <span class="text-xs font-bold"><i class="bx bxs-calendar mr-1"></i> {{ duree.fin }} </span>
        </p>
      </div>       
      </div>
    </div>
  </div>

  <!-- End cards Tâches -->
</template>

<script>
import Dropdown from "@/components/Dropdown.vue";
import ActiviteService from '@/services/modules/activite.service';
export default {
  props: [
    "bailleur",
    "poids",
    "libelle",
    "montantNE",
    "montantEPM",
    "structureResponsable",
    "debut",
    "fin",
    "statut",
    "isDelete",
    "isUpdate",
    "code",
    "data",
    "durees"
  ],
  components: { Dropdown },
  data() {
    return {
      option: [
        { name: "supprimer" },
        { name: "modifier" },
        { name: "prolonger" },
        /*   { name: "continuer" }, */
      ],
      optionD: [
        { name: "supprimer" },
        /*   { name: "continuer" }, */
      ],
      optionUpdate: [
        { name: "modifier" },
        /*   { name: "continuer" }, */
      ],
      showValidate: false,
      delay: 700,
      clicks: 0,
      timer: null,
      showInput: false,
      isValidate: this.statut.code >= -1,
    };
  },
  methods: {
    suivreActivite() {
      this.clicks++;
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.clicks = 0
        }, this.delay);
      } else {
        clearTimeout(this.timer);
        this.showInput = true
        this.clicks = 0;
      }
    },
    validerSuivi(poids) {
      this.showInput = false
    },
    validation(data) {
      const params = {
        statut: -1,
        composanteId: this.data.composanteId
      }
      ActiviteService.update(this.data.id, params).then((data) => {
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
      this.$router.push({ name: 'dashboard_projets_activites_globale_details', params: { id: 1 } })
    }
  },
};
</script>

<style>

</style>
