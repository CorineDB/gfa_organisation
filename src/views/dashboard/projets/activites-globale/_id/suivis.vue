<template>
  

</template>

<script>

import ActiviteService from "@/services/modules/activite.service.js";

export default {
  components: {
    
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
          { name: "Activite", cle: "activite"},
          { name: "code pta", cle: "codePta"},
          { name: "poids initial", cle:'poidsInitial'},
          { name: "poids actuel", cle:'poidsActuel'},
          { name: "date de creation", cle:'created_at'},
        ],
        activite:[],
        dataTable:[],
        suivis:[],
      });
  },
 
  computed: {
   
    
  },
  
  methods: {
    getSuivi() {
      ActiviteService.mySuivis(this.$route.params.id).then((data) => {
        const datas = data.data.data
         datas.forEach(element => {
          const activite = element.activite.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({activte:activite,codePta:codePta,poidsInitial:poidsInitial,poidsActuel:poidsActuel,created_at:created_at})
        })
        console.log("les suiivs",this.dataTable)
      }).catch((e) => {
        console.log(e)
      })
    },
    currentActivite() {
      ActiviteService.get(this.$route.params.id).then((data) => {
        this.activite= data.data.data
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  mounted() {
    this.getSuivi()
    this.currentActivite()
  },
}
</script>

<style scoped>

</style>