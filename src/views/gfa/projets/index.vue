<template>
  <!-- Modal Overlay -->
  <div class="col-span-12 _lg:col-span-7 _2xl:col-span-8">
      <div class="grid grid-cols-12 gap-5">
        <div
          v-for="(faker, fakerKey) in $_.take($f(), 9)"
          :key="fakerKey"
          class="intro-y col-span-12 sm:col-span-6 2xl:col-span-4"
        >
          <div class="box">
            <div class="p-5">
              <div
                class="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10"
              >
                <img
                  alt="Midone - HTML Admin Template"
                  class="rounded-md"
                  :src="faker.images[0]"
                />
                <template v-if="faker.trueFalse[0]">
                  <span
                    class="absolute top-0 bg-pending/80 text-white text-xs m-5 px-2 py-1 rounded z-10"
                    >Featured</span
                  >
                </template>
                <div class="absolute bottom-0 text-white px-5 pb-6 z-10">
                  <a href="" class="block font-medium text-base">{{
                    faker.products[0].name
                  }}</a>
                  <span class="text-white/90 text-xs mt-3">{{
                    faker.products[0].category
                  }}</span>
                </div>
              </div>
              <div class="text-slate-600 dark:text-slate-500 mt-5">
                <div class="flex items-center">
                  <LinkIcon class="w-4 h-4 mr-2" /> Price: ${{
                    faker.totals[0]
                  }}
                </div>
                <div class="flex items-center mt-2">
                  <LayersIcon class="w-4 h-4 mr-2" /> Remaining Stock:
                  {{ faker.stocks[0] }}
                </div>
                <div class="flex items-center mt-2">
                  <CheckSquareIcon class="w-4 h-4 mr-2" />
                  Status: {{ faker.trueFalse[0] ? "Active" : "Inactive" }}
                </div>
              </div>
            </div>
            <div
              class="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400"
            >
              <a
                class="flex items-center text-primary mr-auto"
                href="javascript:;"
              >
                <EyeIcon class="w-4 h-4 mr-1" /> Preview
              </a>
              <a class="flex items-center mr-3" href="javascript:;">
                <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
              </a>
              <a
                class="flex items-center text-danger"
                href="javascript:;"
                @click="deleteConfirmationModal = true"
              >
                <Trash2Icon class="w-4 h-4 mr-1" /> Delete
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- BEGIN: Pagination -->
      <div
        class="intro-y col-span-11 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6"
      >
        <nav class="w-full sm:w-auto sm:mr-auto">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" href="#">
                <ChevronsLeftIcon class="w-4 h-4" />
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">
                <ChevronLeftIcon class="w-4 h-4" />
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">...</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">1</a>
            </li>
            <li class="page-item active">
              <a class="page-link" href="#">2</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">3</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">...</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">
                <ChevronRightIcon class="w-4 h-4" />
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">
                <ChevronsRightIcon class="w-4 h-4" />
              </a>
            </li>
          </ul>
        </nav>
        <select class="w-20 form-select box mt-3 sm:mt-0">
          <option>10</option>
          <option>25</option>
          <option>35</option>
          <option>50</option>
        </select>
      </div>
      <!-- END: Pagination -->
    </div>


</template>

<script>


import ProgrammeService from "@/services/modules/programme.service.js";
import ProjetService from "@/services/modules/projet.service.js";
import BailleurService from "@/services/modules/bailleur.service";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { API_BASE_URL } from "@/services/configs/environment.js";
import { extractFormData } from '@/utils/index'

