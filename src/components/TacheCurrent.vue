<template>
  
 
</template>

<script>

import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { extractFormData, getStringValueOfStatutCode } from "@/utils/index";
import Composante from "@/store/modules/composantes/composante";
import Activite from "@/store/modules/activites/activite";
import ComposanteService from "@/services/modules/composante.service.js";
import TacheService from "@/services/modules/tache.service.js";
import ActiviteService from '@/services/modules/activite.service';
import ProgrammeService from "@/services/modules/programme.service.js";

export default {
  components: {
   
  },
  props: ['valeurProjet', 'valueProfondeur', 'valueComposante', 'valueSC'],
  data() {
    return {
      savedInput: [],
      dates: { debut: '', fin: '' },
      date:'',
      suivis: [],
      commentaires: [
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Gomez jacob', message: 'lorem ipsum', date: '22 septembre 2022' },
        { nom: 'Yann olou', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere asperiores, ipsa enim eos impedit facilis eveniet doloribus quo veniam perferendis nam nostrum eius tempore quae architecto alias nobis amet vel.', date: '20 septembre' }
      ],
      chargement: false,
      showComment: false,
      showProlonger: false,
      showModalSuivi: false,
      valueFiltre: null,
      composanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      sousComposanteFiltre: null,
      pending: false,
      success: true,
      retard: false,
      inProgress: false,
      rangeValue: 0,
      programmeId: this.currentUser?.programme.id,
      cols: 1,
      sendRequest: false,
      submitText: "Enregistrer",
      showFiltre: false,
      showModal: false,
      showModal2: false,
      doSuiviOld: false,
      line: false,
      mosaique: true,
      isStateChange: false,
      seeSuivi: false,
      seeTache: true,
      options: [
        { name: 'activite 1' },
        { name: 'activite 2' },
        { name: 'activite 3' },
        { name: 'activite 4' },
        { name: 'activite 5' },
      ],
      tacheId: '',
      tacheAttributs: ['nom', 'description', 'debut', 'fin', 'poids'],

      champs: [
        { name: 'Nom de la tâche', key: "nom", type: 'text', placeholdere: "Nom de la tâche", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de debut', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de fin', key: "fin", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Description', type: '', key: "description", placeholdere: 'Description de la tâche', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
      ],
      champsSuiviTache: [
        { name: 'Tache ', key: "statut", type: '', placeholdere: 'Selectionnez une tache ', isSelect: true, isTextArea: false, data: '', required: true, options: [{ nom: 'tache 1' }, { nom: 'tache 2' }], cle: 'etat', value: 'nom', errors: [] },
        { name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
      ],

      headers: [
        { name: "Tache", cle: "tache" },
        { name: "code pta", cle: "codePta" },
        { name: "poids initial", cle: 'poidsInitial' },
        { name: "poids actuel", cle: 'poidsActuel' },
        { name: "date de creation", cle: 'created_at' },

      ],

      dataTable: [],

      actions: [

      ],
      tacheVisible: false,
      tacheAdd: false,
      tacheDelete: false,
      tacheUpdate: false,
      tacheSuivi: false,
      idProjet: '',
      idComposante: '',
      idSC: '',
      idActivite: '',
      newProjet: null,
      newComponent: null,
      newSC: null,
      newActivite: null,
      isClick: false,
      isShow: true,
      search: '',
      isSearch: false,
      projets: [],
      deleteData: {},
      deleteModal: false,
    };
  },

  computed: {
    //importation des variables du module activites
    ...mapState({
      tache: (state) => state.taches.tache,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),

    allData() {
      if (this.terminer != undefined || this.enAttente != undefined || this.enCours != undefined || this.retardData != undefined) {
        return [].concat(this.terminer, this.enAttente, this.enCours, this.retardData)
      }
    },
    filtere: function () {
      var self = this;
      return this.allData.filter(function (data) {
        return data.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      });
    },

    ...mapGetters({
      composantes: "composantes/getComposantes",
      sousComposantes: "sousComposantes/getSousComposantes",
      activites: "activites/getActivites",
      taches: "taches/getTaches",
      tache: "taches/getTache",
      currentUser: 'auths/GET_AUTHENTICATE_USER'
    }),

    terminer() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if (element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    enAttente() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if (element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    retardData() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if (element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },

    enCours() {
      if (this.taches != undefined) {
        const datas = []
        this.taches.forEach(element => {
          if (element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },

  methods: {

    getSearchValue(data) {
      if (data != '') {
        this.isSearch = true
        this.search = data
      }
      else {
        this.isSearch = false
        this.search = data
      }

    },
    changeProjet(projet) {
      if (this.isClick) {
        this.projetFiltre = this.newProjet
        this.composanteFiltre = this.newComponent
        this.fetchComposantes(this.idProjet);
        localStorage.removeItem('profondeurActivite');
      } else {
        this.fetchComposantes(projet.id);
        let indexProjet = 0
        for (let index = 0; index < this.projets.length; index++) {
          const element = this.projets[index];
          if (projet.id == element.id) {
            indexProjet = index
          }
        }
        let composantes = this.projets[indexProjet].composantes

        if (composantes[0] != null) {
          let code = composantes[0].codePta
          let nom = composantes[0].nom
          this.composanteFiltre = { codePta: code, nom: nom }
          let indexComposante = composantes[0].id
          ComposanteService.sousComposantes(indexComposante).then((data) => {
            const sous_composantes = data.data.data
            if (sous_composantes[0] != null) {
              let code = sous_composantes[0].codePta
              let nom = sous_composantes[0].nom
              this.sousComposanteFiltre = { codePta: code, nom: nom }
              let indexSC = sous_composantes[0].id
              //this.fetchActivites(indexSC)
              ComposanteService.activites(indexSC).then((data) => {
                const activites = data.data.data
                if (activites[0] != null) {
                  const idActivite = activites[0].id
                  let code = activites[0].codePta
                  let nom = activites[0].nom
                  this.valueFiltre = { id: idActivite, codePta: code, nom: nom }
                  this.fetchTaches(idActivite);
                  this.isShow = true
                }
                else {
                  this.isShow = false
                  this.valueFiltre = null
                }
              })

            }
            else {
              ComposanteService.activites(indexComposante).then((data) => {
                const activites = data.data.data
                if (activites[0] != null) {
                  const idActivite = activites[0].id
                  let code = activites[0].codePta
                  let nom = activites[0].nom
                  this.valueFiltre = { id: idActivite, codePta: code, nom: nom }
                  this.fetchTaches(idActivite);
                  this.isShow = true
                  this.sousComposanteFiltre = null
                  //this.composanteFiltre = null 

                }
              })

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
        }
        else {
          this.isShow = false
          this.composanteFiltre = null
          this.valueFiltre = null
          this.sousComposanteFiltre = null
        }

        //this.fetchActivites(Scomposante.id);
      }

    },
    changeComposante(composante) {
      if (this.isClick) {
        this.fetchSousComposantes(this.idComposante);
        localStorage.removeItem('profondeurActivite');
      } else {
        this.fetchSousComposantes(composante.id);
      }


    },
    changeSC(Scomposante) {
      if (this.isClick) {
        this.sousComposanteFiltre = this.newSC
        this.valueFiltre = this.newActivite
        this.fetchTaches(this.idActivite);
        this.fetchActivites(this.idSC);

        localStorage.removeItem('profondeurActivite');
      } else {
        this.fetchActivites(Scomposante.id);

      }

    },
    changeActivite(activite) {
      if (this.isClick) {

        this.fetchTaches(this.idActivite);
        this.isClick = false
        localStorage.removeItem('profondeurActivite');
      } else {
        this.fetchTaches(activite.id);
        this.isShow = true
      }

    },
    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setTache: "taches/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setTaches: "taches/SET_LIST_TACHE_OF_ACTIVITE",
      setActivites: 'activites/SET_LIST_ACTIVITES',
      setComposantes: 'composantes/SET_LIST_COMPOSANTES',
      setSousComposantes: 'sousComposantes/SET_LIST_SOUSCOMPOSANTE'
    }),

    ...mapActions("taches", {
      fetchTaches: "FETCH_LIST_TACHE_OF_ACTIVITE",
      saveTache: "STORE_TACHE",
      updateTache: "UPDATE_TACHE",
      deleteTache: "DESTROY_TACHE",
    }),

    ...mapActions({
      fetchActivites: "activites/FETCH_LIST_ACTIVITE_OF_COMPOSANTE",
      fetchComposantes: "composantes/FETCH_LIST_COMPOSANTE_OF_PROJET",
      fetchSousComposantes: "sousComposantes/FETCH_LIST_SOUS_COMPOSANTE_OF_COMPOSANTE",
    }),

    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-une-tache') {
          this.tacheVisible = true
        }
        if (element.slug === 'creer-une-tache') {
          this.tacheAdd = true
        }
        if (element.slug === 'modifier-une-tache') {
          this.tacheUpdate = true
        }
        if (element.slug === 'supprimer-une-tache') {
          this.tacheDelete = true
        }
        if (element.slug === 'voir-un-suivi-tache') {
          this.tacheSuivi = true
        }
      });
    },
    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },
    customLabelP({ bailleur, nom }) {
      return `${bailleur.sigle} – ${nom}`
    },


    filtreRange(value) {
      this.rangeValue = value
    },
    selectActivite({ name }) {
      return `${name}`
    },

    addDate() {
      this.dates.push({});
    },
    deleteItem(item) {
      this.dates.splice(item, 1);
      alert(item)
    },
    prolonger(tache) {
      this.tacheId = tache.id
      this.showProlonger = true
    },
    suiviOld(tache) {
      this.tacheId = tache.id
      this.doSuiviOld = true
    },
    saveProlongerDate(id, data) {
      this.chargement = true
      TacheService.addDate(id, data).then((data) => {
        this.$toast.success('Operation éffectué avec succès')
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
      this.chargement = false
    },
    saveSuiviOld(id, data) {
      this.chargement = true
      var form = {
        date:data,
        tacheId:id
      }
      TacheService.myOldSuivis(form).then((data) => {
        this.doSuiviOld = false
        this.$toast.success('Operation éffectué avec succès')
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
      this.chargement = false
    },
    getSuivi() {
      TacheService.getSuivi().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const tache = element.tache.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({ tache: tache, codePta: codePta, poidsInitial: poidsInitial, poidsActuel: poidsActuel, created_at: created_at })
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
    suivreMyTache(tache) {
      if (this.tacheSuivi)
        this.$router.push({ name: 'dashboard_projets_taches_globale_suivis', params: { id: tache.id } })
    },
    close() {
      this.showModal = false;
      this.resetForm()
    },
    close2() {
      this.showModal = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },
    
    addPlan() {
      this.title = "Ajouter un plan decaissement";
      this.showModal2 = true;
    },
    modifierPlan() {
      this.title = "Modifier un plan de decaissement";
      this.showModal2 = true;
    },
    dupliquerPlan() {
      this.title = "Dupliquer un plan decaissement";
      this.showModal2 = true;
    },

    addTache() {

      this.title = "Ajouter"

      this.submitText = "Enregistrer",

        this.showCloseModal(true)

    },

    suivreTache(data) {
      this.title = "Suivre une tache "

      this.submitText = "Enregistrer",

        this.showModalSuivi = true
    },

    getNom(nom, prenom) {

      let name = ''

      if (nom !== undefined && nom !== null) name += nom

      if (prenom !== undefined && prenom !== null) name += prenom

      return name;
    },

    supprimer(tache, index) {
      this.deleteModal = true
      this.deleteData.data = tache
      this.deleteData.index = index
    },

    deleteTaches(data) {
      //this.filteredBailleur.splice(data.index,1)
      this.deleteModal = false
      TacheService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.fetchTaches(this.valueFiltre.id);

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



    dupliquer(tache) {

      this.title = 'Ajouter une tache'

      this.tacheAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = tache[item]
          }

        });

      });

      this.submitText = "Enregistrer",

        this.showCloseModal(true)
    },

    modifier(tache) {
      localStorage.removeItem('formData')

      this.title = 'Modifier une tache'

      this.setTache(tache)

      this.tacheAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = tache[item]
          }

        });

      });

      this.submitText = "Modifier",

        this.showCloseModal(true)
    },

    dupliquer() {
      this.title = "Dupliquer une activité";
      this.showModal = true;
    },

    gotoNext() {
      this.$router.push(
        "/dashboard/projets/composantes/sous-composantes/activites/taches"
      );
    },

    toggle() {
      this.pending = false
      this.inProgress = false
      this.success = true
      this.retard = false
    },

    toggle2() {
      this.success = false
      this.inProgress = false
      this.pending = true
      this.retard = false
    },

    toggle3() {
      this.pending = false
      this.success = false
      this.inProgress = true
      this.retard = false
    },
    toggle4() {
      this.pending = false
      this.success = false
      this.inProgress = false
      this.retard = true
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },

    validation() {
      this.fetchTaches(this.valueFiltre.id);
    },


    sendForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        /* this.champs = this.champs.map((item) => {
          item.errors = [];
          return item;
        }); */

        let tache = extractFormData(this.champs, this.tacheAttributs);
        if (this.valueFiltre == undefined || this.valueFiltre == null) {
          this.$toast.error('Activité non definit  ')
          this.sendRequest = false;
          this.close()
        } else {
          tache['activiteId'] = this.valueFiltre.id;
          if (this.tache?.id) {
            this.updateTache({ tache: tache, id: this.tache?.id })
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchTaches(this.valueFiltre.id);
                  this.close();
                }
              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs2.map(value => value.errors = this.erreurs[value.key])

              });
          } else {
            this.saveTache(tache)
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchTaches(this.valueFiltre.id);
                  this.close();
                  this.resetForm()
                  localStorage.removeItem('formData');

                }
              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs2.map(value => value.errors = this.erreurs[value.key])
              });
          }
        }

      }
    },

    close() {
      this.showCloseModal();

      this.sendRequest = false;
    },

    resetForm() {

      this.champs = this.champs.map(item => { item['data'] = ''; item['errors'] = []; return item })

      window.document.getElementById('vform').reset()

      this.setTache({})
    },

    showCloseModal(value = false) {
      this.showModal = value;
    },

    gotoSuivi() {
      this.seeSuivi = true
      this.seeTache = false
    },

    gotoTache() {
      this.seeSuivi = false
      this.seeTache = true
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

  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {

      if (errors.length > 0) {
        this.champs.forEach((value) => {
          if (errors[value.key] instanceof Array || errors[value.key] !== undefined) {
            value.errors = errors[value.key]
            if (value.key === "types") {

              value.errors = errors["type"];

            }
            else value.errors = errors[value.key];
          }
        })
      }
      else {
        this.champs = this.champs.map(item => { item['errors'] = []; return item })
      }

    },

    projets: function (projets) {
      if (projets.length > 0) {
        this.projetFiltre = projets[0]
      }
    },

    projetFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchComposantes(valeur);
      }
      else {
        this.setComposantes([])
      }
    },

    composantes: function (composantes) {
      if (composantes.length > 0) {
        this.composanteFiltre = composantes[0]
      }
      else {
        this.composanteFiltre = null
      }
    },

    composanteFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchSousComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchSousComposantes(valeur);
      }
      else {
        this.setSousComposantes([])
      }
    },

    sousComposantes: function (sousComposantes) {
      if (sousComposantes.length > 0) {
        this.sousComposanteFiltre = sousComposantes[0];
      }
      else if (this.composanteFiltre !== null && typeof this.composanteFiltre !== 'undefined' && this.composanteFiltre.length !== 0) {
        this.fetchActivites(this.composanteFiltre.id);
        this.composanteId = this.composanteFiltre.id
        this.sousComposanteFiltre = null
        this.valueFiltre = null;
      }
      else {
        this.sousComposanteFiltre = null;
      }
    },

    sousComposanteFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchActivites(valeur.id);
        this.composanteId = valeur.id
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchActivites(valeur);
        this.composanteId = valeur
      }
      else {
        this.setActivites([])
      }

    },

    activites: function (activites) {
      if (activites.length > 0) {
        this.valueFiltre = activites[0]
      }
      else {
        this.valueFiltre = null
      }
    },

    valueFiltre: function (valeur) {
      if (valeur instanceof Activite || valeur instanceof Object) {
        this.fetchTaches(valeur.id);
      }

      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchTaches(valeur);
      }

    }

  },

  created() {
    const profondeurActivite = JSON.parse(localStorage.getItem('profondeurActivite'))

    if (profondeurActivite != undefined || profondeurActivite != null) {
      this.isClick = profondeurActivite.isClick
      if (this.isClick) {

        this.idProjet = profondeurActivite.id
        this.idSC = profondeurActivite.idSC
        this.idComposante = profondeurActivite.idC
        this.idActivite = profondeurActivite.idActivite

        this.newProjet = profondeurActivite.projet
        this.newComponent = profondeurActivite.composente
        this.newSC = profondeurActivite.sousComposante
        this.newActivite = profondeurActivite.activite
      }

    }
    if (this.tacheSuivi) {
      this.getSuivi()
    }

    this.getPermission()
    this.programmeId = this.currentUser.programme.id

    if (this.programmeId) {
      Promise.all([this.fetchProjets(this.programmeId)]);
    }

  }

};
</script>

<style></style>
