<script>
import { createIcons, icons } from "lucide";
createIcons({ icons });

import OngService from "@/services/modules/ong.service.js";
import ProgrammeService from "@/services/modules/programme.service.js";
import BailleurService from "@/services/modules/bailleur.service";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import extractFormData from "@/utils/extract-data";
import { advancedTable } from "../../constant/basic-tablle-data";
import xlsx from "xlsx";
import Tabulator from "tabulator-tables";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import { toast } from "vue3-toastify";

export default {
  components: {
    InputForm,
    VButton,
  },

  data() {
    return {
      ajoutLoading: false,
      programmes: [],
      savedInput: [],
      ongAttributs: ["dossier", "statut", "dateSoumission", "destinataire", "bailleurId", "fichiers"],
      ongAttributsUpdate: ["dossier", "statut", "dateDeSoumission", "destinataire", "bailleurId"],
      commentaires: [],
      data: {},
      showModal: false,
      showInput: true,
      showDetail: false,
      search: "",
      title: "",
      statut: "",
      ongVisible: false,
      ongAdd: false,
      ongDelete: false,
      ongUpdate: false,
      bailleurVisible: false,
      voirDetailOng: false,
      commentaireVisible: false,
      ongRelancer: false,
      reponseOngVisible: false,
      reponseOngAdd: false,
      readPDF: false,
      pdfFile: "",
      chargement: false,
      Relance: {
        statut: null,
        files: [],
        commentaire: "",
      },
      statuts: [
        { name: "validé", value: 1 },
        { name: "non validé", value: -1 },
      ],
      statutsOng: [
        {
          nom: "Non validé",
          etat: -1,
        },
        {
          nom: "Validé",
          etat: 1,
        },
      ],
      champs: [],
      champsUpdate: [],
      datas: [],
      cols: 1,
      headers: [
        { name: "Dossier", cle: "dossier" },
        { name: "Bailleur", props: "bailleur", cle: "sigle" },
        { name: "Date soumission", cle: "dateDeSoumission" },
        { name: "Destinataire", cle: "destinataire" },
        { name: "Date de création", cle: "created_at" },
      ],
      actions: [{ name: "supprimer", iconne: "" }, { name: "detail" }, { name: "modifier", iconne: "" }, { name: "reponse" }],
      actionsDetail: [{ name: "detail" }],
      actionsDelete: [{ name: "supprimer", iconne: "" }, { name: "detail" }],
      actionsReponse: [{ name: "reponse" }, { name: "detail" }],
      sendRequest: false,

      fichiers: [],
      pdf: [
        { url: "/upload/ppm -2022.pdf", title: "ppm -2022.pdf" },
        { url: "/upload/pta -2022.pdf", title: "pta -2022.pdf" },
      ],
      showReponse: false,
      ongsId: "",
      showComment: false,
      ongs: [],
      ongId: "",
      ongsReponses: [],
      isUpdate: false,
      bailleurs: [],
      programmeId: [],
      deleteData: {},
      deleteModal: false,
      advancedTable,
      tabulator: null,
      filterField: "",
      filterType: "=",
      filterValue: "",
      tableExemple: [
        { nom: "joe", taille: "170cm", age: "14 ans", stats: "actif" },
        { nom: "Jack", taille: "120cm", age: "99 ans", stats: "inactif" },
        { nom: "Avril", taille: "70cm", age: "82 ans", stats: "tetraPlégique" },
        { nom: "William", taille: "130cm", age: "1 ans", stats: "jeune" },
      ],
      programmes: [],
      formData: {
        nom: "",
        contact: "",
        email: "@gmail.com",
        sigle: "",
        code: "",
        //programmeId: "",
      },
      showDeleteModal: false,
      isLoading: false,
      labels: "Ajouter",
    };
  },

  computed: {
    // importation des variables du module auths
    ...mapState({
      loading: (state) => state.loading,
      errors: (state) => state.errors,
      programme: (state) => state.programmes.programme,
    }),
    //importation des variables du module auths

    ...mapGetters({
      hasErrors: "GET_ERREURS",
      isLoading: "IS_LOADING",

      ong: "ongs/getOng",
      typeOngs: "typeOngs/getTypeOngs",
      currentUser: "auths/GET_AUTHENTICATE_USER",
    }),
  },

  methods: {
    supprimer(data) {
      this.showDeleteModal = true;
      this.ongsId = data.id;
      console.log(this.showDeleteModal);
    },
    modifierOrganisation(data) {
      this.ongsId = data.id;
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.contact = data.user.contact;
      this.formData.email = data.user.email;
      this.formData.sigle = data.sigle;
      this.formData.code = data.code;
      // this.formData.programmeId = data.projet.programmeId;
    },
    clearObjectValues(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let value = obj[key];

          if (typeof value === "string") {
            obj[key] = "";
          } else if (typeof value === "number") {
            obj[key] = 0;
          } else if (typeof value === "boolean") {
            obj[key] = false;
          } else if (Array.isArray(value)) {
            obj[key] = [];
          } else if (typeof value === "object" && value !== null) {
            obj[key] = {}; // ou appliquer récursion pour vider les objets imbriqués
            clearObjectValues(obj[key]); // récursion pour les objets imbriqués
          } else {
            obj[key] = null; // pour les autres types (null, undefined, etc.)
          }
        }
      }
    },
    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    fetchOngs() {
      // this.active();
      OngService.get()
        .then((data) => {
          const datas = data.data.data;
          this.ongs = datas;

          this.initTabulator();
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
    fetchProgrammes() {
      // this.active();
      ProgrammeService.get()
        .then((data) => {
          const datas = data.data.data;
          this.programmes = datas;

          // this.initTabulator();
          // this.disabled();
        })
        .catch((error) => {
          // this.disabled();
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },
    previewFiles(event) {
      const data = event.target.files;
      for (const property in data) {
        this.Relance.files.push(data[property]);
      }
      this.Relance.files.pop();
      this.Relance.files.pop();
    },
    seeUpload(data) {
      this.datas = data;
      this.showDetail = true;
    },
    closeReponse() {
      this.showReponse = false;
      this.Relance.statut = null;
      this.Relance.files = [];
      this.Relance.commentaires = "";
    },
    closeCommentaire() {
      this.showComment = false;
      this.ongsReponses = [];
    },
    reponseOng(data) {
      this.ongsId = data.id;
      this.showReponse = true;
      this.title = "Reponse un ong";
    },
    commenter(data) {
      this.ongsId = data.id;
      this.statut = data.statut;
      this.getOngsReponse(data.id);
      this.showComment = true;
      this.title = "reponses";
    },
    getOngsReponse(id) {
      OngService.getReponseOngs(id)
        .then((data) => {
          const datas = data.data.data;
          datas.forEach((element) => {
            let auteur = "non definit";
            if (element.auteur != null) {
              auteur = element.auteur.nom;
            }
            const ongid = element.ongsId;
            const commentaire = element.commentaire;
            const bailleur = element.bailleur.sigle;
            const date = element.created_at;
            const documents = element.documents;
            const idReponse = element.id;
            this.ongsReponses.push({ ongid, commentaire, bailleur, date, documents, idReponse, date, auteur });
          });
        })
        .catch((error) => {
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

    getFile(data) {
      for (const property in data) {
        this.fichiers.push(data[property]);
      }
      this.fichiers.pop();
      this.fichiers.pop();
    },
    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    getPermission() {
      JSON.parse(localStorage.getItem("authenticateUser")).role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-ong") {
          this.ongVisible = true;
        }
        if (element.slug === "creer-un-ong") {
          this.ongAdd = true;
        }
        if (element.slug === "modifier-un-ong") {
          this.ongUpdate = true;
        }
        if (element.slug === "supprimer-un-ong") {
          this.ongDelete = true;
        }
        if (element.slug === "voir-une-reponse-ong") {
          this.reponseOngVisible = true;
        }
        if (element.slug === "creer-une-reponse-ong") {
          this.reponseOngAdd = true;
        }

        if (element.slug === "voir-un-bailleur") {
          this.bailleurVisible = true;
        }
      });
    },
    customFilter(data) {
      return data.car && data.rating < 3;
    },
    updateFilter() {
      this.tabulator.setFilter(this.filterField, this.filterType, this.filterValue);
    },
    clearFilter() {
      this.filterField = "nom";
      this.filterType = "like";
      this.filterValue = "";
      this.updateFilter();
    },
    initTabulator() {
      this.tabulator = new Tabulator("#tabulator", {
        data: this.ongs,

        selectableRows: true, //assign data to table
        layout: "fitColumns",
        columns: [
          {
            title: "Nom",
            field: "nom",
            minWidth: 125,
            hozAlign: "left",
          },
          {
            title: "Sigle",
            field: "sigle",
            minWidth: 150,
          },

          {
            title: "Projet associé",
            field: "projet",
            minWidth: 150,
            hozAlign: "left",
            hozAlign: "left",
            formatter(cell) {
              if (cell.getData().projet !== null) {
                return `<div> ${cell.getData().projet.nom ?? "a"}</div>`;
              } else {
                return `<div>--</div>`;
              }
            },
          },
          {
            title: "E-mail",
            field: "user",
            minWidth: 150,
            hozAlign: "left",
            hozAlign: "left",
            formatter(cell) {
              if (cell.getData().user.email !== null) {
                return `<div> ${cell.getData().user.nom}</div>`;
              } else {
                return `<div></div>`;
              }
            },
          },
          {
            title: "Contact",
            field: "user",
            minWidth: 150,
            hozAlign: "left",
            hozAlign: "left",
            formatter(cell) {
              if (cell.getData().user.contact !== null) {
                return `<div> ${cell.getData().user.contact}</div>`;
              } else {
                return `<div></div>`;
              }
            },
          },

          {
            title: "Date de création",
            field: "created_at",
            minWidth: 150,
            hozAlign: "left",
          },
          {
            title: "Actions",
            field: "actions",
            formatter: function (cell, formatterParams) {
              return ` 
              <div class="flex items-center gap-3">
                  <button class='btn-supprimer btn btn-danger'>
                    Supprimer
                  </button>
                   <button class='btn-modifier btn btn-primary'>
                    Modifier
                  </button>
                </div>
               `;
            },
            cellClick: (e, cell) => {
              console.log(e);
              // Utilisation d'une fonction fléchée pour garder le contexte de `this`
              const rowData = cell.getRow().getData();
              if (e.target.classList.contains("btn-modifier")) {
                this.modifierOrganisation(rowData);
              } else if (e.target.classList.contains("btn-supprimer")) {
                this.supprimer(rowData);
              }
            },
          },
        ],
      });
    },

    // Export
    onExportCsv() {
      this.tabulator.download("csv", "data.csv");
    },

    onExportJson() {
      this.tabulator.download("json", "data.json");
    },

    onExportXlsx() {
      const win = window;
      win.XLSX = xlsx;
      this.tabulator.download("xlsx", "data.xlsx", {
        sheetName: "Products",
      });
    },

    onExportHtml() {
      this.tabulator.download("html", "data.html", {
        style: true,
      });
    },

    // Print
    onPrint() {
      this.tabulator.print();
    },

    // call action
    ...mapActions("ongs", {
      saveOng: "STORE_ONG",
      updateOng: "UPDATE_ONG",
      deleteOng: "DESTROY_Ong",
    }),

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setOng: "ongs/FILL",
    }),

    ...mapActions("typeOngs", { fetchTypeOngs: "FETCH_LIST_TYPE_Ong" }),

    resetForm() {
      //delete data in form after submit
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });
      window.document.getElementById("vform")?.reset();
      this.setOng({});
    },

    sendReponse() {
      if (this.chargement == false) {
        this.chargement = true;
        const formData = new FormData();
        formData.append("statut", this.Relance.statut);
        formData.append("commentaire", this.Relance.commentaire);
        formData.append("ongId", this.ongsId);
        /* formData.append('reponseId',null) */

        for (let i = 0; i < this.Relance.files.length; i++) {
          let file = this.Relance.files[i];
          formData.append("fichier" + i, file);
        }
        OngService.reponseOngs(formData)
          .then(() => {
            this.$toast.success("operation effectué avec success !!!");
            this.showReponse = false;
            this.chargement = false;
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
            this.chargement = false;
          });
      }
    },
    sendForm() {
      if (this.update) {
        console.log("ongId", this.ongsId);
        this.ajoutLoading = true;
        this.updateOng({ ong: this.formData, id: this.ongsId })
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update =false
              this.ajoutLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.close();
              this.clearObjectValues(this.formData);
              this.fetchOngs();
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.ajoutLoading = false;
            toast.error(error.message);
            // this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors });
            // this.sendRequest = false;
            // this.champs.map((value) => (value.errors = this.erreurs[value.key]));
          });
      } else {
        this.sendRequest = true;

        this.ajoutLoading = true;
        this.saveOng(this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.ajoutLoading = false;
              toast.success("Ajout éffectué");
              this.close();
              this.clearObjectValues(this.formData);
              // this.resetForm();
              // localStorage.removeItem("formData");
              // this.sendRequest = false;
              this.fetchOngs();
            }
          })
          .catch((error) => {
            toast.error(error.message);

            this.ajoutLoading = false;
            // this.getFile();
            // this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors });
            // this.sendRequest = false;

            // this.champs.map((value) => (value.errors = this.erreurs[value.key]));
          });
      }
    },

    addOng() {
      this.title = "Ajouter";
      this.showModal = true;
      this.isUpdate = false;
    },

    modifier(ong) {
      localStorage.removeItem("formData");
      this.isUpdate = true;
      this.title = "Modifier ";
      this.showModal = true;

      this.submitText = "Modifier";

      this.ongId = ong.id;

      this.ongAttributsUpdate.forEach((item) => {
        this.champsUpdate.find((value, index) => {
          if (value.key !== "statut") {
            if (value.key === item) {
              this.champsUpdate[index]["data"] = ong[item];
            }
          }
        });
      });
    },

    deleteOngs() {
      // this.ongs.splice(data.index, 1);
      // this.deleteModal = false;
     
      this.isLoading = true;
      OngService.destroy(this.ongsId)
        .then((data) => {
  
          this.isLoading = false;
          this.showDeleteModal  = false
          toast.success("Suppression  éffectuée avec succès");
          this.fetchOngs();
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.isLoading = false;
            toast.success(message);
         
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },

    fetchBailleurs(programme) {
      BailleurService.bailleursOfProgramme(programme)
        .then((data) => {
          const datas = data.data.data;
          this.bailleurs = datas;
          this.champs = [
            { name: "Objet", key: "dossier", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Bailleurs", key: "bailleurId", type: "", placeholdere: "Selectionnez le bailleur", isSelect: true, isTextArea: false, data: "", required: false, options: datas, cle: "id", value: "sigle", errors: [] },
            { name: "Date de soumission", key: "dateSoumission", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Destinataire", key: "destinataire", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Pièce jointe", key: "fichiers", type: "file", placeholdere: "televerser des fichiers", isSelect: false, isImage: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Description", key: "", type: "", placeholdere: "Description", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
            { name: "Status", key: "statut", type: "", placeholdere: "Selectionnez une valeur", isSelect: true, isTextArea: false, data: "", options: this.statutsOng, cle: "etat", value: "nom", required: true, errors: [] },
          ];
          this.champsUpdate = [
            { name: "Objet", key: "dossier", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Bailleurs", key: "bailleurId", type: "", placeholdere: "Selectionnez le bailleur", isSelect: true, isTextArea: false, data: "", required: false, options: datas, cle: "id", value: "sigle", errors: [] },
            { name: "Date de soumission", key: "dateDeSoumission", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Destinataire", key: "destinataire", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Status", key: "statut", type: "", placeholdere: "Selectionnez une valeur", isSelect: true, isTextArea: false, data: "", options: this.statutsOng, cle: "etat", value: "nom", required: true, errors: [] },
          ];
        })
        .catch((error) => {});
    },

    close() {
      this.showModal = false;
      this.resetForm();
    },
    close2() {
      this.showModal = false;
      this.savedInput = [];
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data);
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem("formData", parsed);
    },
  },
  mounted() {
    this.fetchProgrammes();
    // this.test();
    // this.initTabulator();
  },

  created() {
    this.getPermission();
    // if (!this.ongVisible) {
    //   this.$router.push("/401-non-autorise");
    // } else {
    //   if (this.bailleurVisible) {
    //     this.programmeId = JSON.parse(localStorage.getItem("authenticateUser")).programme.id;
    //     this.fetchBailleurs(this.programmeId);
    //   }
    //   this.fetchOngs();
    // }

    if (this.bailleurVisible) {
      this.programmeId = JSON.parse(localStorage.getItem("authenticateUser")).programme.id;
      this.fetchBailleurs(this.programmeId);
    }
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
      //this.errors = errors
    },

    // map du statut dans Store
    statuts: function (statuts) {
      this.champs.map((item) => {
        if (item.key === "statut") {
          item.options = statuts.map((statut) => {
            return {
              id: statut.etat,
              nom: statut.nom,
            };
          });
        }
        return item;
      });
    },
  },
};
</script>

<template>
  <Modal :show="showDeleteModal" @hidden="showDeleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Etes vous sûr?</div>
        <div class="mt-2 text-slate-500">Voulez vous supprimer l'organisation ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="showDeleteModal = false" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="isLoading" label="Supprimer" @click="deleteOngs" />
      </div>
    </ModalBody>
  </Modal>

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter une organisation</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier une organisation</h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'organisation" label="Nom" />
      <InputForm v-model="formData.contact" class="col-span-12" type="number" required="required" placeHolder="Contact" label="Téléphone" />
      <InputForm v-model="formData.email" class="col-span-12" type="email" required="required" placeHolder="Entrer le mail de l'organisation" label="E-mail" />
      <InputForm v-model="formData.code" class="col-span-12" type="number" required="required" placeHolder="Ex : 2" label="Code" />
      <InputForm v-model="formData.sigle" class="col-span-12" type="text" required="required" placeHolder="Ex : APF" label="Sigle" />

      <!-- <div class="col-span-12">
        <label>Programme</label>
        <div class="mt-2">
          <TomSelect
            v-model="formData.programmeId"
            :options="{
              placeholder: 'Veuillez choisir le programme auquel est associé l\'organisation',
            }"
            class="w-full"
          >
            <option v-for="(program, index) in programmes" :key="index" :value="program.id">{{ program.nom }}</option>
          </TomSelect>
        </div>
      </div> -->
    </ModalBody>
    <ModalFooter>
      <div class="flex items-center justify-center">
        
        <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton class="inline-block" :label="labels" :loading="ajoutLoading" @click="sendForm" />
        <!-- <button type="button" class="w-20 btn btn-primary">Send</button> -->
      </div>
    </ModalFooter>
  </Modal>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Organisation</h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <button class="mr-2 shadow-md btn btn-primary" @click="showModal = true ,  labels = 'Ajouter' ">Ajouter une organisation</button>
    </div>
  </div>
  <!-- BEGIN: HTML Table Data -->
  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-wrap flex-end _sm:items-end _xl:items-start">
      <div class="flex mt-5 sm:mt-0">
        <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto" @click="onPrint"><PrinterIcon class="w-4 h-4 mr-2" /> PDF</button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Exporter
            <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem @click="onExportCsv"> <FileTextIcon class="w-4 h-4 mr-2" /> Export CSV </DropdownItem>
              <DropdownItem @click="onExportJson"> <FileTextIcon class="w-4 h-4 mr-2" /> Export JSON </DropdownItem>
              <DropdownItem @click="onExportXlsx"> <FileTextIcon class="w-4 h-4 mr-2" /> Export XLSX </DropdownItem>
              <DropdownItem @click="onExportHtml"> <FileTextIcon class="w-4 h-4 mr-2" /> Export HTML </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="overflow-x-auto scrollbar-hidden">
      <div id="tabulator" ref="tableRef" class="mt-5 table-report table-report--tabulator"></div>
    </div>
  </div>
  <!-- END: HTML Table Data -->
</template>
