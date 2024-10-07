<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import SuiviService from "@/services/modules/indicateur.suivi.service.js";
import IndicateurService from "@/services/modules/indicateur.service";
import CategorieService from "@/services/modules/categorie.service"; // add categorie modal
import BailleurService from "@/services/modules/bailleur.service";
import UniteDeMesureService from "@/services/modules/unitee.mesure.service";
import { API_BASE_URL } from "@/services/configs/environment.js";
import extractFormData from "@/utils/extract-data";
//import { advancedTable } from "../../constant/basic-tablle-data";
import xlsx from "xlsx";
import Tabulator from "tabulator-tables";
import 'tabulator-tables/dist/css/tabulator_modern.css'; // Ou un autre thème


export default {
  components: {
    // IndicateurTable,
    // Dashboard,
    // Vmodal,
    // Vbutton,
    // Vform,
    // Titre,
    // SearchBar,
    // CardProgramme,
    // DeleteAlert,
    // ModalTopRight,
    // JsonExcel,
    // Dropdown,
  },
  data() {
    return {
      inboxLigne : true ,
      options: ["foo", "bar", "baz"],
      savedInput: [],
      sendRequest: false,
      suiviIndicateurs: {
        annee: "",
        trimestre: "",
        dateSuivie: "",
        valeurCible: 0,
        valeurRealise: 0,
        commentaire: "",
      },

      showModal: false,
      showModal2: false,
      showSuiviModal: false,
      loading: false,
      search: "",
      title: "",
      chargement: false,
      indicateurId: "",
      indicateurAttributs: ["nom", "description", "anneeDeBase", "valeurDeBase", "bailleurId", "categorieId", "uniteeMesureId", "sourceDeVerification", "hypothese", "kobo", "koboVersion", "valeurCibleTotal"],
      indicateurAttributsUpdate: ["nom", "description", "anneeDeBase", "valeurDeBase", "bailleurId", "categorieId", "uniteeMesureId", "kobo", "koboVersion", "valeurCibleTotal"],
      indicateurAttributsRecherche: ["nom", "anneeDeBase", "bailleurId", "categorieId", "uniteeMesureId"],
      choiceDateOption: true,
      champs: null,
      // add Unite de mesure
      showUniteDeMesureModal: false, // open and close unite de mesure
      champsUniteDeMesure: [
        {
          name: "Nom",
          type: "text",
          key: "nom",
          placeholdere: "Nom de l'unitee de mésure",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },
        {
          name: "Type",
          type: "",
          key: "type",
          placeholdere: "Type de l'unitée",
          isSelect: true,
          isTextArea: false,
          options: [
            { id: 1, nom: "Numérique" },
            { id: 0, nom: "Non Numérique" },
          ],
          data: "",
          cle: "id",
          value: "nom",
          required: true,
          errors: [],
        },
      ],
      // add categories data
      showCategorieModal: false,
      champsCategorie: [
        {
          name: "Nom",
          type: "text",
          key: "nom",
          placeholdere: "Nom de la categorie",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },
      ],
      categorieAttributes: ["nom"],
      // add bailleur data
      showBailleurModal: false,
      base_url: API_BASE_URL,
      bailleurAttributs: ["nom", "email", "contact", "code", "pays", "sigle"],
      sendBailleurRequest: false,
      champsLogo: [{ name: "Changer le logo", type: "file", placeholdere: "Changer le logo", isImage: true, isSelect: false, isTextArea: false, data: "", required: false, errors: [] }],
      image: {},
      showUpdateImage: false,
      bailleurVisible: false,
      bailleurAdd: false,
      programmeId: JSON.parse(localStorage.getItem('authenticateUser')).users?.programme?.id,
      bailleurVisible: false,
      bailleurAdd: false,
      champsBailleur: [
        {
          name: "Nom",
          type: "text",
          key: "nom",
          placeholdere: "Nom du bailleur",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },
        {
          name: "Code",
          type: "number",
          key: "code",
          placeholdere: "Code du bailleur",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },
        {
          name: "Sigle",
          type: "text",
          key: "sigle",
          placeholdere: "Sigle du bailleur",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },
        {
          name: "Email",
          type: "email",
          key: "email",
          placeholdere: "Votre Email",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },
        {
          name: "Contact",
          type: "number",
          key: "contact",
          placeholdere: "Votre contact",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },
        {
          name: "Pays",
          type: "text",
          key: "pays",
          placeholdere: "Pays du bailleur",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        },

        { name: "Logo", type: "file", isImage: true, placeholdere: "Votre logo ", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
      ],
      cols: 1,
      // indicateur data
      champsUpdate: [],
      cols: 2,
      champsRecherche: [],
      headers: [],
      idIndicateur: "",
      isValeurCibleUse: true,
      colonnes: [],
      actions: [{ name: "suivre" }, { name: "supprimer", iconne: "" }, { name: "modifier", iconne: "" }, { name: "consulter", iconne: "" }],
      indicateurBailleurs: "",
      currentRole: "",
      indicateurVisible: false,
      indicateurAdd: false,
      indicateurDelete: false,
      indicateurUpdate: false,
      suiviIndicateurAdd: false,
      suiviIndicateurVisible: false,
      exporterIndicateur: false,
      indicateurs: [],
      bailleurs: [],
      categories: [],
      uniteDeMesures: [],
      programmeId: [],
      isUpdate: false,
      deleteData: {},
      deleteModal: false,
      componentKey: 0,
      tabulator: null,
      filterField: "",
      filterType: "=",
      filterValue: "",
      filteredIndicateur: {
        nom: "",
        anneeDeBase: "",
        bailleurId: "",
        categorieId: "",
        uniteeMesureId: "",
      },
      formAjoutIndicateur: {
        nom: "",
        anneeDeBase: Number,
        valeurDeBase: "",
        uniteeMesureId: "",
        categorieId: "",
        bailleurId: "",
        valeurCibleTotal: "",
        // kobo: "",
        // koboVersion: "",
        sourceDeVerification: "",
        hypothese: "",
        description: "",
      },
    };
  },
  watch: {
    // isLoading: function (value) {
    //   //this.loading = value
    // },
    // showUniteDeMesureModal: function (value) {
    //   if (this.showUniteDeMesureModal === false) {
    //     // console.log(this.showUniteDeMesureModal)
    //     this.getUpdateUniteDeMesure();
    //   }
    // },
    // showBailleurModal: function (value) {
    //   if (this.showBailleurModal === false) {
    //     // console.log(this.showUniteDeMesureModal)
    //     this.getUpdateBailleur(this.programmeId);
    //   }
    // },
    // bailleurs: function (bailleurs) {
    //   this.champs.map((item) => {
    //     if (item.key === "bailleurId") {
    //       item.options = bailleurs.map((bailleur) => {
    //         return {
    //           id: bailleur.id,
    //           sigle: bailleur.sigle,
    //         };
    //       });
    //     }
    //     return item;
    //   });
    //   this.champsRecherche.map((item) => {
    //     if (item.key === "bailleurId") {
    //       item.options = bailleurs.map((bailleur) => {
    //         return {
    //           id: bailleur.id,
    //           sigle: bailleur.sigle,
    //         };
    //       });
    //     }
    //     return item;
    //   });
    // },
    // categories: function (categories) {
    //   this.champs.map((item) => {
    //     if (item.key === "categorieId") {
    //       item.options = categories.map((categorie) => {
    //         return {
    //           id: categorie.id,
    //           nom: categorie.nom,
    //         };
    //       });
    //     }
    //     return item;
    //   });
    //   this.champsRecherche.map((item) => {
    //     if (item.key === "categorieId") {
    //       item.options = categories.map((categorie) => {
    //         return {
    //           id: categorie.id,
    //           nom: categorie.nom,
    //         };
    //       });
    //     }
    //     return item;
    //   });
    // },
    // uniteDeMesure: function (uniteDeMesure) {
    //   this.champs.map((item) => {
    //     if (item.key === "uniteeMesureId") {
    //       item.options = uniteDeMesure.map((unite) => {
    //         return {
    //           id: unite.id,
    //           nom: unite.nom,
    //         };
    //       });
    //     }
    //     return item;
    //   });
    //   this.champsRecherche.map((item) => {
    //     if (item.key === "uniteeMesureId") {
    //       item.options = uniteDeMesure.map((unite) => {
    //         return {
    //           id: unite.id,
    //           nom: unite.nom,
    //         };
    //       });
    //     }
    //     return item;
    //   });
    // },
    // hasErrors: function (errors) {
    //   this.champs.forEach((value) => {
    //     value.errors = errors[value.key];
    //   });
    //   this.champsUniteDeMesure.forEach((value) => {
    //     value.errors = errors[value.key];
    //   });
    //   this.champsCategorie.forEach((value) => {
    //     value.errors = errors[value.key];
    //   });
    //   this.champsBailleur.forEach((value) => {
    //     value.errors = errors[value.key];
    //   });
    // },
  },

  computed: {
    // ...mapState({

    //   loading: state => state.loading,
    //   errors: state => state.errors
    // }),
    // ...mapGetters({
    //   hasErrors: "GET_ERREURS",
    //   isLoading: "IS_LOADING",
    //   indicateur: "indiateurs/getIndicateur",
    //   uniteeDeMesure: "uniteesDeMesure/getUniteeDeMesure",
    //   uniteesDeMesure: "uniteesDeMesure/getUniteesDeMesure",
    //   categorie: "categories/getCategorie",
    //   categories: "categories/getCategories",
    //   bailleurs: "bailleurs/getBailleurs",

    //   /* categories: "categories/getCategorie",

    //   categories: "categories/getCategories",
    //   , */
    // }),
    // ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' }),

    filteredIndicateurs() {
      var self = this;
      var colonnes = [];
      var i = 0;

      this.headers.forEach((element) => {
        if (this.colonnes[i]) {
          if (element.props) {
            colonnes.push([element.props, element.cle]);
          } else {
            colonnes.push(element.cle);
          }
        }

        i++;
      });

      if (colonnes.length) {
        return this.indicateurs.filter(function (data) {
          for (let col of colonnes) {
            if (Array.isArray(col)) {
              if (data[col[0]][col[1]].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                return data;
              }
            } else {
              if (data[col].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                return data;
              }
            }
          }
        });
      } else {
        return this.indicateurs.filter(function (data) {
          for (let header of self.headers) {
            if (data[header.props] != null) {
              if (data[header.props][header.cle]) {
                if (data[header.props][header.cle].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                  return data;
                }
              }
            } else {
              if (data[header.cle]) {
                if (data[header.cle].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                  return data;
                }
              }
            }
          }
        });
      }
    },
  },
  methods: {
    initTabulator() {
      console.log(this.indicateurs);
      this.tabulator = new Tabulator("#tabulatorIndicateurs", {
        data: this.indicateurs,
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
            title: "INDICATEUR",
            field: "nom",
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
          {
            title: "Catégorie",
            field: "categorie",
            minWidth: 150,
            hozAlign: "left",
            formatter(cell) {
              return `${cell.getData().categorie.nom}`;
            },
          },
          {
            title: "Valeur cible finale",
            field: "valeurCibleTotal",
            minWidth: 150,
            hozAlign: "left",
          },

          {
            title: "Unité de mesure",
            field: "uniteeDeMesure",
            minWidth: 150,
            hozAlign: "left",
            formatter(cell) {
              return `${cell.getData().uniteeDeMesure.nom}`;
            },
          },
          {
            title: "Valeur de base",
            field: "valeurDeBase",
            minWidth: 150,
            hozAlign: "left",
          },
          {
            title: "Année de base",
            field: "anneeDeBase",
            minWidth: 150,
            hozAlign: "left",
          },
          {
            title: "Date de création",
            minWidth: 200,
            field: "created_at",
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

    modalclose() {
      // this.suiviIndicateurs.annee='',
      // this.suiviIndicateurs.trimestre='',
      //this.suiviIndicateurs.valeurCible=0,
      //this.suiviIndicateurs.valeurRealise=0,
      //this.suiviIndicateurs.commentaire='',
    },
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setIndicateur: "indicateurs/FILL", // map `this.CREATE_INSTANCE_PROGRAMME()` to `this.$store.commit('CREATE_INSTANCE_PROGRAMME')`
      setUniteeDeMesure: "uniteesDeMesure/FILL",
      setBailleur: "bailleurs/FILL", //for add's bailleur modal
      setCategorie: "categories/FILL",
    }),

    getColonne(data) {
      this.colonnes = data;
      console.log(this.colonnes);
    },
    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },

    fetchIndicateurs() {
      // this.active();
      // alert("ok")
      IndicateurService.get()
        .then((data) => {
          const datas = data.data.data;
          this.indicateurs = datas;
          this.initTabulator();
          this.headers = [
            { name: "Indicateur ", cle: "nom", width: "w-48" },
            { name: "Bailleur", cle: "sigle", props: "bailleur", select: true, options: this.bailleurs, key: "sigle", updateKey: "bailleurId", width: "w-48" },
            { name: "Catégorie", cle: "nom", props: "categorie", select: true, options: this.categories, key: "nom", updateKey: "categorieId", width: "w-48" },
            { name: "Valeur cible finale", cle: "valeurCibleTotal", width: "w-56" },
            { name: "Kobo champs", cle: "kobo", width: "w-48" },
            { name: "Kobo version", cle: "koboVersion", width: "w-48" },
            { name: "Unité de mesure", cle: "nom", props: "uniteeDeMesure", select: true, options: this.uniteDeMesures, key: "nom", updateKey: "uniteeMesureId", width: "w-56" },
            { name: "Valeur de base", cle: "valeurDeBase", width: "w-48" },
            { name: "Année de base", cle: "anneeDeBase", width: "w-48" },
            { name: "Date de création", cle: "created_at", width: "w-48" },
          ];

          this.champs = {
            nom: "",
            anneeDeBase: Number,
            valeurDeBase: "",
            uniteeMesureId: "",
            categorieId: "",
            bailleurId: "",
            valeurCibleTotal: "",
            kobo: "",
            koboVersion: "",
            sourceDeVerification: "",
            hypothese: "",
            description: "",
          };

          this.champsRecherche = [
            { name: "Indicateur", key: "nom", type: "text", placeholdere: "Donnez un nom d'indicateur", isSelect: false, isTextArea: false, data: "", required: false },
            { name: "Année de base", key: "anneeDeBase", type: "numer", placeholdere: "l'année de base", isSelect: false, isTextArea: false, data: "", required: false },
            { name: "Categories", key: "categorieId", type: "", placeholdere: "Selectionnez une categorie", isSelect: true, isTextArea: false, data: "", options: this.categories, required: true, cle: "id", value: "nom", required: false },
            { name: "Unite de mesure", key: "uniteeMesureId", type: "", placeholdere: "Selectionnez une unité de mesure", isSelect: true, isTextArea: false, data: "", options: this.uniteDeMesures, required: false, cle: "id", value: "nom", errors: [] },
            { name: "Bailleurs", key: "bailleurId", type: "", placeholdere: "Selectionnez le bailleur", isSelect: true, isTextArea: false, data: "", required: false, options: this.bailleurs, cle: "id", value: "sigle" },
          ];
          // this.disabled();
        })
        .catch((error) => {
          //  this.disabled();
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
    fetchIndicateur() {
      IndicateurService.get()
        .then((data) => {
          const datas = data.data.data;
          this.indicateurs = datas;
          this.headers = [
            { name: "Indicateur ", cle: "nom", width: "w-56" },
            { name: "Bailleur", cle: "sigle", props: "bailleur", select: true, options: this.bailleurs, key: "sigle", updateKey: "bailleurId", width: "w-20" },
            { name: "Catégorie", cle: "nom", props: "categorie", select: true, options: this.categories, key: "nom", updateKey: "categorieId", width: "w-56" },
            { name: "Valeur cible finale", cle: "valeurCibleTotal", width: "w-56" },
            { name: "Kobo champs", cle: "kobo", width: "w-56" },
            { name: "Kobo version", cle: "koboVersion", width: "w-56" },
            { name: "Unité de mesure", cle: "nom", props: "uniteeDeMesure", select: true, options: this.uniteDeMesures, key: "nom", updateKey: "uniteeMesureId", width: "w-56" },
            { name: "Valeur de base", cle: "valeurDeBase", width: "w-24" },
            { name: "Année de base", cle: "anneeDeBase", width: "w-24" },
            { name: "Date de création", cle: "created_at", width: "w-56" },
          ];
          this.champs = [
            { name: "Nom", type: "text", key: "nom", placeholdere: "Nom de l'indicateur", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Année de base", key: "anneeDeBase", type: "number", placeholdere: "l'année de base", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Valeur de base", key: "valeurDeBase", type: "text", placeholdere: "Valeur de base", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Unite de mesure", key: "uniteeMesureId", type: "", placeholdere: "Selectionnez une unité de mesure", isSelect: true, isTextArea: false, data: "", options: this.uniteDeMesures, required: true, cle: "id", value: "nom", errors: [] },
            { name: "Categories", key: "categorieId", type: "", placeholdere: "Selectionnez une categorie", isSelect: true, isTextArea: false, data: "", options: this.categories, required: false, cle: "id", value: "nom", errors: [] },
            { name: "Bailleurs", key: "bailleurId", type: "", placeholdere: "Selectionnez le bailleur", isSelect: true, isTextArea: false, data: "", required: true, options: this.bailleurs, cle: "id", value: "sigle", errors: [] },
            { name: "Valeur cible finale", type: "text", key: "valeurCibleTotal", placeholdere: "Valeur cible total", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Kobo champs", type: "text", key: "kobo", placeholdere: "Paramètre champs kobo", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Kobo version", type: "text", key: "koboVersion", placeholdere: "Paramètre version kobo", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Source de verification", type: "text", key: "sourceDeVerification", placeholdere: "Source de verification", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Hypothese", type: "text", key: "hypothese", placeholdere: "Hypothese", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Description", key: "description", type: "", placeholdere: "Description", isSelect: false, isTextArea: true, data: "", required: true },
          ];
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

    ...mapActions("indicateurs", {
      saveIndicateur: "STORE_INDICATEUR",
      filtre: "FILTRE_INDICATEUR",
      updateIndicateur: "UPDATE_INDICATEUR",
      deleteIndicateur: "DESTROY_INDICATEUR",
    }),

    ...mapActions("categories", {
      fetchCategories: "FETCH_LIST_CATEGORIE",
      saveCategorie: "STORE_CATEGORIE",
    }),

    ...mapActions("uniteesDeMesure", {
      fetchUniteesDeMesure: "FETCH_LIST_UNITEE_DE_MESURE",
      saveUniteeDeMesure: "STORE_UNITEE_DE_MESURE",
    }),

    ...mapActions("bailleurs", {
      saveBailleur: "STORE_BAILLEUR",
    }),

    // all  unite de mesure add modal methods

    openModal(champsName) {
      if (champsName == "Unite de mesure") {
        this.addUniteeDeMesure();
      } else if (champsName == "Categories") {
        this.addCategorie();
      } else if (champsName == "Bailleurs") {
        this.addBailleur();
      }
    },

    addUniteeDeMesure() {
      this.title = "Ajouter une nouvelle unitee de mésure";

      this.submitText = "Enrégistrer";

      this.showUniteDeMesureModal = true;

      this.fetchUniteesDeMesure();
    },
    closeUniteDeMesure() {
      this.showCloseUniteDeMesureModal();
      this.resetUniteDeMesureForm();
      localStorage.removeItem("formData");
      // this.saveForm()
    },
    closeUniteDeMesure1() {
      this.showCloseUniteDeMesureModal();
      this.savedInput = [];
      for (let i = 0; i < this.champsUniteDeMesure.length; i++) {
        this.savedInput.push(this.champsUniteDeMesure[i].data);
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem("formData", parsed);
    },
    showCloseUniteDeMesureModal(value = false) {
      this.showUniteDeMesureModal = value;
    },
    resetUniteDeMesureForm() {
      this.champsUniteDeMesure = this.champsUniteDeMesure.map((item) => {
        item.data = "";
        return item;
      });

      window.document.getElementById("vform")?.reset();

      this.setUniteeDeMesure({});
    },

    sendUniteDeMesureForm() {
      this.champsUniteDeMesure = this.champsUniteDeMesure.map((item) => {
        item.errors = [];
        return item;
      });

      let uniteeDeMesure = {
        nom: "",
        type: "",
      };

      uniteeDeMesure.nom = this.champsUniteDeMesure[0].data;

      uniteeDeMesure.type = this.champsUniteDeMesure[1].data.id;
      console.log(uniteeDeMesure);

      this.saveUniteeDeMesure(uniteeDeMesure).then((response) => {
        if (response.status == 200 || response.status == 201) {
          this.fetchIndicateurs();
          this.closeUniteDeMesure();
          this.resetUniteDeMesureForm();
          localStorage.removeItem("formData");
        }
      });
    },
    // fin all Unite de mesure add modal methods

    //  all categorie add modal methods
    addCategorie() {
      this.title = "Ajouter une nouvelle categorie";
      this.submitText = "Enrégistrer";

      this.showCategorieModal = true;
      this.fetchUniteesDeMesure();
    },
    closeCategorie() {
      this.showCloseCategorieModal();
      this.resetCategorieForm();
      localStorage.removeItem("formData");
    },
    closeCategorie2() {
      this.showCloseCategorieModal();
      this.savedInput = [];
      for (let i = 0; i < this.champsCategorie.length; i++) {
        this.savedInput.push(this.champsCategorie[i].data);
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem("formData", parsed);
    },
    showCloseCategorieModal(value = false) {
      this.showCategorieModal = value;
    },
    resetCategorieForm() {
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });
    },
    sendCategorieForm() {
      this.champsCategorie = this.champsCategorie.map((item) => {
        item.errors = [];
        return item;
      });

      let categorie = extractFormData(this.champsCategorie, this.categorieAttributes);

      this.saveCategorie(categorie).then((response) => {
        if (response.status == 200 || response.status == 201) {
          this.closeCategorie();
          this.resetCategorieForm();
          localStorage.removeItem("formData");
          this.getCategorie();
        }
      });
    },
    //fin  all categorie add modal methods

    // all bailleurs methods

    fetchBailleurs(programme) {
      // this.active();
      BailleurService.bailleursOfProgramme(programme)
        .then((data) => {
          const datas = data.data.data;
          this.bailleurs = datas;
          // this.disabled();
        })
        .catch((error) => {
          //  this.disabled();
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

    getBailleurImage(data) {
      this.image = data;
    },
    addBailleur() {
      this.title = "Ajouter un bailleur";

      this.submitText = "Enrégistrer";

      this.showBailleurModal = true;
    },

    closeBailleur() {
      this.showCloseBailleurModal();
      this.resetBailleurForm();
      localStorage.removeItem("formData");
      // this.saveForm()
    },
    closeBailleur2() {
      this.showCloseBailleurModal();
      this.savedInput = [];
      for (let i = 0; i < this.champsBailleur.length; i++) {
        this.savedInput.push(this.champsBailleur[i].data);
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem("formData", parsed);
    },
    showCloseBailleurModal(value = false) {
      this.showBailleurModal = value;
    },

    resetBailleurForm() {
      this.champsBailleur = this.champsBailleur.map((item) => {
        item.data = "";
        return item;
      });
      window.document.getElementById("vform")?.reset();

      this.setBailleur({});
    },

    sendBailleurForm() {
      this.savedInput = [];
      this.champsBailleur = this.champsBailleur.map((item) => {
        item.errors = [];
        return item;
      });

      let bailleur = {};

      bailleur = extractFormData(this.champsBailleur, this.bailleurAttributs);
      bailleur.programmeId = this.programmeId;

      if (this.sendRequest == false) {
        this.sendRequest = true;

        const demo = {
          nom: bailleur.nom,
          email: bailleur.email,
          contact: bailleur.contact,
          code: bailleur.code,
          pays: bailleur.pays,
          sigle: bailleur.sigle,
        };

        const formData = new FormData();
        formData.append("nom", demo.nom);
        formData.append("email", demo.email);
        formData.append("contact", demo.contact);
        formData.append("code", demo.code);
        formData.append("pays", demo.pays);
        formData.append("sigle", demo.sigle);
        formData.append("logo", this.image);
        formData.append("programmeId", this.programmeId);

        console.log(demo);

        this.saveBailleur(formData)
          .then((response) => {
            console.log(response);
            if (response.status == 200 || response.status == 201) {
              this.closeBailleur();
              this.resetBailleurForm();
              localStorage.removeItem("formData");
              this.fetchBailleurs(this.programmeId);
              this.sendRequest = false;
            }
          })
          .catch((error) => {
            this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors });
            this.sendRequest = false;
            this.champsBailleur.map((value) => (value.errors = this.erreurs[value.key]));
            this.getImage();
          });
      }
    },

    // fin all bailleurs methods
    getIndicateurBailleurs() {
      IndicateurService.getIndicateurBailleur()
        .then((data) => {
          this.indicateurBailleurs = data.data.data;
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

    getPermission() {
      JSON.parse(localStorage.getItem('authenticateUser')).role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-indicateur") {
          this.indicateurVisible = true;
        }
        if (element.slug === "creer-un-indicateur") {
          this.indicateurAdd = true;
        }
        if (element.slug === "modifier-un-indicateur") {
          this.indicateurUpdate = true;
        }
        if (element.slug === "supprimer-un-indicateur") {
          this.indicateurDelete = true;
        }
        if (element.slug === "creer-un-suivi-indicateur") {
          this.suiviIndicateurAdd = true;
        }
        if (element.slug == "voir-un-suivi-indicateur") {
          this.suiviIndicateurVisible = true;
        }
        if (element.slug == "exporter-un-indicateur") {
          this.exporterIndicateur = true;
        }
        if (element.slug === "voir-une-unite-de-mesure") {
          this.uniteVisible = true;
        }
        if (element.slug === "creer-une-unite-de-mesure") {
          this.uniteAdd = true;
        }
        if (element.slug === "voir-un-bailleur") {
          this.bailleurVisible = true;
        }
        if (element.slug === "creer-un-bailleur") {
          this.bailleurAdd = true;
        }
      });
    },

    suivreIndicateur(data) {
      this.idIndicateur = data;
      this.showSuiviModal = true;
      this.title = `Suivre l'indicateur`;
    },

    consulterSuivi(id) {
      this.$router.push({ name: "indicateurs_suivi_details", params: { id: id } });
    },

    saveSuivi() {
      if (this.chargement == false) {
        this.chargement = true;
        const data = this.suiviIndicateurs;
        data.valeurRealise = [Number(data.valeurRealise)];
        //data.valeurCible = [90000]
        data.valeurCible = [Number(data.valeurCible)];
        data.indicateurId = this.idIndicateur;
        if (this.choiceDateOption == true) {
          delete data.trimestre;
        } else {
          delete data.dateSuivie;
        }

        SuiviService.create(data)
          .then((data) => {
            this.$toast.success("suivi éffectué");
            this.showSuiviModal = false;
            this.chargement = false;
            this.suiviIndicateurs.annee = "";
            this.suiviIndicateurs.trimestre = "";
            this.suiviIndicateurs.dateSuivie = "";
            this.suiviIndicateurs.valeurCible = 0;
            this.suiviIndicateurs.valeurRealise = 0;
            this.suiviIndicateurs.commentaire = "";
          })
          .catch((error) => {
            this.chargement = false;
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
      }
    },

    title_csv() {
      return "indicateur-" + "-" + new Date();
    },

    json_data() {
      let tab = [];

      this.filteredIndicateurs().forEach((element) => {
        tab.push({
          nom: element.nom,
          description: element.description,
          bailleur: element.bailleur.sigle,
          categorie: element.categorie?.nom,
          unitee_de_mesure: element.uniteeDeMesure.nom,
          valeur_de_base: element.valeurDeBase,
          annee_de_base: element.anneeDeBase,
        });
      });
      return tab;
    },

    verifyValeurCible(date) {
      SuiviService.checksuivi(this.idIndicateur, date)
        .then((data) => {
          //recuperation de la valeur de verfication pour la valeur cible
          if (data.data.data === true) {
            this.isValeurCibleUse = false;
          } else {
            this.isValeurCibleUse = true;
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

    sendForm() {
      // this.champs = this.champs.map((item) => {
      //   item.errors = [];
      //   return item;
      // });
      // this.champsUpdate = this.champsUpdate.map((item) => {
      //   item.errors = [];
      //   return item;
      // });
      // let indicateur = {};
      // if (this.isUpdate) {
      //   indicateur = extractFormData(this.champsUpdate, this.indicateurAttributsUpdate);
      // } else {
      //   indicateur = extractFormData(this.champs, this.indicateurAttributs);
      // }

      // indicateur.bailleurId = indicateur.bailleurId.id;
      // indicateur.categorieId = indicateur.categorieId.id;
      // indicateur.uniteeMesureId = indicateur.uniteeMesureId.id;

      if (this.sendRequest == false) {
        this.sendRequest = true;
        if (this.indicateurId != "") {
          this.updateIndicateur({ indicateur: indicateur, id: this.indicateurId })
            .then((response) => {
              if (response.status == 200 || response.status == 201) {
                this.$toast.success("operation effectué avec success");
                this.fetchIndicateur();

                this.sendRequest = false;
                this.close();
              }
            })
            .catch((e) => {
              this.$toast.error(e);
              this.sendRequest = false;
            });
        } else {
          this.saveIndicateur(this.formAjoutIndicateur)
            .then((response) => {
              if (response.status == 200 || response.status == 201) {
                // this.close();
                // this.resetForm();
                // localStorage.removeItem("formData");
                // this.$toast.success("operation effectué avec success");
                // this.fetchIndicateur();
                // this.sendRequest = false;
              }
            })
            .catch((e) => {
              // this.$toast.error(e);
              // this.sendRequest = false;
            });
        }
      }
    },

    filter() {
      // this.champsRecherche = this.champsRecherche.map((item) => {
      //   item.errors = [];
      //   return item;
      // });

      // let indicateur = extractFormData(this.champsRecherche, this.indicateurAttributsRecherche);
      // indicateur.bailleurId = indicateur.bailleurId?.id;
      // indicateur.categorieId = indicateur.categorieId?.id;
      // indicateur.uniteeMesureId = indicateur.uniteeMesureId?.id;

      console.log(this.filteredIndicateur);

      this.filtre(this.filteredIndicateur).then((response) => {
        if (response.status == 200 || response.status == 201) {
          const datas = response.data.data;
          this.indicateurs = datas;
          this.clearObjectValues(this.filteredIndicateur);
          // this.close2();
        }
      });
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

    resetForm() {
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });

      window.document.getElementById("vform")?.reset();

      this.setIndicateur({});
    },

    async updateInputData(id, attribut, value) {
      await this.updateIndicateur({ indicateur: { [attribut]: value }, id: id })
        .catch((value, status) => {
          if (this.hasErrors[attribut] !== undefined) alert(this.hasErrors[attribut]);
        })
        .finally(() => {
          $("#" + "dataTable").load(location.href + "#" + id + ">*", "");
        });
    },

    supprimer(indicateur, index) {
      this.deleteModal = true;
      this.deleteData.data = indicateur;
      this.deleteData.index = index;
    },

    deleteIndicateur(data) {
      //this.filteredIndicateur.splice(data.index,1)
      this.deleteModal = false;
      IndicateurService.destroy(data.data.id)
        .then((data) => {
          this.$toast.success("Operation effectué avec success !");
          this.fetchIndicateur();
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

    close() {
      this.showCloseModal();
      this.resetForm();
    },
    closeA() {
      this.showCloseModal();
      this.savedInput = [];
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data);
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem("formData", parsed);
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

    addIndicateur() {
      this.title = "Ajouter";
      this.showModal = true;
      this.isUpdate = false;
    },

    modifier(indicateur) {
      localStorage.removeItem("formData");
      this.isUpdate = true;
      this.title = "Modifier un indicateur";
      this.showModal = true;

      this.submitText = "Modifier";

      this.indicateurId = indicateur.id;

      this.indicateurAttributsUpdate.forEach((item) => {
        this.champsUpdate.find((value, index) => {
          if (value.key !== "bailleurId" && value.key !== "categorieId" && value.key !== "uniteeMesureId") {
            if (value.key === item) {
              this.champsUpdate[index]["data"] = indicateur[item];
            }
          }
        });
      });
    },

    getBailleur(programme) {
      // this.active();
      BailleurService.bailleursOfProgramme(programme)
        .then((data) => {
          const datas = data.data.data;
          this.bailleurs = datas;
          this.champsUpdate.push({ name: "Bailleurs", key: "bailleurId", type: "", placeholdere: "Selectionnez le bailleur", isSelect: true, isTextArea: false, data: "", required: true, options: datas, cle: "id", value: "sigle", errors: [] });
          // this.disabled();
        })
        .catch((error) => {
          // this.disabled();
        });
    },

    getUniteDeMesure() {
      // this.active();
      UniteDeMesureService.get()
        .then((data) => {
          const datas = data.data.data;
          this.uniteDeMesures = datas;
          console.log(this.uniteDeMesures);
          this.champsUpdate.push({ name: "Unite de mesure", key: "uniteeMesureId", type: "", placeholdere: "Selectionnez une unité de mesure", isSelect: true, isTextArea: false, data: "", options: datas, required: true, cle: "id", value: "nom", errors: [] });
          // this.disabled();
        })
        .catch((error) => {
          // this.disabled();
        });
    },

    getUpdateUniteDeMesure() {
      let old = this.champs[3].options;
      UniteDeMesureService.get()
        .then((data) => {
          this.uniteDeMesure = data.data.data;
          this.champs[3].options = this.uniteDeMesure;
        })
        .catch((error) => {
          this.champs[3].options = old;
        });
    },

    getUpdateBailleur(programme) {
      let old = this.champs[5].options;

      BailleurService.bailleursOfProgramme(programme)
        .then((data) => {
          this.bailleurs = data.data.data;
          this.champs[5].options = this.bailleurs;
          console.log(this.champs[5].options);
        })
        .catch((error) => {
          this.champs[5].options = old;
        });
    },

    getCategorie() {
      // this.active();
      CategorieService.get()
        .then((data) => {
          const datas = data.data.data;
          this.categories = datas;
          console.log(datas);
          this.champsUpdate.push({ name: "Categories", key: "categorieId", type: "", placeholdere: "Selectionnez une categorie", isSelect: true, isTextArea: false, data: "", options: datas, required: false, cle: "id", value: "nom", errors: [] });
          // this.disabled();
        })
        .catch((error) => {
          //  this.disabled();
        });
    },
  },
  mounted() {},

  created() {
    console.log(JSON.parse(localStorage.getItem('authenticateUser')));
    this.programmeId = JSON.parse(localStorage.getItem('authenticateUser')).programme.id;
    if (this.programmeId) {
      this.fetchBailleurs(this.programmeId);
      this.fetchIndicateurs()
    }
    this.getPermission();
    if (!this.indicateurVisible) {
      this.$router.push("/401-non-autorise");
    }

    if (JSON.parse(localStorage.getItem('authenticateUser')).users != undefined) {
      this.currentRole = JSON.parse(localStorage.getItem('authenticateUser')).users.type;
      this.programmeId = JSON.parse(localStorage.getItem('authenticateUser')).programme.id;

      if (JSON.parse(localStorage.getItem('authenticateUser')).users.type === "bailleur") {
        this.getIndicateurBailleurs();
        this.headers = [
          { name: "Indicateur", cle: "nom" },
          { name: "description", cle: "description" },
          { name: "Kobo champs", cle: "kobo" },
          { name: "Kobo version", cle: "koboVersion" },
          { name: "Bailleur", cle: "nom", props: "bailleur", select: true },
          { name: "Categorie", cle: "nom", props: "categorie", select: true },
          { name: "Unité de mesure", cle: "nom", props: "unitee_mesure", select: true },
          { name: "Valeur de base", cle: "valeurDeBase" },
          { name: "Année de base", cle: "anneeDeBase" },
          { name: "Date de création", cle: "created_at" },
        ];
      } else {
        this.getBailleur(this.programmeId);
        this.getUniteDeMesure();
        this.getCategorie();
        this.fetchIndicateurs();

        this.champsUpdate = [
          { name: "Nom", type: "text", key: "nom", placeholdere: "Nom de l'indicateur", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
          { name: "Année de base", key: "anneeDeBase", type: "number", placeholdere: "l'année de base", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
          { name: "Valeur de base", key: "valeurDeBase", type: "text", placeholdere: "Valeur de base", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
          { name: "Valeur cible finale", type: "text", key: "valeurCibleTotal", placeholdere: "Valeur cible total", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
          { name: "Kobo champs", type: "text", key: "kobo", placeholdere: "Paramètre champs kobo", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
          { name: "Kobo version", type: "text", key: "koboVersion", placeholdere: "Paramètre version kobo", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
          /* { name: 'Source de verification', type: 'text', key: 'sourceDeVerification', placeholdere: "Source de verification", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Hypothese', type: 'text', key: 'hypothese', placeholdere: "Hypothese", isSelect: false, isTextArea: false, data: '', required: true, errors: [] }, */
          { name: "Description", key: "description", type: "", placeholdere: "Description", isSelect: false, isTextArea: true, data: "", required: true },
        ];
      }
    }
  },
};
</script>

<template>
  <div class="p-4"></div>

  <div class="container mx-auto px-4">
    <!-- Combined Filter Section -->
    <div class="bg-white shadow-md p-6 rounded-lg space-y-3">
      <h2 class="font-bold text-base mb-4">Filtre</h2>
      <div class="grid grid-cols-3 gap-4">
        <input type="text" v-model="filteredIndicateur.nom" placeholder="Indicateur" class="border p-2 rounded" />
        <input type="text" v-model="filteredIndicateur.anneeDeBase" placeholder="Année de base" class="border p-2 rounded" />

        <div class="flex w-full">
          <v-select class="w-full" :reduce="(categories) => categories.id" v-model="filteredIndicateur.categorieId" label="nom" :options="categories">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!filteredIndicateur.categorieId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="form-label absolute ml-1 px-3 font-medium -translate-y-3 bg-white text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm z-10">Catégories</label>
        </div>
        <div class="flex w-full">
          <v-select class="w-full" :reduce="(uniteDeMesures) => uniteDeMesures.id" v-model="filteredIndicateur.uniteeMesureId" label="nom" :options="uniteDeMesures">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!filteredIndicateur.uniteeMesureId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="form-label absolute ml-1 px-3 font-medium -translate-y-3 bg-white text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm z-10"> Unité de mesure</label>
        </div>
        <div class="flex w-full">
          <v-select class="w-full" :reduce="(bailleurs) => bailleurs.id" v-model="filteredIndicateur.bailleurId" label="sigle" :options="bailleurs">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!filteredIndicateur.bailleurId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="form-label absolute ml-1 px-3 font-medium -translate-y-3 bg-white text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm z-10"> Bailleurs</label>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <input type="text" placeholder="Recherche" class="border p-2 rounded" />
        <button class="bg-blue-500 text-white py-2 px-4 rounded" @click="filter()">Filtrer</button>
      </div>
    </div>

    <!-- Results or other components -->
    <div class="mt-6">
      <!-- Place the table or grid component here -->
    </div>
  </div>

  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Indicateur</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <button class="btn btn-primary shadow-md mr-2" @click="addIndicateur"><PlusIcon class="w-4 h-4 mr-3" /> Ajouter un nouvel Indicateur</button>
    </div>
  </div>
  <!-- BEGIN: HTML Table Data -->
  <div class="intro-y box p-5 mt-5">
    <div class="flex flex-row flex-wrap _sm:items-end _xl:items-start">
      <form id="tabulator-html-filter-form" class="xl:flex sm:mr-auto">
        <div class="sm:flex items-center sm:mr-4">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Colonnes</label>
          <select id="tabulator-html-filter-field" v-model="filterField" class="form-select w-full _sm:w-32 2xl:w-full mt-2 sm:mt-0 sm:w-auto">
            <option value="nom">Nom</option>
            <option value="taille">Taille</option>
            <option value="age">Age</option>
            <option value="stats">Stats</option>
          </select>
        </div>
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Type d'égalité</label>
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
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Valeurs</label>
          <input id="tabulator-html-filter-value" v-model="filterValue" type="text" class="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0" placeholder="Rechercher..." />
        </div>
        <div class="mt-2 xl:mt-0">
          <button id="tabulator-html-filter-go" type="button" class="btn btn-primary w-full sm:w-16 mr-3" @click="updateFilter">Go</button>
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
      <div id="tabulatorIndicateurs"  ref="tableRef" class="mt-5 inbox__item"></div>
    </div>
  </div>
  <!-- END: HTML Table Data -->

  <Modal size="modal-xl" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">Ajouter un indicateur</h2>
    </ModalHeader>
    <ModalBody>
      <div class="grid grid-cols-12 gap-4 gap-y-3" v-if="!isUpdate" key="ajouter" @submit.prevent="storeGestionnaire">
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-1" class="form-label">Nom</label>
          <input id="modal-form-1" v-model="formAjoutIndicateur.nom" type="text" class="form-control" placeholder="Nom de votre indicateur" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-2" class="form-label">Année de base </label>
          <input id="modal-form-2" type="number" min="1900" max="2099" step="1" v-model="formAjoutIndicateur.anneeDeBase" class="form-control" placeholder="2023" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-3" class="form-label">Valeur de base</label>
          <input id="modal-form-3" type="text" class="form-control" v-model="formAjoutIndicateur.valeurDeBase" placeholder="Valeur de base" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-3" class="form-label">Catégories</label>
          <v-select class="w-full" :reduce="(categories) => categories.id" v-model="formAjoutIndicateur.categorieId" label="nom" :options="categories">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!formAjoutIndicateur.categorieId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-3" class="form-label">Bailleurs</label>
          <v-select class="w-full" :reduce="(bailleurs) => bailleurs.id" v-model="formAjoutIndicateur.bailleurId" label="sigle" :options="bailleurs">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!formAjoutIndicateur.bailleurId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-3" class="form-label">Unité de mesure</label>
          <v-select class="w-full" :reduce="(uniteDeMesures) => uniteDeMesures.id" v-model="formAjoutIndicateur.uniteeMesureId" label="nom" :options="uniteDeMesures">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!formAjoutIndicateur.uniteeMesureId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-3" class="form-label">Valeur cible finale</label>
          <input id="modal-form-3" type="text" class="form-control" v-model="formAjoutIndicateur.valeurCibleTotal" placeholder="Valeur cible finale" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-3" class="form-label">Source de vérification</label>
          <input id="modal-form-3" type="text" class="form-control" v-model="formAjoutIndicateur.sourceDeVerification" placeholder="Source de vérification" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="modal-form-4" class="form-label">Hypothèse</label>
          <input id="modal-form-4" type="text" class="form-control" v-model="formAjoutIndicateur.hypothese" placeholder="Hypothèse" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label for="validation-form-6" class="form-label w-full flex flex-col sm:flex-row"> Description </label>
          <textarea id="validation-form-6" v-model="formAjoutIndicateur.description" class="form-control" name="description" placeholder="Laissez une description"></textarea>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <!-- <label for="modal-form-6" class="form-label">Size</label>
          <select id="modal-form-6" class="form-select">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </select> -->
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <button type="button" @click="showModal = false" class="btn btn-outline-secondary w-20 mr-1">Annuler</button>
      <button type="button" class="btn btn-primary w-20" @click="sendForm()">Envoyer</button>
    </ModalFooter>
  </Modal>
</template>

<style scoped>

</style>
