<template>
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Liste des projets</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <button class="btn btn-primary shadow-md mr-2" @click="addProjet()">Ajouter un projet</button>
    </div>
  </div>

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="font-medium text-base mr-auto">Ajouter un projet</h2>
      <h2 v-else class="font-medium text-base mr-auto">Modifier un projet</h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom du projet" label="Nom" />
      <InputForm v-model="formData.couleur" class="col-span-12" type="color" required="required" placeHolder="Couleur" label="Couleur" />
      <InputForm v-model="formData.debut" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de début" label="Début du projet" />
      <InputForm v-model="formData.fin" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de fin" label="Fin du projet " />
      <InputForm v-model="formData.nombreEmploie" class="col-span-12" type="number" required="required" placeHolder="Ex : 10" label="Nombre d'employé" />
      <InputForm v-model="formData.ville" class="col-span-12" type="text" required="required" placeHolder="Ex : Cotonou" label="Sigle" />
      <InputForm v-model="formData.budgetNational" class="col-span-12" type="number" required="required" placeHolder="Ex : 100000" label="Budget National" />

      <InputForm class="col-span-12" type="file" @change="handleFileChange" required="required" placeHolder="choisir une image" label="Images" accept="image/*" />
      <div class="col-span-12" v-if="imagePreview">
        <h3>Prévisualisation de l'image :</h3>
        <img :src="imagePreview" alt="Prévisualisation" width="200" />
      </div>
      <div class="col-span-12">
        <label>Organisation</label>
        <div class="mt-2">
          <TomSelect
            v-model="formData.organisationId"
            :options="{
              placeholder: 'Veuillez associé une organisation au programme',
            }"
            class="w-full"
          >
            <option v-for="(org, index) in ongs" :key="index" :value="org.id">{{ org.nom }}</option>
          </TomSelect>
        </div>
      </div>
      <!-- Choix de fichier -->
      <!-- <div class="col-span-12 relative">
        <label for="modal-form-1" class="form-label font-medium">Fichier(s)</label>
        <div ref="dropzoneElement" class="dropzone z-50 min-h-[200px] w-full"></div>
      </div> -->
    </ModalBody>
    <ModalFooter>
      <div class="flex items-center justify-center">
        <button type="button" @click="showModal = false" class="btn btn-outline-secondary w-full mr-1">Annuler</button>
        <VButton class="inline-block" :label="labels" :loading="isLoading" @click="sendForm" />
      </div>
    </ModalFooter>
  </Modal>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Autres projets (copie le div ci-dessus pour chaque projet) -->
    <div v-for="(projet, index) in projets" :key="index" class="bg-white shadow-lg rounded-lg p-4 relative zoom-in">
      <h3 class="text-xl font-bold mb-2">{{ projet.nom }}</h3>
      <p class="text-gray-700 mb-4">{{ projet.description }}</p>
      <div class="flex justify-between items-center">
        <span v-if="-2" class="text-red-600 font-semibold"> Non validé </span>
        <span v-else-if="-1" class="text-green-600 font-semibold"> Validé </span>
        <span v-else-if="0" class="text-pending font-semibold"> En cours </span>
        <span v-else-if="1" class="text-red-600 font-semibold"> En retard </span>
        <span v-else-if="2" class="text-primary font-semibold">Terminé</span>
        <div class="space-x-3">
          <button class="btn btn-secondary mr-1 mb-2" title="voir détail projet">
            <EyeIcon class="w-4 h-4" />
          </button>
          <button class="btn btn-primary mr-1 mb-2" title="modifier le projet">
            <EditIcon class="w-4 h-4" />
          </button>
          <button class="btn btn-danger mr-1 mb-2" title="supprimer le projet">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgrammeService from "@/services/modules/programme.service.js";
import ProjetService from "@/services/modules/projet.service.js";
import BailleurService from "@/services/modules/bailleur.service";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { API_BASE_URL } from "@/services/configs/environment.js";
import { extractFormData } from "@/utils/index";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import OngService from "@/services/modules/ong.service.js";
import { helper as $h } from "@/utils/helper";
import { toast } from "vue3-toastify";

