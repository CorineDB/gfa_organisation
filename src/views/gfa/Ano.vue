<script>
// import ModalTopRight from '@/components/ModalTopRight'
// import SearchBar from '@/components/SearchBar'
// import Vtable from '@/components/Vtable'
// import Vform from '@/components/Vform'
// import Vmodal from '@/components/Vmodal'
// import Dashboard from '@/layouts/Dashboard'
// import Preview from '@/components/Preview.vue'
// import Vbutton from '@/components/Vbutton.vue'
// import ModalChat from '@/components/ModalChat'
// import Commentaire from '@/components/Commentaire.vue'
// import ReponseAnos from '@/components/ReponseAnos.vue'
// import PermissionsService from "@/services/modules/permission.service.js";
//import DeleteAlert from "@/components/DeleteAlert.vue";
// import { createIcons, icons } from "lucide";
// import dom from "@left4code/tw-starter/dist/js/dom";

import AnosService from "@/services/modules/ano.service.js";
import BailleurService from "@/services/modules/bailleur.service";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import extractFormData from "@/utils/extract-data";
import { advancedTable } from "../../constant/basic-tablle-data";
import xlsx from "xlsx";
import Tabulator from "tabulator-tables";

export default {
  components: {},

  data() {
    return {
      savedInput: [],
      anoAttributs: ["dossier", "statut", "dateSoumission", "destinataire", "bailleurId", "fichiers"],
      anoAttributsUpdate: ["dossier", "statut", "dateDeSoumission", "destinataire", "bailleurId"],
      commentaires: [],
      data: {},
      showModal: false,
      showInput: true,
      showDetail: false,
      search: "",
      title: "",
      statut: "",
      anoVisible: false,
      anoAdd: false,
      anoDelete: false,
      anoUpdate: false,
      bailleurVisible: false,
      voirDetailAno: false,
      commentaireVisible: false,
      anoRelancer: false,
      reponseAnoVisible: false,
      reponseAnoAdd: false,
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
      statutsAno: [
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
      anosId: "",
      showComment: false,
      anos: [],
      anoId: "",
      anosReponses: [],
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
    };
  },

  computed: {
    //  importation des variables du module auths
    // ...mapState({
    //   loading: (state) => state.loading,
    //   errors: (state) => state.errors,
    // }),
    // ...mapGetters({
    //   hasErrors: "GET_ERREURS",
    //   isLoading: "IS_LOADING",
    //   ano: "anos/getAno",
    //   typeAnos: "typeAnos/getTypeAnos",
    //   currentUser: "auths/GET_AUTHENTICATE_USER",
    // }),
  },

  methods: {
    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    fetchAnos() {
      // this.active();
      AnosService.get()
        .then((data) => {
          const datas = data.data.data;
          this.anos = datas;

          this.initTabulator();
          // this.disabled();
        })
        .catch((error) => {
          // this.disabled();
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
      this.anosReponses = [];
    },
    reponseAno(data) {
      this.anosId = data.id;
      this.showReponse = true;
      this.title = "Reponse un ano";
    },
    commenter(data) {
      this.anosId = data.id;
      this.statut = data.statut;
      this.getAnosReponse(data.id);
      this.showComment = true;
      this.title = "reponses";
    },
    getAnosReponse(id) {
      AnosService.getReponseAnos(id)
        .then((data) => {
          const datas = data.data.data;
          datas.forEach((element) => {
            let auteur = "non definit";
            if (element.auteur != null) {
              auteur = element.auteur.nom;
            }
            const anoid = element.anosId;
            const commentaire = element.commentaire;
            const bailleur = element.bailleur.sigle;
            const date = element.created_at;
            const documents = element.documents;
            const idReponse = element.id;
            this.anosReponses.push({ anoid, commentaire, bailleur, date, documents, idReponse, date, auteur });
          });
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
      this.currentUser.role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-ano") {
          this.anoVisible = true;
        }
        if (element.slug === "creer-un-ano") {
          this.anoAdd = true;
        }
        if (element.slug === "modifier-un-ano") {
          this.anoUpdate = true;
        }
        if (element.slug === "supprimer-un-ano") {
          this.anoDelete = true;
        }
        if (element.slug === "voir-une-reponse-ano") {
          this.reponseAnoVisible = true;
        }
        if (element.slug === "creer-une-reponse-ano") {
          this.reponseAnoAdd = true;
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
      alert("ok");
      console.log(this.anos);
      this.tabulator = new Tabulator("#tabulator", {
        data: this.anos,
        rowClickMenu: [
          {
            label: "Modifier",
            action: function (e, row) {
              console.log(row);
              row.delete();
            },
          },
          {
            label: "Suprimer",
            action: function (e, row) {
              row.delete();
            },
          },
        ],
        // printHeader: "<h1 class='pdfPrint' >TABLEAU DE LA PAGE PROJET</h1>",
        selectableRows: true, //assign data to table
        layout: "fitColumns",
        columns: [
          //Define Table Columns
          {
            title: "Dossier",
            field: "dossier",
            minWidth: 125,
            hozAlign: "left",
          },
          {
            title: "Bailleur",
            field: "bailleur",
            minWidth: 150,
            hozAlign: "left",
            formatter(cell) {
              return `${cell.getData().bailleur.sigle}`;
            },
          },
          // { title: "AGE", field: "age", minWidth: 150, hozAlign: "left" },
          {
            title: "Date de soumissions",
            field: "dateDeSoumission",
            minWidth: 150,
            hozAlign: "left",
          },
          {
            title: "Destinataire",
            field: "destinataire",
            minWidth: 150,
            hozAlign: "left",
          },
          {
            title: "Date de création",
            field: "created_at",
            minWidth: 150,
            hozAlign: "left",
          },
          {
            title: "STATUT",
            minWidth: 200,
            field: "statut",
            hozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              return `<div class="flex items-center lg:justify-center ${cell.getData().statut ? "text-success" : "text-danger"}">
                <i data-lucide="check-square" class="w-4 h-4 mr-2"></i> ${cell.getData().statut ? "Active" : "Inactive"}
              </div>`;
            },
          },
          {
            title: "ACTIONS",
            minWidth: 200,
            field: "actions",
            responsive: 1,
            hozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,

            formatter() {
              // Créer un conteneur pour le bouton et le menu dropdown
              const div = document.createElement("div");
              div.className = "relative inline-block text-left";

              // Créer le bouton pour ouvrir le menu dropdown
              const button = document.createElement("button");
              button.className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none";
              button.innerHTML = "Options";

              // Créer le menu dropdown caché
              const menu = document.createElement("div");
              menu.className = "absolute right-0 -mt-6 w-48 bg-white border border-gray-300 rounded shadow-lg hidden z-50";
              // menu.style.zIndex = "9999"; // Définir un z-index élevé pour le menu dropdown
              menu.innerHTML = `
            <ul class="py-1">
              <li><a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a></li>
              <li><a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</a></li>
            </ul>
          `;

              div.appendChild(button);

              return div;
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
    ...mapActions("anos", {
      saveAno: "STORE_ANO",
      updateAno: "UPDATE_ANO",
      deleteAno: "DESTROY_ANO",
    }),

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setAno: "anos/FILL", // map `this.CREATE_INSTANCE_ANO()` to `this.$store.commit('CREATE_INSTANCE_ANO')`
    }),

    ...mapActions("typeAnos", { fetchTypeAnos: "FETCH_LIST_TYPE_ANO" }),

    resetForm() {
      //delete data in form after submit
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });
      window.document.getElementById("vform")?.reset();
      this.setAno({});
    },

    sendReponse() {
      if (this.chargement == false) {
        this.chargement = true;
        const formData = new FormData();
        formData.append("statut", this.Relance.statut);
        formData.append("commentaire", this.Relance.commentaire);
        formData.append("anoId", this.anosId);
        /* formData.append('reponseId',null) */

        for (let i = 0; i < this.Relance.files.length; i++) {
          let file = this.Relance.files[i];
          formData.append("fichier" + i, file);
        }
        AnosService.reponseAnos(formData)
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
      this.champs = this.champs.map((item) => {
        item.errors = [];
        return item;
      });
      this.champsUpdate = this.champsUpdate.map((item) => {
        item.errors = [];
        return item;
      });
      let ano = {};
      if (this.isUpdate) {
        ano = extractFormData(this.champsUpdate, this.anoAttributsUpdate);
        ano.id = this.anoId;
      } else {
        ano = extractFormData(this.champs, this.anoAttributs);
      }

      ano.bailleurId = ano.bailleurId.id;
      ano.statut = ano.statut.etat;

      if (this.sendRequest == false) {
        this.sendRequest = true;
        if (ano?.id) {
          this.updateAno({ ano: ano, id: ano?.id })
            .then((response) => {
              if (response.status == 200 || response.status == 201) {
                this.close();
                this.sendRequest = false;
              }
            })
            .catch((error) => {
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors });
              this.sendRequest = false;
              this.champs.map((value) => (value.errors = this.erreurs[value.key]));
            });
        } else {
          this.sendRequest = true;
          const demo = {
            dossier: ano.dossier,
            statut: ano.statut,
            dateSoumission: ano.dateSoumission,
            destinataire: ano.destinataire,
            bailleurId: ano.bailleurId,
          };
          const formData = new FormData();
          formData.append("dossier", demo.dossier);
          formData.append("statut", demo.statut);
          formData.append("dateSoumission", demo.dateSoumission);
          formData.append("destinataire", demo.destinataire);
          formData.append("bailleurId", demo.bailleurId);
          for (let i = 0; i < this.fichiers.length; i++) {
            let file = this.fichiers[i];
            formData.append("fichier" + i, file);
          }

          this.saveAno(formData)
            .then((response) => {
              if (response.status == 200 || response.status == 201) {
                this.close();
                this.resetForm();
                localStorage.removeItem("formData");
                this.sendRequest = false;
                this.fetchAnos();
              }
            })
            .catch((error) => {
              this.getFile();
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors });
              this.sendRequest = false;

              this.champs.map((value) => (value.errors = this.erreurs[value.key]));
            });
        }
      }
    },

    addAno() {
      this.title = "Ajouter";
      this.showModal = true;
      this.isUpdate = false;
    },

    modifier(ano) {
      localStorage.removeItem("formData");
      this.isUpdate = true;
      this.title = "Modifier ";
      this.showModal = true;

      this.submitText = "Modifier";

      this.anoId = ano.id;

      this.anoAttributsUpdate.forEach((item) => {
        this.champsUpdate.find((value, index) => {
          if (value.key !== "statut") {
            if (value.key === item) {
              this.champsUpdate[index]["data"] = ano[item];
            }
          }
        });
      });
    },

    supprimer(ano, index) {
      this.deleteModal = true;
      this.deleteData.data = ano;
      this.deleteData.index = index;
    },
    deleteAnos(data) {
      this.anos.splice(data.index, 1);
      this.deleteModal = false;
      AnosService.destroy(data.data.id)
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
            { name: "Status", key: "statut", type: "", placeholdere: "Selectionnez une valeur", isSelect: true, isTextArea: false, data: "", options: this.statutsAno, cle: "etat", value: "nom", required: true, errors: [] },
          ];
          this.champsUpdate = [
            { name: "Objet", key: "dossier", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Bailleurs", key: "bailleurId", type: "", placeholdere: "Selectionnez le bailleur", isSelect: true, isTextArea: false, data: "", required: false, options: datas, cle: "id", value: "sigle", errors: [] },
            { name: "Date de soumission", key: "dateDeSoumission", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Destinataire", key: "destinataire", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Status", key: "statut", type: "", placeholdere: "Selectionnez une valeur", isSelect: true, isTextArea: false, data: "", options: this.statutsAno, cle: "etat", value: "nom", required: true, errors: [] },
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
    // this.initTabulator();
  },

  created() {
    // this.getPermission();
    // if (!this.anoVisible) {
    //   this.$router.push("/401-non-autorise");
    // } else {
    //   if (this.bailleurVisible) {
    //     this.programmeId = this.currentUser.programme.id;
    //     this.fetchBailleurs(this.programmeId);
    //   }
    //   this.fetchAnos();
    // }
    //this.programmeId = this.currentUser.programme.id;
    this.programmeId = "Kl4ankW8vn18AZDLmoaqz3YdgwkG5RE9AEMKBQOP2y9le4pXrj60Wbx71mr7dxLq";
    this.fetchBailleurs(this.programmeId);
    this.fetchAnos();

    //.then((value) => { console.log(value), console.log('content bailleur ' + this.bailleurs) });
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
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Tabulator</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <button class="btn btn-primary shadow-md mr-2">Add New Product</button>
      <Dropdown class="ml-auto sm:ml-0">
        <DropdownToggle class="btn px-2 box">
          <span class="w-5 h-5 flex items-center justify-center">
            <PlusIcon class="w-4 h-4" />
          </span>
        </DropdownToggle>
        <DropdownMenu class="w-40">
          <DropdownContent>
            <DropdownItem> <FilePlusIcon class="w-4 h-4 mr-2" /> New Category </DropdownItem>
            <DropdownItem> <UserPlusIcon class="w-4 h-4 mr-2" /> New Group </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
  <!-- BEGIN: HTML Table Data -->
  <div class="intro-y box p-5 mt-5">
    <div class="flex flex-row flex-wrap _sm:items-end _xl:items-start">
      <form id="tabulator-html-filter-form" class="xl:flex sm:mr-auto">
        <div class="sm:flex items-center sm:mr-4">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Champs</label>
          <select id="tabulator-html-filter-field" v-model="filterField" class="form-select w-full _sm:w-32 2xl:w-full mt-2 sm:mt-0 sm:w-auto">
            <option value="nom">Nom</option>
            <option value="taille">Taille</option>
            <option value="age">Age</option>
            <option value="stats">Stats</option>
          </select>
        </div>
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Type</label>
          <select id="tabulator-html-filter-type" v-model="filterType" class="form-select w-full mt-2 sm:mt-0 sm:w-auto">
            <option value="like" selected>like</option>
            <option value="=">=</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option value=">">></option>
            <option value=">=">>=</option>
            <option value="!=">!=</option>
          </select>
        </div>
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Value</label>
          <input id="tabulator-html-filter-value" v-model="filterValue" type="text" class="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0" placeholder="Search..." />
        </div>
        <div class="mt-2 xl:mt-0">
          <button id="tabulator-html-filter-go" type="button" class="btn btn-primary w-full sm:w-16" @click="updateFilter">Go</button>
          <button id="tabulator-html-filter-reset" type="button" class="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1" @click="clearFilter">Reset</button>
        </div>
      </form>
      <div class="flex mt-5 sm:mt-0">
        <button id="tabulator-print" class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2" @click="onPrint"><PrinterIcon class="w-4 h-4 mr-2" /> Print</button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="btn btn-outline-secondary w-full sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Export
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
