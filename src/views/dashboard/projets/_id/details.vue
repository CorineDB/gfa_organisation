<template>
  <dashboard>
   <dashboarde :projet="projet"></dashboarde>
  </dashboard>
</template>

<script>

import Dashboard from "@/layouts/Dashboard";

import { mapGetters, mapActions, mapMutations, mapState} from "vuex";

import Dashboarde from '@/components/Dashboarde.vue';

import ProjetService from "@/services/modules/projet.service.js";

export default {
  components: {
    Dashboard,
    Dashboarde,
  },
  data() {
    return {
      showModal:false,
      projet: null,
      detailsProjetVisible:false,
    }
  },

  computed:{
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
  },

  methods: {
    ...mapActions('projets', {
      detailsProjet: "GET_DETAILS_PROJET"
    }),
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    detailsProjet(id) {
      this.active()
      ProjetService.statistiques(id).then((data) => {
        const datas = data.data.data
        this.projet= datas
        this.disabled()
      }).catch((error) => {
        this.disabled()
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
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if(element.slug ==='voir-details-projet') {
          this.detailsProjetVisible = true
        }  
      });
    },
  },

  created() {
    this.getPermission()
    if(!this.detailsProjetVisible) {
      this.$router.push('/401-non-autorise')
    }else {
      this.detailsProjet(this.$route.params.id)
    }
  },
};



</script>
<style scoped>

</style>