<template>
 
</template>

<script>


import ProjetService from "@/services/modules/projet.service.js";


import  { getStringValueOfStatutCode }  from '@/utils/index'
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
   
  },
  data() {
    return {
      currentPage:true,
      version:'current',
      composanteVisible:false,
      composanteReVisible:false,
      version: "",
      scopes: [],
      currentRole:'',
      sous_composantes:[],
      idComposante:'',
      composantes:[],
      value:''
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
    demoEcoute(value) {
      this.idComposante = value.id
      this.getSComposante(value.id)
    },

    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),
    customLabel ({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if(element.slug ==='voir-une-composante') {
            this.composanteVisible = true
          }
          if(element.slug ==='voir-revision-ptab') {
            this.composanteReVisible = true
          }
        });
    },
    getStatus(status){
      return getStringValueOfStatutCode(status);
    },
    validation(data) {
      const id = data.id
      const datas = {
        statut:-1,
        composanteId:this.idComposante
      }
      ComposanteService.update(id,datas).then(() => {
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
      ProjetService.composantes(id).then((data) => {
        const datas = data.data.data
        this.composantes = datas
        this.idComposante = datas[0].id
        this.getSComposante(datas[0].id)
       
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
    getSComposante(id) {
      this.active()
      ComposanteService.sousComposantes(id).then((data) => {
        const datas = data.data.data
        this.sous_composantes = datas
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