export default {
  components: {
   
  },
  data() {
    return {
      savedInput: [],
      base_url: API_BASE_URL,
      showModal: false,
      showSearch: false,
      line: false,
      dates: { fin: '' },
      isUpdate: false,
      submitText: "Enregistrer",
      cols: 1,
      mosaique: true,
      programmeId: this.currentUser?.programme?.id,
      showProlonger: false,
      chargement: false,
      projetId: '',
      title: '',
      search: "",
      projetAttributs: ['nom', 'description', 'debut', 'fin', 'objectifGlobaux', 'budgetNational', 'pret', 'couleur', 'ville', 'bailleurId', 'tauxEngagement'],
      projetAttributsUpdate: ['nom', 'description', 'debut', 'fin', 'objectifGlobaux', 'budgetNational', 'pret', 'couleur', 'ville', 'tauxEngagement'],
      champs: [],
      champsUpdate: [],
      option: [
        { name: "supprimer" },
        { name: "modifier" },
        { name: "prolonger" },
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
      projetId: '',
      projetVisible: false,
      projetAdd: false,
      projetDelete: false,
      projetUpdate: false,
      dashboardProjetVisible: false,
      bailleurVisible: false,
      validation: false,
      sendRequest: false,
      fichiers: [],
      image: {},
      projets: [],
      bailleurs: [],
      deleteData: {},
      deleteModal: false,

    }

  },

  computed: {

    //importation des variables du module auths
    ...mapState({
      identifiant: state => state.auths.identifiant,
      projet: state => state.projets.projet,
      loading: state => state.loading,
      errors: state => state.errors
    }),

    ...mapGetters({
      projet: "getProjet",
      //bailleurs: "bailleurs/getBailleurs",
      currentUser: 'auths/GET_AUTHENTICATE_USER'
    }),
    filteredProjet() {
      var self = this;
      return this.projets.filter(function (projet) {
        return projet.bailleur.sigle.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          projet.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          projet.codePta.toLowerCase().indexOf(self.search.toLowerCase()) >= 0;
      });
    },

  },

  methods: {
    getFile(data) {
      this.champs[7].data = data
      for (const property in data) {
        this.fichiers.push(data[property])
      }
      this.fichiers.pop()
      this.fichiers.pop()


    },
    getImage(data) {
      this.champs[6].data = data
      this.image = data

    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-un-projet') {
          this.projetVisible = true
        }
        if (element.slug === 'creer-un-projet') {
          this.projetAdd = true
        }
        if (element.slug === 'modifier-un-projet') {
          this.projetUpdate = true
        }
        if (element.slug === 'supprimer-un-projet') {
          this.projetDelete = true
        }
        if (element.slug === 'voir-details-projet') {
          this.dashboardProjetVisible = true
        }
        if (element.slug === 'voir-un-bailleur') {
          this.bailleurVisible = true
        }
        if (element.slug === 'validation') {
          this.validation = true
        }

      });
    },
    prolonger(projet) {
      this.projetId = projet.id
      this.showProlonger = true
    },
    gotoNext(projet, index) {
      const profondeurProjet = {
        isClick: true,
        position: index,
        id: projet.id
      }

      localStorage.setItem('profondeurProjet', JSON.stringify(profondeurProjet));
      this.$router.push({ name: 'dashboard_projets_composantes_globale' })
    },

    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    fetchProjets(programme) {
      this.active()
      ProgrammeService.projets(programme).then((data) => {
        const datas = data.data.data
        this.projets = datas
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

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: 'SET_ERRORS_MESSAGE', // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setProjet: 'projets/FILL' // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
    }),

    ...mapActions('projets', {

      saveProjet: "STORE_PROJET",
      prolongerDateProjet: "PROLONGER_DATE_PROJET",
      updateProjet: "UPDATE_PROJET",
      deleteProjet: "DESTROY_PROJET"
    }),

    // ...mapActions('bailleurs', { fetchBailleurs: 'FETCH_LIST_BAILLEUR_OF_PROGRAMME' }),

    gotoDetails(projet) {
      if (this.dashboardProjetVisible) {
        this.$router.push({ name: 'projets_id_details', params: { id: projet.id, projet: projet } })
      }
    },

    addDate() {
      this.dates.push({})
    },

   close () {
      this.showCloseModal()
      this.resetForm()
      this.sendRequest = false;
    },
    close2() {
      this.showCloseModal()
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);

    },

    showCloseModal(value = false) {
      this.showModal = value
    },



    addProjet() {
      this.title = 'Ajouter'
      this.submitText = "Enregistrer"
      this.isUpdate = false
      let formData = this.champs.map((value) => {
        if (value.key === 'bailleurId') {
          value['options'] = this.bailleurs
        }

        else if (value.key === 'statut') {
          value['options'] = this.$store.state.statuts
        }

        return value

      })
      this.champs = formData

      this.showCloseModal(true)
    },

    modifierProjet(projet) {
      localStorage.removeItem('formData')
      this.isUpdate = true
      this.title = 'Modifier un projet'

      this.submitText = "Modifier"

      this.projetId = projet.id

      this.projetAttributsUpdate.forEach((item) => {

        this.champsUpdate.find((value, index) => {

          if (value.key !== 'statut') {
            if (value.key === item) {
              this.champsUpdate[index]['data'] = projet[item]
            }
          }

        })

      })

      this.showCloseModal(true)

    },


    async supprimerProjet(projet, index) {
      this.deleteModal = true
      this.deleteData.data = projet
      this.deleteData.index = index
    },
    deleteProjets(data) {
      this.filteredProjet.splice(data.index, 1)
      this.deleteModal = false
      ProjetService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")

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

    saveProlongerDate() {

      this.chargement = true

      this.prolongerDateProjet({ projet: this.dates, id: this.projetId }).then(response => {

        if (response.status == 200 || response.status == 201) {

          this.showProlonger = false;

          this.fetchProjets(this.programmeId);
        }

      }).catch((error) => {
        alert(error.response?.data?.errors['fin']);
      })

      this.chargement = false
    },

    dupliquer() {
      this.title = "Dupliquer projet existant"
      this.showModal = true
    },


    resetForm() {

      this.champs = this.champs.map(item => { item.data = ''; return item })

      window.document.getElementById('vform').reset()

      this.setProjet({})
    },


    sendForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        this.champs = this.champs.map(item => { item.errors = []; return item })
        this.champsUpdate = this.champsUpdate.map(item => { item.errors = []; return item })
        let projet = {}
        if (this.isUpdate) {
          projet = extractFormData(this.champsUpdate, this.projetAttributsUpdate)
          projet.id = this.projetId
        } else {
          projet = extractFormData(this.champs, this.projetAttributs)
          projet.bailleurId = projet.bailleurId.id
        }

        projet.programmeId = this.programmeId



        if (projet?.id) {
          projet.statut = projet.statut
          this.updateProjet({ projet: projet, id: projet?.id }).then(response => {

            if (response.status == 200 || response.status == 201) {
              this.sendRequest = false;
              this.fetchProjets(this.programmeId)
              this.close()
            }

          }).catch((error) => {
            this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
            this.sendRequest = false;
            this.champs.map(value => value.errors = this.erreurs[value.key])
          })
        }
        else {
          this.sendRequest = true;
          projet.statut = -2
          const demo = {
            "nom": projet.nom,
            "description": projet.description,
            "debut": projet.debut,
            "fin": projet.fin, 
            "objectifGlobaux": projet.objectifGlobaux,
            "budgetNational": projet.budgetNational,
            "pret": projet.pret,
            "couleur": projet.couleur,
            "ville": projet.ville,
            "statut": -1,
            "bailleurId": projet.bailleurId,
            "programmeId": projet.programmeId,
            "id": ""
          }

          const formData = new FormData();
          formData.append('nom', demo.nom)
          formData.append('description', demo.description)
          formData.append('debut', demo.debut)
          formData.append('fin', demo.fin)
          formData.append('objectifGlobaux', demo.objectifGlobaux)
          formData.append('budgetNational', demo.budgetNational)
          formData.append('pret', demo.pret)
          formData.append('couleur', demo.couleur)
          formData.append('budgetNational', Number(demo.budgetNational))
          formData.append('pret', demo.pret)
          formData.append('couleur', demo.couleur)
          formData.append('ville', demo.ville)
          formData.append('statut', demo.statut)
          formData.append('image', this.image)
          for (let i = 0; i < this.fichiers.length; i++) {
            let file = this.fichiers[i];

            formData.append('fichier' + i, file);
          }

          formData.append('bailleurId', demo.bailleurId)
          formData.append('programmeId', demo.programmeId)

          this.saveProjet(formData).then(response => {
            if (response.status == 200 || response.status == 201) {
              this.close()
              this.resetForm()
              localStorage.removeItem('formData');
              this.fetchProjets(this.programmeId)
              this.sendRequest = false;
            }
          }).catch((error) => {


            this.sendRequest = false;


          })

        }
      }


    },

    validerProjet(id) {
      let projet = {}
      projet.statut = -1
      this.updateProjet({ projet: projet, id: id }).then(response => {

        if (response.status == 200 || response.status == 201) {
          this.$toast.success("projet valider")
          this.fetchProjets(this.programmeId)
        }

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
    fetchBailleurs(programme) {

      BailleurService.bailleursOfProgramme(programme).then((data) => {
        const datas = data.data.data
        this.bailleurs = datas
        this.champs = [
          { name: 'Nom du projet', key: "nom", type: 'text', placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: '', required: true, title: "renseigner le nom du projet", errors: [] },
          { name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Budget Nationnal', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Date début', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, },
          { name: 'Date fin', type: 'date', key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Couleur', type: 'color', key: "couleur", placeholdere: 'Choississez une couleur', isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'couverture du projet', type: 'file', placeholdere: 'Choississez une couverture', isImage: true, isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Pièce jointe', type: 'file', placeholdere: 'televerser des fichiers', isSelect: false, isImage: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Ville', key: "ville", type: '', placeholdere: 'Selectionnez une ville', isSelect: true, isTextArea: false, data: '', required: true, options: ['cotonou', 'calavi', 'bohicon'], isSimpleTable: true, errors: [] },
          { name: 'Bailleur', key: "bailleurId", type: '', placeholdere: 'Selectionnez un bailleur', isSelect: true, isTextArea: false, data: '', required: true, options: datas, cle: 'id', value: 'sigle', errors: [] },
          { name: 'Objectifs globaux', key: "objectifGlobaux", type: '', placeholdere: '', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
          { name: 'Objectifs specifiques', key: "objectifSpecifique", type: 'text', placeholdere: 'Definir les objectifs', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Taux engagement', key: "tauxEngagement", type: 'text', placeholdere: 'Taux engagement', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },

        ]
        this.champsUpdate = [
          { name: 'Nom du projet', key: "nom", type: 'text', placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Prêt', type: 'text', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Budget Nationnal', key: "budgetNational", type: 'text', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Date début', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, },
          { name: 'Date fin', type: 'date', key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Couleur', type: 'color', key: "couleur", placeholdere: 'Choississez une couleur', isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Ville', key: "ville", type: '', placeholdere: 'Selectionnez une ville', isSelect: true, isTextArea: false, data: '', required: true, options: ['cotonou', 'calavi', 'bohicon'], isSimpleTable: true, errors: [] },
          { name: 'Objectifs globaux', key: "objectifGlobaux", type: '', placeholdere: '', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
          { name: 'Objectif specifique', key: "objectifSpecifique", type: 'text', placeholdere: 'Definir les objectifs', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Taux engagement', key: "tauxEngagement", type: 'text', placeholdere: 'Taux engagement', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },

        ]

      }).catch((error) => {

      })
    },
  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {
      this.champs.forEach((value) => { value.errors = errors[value.key] })
    }

  },

  created() {

    this.getPermission()
    if (!this.projetVisible) {
      this.$router.push('/401-non-autorise')
    }
    this.programmeId = this.currentUser.programme.id
    if (this.programmeId) {
      if (this.bailleurVisible) {
        this.fetchBailleurs(this.programmeId)
        this.fetchProjets(this.programmeId)
      }
      else {
        this.fetchProjets(this.programmeId)
      }


    }
  }
}
</script>

<style scoped>
.icon-bold {
  font-weight: 800;
}
.dropdown-content{
  transform: translate(  200px, 200px);
}
.custom_height {
  height: 288px;
}

.block_img {
  height: 208px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
