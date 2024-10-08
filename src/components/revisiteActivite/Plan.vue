<template>

</template>

<script>
import { mapMutations } from "vuex";

export default {
  components: {
    
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