<script>
import { createIcons, icons } from "lucide";
createIcons({ icons });

import OngService from "@/services/modules/ong.service.js";
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
    };
  },

  computed: {
    // importation des variables du module auths
    ...mapState({
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),
    ...mapGetters({
      hasErrors: "GET_ERREURS",
      isLoading: "IS_LOADING",
      ong: "ongs/getOng",
      typeOngs: "typeOngs/getTypeOngs",
      currentUser: "auths/GET_AUTHENTICATE_USER",
    }),
  },

  methods: {
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
      // console.log(this.ongs);
      this.tabulator = new Tabulator("#tabulator", {
        data: this.ongs,
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
                <button class='btn-suivre btn btn-primary'>
                   Modifier
                </button>
                 <button class='btn-suivre btn btn-danger'>
                   Supprimer
                </button>
                </div>
               `;
            },
            cellClick: (e, cell) => {
              // Utilisation d'une fonction fléchée pour garder le contexte de `this`
              if (e.target.classList.contains("btn-suivre")) {
                const rowData = cell.getRow().getData();
                //this.suivreIndicateur(rowData.id); // Appel de la méthode
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
      updateOng: "UPDATE_Ong",
      deleteOng: "DESTROY_Ong",
    }),

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setOng: "ongs/FILL", // map `this.CREATE_INSTANCE_Ong()` to `this.$store.commit('CREATE_INSTANCE_Ong')`
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
      // this.champs = this.champs.map((item) => {
      //   item.errors = [];
      //   return item;
      // });
      // this.champsUpdate = this.champsUpdate.map((item) => {
      //   item.errors = [];
      //   return item;
      // });
      // let ong = {};
      // if (this.isUpdate) {
      //   ong = extractFormData(this.champsUpdate, this.ongAttributsUpdate);
      //   ong.id = this.ongId;
      // } else {
      //   ong = extractFormData(this.champs, this.ongAttributs);
      // }

      // ong.bailleurId = ong.bailleurId.id;
      // ong.statut = ong.statut.etat;

      if (this.sendRequest == false) {
        this.sendRequest = true;
        if (this.update) {
          this.updateOng({ ong: ong, id: ong?.id })
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
          // const demo = {
          //   dossier: ong.dossier,
          //   statut: ong.statut,
          //   dateSoumission: ong.dateSoumission,
          //   destinataire: ong.destinataire,
          //   bailleurId: ong.bailleurId,
          // };
          // const formData = new FormData();
          // formData.append("dossier", demo.dossier);
          // formData.append("statut", demo.statut);
          // formData.append("dateSoumission", demo.dateSoumission);
          // formData.append("destinataire", demo.destinataire);
          // formData.append("bailleurId", demo.bailleurId);
          // for (let i = 0; i < this.fichiers.length; i++) {
          //   let file = this.fichiers[i];
          //   formData.append("fichier" + i, file);
          // }
          let formData = {
            nom: "test",
            contact: 67217812,
            email: "alaomoutawakil@gmail.com",
            sigle: "TES",
            code: "23",
            programmeId: this.programmeId,
          };

          this.saveOng(formData)
            .then((response) => {
              if (response.status == 200 || response.status == 201) {
                this.close();
                this.resetForm();
                localStorage.removeItem("formData");
                this.sendRequest = false;
                this.fetchOngs();
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

    supprimer(ong, index) {
      this.deleteModal = true;
      this.deleteData.data = ong;
      this.deleteData.index = index;
    },
    deleteOngs(data) {
      this.ongs.splice(data.index, 1);
      this.deleteModal = false;
      OngService.destroy(data.data.id)
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
  <i data-lucide="trash"></i>
  <Modal :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">Broadcast Message</h2>
      <button class="btn btn-outline-secondary hidden sm:flex"><FileIcon class="w-4 h-4 mr-2" /> Download Docs</button>
      <Dropdown class="sm:hidden">
        <DropdownToggle class="w-5 h-5 block" href="javascript:;">
          <MoreHorizontalIcon class="w-5 h-5 text-slate-500" />
        </DropdownToggle>
        <DropdownMenu class="w-40">
          <DropdownContent>
            <DropdownItem>
              <FileIcon class="w-4 h-4 mr-2" />
              Download Docs
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-1" class="form-label">From</label>
        <input id="modal-form-1" type="text" class="form-control" placeholder="example@gmail.com" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-2" class="form-label">To</label>
        <input id="modal-form-2" type="text" class="form-control" placeholder="example@gmail.com" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-3" class="form-label">Subject</label>
        <input id="modal-form-3" type="text" class="form-control" placeholder="Important Meeting" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-4" class="form-label">Has the Words</label>
        <input id="modal-form-4" type="text" class="form-control" placeholder="Job, Work, Documentation" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-5" class="form-label">Doesn't Have</label>
        <input id="modal-form-5" type="text" class="form-control" placeholder="Job, Work, Documentation" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-6" class="form-label">Size</label>
        <select id="modal-form-6" class="form-select">
          <option>10</option>
          <option>25</option>
          <option>35</option>
          <option>50</option>
        </select>
      </div>
    </ModalBody>
    <ModalFooter>
      <button type="button" @click="showModal = false" class="btn btn-outline-secondary w-20 mr-1">Cancel</button>
      <button type="button" class="btn btn-primary w-20">Send</button>
    </ModalFooter>
  </Modal>
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Organisation</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <button class="btn btn-primary shadow-md mr-2">Ajouter une organisation</button>
      <button class="btn btn-primary shadow-md mr-2" @click="sendForm">test</button>
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
    <div class="flex flex-end flex-wrap _sm:items-end _xl:items-start">
      <div class="flex mt-5 sm:mt-0">
        <button id="tabulator-print" class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2" @click="onPrint"><PrinterIcon class="w-4 h-4 mr-2" /> PDF</button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="btn btn-outline-secondary w-full sm:w-auto">
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
