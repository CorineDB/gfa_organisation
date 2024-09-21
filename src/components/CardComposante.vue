<template>
  <div @mouseenter="showValidate = true" @mouseleave="showValidate = false" class="relative mb-4  sm:mb-0">
    <div class="absolute flex space-x-3 right-1 top-2 z-10  cursor-pointer">
      <span v-if="(this.statut.code == -2)"
        :title="composanteName != undefined ? composanteName.concat(' non valider') : 'Composante non valider'"
        class="text-red-300"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
          height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
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

      <span v-else
        :title="composanteName != undefined ? composanteName.concat(' valider') : 'Composante valider'"
        class="text-green-500"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16"
          height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M2 15.5V2a2 2 0 012-2h8a2 2 0 012 2v13.5a.5.5 0 01-.74.439L8 13.069l-5.26 2.87A.5.5 0 012 15.5zm8.854-9.646a.5.5 0 00-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 10-.708.708l1.5 1.5a.5.5 0 00.708 0l3-3z"
            stroke="none" />
        </svg></span>

      <dropdown v-if="isDelete && isUpdate" @supprimer="$emit('supprimer')" @gotoNext="$emit('gotoNext')"
        @modifier="$emit('modifier')" :option="option"></dropdown>
      <dropdown v-if="isDelete && isUpdate == false" @supprimer="$emit('supprimer')" @gotoNext="$emit('gotoNext')"
        :option="optionD"></dropdown>
      <dropdown v-if="isUpdate && isDelete == false" @modifier="$emit('modifier')" @gotoNext="$emit('gotoNext')"
        :option="optionUpdate"></dropdown>
    </div>
    <!-- cards composantes -->
    <div class="relative bg-white sm:rounded-lg overflow-hidden ">
      <div class="p-2">
        <div class="absolute uppercase flex space-x-2 items-center">
          <div class="bg-primary rounded-lg text-sm text-white px-3 py-1 font-semibold ">
            <i class='bx bx-coin-stack mr-1'></i>
            <span>{{ bailleur }}</span>
          </div>

          <div v-if="((this.statut.code == -2) && showValidate)">
            <button
              :title="composanteName != undefined ? 'Valider la '.concat(composanteName) : 'Valider la composante'"
               @click="validation"
              class="bg-green-500 rounded-lg text-sm   px-3 py-1 font-semibold text-white">Valider</button>
          </div>
        </div>

        <div v-if="statut.code >= -1 && statut.code <= 2">
          <span class="absolute bottom-6 right-0  text-sm text-white px-2 py-1 font-semibold"
            :class="statut.couleur"> {{ statut.libelle }}<i class='bx bx-time-five ml-1'></i></span>
        </div>

        <p class="my-2 uppercase text-sm font-medium text-gray-600 mt-16 line-clamp-2">
          <!--<span class="font-bold italic">
          <span class="underline mr-2">{{ composanteName !== undefined ? composanteName : 'COMPOSANTE' }}</span> {{ position }} :</span>-->
          {{ libelle }}
        </p>
        <div class="flex items-center mt-1 text-gray-600 dark:text-gray-400 mb-6">
          <i class='bx bxs-wallet bx-xs'></i>
          <div class="ml-2 text-xs tracking-wide font-semibold w-4/6 truncate">EMP : <span
              class="font-bold italic text-sm">{{ montantEPM | formatNumber }}</span><span class="ml-2 uppercase font-bold">fcfa</span>
          </div>
        </div>
      </div>
      <div class="flex text-xs">
        <div title="suivre une activité"
          class="w-full _cursor-pointer bg-primary text-white font-bold px-4 py-1 text-left">Code:
          {{ code }} </div>
        <div title="suivre une activité"
          class="w-full _cursor-pointer bg-primary text-white font-bold px-4 py-1 text-right">Poids:
          {{ poids }} </div>

          
      </div>
      <!-- <span title="suivre une activité"
        class="cursor-pointer bottom-0 left-0 w-full bg-primary h-10 text-white font-bold leading-3 px-8 py-3 text-right">Poids
        : {{ poids }} </span> -->
    </div>
  </div>
  <!-- End cards composantes -->
</template>

<script>
import ComposanteService from "@/services/modules/composante.service.js";
import Dropdown from '@/components/Dropdown.vue'
export default {
  components: { Dropdown },
  props: ['libelle', 'code', 'data', 'isComposante', 'montantEPM', 'position', 'bailleur', 'poids', 'composanteName', 'statut', 'isDelete', 'isUpdate'],
  data() {
    return {
      option: [
        { name: "supprimer" },
        { name: "modifier" },
        /*  { name: "continuer" }, */
      ],
      optionUpdate: [
        { name: "modifier" },
        /*  { name: "continuer" }, */
      ],
      optionD: [
        { name: "supprimer" },
        /*  { name: "continuer" }, */
      ],
      showValidate: false,
      showValidate: false,
      delay: 700,
      clicks: 0,
      timer: null,
      showInput: false,
      isValidate: false,
    }
  },
  methods: {
    suivreComposant(poids) {
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
    validation() {
      let params = {}
      
      if (this.isComposante) {
        params = {
          statut: -1,
          projetId: this.data.projetId,

        }
      } else {
        params = {
          statut: -1,
          composanteId: this.data.composanteId
        }
      }

      ComposanteService.update(this.data.id, params).then((data) => {
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

  },
  mounted() {
    this.isValidate = this.statut.code >= -1
  }
}
</script>

<style>

</style>