export default {
  components: { InputForm, VButton },
  data() {
    return {
      savedInput: [],
      base_url: API_BASE_URL,
      showModal: false,
      showSearch: false,
      line: false,
      dates: { fin: "" },
      isUpdate: false,
      submitText: "Enregistrer",
      cols: 1,
      mosaique: true,
      programmeId: this.currentUser?.programme?.id,
      showProlonger: false,
      chargement: false,
      projetId: "",
      title: "",
      search: "",
      projetAttributs: ["nom", "description", "debut", "fin", "objectifGlobaux", "budgetNational", "pret", "couleur", "ville", "bailleurId", "tauxEngagement"],
      projetAttributsUpdate: ["nom", "description", "debut", "fin", "objectifGlobaux", "budgetNational", "pret", "couleur", "ville", "tauxEngagement"],
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
      projetId: "",
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
      formData: {
        nom: "",
        couleur: "",
        debut: "",
        fin: "",
        ville: "",
        organisationId: "",
        nombreEmploie: Number,
        budgetNational: Number,
      },
      dropzoneMultipleRef: null,
      FormProjet: new FormData(),
      isLoading: false,
      ongs: [],
      selectedFile: null, // Pour stocker le fichier sélectionné
      imagePreview: null, // Pour afficher la prévisualisation de l'imag
    };
  },

  computed: {
    //importation des variables du module auths
    ...mapState({
      identifiant: (state) => state.auths.identifiant,
      projet: (state) => state.projets.projet,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),

    ...mapGetters({
      projet: "getProjet",
      //bailleurs: "bailleurs/getBailleurs",
      currentUser: "auths/GET_AUTHENTICATE_USER",
    }),
    filteredProjet() {
      var self = this;
      return this.projets.filter(function (projet) {
        return projet.bailleur.sigle.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 || projet.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 || projet.codePta.toLowerCase().indexOf(self.search.toLowerCase()) >= 0;
      });
    },
  },

  methods: {
    resetFileInput() {
      // Réinitialiser le champ de fichier
      this.selectedFile = null; // Réinitialiser la variable selectedFile
      this.imagePreview = null; // Réinitialiser la prévisualisation
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;

        // Créer une prévisualisation de l'image
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
      }
    },
    ajouterFormNormalDansFormData() {
      for (let key in this.formNormal) {
        if (this.formNormal.hasOwnProperty(key)) {
          this.formData.append(key, this.formNormal[key]);
        }
      }
    },
    fetchOngs() {
      // this.active();

      OngService.get()
        .then((data) => {
          const datas = data.data.data;
          this.ongs = datas;

          // this.disabled();
        })
        .catch((error) => {
          // this.disabled();
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            // this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },
    initializeDropzone() {
      const dropzoneElement = this.$refs.dropzoneElement;

      // Initialisation explicite de Dropzone
      this.dropzoneInstance = new Dropzone(dropzoneElement, {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 1000,
        addRemoveLinks: true,
        dictDefaultMessage: "Déposez les fichiers ici pour les télécharger",
        dictFallbackMessage: "Votre navigateur ne prend pas en charge les téléchargements de fichiers par glisser-déposer.",
        dictCancelUpload: "Annuler chargement",
        dictUploadCanceled: "Chargement Annulé.",
        dictCancelUploadConfirmation: "Êtes-vous sûr de vouloir annuler ce téléchargement ?",
        dictRemoveFile: "Supprimer le fichier",
        dictMaxFilesExceeded: "Vous ne pouvez plus charger de fichiers.",
        headers: { "My-Awesome-Header": "header value" },
      });
      const dropzoneRef = null;
      // Gestion des événements de Dropzone après initialisation
      this.dropzoneInstance.on("addedfile", (file) => {
        var myDropzone = this;
        dropzoneRef = myDropzone;

        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryData = event.target.result;
          return binaryData;
        };
        reader.readAsBinaryString(file);
        // this.FormProjet.append("fichier[]", file);

        // this.FormProjet.forEach((value, key) => {
        //   console.log(`${key}: ${value}`);
        // });
      });
      this.dropzoneMultipleRef = dropzoneRef;
      console.log(this.dropzoneMultipleRef);
    },
    getFile(data) {
      this.champs[7].data = data;
      for (const property in data) {
        this.fichiers.push(data[property]);
      }
      this.fichiers.pop();
      this.fichiers.pop();
    },
    getImage(data) {
      this.champs[6].data = data;
      this.image = data;
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-projet") {
          this.projetVisible = true;
        }
        if (element.slug === "creer-un-projet") {
          this.projetAdd = true;
        }
        if (element.slug === "modifier-un-projet") {
          this.projetUpdate = true;
        }
        if (element.slug === "supprimer-un-projet") {
          this.projetDelete = true;
        }
        if (element.slug === "voir-details-projet") {
          this.dashboardProjetVisible = true;
        }
        if (element.slug === "voir-un-bailleur") {
          this.bailleurVisible = true;
        }
        if (element.slug === "validation") {
          this.validation = true;
        }
      });
    },
    prolonger(projet) {
      this.projetId = projet.id;
      this.showProlonger = true;
    },
    gotoNext(projet, index) {
      const profondeurProjet = {
        isClick: true,
        position: index,
        id: projet.id,
      };

      localStorage.setItem("profondeurProjet", JSON.stringify(profondeurProjet));
      this.$router.push({ name: "dashboard_projets_composantes_globale" });
    },

    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    fetchProjets(programme) {
      this.active();
      ProgrammeService.projets(programme)
        .then((data) => {
          const datas = data.data.data;
          this.projets = datas;
          this.disabled();
        })
        .catch((error) => {
          this.disabled();
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setProjet: "projets/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
    }),

    ...mapActions("projets", {
      saveProjet: "STORE_PROJET",
      prolongerDateProjet: "PROLONGER_DATE_PROJET",
      updateProjet: "UPDATE_PROJET",
      deleteProjet: "DESTROY_PROJET",
    }),

    // ...mapActions('bailleurs', { fetchBailleurs: 'FETCH_LIST_BAILLEUR_OF_PROGRAMME' }),

    gotoDetails(projet) {
      if (this.dashboardProjetVisible) {
        this.$router.push({ name: "projets_id_details", params: { id: projet.id, projet: projet } });
      }
    },

    addDate() {
      this.dates.push({});
    },

    close() {
      this.showCloseModal();
      this.resetForm();
      this.sendRequest = false;
    },
    close2() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = [];
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data);
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem("formData", parsed);
    },

    showCloseModal(value = false) {
      this.showModal = value;
    },

    addProjet() {
      // this.title = "Ajouter";
      // this.submitText = "Enregistrer";:
      this.isUpdate = false;
      this.showCloseModal(true);
    },

    modifierProjet(projet) {
      localStorage.removeItem("formData");
      this.isUpdate = true;
      this.title = "Modifier un projet";

      this.submitText = "Modifier";

      this.projetId = projet.id;

      this.projetAttributsUpdate.forEach((item) => {
        this.champsUpdate.find((value, index) => {
          if (value.key !== "statut") {
            if (value.key === item) {
              this.champsUpdate[index]["data"] = projet[item];
            }
          }
        });
      });

      this.showCloseModal(true);
    },

     supprimerProjet(projet, index) {
      this.deleteModal = true;
      this.deleteData.data = projet;
      this.deleteData.index = index;
    },

    deleteProjets(data) {
      this.filteredProjet.splice(data.index, 1);
      this.deleteModal = false;
      ProjetService.destroy(data.data.id)
        .then((data) => {
          this.$toast.success("Operation effectué avec success !");
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },

    saveProlongerDate() {
      this.chargement = true;

      this.prolongerDateProjet({ projet: this.dates, id: this.projetId })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.showProlonger = false;

            this.fetchProjets(this.programmeId);
          }
        })
        .catch((error) => {
          alert(error.response?.data?.errors["fin"]);
        });

      this.chargement = false;
    },

    dupliquer() {
      this.title = "Dupliquer projet existant";
      this.showModal = true;
    },

    resetForm() {
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });

      window.document.getElementById("vform").reset();

      this.setProjet({});
    },

    sendForm() {
      if (this.update) {
        projet.statut = projet.statut;
        this.updateProjet({ projet: projet, id: projet?.id })
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.sendRequest = false;
              this.fetchProjets(this.programmeId);
              this.close();
            }
          })
          .catch((error) => {
            this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors });
            this.sendRequest = false;
            this.champs.map((value) => (value.errors = this.erreurs[value.key]));
          });
      } else {
        for (const key of Array.from(this.FormProjet.keys())) {
          this.FormProjet.delete(key);
        }

        $h.ajouterObjetDansFormData(this.formData, this.FormProjet);

        if (this.selectedFile) {
          this.FormProjet.append("fichier[]", this.selectedFile);
        }

        //projet.statut = -2;
        this.FormProjet.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        this.isLoading = true;
        this.saveProjet(this.FormProjet)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              this.resetFileInput();
              $h.clearFormData(this.FormProjet);
              $h.clearObjectValues(this.formData);

              this.FormProjet.forEach((value, key) => {
                console.log(`${key}: ${value}`);
              });
              console.log(this.formData);
              toast.success("Ajout éffectuée avec succès");
              this.showModal = false;
              // this.resetForm();
              console.log(this.programmeId);
              this.fetchProjets(this.programmeId);
              alert("ok");
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
            //  $h.supprimerFichier(this.FormProjet, "fichier[]", this.dropzoneMultipleRef);
            $h.clearFormData(this.FormProjet);
            toast.error(error.response.data.errors.message);
            // this.sendRequest = false;
          });
      }
    },

    validerProjet(id) {
      let projet = {};
      projet.statut = -1;
      this.updateProjet({ projet: projet, id: id })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.$toast.success("projet valider");
            this.fetchProjets(this.programmeId);
          }
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
    },
    fetchBailleurs(programme) {
      BailleurService.bailleursOfProgramme(programme)
        .then((data) => {
          const datas = data.data.data;
          this.bailleurs = datas;
          this.champs = [
            { name: "Nom du projet", key: "nom", type: "text", placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: "", required: true, title: "renseigner le nom du projet", errors: [] },
            { name: "Prêt", type: "number", key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Budget Nationnal", key: "budgetNational", type: "number", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Date début", key: "debut", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true },
            { name: "Date fin", type: "date", key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Couleur", type: "color", key: "couleur", placeholdere: "Choississez une couleur", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "couverture du projet", type: "file", placeholdere: "Choississez une couverture", isImage: true, isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Pièce jointe", type: "file", placeholdere: "televerser des fichiers", isSelect: false, isImage: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Ville", key: "ville", type: "", placeholdere: "Selectionnez une ville", isSelect: true, isTextArea: false, data: "", required: true, options: ["cotonou", "calavi", "bohicon"], isSimpleTable: true, errors: [] },
            { name: "Bailleur", key: "bailleurId", type: "", placeholdere: "Selectionnez un bailleur", isSelect: true, isTextArea: false, data: "", required: true, options: datas, cle: "id", value: "sigle", errors: [] },
            { name: "Objectifs globaux", key: "objectifGlobaux", type: "", placeholdere: "", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
            { name: "Objectifs specifiques", key: "objectifSpecifique", type: "text", placeholdere: "Definir les objectifs", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Taux engagement", key: "tauxEngagement", type: "text", placeholdere: "Taux engagement", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Description", type: "", key: "description", placeholdere: "Description du projet", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
          ];
          this.champsUpdate = [
            { name: "Nom du projet", key: "nom", type: "text", placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Prêt", type: "text", key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Budget Nationnal", key: "budgetNational", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Date début", key: "debut", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true },
            { name: "Date fin", type: "date", key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Couleur", type: "color", key: "couleur", placeholdere: "Choississez une couleur", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Ville", key: "ville", type: "", placeholdere: "Selectionnez une ville", isSelect: true, isTextArea: false, data: "", required: true, options: ["cotonou", "calavi", "bohicon"], isSimpleTable: true, errors: [] },
            { name: "Objectifs globaux", key: "objectifGlobaux", type: "", placeholdere: "", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
            { name: "Objectif specifique", key: "objectifSpecifique", type: "text", placeholdere: "Definir les objectifs", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Taux engagement", key: "tauxEngagement", type: "text", placeholdere: "Taux engagement", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Description", type: "", key: "description", placeholdere: "Description du projet", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
          ];
        })
        .catch((error) => {});
    },
  },
  mounted() {
    // Initialiser Dropzone après le montage du composant
    //  this.initializeDropzone();
    this.fetchOngs();
  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {
      this.champs.forEach((value) => {
        value.errors = errors[value.key];
      });
    },
  },

  created() {
    this.getPermission();
    if (!this.projetVisible) {
      this.$router.push("/401-non-autorise");
    }
    this.programmeId = this.currentUser.programme.id;
    if (this.programmeId) {
      if (this.bailleurVisible) {
        this.fetchBailleurs(this.programmeId);
        this.fetchProjets(this.programmeId);
      } else {
        this.fetchProjets(this.programmeId);
      }
    }
  },
};
</script>

<style scoped>
.icon-bold {
  font-weight: 800;
}
.dropdown-content {
  transform: translate(200px, 200px);
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
