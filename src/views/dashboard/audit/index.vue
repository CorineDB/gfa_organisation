<template>
 
</template>

<script>

import AuditService from "@/services/modules/audit.service.js";
import ProjetService from "@/services/modules/projet.service.js";
import EntrepriseService from "@/services/modules/entreprise.executante.service.js";
import UsersService from "@/services/modules/utilisateur.service.js";

import { mapGetters, mapActions, mapMutations, mapState } from "vuex";

//add import
import BailleurService from "@/services/modules/bailleur.service";
import { API_BASE_URL } from "@/services/configs/environment.js";
import Dropdown from '@/components/Dropdown.vue'
import { extractFormData } from '@/utils/index'


export default {
  components: {
  },
  data() {
    return {
      savedInput: [],
      showModal: false,
      title: '',
      audit: {
        annee: '',
        entreprise: '',
        entrepriseContact: '',
        dateDeTransmission: '',
        etat: '',
        statut: '',
        projetId: '',
        categorie: ''
      },
      projets: [],
      chargement: false,
      audits: [],
      showRapport: false,
      fichiers: [],
      sendRapportFile: null,
      showSelect: false,
      showStatut: false,
      showFile: false,
      showCategorie: false,
      auditVisible: false,
      auditAdd: false,
      auditDelete: false,
      auditUpdate: false,
      saveUpdate: {},
      deleteData: {},
      deleteModal: false,
      value: [],
      users: [],
      usersId:[],
      shared:[],

      //data projet
      champsProjet: [],
      showProjetModal: false,
      projetAttributs: ['nom', 'description', 'debut', 'fin', 'objectifGlobaux', 'budgetNational', 'pret', 'couleur', 'ville', 'bailleurId', 'tauxEngagement'],
      programmeId: this.currentUser?.programme?.id,
      fichiersProjet: [],

      bailleurs: [],
      projetVisible: true,
      projetAdd: true,
      bailleurVisible: true,
      cols: 1,
      sendRequest: false
    }

  },
  computed: {
    ...mapState({
      identifiant: state => state.auths.identifiant,
      loading: state => state.loading,
      errors: state => state.errors,
      projet: state => state.projets.projet, //add projet
    }),

    ...mapGetters({
      
      currentUser: 'auths/GET_AUTHENTICATE_USER',
      projet: "getProjet", //add projet
    }),

    //importation des variables du module auths
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },
  methods: {
    addTag (newTag) {
      const tag = {
        nom: newTag,
      }
      this.options.push(tag)
      this.value.push(tag)
    },
    previewFiles(event) {
      const data = event.target.files[0]
      this.datasFiles = data

    },
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },

    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-un-audit') {
          this.auditVisible = true
        }
        if (element.slug === 'creer-un-audit') {
          this.auditAdd = true
        }
        if (element.slug === 'modifier-un-audit') {
          this.auditUpdate = true
        }
        if (element.slug === 'supprimer-un-audit') {
          this.auditDelete = true
        }
        if (element.slug === 'voir-un-projet') {
          this.projetVisible = true
        }
        if (element.slug === 'creer-un-projet') {
          this.projetAdd = true
        }
        if (element.slug === 'voir-un-bailleur') {
          this.bailleurVisible = true
        }
      });
    },

    supprimerAudit(audit, index) {
      this.deleteModal = true
      this.deleteData.data = audit
      this.deleteData.index = index
    },

    deleteAudits(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal = false
      AuditService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.getAudits()

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


    updateAudit() {
      if (this.chargement == false) {
        this.chargement = true
        const data = this.saveUpdate
        const audit = this.audit
        audit.projetId = audit.projetId.id
        const formData = new FormData();
        formData.append('annee', data.annee)
        formData.append('entreprise', data.entreprise)
        formData.append('entrepriseContact', data.entrepriseContact)
        formData.append('dateDeTransmission', data.dateDeTransmission)
        formData.append('etat', data.etat)
        formData.append('statut', audit.statut)
        formData.append('categorie', data.categorie)
        formData.append('projetId', audit.projetId)
        if (this.showFile) {
          formData.append('rapport', this.fichiers)
        }


        AuditService.update(data.id, formData).then((data) => {
          this.chargement = false
          this.$toast.success('operation effectuer ave success')
          this.showModal = false
          this.getAudit()
          data.annee = ''
          data.entreprise = ''
          data.entrepriseContact = ''
          data.dateDeTransmission = ''
          data.etat = ''
          audit.statut = ''
          audit.categorie = ''
          audit.projetId = null
          this.fichiers = ''
        }).catch((e) => {
          this.chargement = false
          this.$toast.error(e)
        })
      }
    },
    modifierAudit(data) {
      localStorage.removeItem('formData')

      this.saveUpdate = data
      this.audit.projetId = data.projet
      this.audit.statut = data.statut

      if (data.categorie === 'Audit comptable et financier') {
        data.categorie = 0
      } else if (data.categorie === 'Audit de conformité environnementale et social') {
        data.categorie = 1
      }
      else if (data.categorie === 'Audit des acquisitions') {
        data.categorie = 2
      }
      else {
        data.categorie = 3
      }

      this.title = 'Modifier un audit'
      this.showModal = true
    },
    previewRapport(data) {
      this.showRapport = true
      this.sendRapportFile = data
    },
    getFile(event) {
      this.fichiers = event.target.files[0];
    },
    selectProjet({ nom }) {
      return `${nom}`
    },
    getUser() {
      UsersService.getByProgramme(this.programmeId).then((data) => {
        let datas = data.data.data
        this.users = datas
             
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
    saveAudit() {
      if (this.chargement == false) {
        this.chargement = true
        const data = this.audit
        data.projetId = data.projetId.id

        this.value.forEach(element => {
          this.usersId.push(element.id)
        })

        const formData = new FormData();
        formData.append('annee', data.annee)
        formData.append('entreprise', data.entreprise)
        formData.append('entrepriseContact', data.entrepriseContact)
        formData.append('dateDeTransmission', data.dateDeTransmission)
        formData.append('etat', data.etat)
        formData.append('statut', data.statut)
        formData.append('categorie', data.categorie)
        formData.append('projetId', data.projetId)
        //formData.append('rapport', this.fichiers)
        formData.append('fichier',this.datasFiles)
        for( let i = 0; i < this.usersId.length; i++ ){
          let file = this.usersId[i];
          formData.append('sharedId[]', file);
        }

        AuditService.create(formData).then((data) => {
          this.chargement = false
          this.$toast.success('nouveau element')
          this.showModal = false
          this.getAudit()
          this.audit.annee = ''
          this.audit.entreprise = ''
          this.audit.entrepriseContact = ''
          this.audit.dateDeTransmission = ''
          this.audit.etat = ''
          this.audit.statut = ''
          this.audit.categorie = ''
          this.audit.projetId = null
          this.fichiers = ''
          localStorage.removeItem('formData');
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
    getAudit() {
      this.active()
      AuditService.get().then((data) => {
        this.audits = data.data.data
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
    getAudits() {
      AuditService.get().then((data) => {
        this.audits = data.data.data
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
    getProjet() {
      ProjetService.get().then((data) => {
        this.projets = data.data.data
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
    getEntreprise() {
      EntrepriseService.get().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const id = element.id
          const name = element.user.nom
          this.entreprises.push({ name, id })
        });
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
    createAudit() {
      this.title = 'Ajouter'
      this.showModal = true
    },


    closeA() {
      this.showModal = false

      this.savedInput = Object.values(this.audit)

      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },
    close() {
      this.showModal = false
      this.audit.annee = ''
      this.audit.entreprise = ''
      this.audit.entrepriseContact = ''
      this.audit.dateDeTransmission = ''
      this.audit.etat = ''
      this.audit.statut = ''
      this.audit.categorie = ''
      this.audit.projetId = null
      this.fichiers = ''
      localStorage.removeItem('formData')

    },


    // all methods ajout projet


    getProjetFile(data) {
      this.champsProjet[7].data = data
      for (const property in data) {
        this.fichiersProjet.push(data[property])
      }
      this.fichiers.pop()
      this.fichiers.pop()


    },
    getProjetImage(data) {
      this.champsProjetProjet[6].data = data
      this.image = data

    },
    closeProjet() {
      this.showCloseProjetModal()
      this.resetProjetForm()
      this.sendRequest = false;
    },
    closeProjet2() {
      this.showCloseProjetModal()
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champsProjet.length; i++) {
        this.savedInput.push(this.champsProjet[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);

    },
    resetProjetForm() {

      this.champsProjet = this.champsProjet.map(item => { item.data = ''; return item })

      window.document.getElementById('vform').reset()

      this.setProjet({})
    },

    showCloseProjetModal(value = false) {
      this.showProjetModal = value
    },
    ...mapMutations({
      setErrors: 'SET_ERRORS_MESSAGE', // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setProjet: 'projets/FILL'
    }),

    ...mapActions('projets', { saveProjet: "STORE_PROJET", }),

    addProjet() {
      this.showProjetModal = true
      console.log(this.showProjetModal)
      this.fetchBailleurs(this.programmeId)
      this.titleProjet = 'Ajouter un projet'
      this.submitText = "Enregistrer"

      let formData = this.champsProjet.map((value) => {
        if (value.key === 'bailleurId') {
          value['options'] = this.bailleurs
        }

        else if (value.key === 'statut') {
          value['options'] = this.$store.state.statuts
        }

        return value

      })
      this.champsProjet = formData


    },

    fetchBailleurs(programme) {

      BailleurService.bailleursOfProgramme(programme).then((data) => {
        const datas = data.data.data
        this.bailleurs = datas
        this.champsProjet = [
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


      }).catch((error) => {

      })
    },


    getProjetFile(data) {

      this.champsProjet[7].data = data
      console.log(this.champsProjet[7].data)
      for (const property in data) {
        this.fichiers.push(data[property])
      }
      this.fichiers.pop()
      this.fichiers.pop()

    },

    getProjetImage(data) {
      this.champsProjet[6].data = data
      this.image = data
    },
    sendProjetForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        this.champsProjet = this.champsProjet.map(item => { item.errors = []; return item })
        let projet = {}

        projet = extractFormData(this.champsProjet, this.projetAttributs)
        projet.bailleurId = projet.bailleurId.id


        projet.programmeId = this.programmeId



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
            this.closeProjet()
            this.resetProjetForm()
            localStorage.removeItem('formData');
            this.fetchProjets(this.programmeId)
            this.sendRequest = false;
            this.showModal = true;
          }
        }).catch((error) => {
          this.sendRequest = false;
        })


      }


    },
    // fin all methods ajout projet
  },
  mounted() {
    this.getPermission()
    if (!this.auditVisible) {
      this.$router.push('/401-non-autorise')
    } else {
      this.getProjet()
      this.getAudit()
      this.getUser()

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

    if (localStorage.getItem("formData")) {
      this.savedInput = []
      this.savedInput = JSON.parse(localStorage.getItem("formData"))

      console.log(this.savedInput)

      this.audit.annee = this.savedInput[0]
      this.audit.entreprise = this.savedInput[1]
      this.audit.entrepriseContact = this.savedInput[2]
      this.audit.dateDeTransmission = this.savedInput[3]
      this.audit.etat = this.savedInput[4]
      this.audit.statut = this.savedInput[5]
      this.audit.categorie = this.savedInput[7]
      this.audit.projetId = this.savedInput[6]

    }


  },
  watch: {
    showProjetModal: function (value) {

      if (this.showProjetModal === false) {
        this.getProjet()
      }

    },
  }
}
</script>

<style></style>