<template>
  <dashboard>
    <div class="relative">

      <delete-alert v-if="deleteModal" type="danger" title="Confirm Action" width="sm" v-on:close="deleteModal = false">
        <p class="text-gray-800">
          voulez vous supprimer cet element?
        </p>

        <div class="text-right mt-4">
          <button @click="deleteModal = false"
            class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline">Annuler</button>
          <button class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
            @click="deleteSuivis(deleteData)">Supprimer</button>
        </div>
      </delete-alert>
      <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="true" :preview-modal="true"
        :paginate-elements-by-height="1400" :filename="title_pdf" :pdf-quality="2" :manual-pagination="false"
        pdf-format="a3" pdf-orientation="landscape" pdf-content-width="100vw" @progress="onProgress($event)"
        @hasStartedGeneration="hasStartedGeneration()" @hasGenerated="hasGenerated($event)" ref="html2Pdf">
        <section slot="pdf-content">
          <vtable v-if="!commenterSuivi" :headers="headers" :sendRequest="false" :datas="this.SuivisIndicateurs"></vtable>
        </section>
      </vue-html2pdf>
    </div>
    <modal-chat v-if="showComment" title="espace commentaire" v-on:close="closeCommentaire">
      <commentaire module="suivi" :data="data" :datas="commentaires"></commentaire>
    </modal-chat>

    <div v-if="showModal3">
      <vmodal title="Exportez les données " v-on:close="showModal3 = false">
        <div style="width:40vw" class="p-4 flex items-center space-x-4 ">
          <div class="excel">
            <json-excel :data="SuivisIndicateurs" header="INDICATEUR SUIVI" type="xlsx" :name="title_csv()">
              <button title="exporter en excel"
                class="py-2  px-4 overflow-hidden  space-x-2 items-center text-xs font-semibold text-white uppercase bg-indigo-500 focus:outline-none focus:shadow-outline">
                <span class="mx-2 text-xs  md:text-sm font-semibold">Exportez en excel </span>
              </button>
            </json-excel>
          </div>

          <div>
            <button @click="generateReport"
              class="py-2  px-4 overflow-hidden  space-x-2 items-center text-xs font-semibold text-white uppercase bg-indigo-500 focus:outline-none focus:shadow-outline">exportez
              en pdf</button>
          </div>
        </div>
      </vmodal>
    </div>

    <div class="w-full">
      <nav class="text-xs md:text-sm font-semibold flex justify-between items-center flex-wrap" aria-label="Breadcrumb">
        <div class="mb-2">
          <ol class="inline-flex p-0 list-none">
            <li class="flex items-center text-blue-500">
              <router-link to="#" class="text-gray-600">dashboard</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li class="flex items-center ">
              <router-link to="" class="text-gray-600">Suivi indicateur</router-link>
            </li>
          </ol>
        </div>
        <div>
          <div class="w-full flex text-gray-600">
            <input @input="$emit('search', $event.target.value)"
              class="h-8 w-full px-5 text-sm bg-white border-2 border-gray-300 rounded-lg focus:outline-none relative -mr-9 block sm:block"
              v-model="search" type="text" name="search" placeholder="Rechercher">
            <button type="submit" class="relative  p-2 rounded-lg">
              <svg class="w-4 h-4 text-gray-600 fill-current" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
                viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve"
                width="512px" height="512px">
                <path
                  d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>


      <div v-if="showModal">
        <modal-top-right :title="title" v-on:close="showModal = false">
          <div class="px-4 overflow-y-auto">
            <form action="" @submit.prevent="updateSuivi" class="p-0 w-full">

              <div class="my-4">

                <label class="text-xs font-semibold text-gray-500 uppercase block md:text-sm text-light"> l'année suivi
                  <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>

                <input v-model="suiviIndicateurs.annee" @change="verifyValeurCible(suiviIndicateurs.annee)" required
                  class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent"
                  type="number" placeholder="" />
              </div>

              <div v-if="isValeurCibleUse" class="my-true">

                <label class="text-xs font-semibold text-gray-500 uppercase block md:text-sm text-light">Valeur cible
                  <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
                <input v-model="suiviIndicateurs.valeurCible" required
                  class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent"
                  type="text" placeholder="" />
              </div>

              <div class="my-4">
                <label class="text-xs font-semibold text-gray-500 uppercase block md:text-sm text-light">Valeur Realisé
                  <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
                <input v-model="suiviIndicateurs.valeurRealise" required
                  class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent"
                  type="text" placeholder="" />
              </div>

              <div class="my-4">
                <label class="text-xs font-semibold text-gray-500 uppercase block md:text-sm text-light"> Suivi par date
                  ou par trimestre ? <span
                    class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
                <div class="flex justify-between my-3">
                  <div>
                    <input type="radio" :checked="choiceDateOption" @click="choiceDateOption = true" id="date"
                      name="choix" value="date">
                    <label class="px-2" for="all">Par date</label>
                  </div>
                  <div>
                    <input type="radio" @click="choiceDateOption = false" id="trimestre" name="choix" value="trimestre">
                    <label class="px-2" for="sauf">Par trimestre</label>
                  </div>
                </div>

                <div v-if="choiceDateOption" class="my-4">
                  <label class="text-xs font-semibold text-gray-500 uppercase block md:text-sm text-light">Date de suivi
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
                  <input v-model="suiviIndicateurs.dateSuivie" required
                    class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent"
                    type="date" placeholder="" />
                </div>

                <div v-else class="my-4">
                  <label class="text-xs font-semibold text-gray-500 uppercase block md:text-sm text-light"> Selectionnez
                    un trimestre <span
                      class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
                  <div class="flex justify-between my-3">
                    <div>
                      <input v-model="suiviIndicateurs.trimestre" type="radio" id="T1" name="trimestre" value="1">
                      <label class="px-2" for="T1">T1</label>
                    </div>
                    <div>
                      <input type="radio" v-model="suiviIndicateurs.trimestre" id="T2" name="trimestre" value="2">
                      <label class="px-2" for="T2">T2</label>
                    </div>
                    <div>
                      <input type="radio" v-model="suiviIndicateurs.trimestre" id="T3" name="trimestre" value="3">
                      <label class="px-2" for="T3">T3</label>
                    </div>
                    <div>
                      <input type="radio" v-model="suiviIndicateurs.trimestre" id="T4" name="trimestre" value="4">
                      <label class="px-2" for="T4">T4</label>
                    </div>
                  </div>

                </div>
              </div>

              <div class="my-4">
                <label class="text-xs font-semibold text-gray-500 uppercase block md:text-sm text-light">Commentaire
                </label>
                <textarea v-model="suiviIndicateurs.commentaire"
                  class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent"
                  rows="3">
                                                  </textarea>
              </div>

              <div class="py-2 my-4 flex justify-center space-x-8">
                <button type="submit"
                  class="bg-primary  flex space-x-2  items-center text-white px-4 py-2 border border-primary font-semibold uppercase">
                  <span class="text-sm font-semibold uppercase" v-if="!chargement">
                    Modifier
                  </span>
                  <span v-else class="flex items-center space-x-2">
                    <span class="text-xs px-4 font-semibold ">
                      envoi ...
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </span>
                </button>
                <vbutton type="reset" template="danger" @close="close"> annuler </vbutton>
              </div>
            </form>
          </div>
        </modal-top-right>
      </div>



      <div class="flex items-center justify-between my-4">
        <titre>Le suivi d'evaluation </titre>
        <div v-if="exporterSuivi" class="flex items-center space-x-4">
          <button @click="showModal3 = true" title="exporter "
            class="py-2  px-4 overflow-hidden  space-x-2 items-center text-xs font-semibold text-white uppercase bg-indigo-500 focus:outline-none focus:shadow-outline">
            <svg class="inline" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
              height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 16h2V7h3l-4-5-4 5h3z"></path>
              <path
                d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
              </path>
            </svg>
            <span class="mx-2 text-xs  md:text-sm font-semibold">Exportez</span>
          </button>
          <button @click="showModal2 = true" title="filtre" class="bg-primary text-white px-2 py-1"><svg
              stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg></button>
        </div>
      </div>



      <!--  <vtable v-if="currentRole==='bailleur'" @commenter="commenter" :isComment="true"  :actions="actions" :sendRequest="false" :headers="headers" :datas=" suiviBailleurs"  ></vtable>     -->
      <vtable v-if="commenterSuivi" :headers="headers" @commenter="commenter" @modifier="modifier" @supprimer="supprimer"
        :actions="actions" :isComment="true" :sendRequest="false" :datas="this.SuivisIndicateurs" :search="search">
      </vtable>
      <vtable v-if="!commenterSuivi" :headers="headers" :sendRequest="false" @modifier="modifier" @supprimer="supprimer"
        :actions="actions" :datas="this.SuivisIndicateurs" :search="search"></vtable>

    </div>
  </dashboard>
