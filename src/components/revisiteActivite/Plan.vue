<template>
  <div>
    
    <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
      <div class="flex items-center justify-between flex-wrap">
        <!--Filtre sur projet -->
        <div class="w-2/5 flex items-center space-x-2">
          <multiselect
            v-model="activiteFiltre"
            :options="results.activites"
            :preselect-first="true"
            placeholder="selectionnez une activite"
            label="nom"
            track-by="id">
          </multiselect>
        </div>   
      </div>
    </div>

    <div class="my-4 grid grid-cols-4 gap-2">
      <div v-for="(planDeDecaissement, index) in planDeDecaissements" :key="index">
        <card>
          <div class="p-2">
            <div class="flex justify-between">
                  <h1 class="font-base font-bold text-gray-900">
                    {{ planDeDecaissement.annee }}
                  </h1><!-- 
                  <div>
                     <dropdown
                      v-if="isUpdate && isDelete"
                      @modifier="modifierPlan(planDeDecaissement)"
                      @supprimer="supprimerPlan(planDeDecaissement)"
                      :option="optionActivite"
                    ></dropdown>
                     <dropdown
                       v-if="isUpdate && isDelete==false"
                      @modifier="modifierPlan(planDeDecaissement)"
                      @supprimer="supprimerPlan(planDeDecaissement)"
                      :option="optionActiviteUpdate"
                    ></dropdown>
                     <dropdown
                       v-if="!isUpdate && isDelete"
                      @modifier="modifierPlan(planDeDecaissement)"
                      @supprimer="supprimerPlan(planDeDecaissement)"
                      :option="optionActiviteD"
                    ></dropdown>
                  </div>
                  </div> -->
            </div>
            <div class="my-2">
              <p class="text-sm font-semibold py-1">
                <span class="font-bold">Activité :</span>
                <span class="text-gray-700"> {{ planDeDecaissement.activite.nom }} </span>
              </p>
              <p class="text-sm font-semibold py-1">
                <span class="font-bold">Trimestre :</span>
                <span class="text-gray-700"> {{ planDeDecaissement.trimestre }} </span>
              </p>
              <p class="text-sm font-semibold py-1">
                <span class="font-bold">Montant BN :</span>
                <span class="text-gray-700"> {{ planDeDecaissement.budgetNational }}</span>
              </p>
              <p class="text-sm font-semibold py-1">
                <span class="font-bold">Montant EPM-PRET :</span>
                <span class="text-gray-700"> {{ planDeDecaissement.pret }}</span>
              </p>
              <p class="text-sm font-semibold py-1">
                <span class="font-bold pr-2">De</span> {{ planDeDecaissement.debut }}
                <span class="font-bold px-2">Au</span> {{ planDeDecaissement.fin }}
              </p>
              <div class="flex justify-between">
                <div></div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script>

import Multiselect from "vue-multiselect";
import ModalTopRight from "@/components/ModalTopRight";
import Dropdown from "@/components/Dropdown";
import Card from "@/components/Card";
import { mapMutations } from "vuex";

export default {
  components: {
    ModalTopRight,
    Card,
    Multiselect,
    Dropdown,
  },
  props:['isDelete','isUpdate','results'],
  data() {
    return {
      planDeDecaissementAttributs : [ 'annee', 'trimestre', 'pret', 'budgetNational'],
      champs2:[
        {name: 'Année de base', key: "annee", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Trimestre', key: "trimestre", type: '', placeholdere: 'Selectionnez le trimestre du plan', isSelect: true, isTextArea: false, data:'', required: true, options: this.$store.state.trimestres, cle: 'valeur', value: 'trimestre',  errors : []},
        {name: 'Pret', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
        {name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data:'', required: true, errors : []},
      ],
      showModal2: false,

      optionActivite: [
        { name: "supprimer" },
        { name: "modifier" }
      ],
       optionActiviteUpdate: [
        { name: "modifier" }
      ],
       optionActiviteD: [
       
        { name: "modifier" }
      ],
    }
  },
  
  methods: {

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setPlanDeDecaissements: "planDeDecaissements/SET_LIST_PLAN_DE_DECAISSEMENT",
    }),

    activiteFiltre: function(valeur){
      if( valeur instanceof Activite || valeur instanceof Object )
      {

        this.planDeDecaissements = this.results['planDeDecaissements'].filter((value) => {
          if(value.activiteId === valeur.id) return value;
        })

      }
      else if( valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0 ){

        this.planDeDecaissements = this.results['planDeDecaissements'].filter((value) => {
          if(value.activiteId === valeur) return value;
        })
      }
      else{ 
        this.planDeDecaissements = [];
      }
    },

  },

  created() {
    
    this.activiteFiltre = this.results.activites[0]
  },

}
</script>

<style>

</style>