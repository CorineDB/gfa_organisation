<template>

</template>

<script>
import indicateurService from "@/services/modules/indicateur.service.js";
import objectifSpecifiqueService from "@/services/modules/objectif.specifique.service.js";
import objectifGlobaux from "@/services/modules/objectif.global.service.js";
import ResultatService from "@/services/modules/resultat.service.js";
import CadreLogiqueService from "@/services/modules/cadre.logique.service.js";

export default {
  components: {
   
  },
  data() {
    return {
      showModal: false,
      showModal2: false,
      title: "",
      global_disable: false,
      specific_disable: false,
      result_disable: false,
      checkbox: false,
      isObjectif: true,
      isObjectifGlobale: false,
      isResultat: false,
      cadreLogique: {
        nom: '',
        description: '',
        indicateurId: ''
      },
      editCadreLogique: {
        nom: '',
        description: '',
        indicateurId: '',

      },

      indicateurs: [],
      cols: 1,

      headers: [],
      cadreLogique: [],
      chargement: false,
      objectifGlobals: [],
      objectifSpecifiques: [],
      resultats: [],
      deleteModal1: false,
      deleteModal2: false,
      deleteModal3: false,
      deleteData: {}
    };
  },
  computed: {

  },

  mounted() {
    this.getCadreLogique()
    this.getIndicateur()
    this.headers = [
      { name: "Nom", cle: "nom" },
      { name: "Description du projet", cle: "description" },
      { name: "Indicateurs", props: 'indicateur', cle: "nom" },
      { name: "Sources de vérification", props: 'indicateur', cle: "sourceDeVerification" },
      { name: "Hypothèse", props: 'indicateur', cle: "hypothese" },

    ]
  },
  methods: {
    sendForm() {
      if (this.chargement == false) {

        this.chargement = true
        const data = this.cadreLogique
        data.indicateurId = data.indicateurId.id
        data.projetId = this.$route.params.id
        if (this.isObjectif) {

          objectifSpecifiqueService.create(data).then((data) => {
            this.chargement = false
            this.$toast.success('nouveau element')
            this.showModal = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        } else if (this.isObjectifGlobale) {
          objectifGlobaux.create(data).then((data) => {
            this.chargement = false
            this.$toast.success('nouveau element')
            this.showModal = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        } else  {
          ResultatService.create(data).then((data) => {
            this.chargement = false
            this.$toast.success('element modifié')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        }


      }
    },
    check1() {
      this.isObjectif = true
      this.isObjectifGlobale = false
      this.isResultat = false
    },
    check2() {
      this.isObjectif = false
      this.isObjectifGlobale = true
      this.isResultat = false
    },
    check3() {
      this.isObjectif = false
      this.isObjectifGlobale = false
      this.isResultat = true
    },
    save() {
      this.$emit("sendForm");
    },

    close() {
      this.showModal = false;
      this.showModal2 = false;
    },
    ajouter() {
      this.title = "Ajouter un cadre logique";
      this.showModal = true;
    },
    modifier1(data) {

      this.isObjectifGlobale = true;
      this.isObjectif = false;
      this.isResultat = false;
      this.title = "Modifier un objectif global";
      this.showModal2 = true;
      this.specific_disable = true
      this.result_disable = true
      this.global_disable = false,
      this.editCadreLogique.nom = data.nom
      this.editCadreLogique.description = data.description
      this.editCadreLogique.id = data.id
      this.editCadreLogique.indicateurId = data.indicateur

    },
    modifier2(data) {

      this.isObjectifGlobale = false;
      this.isObjectif = true;
      this.isResultat = false;
      this.title = "Modifier un objectif spécifique";
      this.showModal2 = true;
      this.global_disable = true,
      this.result_disable = true,
      this.specific_disable = false
      this.editCadreLogique.nom = data.nom
      this.editCadreLogique.description = data.description
      this.editCadreLogique.id = data.id
      this.editCadreLogique.indicateurId = data.indicateur

    },
    modifier3(data) {
      this.isObjectif = false;
      this.isObjectifGlobale = false;
      this.isResultat = true;
      this.title = "Modifier un résultat";
      this.showModal2 = true;
      this.result_disable = false,
      this.global_disable = true, 
      this.specific_disable = true
      this.editCadreLogique.nom = data.nom
      this.editCadreLogique.description = data.description
      this.editCadreLogique.id = data.id
      this.editCadreLogique.indicateurId = data.indicateur

    },


    editForm() {
      if (this.chargement == false) {

        this.chargement = true
        const data = this.editCadreLogique
        data.indicateurId = this.editCadreLogique.indicateurId.id
        data.projetId = this.$route.params.id

        console.log(this.isResultat)

        if (this.isObjectifGlobale) {
          objectifGlobaux.update(data.id, data).then((data) => {
            this.chargement = false
            this.$toast.success('élément modifier')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null
          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        } else if (this.isObjectif) {
          objectifSpecifiqueService.update(data.id, data).then((data) => {
            this.chargement = false
            this.$toast.success('élément modifier')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null
          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        }else if(this.isResultat) {
          
          ResultatService.update(data.id , data).then((data) => {
            this.chargement = false
            this.$toast.success('nouveau element')
            this.showModal2 = false
            this.getCadreLogique()
            this.cadreLogique.nom = ''
            this.cadreLogique.description = ''
            this.cadreLogique.indicateurId = null

          }).catch((e) => {
            this.chargement = false
            this.$toast.error(e)
          })
        }

      }
    },


    supprimer(data) {
      alert(data + " à ete bien supprimer");
    },
    getCadreLogique() {
      CadreLogiqueService.get(this.$route.params.id).then((data) => {
        this.cadreLogique = data.data.data
        this.objectifGlobals = this.cadreLogique.objectifGlobaux,
          this.objectifSpecifiques = this.cadreLogique.objectifSpecifique
        this.resultats = this.cadreLogique.resultat
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
    },
    getIndicateur() {
      indicateurService.get().then((data) => {
        this.indicateurs = data.data.data
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
    },
    supprimer1(objectifGlobaux, index) {
      this.deleteModal1 = true
      this.deleteData.data = objectifGlobaux
      this.deleteData.index = index
    },
    supprimer2(objectifSpecifique, index) {
      this.deleteModal2 = true
      this.deleteData.data = objectifSpecifique
      this.deleteData.index = index
    },
    supprimer3(resultat, index) {
      this.deleteModal3 = true
      this.deleteData.data = resultat
      this.deleteData.index = index
    },

    delete1(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal1 = false
      objectifGlobaux.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getCadreLogique()
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
    delete2(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal2 = false
      objectifSpecifiqueService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getCadreLogique()

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
    delete3(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal3 = false
      ResultatService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getCadreLogique()

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
  },
};
</script>

<style scoped>

</style>