</template>

<script>

import { mapGetters, mapMutations, mapActions } from "vuex";

import IndicateurSuiviService from "@/services/modules/indicateur.suivi.service";
import SuiviService from "@/services/modules/indicateur.suivi.service.js";


export default {
  components: {
   
  },
  data() {
    return ({
      suiviAttributes: ['annee', 'trimestre', 'valeurCible', 'valeurRealise', 'indicateurId', 'commentaire'],
      suiviAttributesRecherche: ['date_debut', 'date_fin', 'trimestre', 'bailleurId', 'categorieId'],
      updateInput: [],
      indicateurId: '',
      suiviId: '',
      isValeurCibleUse: false,
      suiviIndicateurs: {
        annee: '',
        trimestre: '',
        dateSuivie: new Date(),
        valeurCible: 0,
        valeurRealise: 0,
        commentaire: '',
      },
      showModal: false,
      showModal: false,
      showModal3: false,
      showDate: true,
      suiviBailleurs: [],
      isUpdate: false,
      saveUpdate: [],
      filtre: {
        annee: '',
        trimestre: ''
      },
      currentRole: '',
      actions: [{ name: '' }, { name: 'modifier', iconne: '' }, { name: 'supprimer', iconne: '' }],
      cols: 2,
      title: '',
      search: '',
      headers: [],
      showComment: false,
      commentaires: [],
      data: '',
      chargement: false,
      suiviIndicateurVisible: false,
      exporterSuivi: false,
      commenterSuivi: false,
      choiceDateOption: true,
      SuivisIndicateurs: [],
      dateSuivie: false,
      dates: [],
      suivis: [],
      deleteData: {},
      deleteModal: false,

    });
  },
  watch: {
    isLoading: function (value) {
      //this.loading = value
    },
    indicateurs: function (indicateurs) {
      this.champsRecherche.map((item) => {
        if (item.key === "indicateurId") {
          item.options = indicateurs.map((indicateur) => {
            return {
              id: indicateur.id,
              nom: indicateur.nom,
            };
          });
        }
        return item;
      });
    },

    hasErrors: function (errors) {
      this.champsRecherche.forEach((value) => {
        value.errors = errors[value.key];
      });
      //this.errors = errors
    },
  },
  computed: {
    formattedDate: {
      get() {
        // Convertir la date en format "DD/MM/YYYY" pour l'input date
        const day = `${this.suiviIndicateurs.dateSuivie.getDate()}`.padStart(2, '0');
        const month = `${this.suiviIndicateurs.dateSuivie.getMonth() + 1}`.padStart(2, '0');
        const year = this.suiviIndicateurs.dateSuivie.getFullYear();
        return `${day}/${month}/${year}`;
      },
      set(newDate) {
        // Convertir la date du format "DD/MM/YYYY" en objet Date
        const [day, month, year] = newDate.split('/').map(Number);
        this.suiviIndicateurs.dateSuivie = new Date(year, month - 1, day);
      },
    },

    ...mapGetters({
      hasErrors: "GET_ERREURS",
      isLoading: "IS_LOADING",
      indicateurs: "indicateurs/getIndicateurs",

      suivi: "suiviIndicateurs/getSuivi",
    }),
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' }),
    title_pdf() {
      const year = new Date().getFullYear()
      return "suivi indicateur -" + year
    },
    years() {
      const year = new Date().getFullYear() + 20
      return Array.from({ length: year - 1900 }, (value, index) => year + index)
    },
    /*filteredSuivis(){
    
        if(this.SuivisIndicateurs != undefined && this.SuivisIndicateurs != null) {

           var self = this;
            return this.SuivisIndicateurs.filter(function (suivi) {
                return suivi.indicateur.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
                //|| suivi.eyes.toLowerCase().indexOf(self.search.toLowerCase()) >= 0; 
            });

        }
       
    },*/

  },

  methods: {
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setSuivis: "suiviIndicateurs/FILL", // map `this.CREATE_INSTANCE_PROGRAMME()` to `this.$store.commit('CREATE_INSTANCE_PROGRAMME')`
    }),
    ...mapActions("indicateurs", {
      fetchIndicateurs: "FETCH_LIST_INDICATEUR",
    }),
    closeFiltre() {
      this.showModal = false
      this.showDate = true
    },
    ...mapActions("suiviIndicateurs", {

      filter: "FILTRE_SUIVI",
      saveSuivi: "STORE_SUIVI",
      updateSuivie: "UPDATE_SUIVI",
      deleteSuivi: "DESTROY_SUIVI",
    }),
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    /*modifier(data) {
      localStorage.removeItem('formData')

      this.saveUpdate = data
      this.isUpdate = true
      //this.audit.projetId = data.projet
      //this.audit.statut = data.statut


      this.title = 'Modifier un audit'
      this.showModal = true
    },*/

    supprimer(suivi, index) {
      this.deleteModal = true
      this.deleteData.data = suivi
      this.deleteData.index = index
    },

    deleteSuivis(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal = false
      SuiviService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getSuivi()

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

    verifyValeurCible(date) {
      SuiviService.checksuivi(this.indicateurId, date).then((data) => {
        //recuperation de la valeur de verfication pour la valeur cible
        if (data.data.data === true) {
          this.isValeurCibleUse = false;
        } else {
          this.isValeurCibleUse = true;
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

    updateSuivi() {
      if (this.chargement == false) {
        this.chargement = true
        const data = this.suiviIndicateurs
        data.valeurRealise = [Number(data.valeurRealise)]
        //data.valeurCible = [90000]
        data.valeurCible = [Number(data.valeurCible)]
        data.indicateurId = this.indicateurId
        if (this.choiceDateOption == true) {
          delete data.trimestre
        }
        else {
          delete data.dateSuivie
        }

        SuiviService.update(this.suiviId, data).then((data) => {
          this.$toast.success('modification éffectué')

          this.showModal = false
          this.chargement = false
       //  this.getSuivi()
       window.location.reload();

          this.suiviIndicateurs.annee = ''
          this.suiviIndicateurs.trimestre = ''
          this.suiviIndicateurs.dateSuivie = ''
          this.suiviIndicateurs.valeurCible = 0
          this.suiviIndicateurs.valeurRealise = 0
          this.suiviIndicateurs.commentaire = ''
        }).catch((error) => {
          this.chargement = false
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
      }


    },



    commenter(data) {
      const commentaires = data.commentaires
      commentaires.forEach(element => {
        const nom = element.auteur.nom
        const message = element.message
        const date = element.date
        this.commentaires.push({ nom, message, date })
      });

      this.data = data
      this.showComment = true
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },
    suivreIndicateur(data) {
      this.showModal = true
      this.title = `Suivre l'indicateur ${data}`
    },

    title_csv() {
      return "suivi-indicateur-" + "-" + new Date()
    },

    filtreDate() {
      if (this.chargement == false) {
        this.chargement = true
        const data = {
          dateSuivie: this.dateSuivie
        }
        this.filter(data).then((response) => {
          this.SuivisIndicateurs = []
          if (response.status == 200 || response.status == 201) {

            const datas = response.data.data

            datas.forEach(element => {
              const bailleur = element.indicateur.bailleur.nom
              const indicateur = element.indicateur.nom
              const unitee_de_mesure = element.indicateur.unitee_mesure.nom
              const annee_de_base = element.indicateur.anneeDeBase
              const annee_de_suivie = element.valeurCible.annee
              const valeur_de_base = element.indicateur.valeurDeBase
              const valeur_cible = element.valeurCible.valeurCible[0]
              const valeur_realise = element.valeurRealise[0]
              const ecart = Number(valeur_realise) - valeur_cible
              const date_de_creation = element.created_at
              this.SuivisIndicateurs.push({ bailleur, indicateur, uniteannee_de_suivie, annee_de_suivie, valeur_de_base, valeur_cible, valeur_realise, ecart, date_de_creation })
            })
            this
            this.chargement = false
            this.closeFiltre()

          }
        }).catch((e) => {
          this.chargement = false
        });
      }
    },
    resetForm() {

      this.champsRecherche = this.champsRecherche.map(item => { item.data = ''; return item })

      window.document.getElementById('vform')?.reset()

      this.setIndicateur({})
    },
    getSuiviBailleur() {
      IndicateurSuiviService.getBailleurSuivi().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const bailleur = element.indicateur.bailleur.nom
          const indicateur = element.indicateur.nom
          const unitee_de_mesure = element.indicateur.unitee_mesure.nom
          const annee_de_base = element.indicateur.anneeDeBase
          const valeur_de_base = element.indicateur.valeurDeBase
          const valeur_cible = element.valeurCible[0]
          const valeur_realise = element.valeurRealise[0]
          const ecart = valeur_realise - valeur_cible
          const date_de_creation = element.created_at
          this.suiviBailleurs.push(id, bailleur, indicateur, unitee_de_mesure, annee_de_base, valeur_de_base, ecart, date_de_creation)
        })
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
    getDate() {
      if (this.chargement == false) {
        this.chargement = true
        this.filtre.annee = Number(this.filtre.annee)
        this.filtre.trimestre = Number(this.filtre.trimestre)
        IndicateurSuiviService.filtreDate(this.filtre).then((data) => {
          const datas = data.data.data
          this.dates = datas
          this.showDate = false
          this.chargement = false
        }).catch((error) => {
          this.chargement = false
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

      }

    },
    closeCommentaire() {
      this.showComment = false
      this.commentaires = []
    },
    async updateInputData(id, attribut, value) {
      await this.updateSuivie({ suivi: { [attribut]: value }, id: id }).catch((value, status) => {
        if (this.hasErrors[attribut] !== undefined)
          alert(this.hasErrors[attribut])
      }).finally(() => {
        $('#' + "dataTable").load(location.href + '#' + id + '>*', '')
      })
    },

    /*async supprimer(suivi) {
      if(window.confirm("Voulez-vous supprimer cette unitee de gestion  " + suivi.nom))
        await this.deleteSuivi(suivi.id)
    },*/

    close() {
      this.showCloseModal();
      this.resetForm();
    },
    close2() {
      this.showCloseModal2();
      this.resetForm();
    },
    showCloseModal(value = false) {
      this.showModal = value;
    },
    showCloseModal2(value = false) {
      this.showModal2 = value;
    },
    addSuivi() {
      this.title = 'Creer un suivi'
      this.showModal = true
    },
    set(newDate) {
      // Convertir la date du format "DD-MM-YYYY" en objet Date
      const [day, month, year] = newDate.split('-').map(Number);
      this.suiviIndicateurs.dateSuivie = new Date(year, month - 1, day);
    },
    modifier(data) {

      console.log(data)
      localStorage.removeItem('formData')

      this.title = 'Modifier un suivi'
      this.indicateurId = data.indicateurId
      this.suiviId = data.id
      this.suiviIndicateurs.annee = data.annee_de_suivie
      this.suiviIndicateurs.trimestre = data.trimestre
      this.suiviIndicateurs.dateSuivie = this.formattedDate
      this.suiviIndicateurs.valeurCible = data.valeur_cible
      this.suiviIndicateurs.valeurRealise = data.valeur_realise
      this.suiviIndicateurs.commentaire = data.commentaire
      this.showModal = true
    },
    dupliquer() {
      this.title = 'Dupliquer un suivi'
      this.showModal = true
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-un-suivi-indicateur') {
          this.suiviIndicateurVisible = true
        }
        if (element.slug === 'exporter-un-suivi-indicateur') {
          this.exporterSuivi = true
        }
        if (element.slug === 'commenter-un-suivi-indicateur') {
          this.commenterSuivi = true
        }

      });
    },
    getSuivi() {
      this.active()
      IndicateurSuiviService.get().then((data) => {

        const datas = data.data.data
        datas.forEach(element => {
          const id = element.id
          const bailleur = element.indicateur.bailleur.nom
          const indicateurId = element.indicateur.id
          const indicateur = element.indicateur.nom
          const unitee_de_mesure = element.indicateur.unitee_mesure.nom
          const annee_de_base = element.indicateur.anneeDeBase
          const annee_de_suivie = element.valeurCible.annee

          const valeur_de_base = element.indicateur.valeurDeBase
          const valeur_cible = element.valeurCible.valeurCible[0]
          const valeur_realise = element.valeurRealise[0]
          const ecart = Number(valeur_realise) - valeur_cible
          const commentaire = element.commentaire
          const date_de_creation = element.created_at
          this.SuivisIndicateurs.push({ id, bailleur, indicateurId, indicateur, unitee_de_mesure, annee_de_base, annee_de_suivie, valeur_de_base, valeur_cible, valeur_realise, ecart, commentaire, date_de_creation })
        })
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
  },
  created() {
    this.getPermission()
    if (!this.suiviIndicateurVisible) {
      this.$router.push('/401-non-autorise')
    }
    if (this.currentUser != undefined) {

      this.currentRole = this.currentUser.type
      if (this.currentUser.type === 'bailleur') {
        this.getSuiviBailleur()
        const headers = [
          { name: 'Bailleur', cle: 'bailleur', edit: false },
          { name: 'Indicateur', cle: 'indicateur', edit: false },
          { name: 'unite de mesure', cle: 'unite_de_mesure', edit: false },
          { name: 'Annee de base', cle: 'annee_de_base', edit: false },
          { name: 'valeur de base', cle: 'valeur_de_base', edit: false },
          { name: 'valeur cible', cle: 'valeur_cible', edit: false },
          { name: 'Valeur réalisée', cle: 'valeur_realise', edit: false },
          { name: 'Ecart', cle: 'ecart', edit: false },
          { name: 'Commentaire', cle: 'commentaire', edit: false },
          { name: 'Date de création', cle: 'date_de_creation', width: "w-24", edit: false },
        ]
        this.headers = headers
      }
      else {
        this.getSuivi()
        const headers = [
          { name: 'Bailleur', cle: 'bailleur', edit: false },
          { name: 'Indicateur', cle: 'indicateur', edit: false },
          { name: 'unite de mesure', cle: 'unitee_de_mesure', edit: false },
          { name: 'Annee de base', cle: 'annee_de_base', edit: false },
          { name: 'valeur de base', cle: 'valeur_de_base', edit: false },
          { name: 'valeur cible', cle: 'valeur_cible', edit: false },
          { name: 'Année de suivie', cle: 'annee_de_suivie', edit: false },
          { name: 'Valeur réalisée', cle: 'valeur_realise', edit: false },
          { name: 'Ecart', cle: 'ecart', edit: false },
          { name: 'Commentaire', cle: 'commentaire', edit: false },
          { name: 'Date de création', cle: 'date_de_creation', width: "w-24", edit: false },
        ]
        this.headers = headers
        /*  this.fetchSuivi().then((value) => {
          setTimeout(() => {
            console.log("Fetching list of suivi...")
            this.fetchIndicateurs()
          }, 100);
        }) */
      }
    }



  },
}
</script>

<style scoped></style>