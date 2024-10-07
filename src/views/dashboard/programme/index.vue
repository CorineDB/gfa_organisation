<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { formatDate, extractFormData } from "@/utils/index";

export default {
  components: {},
  data() {
    return {
      deleteLoader: false,
      deleteModal: false,
      successNotification: null,
      messages: {
        type: "succes",
        message: "",
      },
      update: false,
      addProgrammeLoader: false,
      showModal: false,
      line: false,
      mosaique: true,
      programmeVisible: false,
      programmeAdd: false,
      programmeDelete: false,
      programmeUpdate: false,
      title: "Ajouter",
      submitText: "Enregistrer",
      formAjoutProgramme: {
        nom: "",
        description: "",
        code: "",
        budgetNational: "",
        objectifGlobaux: "",
        debut: "",
        fin: "",
      },
      formModifierProgramme: {
        nom: "",
        description: "",
        code: "",
        budgetNational: "",
        objectifGlobaux: "",
        debut: "",
        fin: "",
      },
      programmeAttributs: ["nom", "code", "description", "debut", "fin", "objectifGlobaux", "budgetNational"],
      champs: [
        { name: "Nom du programme", key: "nom", type: "text", placeholdere: "Nom du programme", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Code", type: "text", key: "code", placeholdere: "Code de l'indicateur", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Date début", type: "date", key: "debut", placeholdere: "Date de debut", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Date fin", type: "date", key: "fin", placeholdere: "Date de fin", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Description", type: "", key: "description", placeholdere: "Description du programme", isSelect: false, isTextArea: true, data: "", required: true, errors: [] },
        { name: "Objectifs globaux", type: "text", key: "objectifGlobaux", placeholdere: "Definir les objectifs", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Budget national", type: "number", key: "budgetNational", placeholdere: "Definir un budget", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
      ],
      cols: 2,
      option: [{ name: "supprimer" }, { name: "modifier" }],
    };
  },

  computed: {
    //importation des variables du module auths
    ...mapState({
      identifiant: (state) => state.auths.identifiant,
      programme: (state) => state.programmes.programme,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),

    ...mapGetters("programmes", {
      programmes: "getProgrammes",
      programme: "getProgramme",
    }),
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },
  provide() {
    return {
      "bind[successNotification]": (el) => {
        this.successNotification = el;
      },
    };
  },

  methods: {
    deletePrograms(data) {
      this.setProgramme(data);
      this.deleteModal = true;
    },
    supprimer() {
      this.deleteProgramme(this.programme?.id).then((response) => {
        this.deleteLoader = true;
        if (response.status == 200 || response.status == 201) {
          this.deleteLoader = false;
          this.messages.type = "success";
          this.messages.message = "Programme supprimé avec succès";

          this.deleteModal = false;
          this.successNotificationToggle();
          this.fetchProgrammes();
          this.close();
        }
      });
    },
    editProgramme(data) {
      this.setProgramme(data);
      this.update = true;
      this.showModal = true;
      this.formModifierProgramme.nom = data.nom;
      this.formModifierProgramme.code = data.code;
      this.formModifierProgramme.description = data.description;
      this.formModifierProgramme.objectifGlobaux = data.objectifGlobaux;
      this.formModifierProgramme.budgetNational = data.budgetNational;
      this.formModifierProgramme.debut = data.debut;
      this.formModifierProgramme.fin = data.fin;
    },
    successNotificationToggle() {
      // Vérifiez que la référence est bien définie avant d'appeler showToast
      if (this.successNotification && this.successNotification.showToast) {
        this.successNotification.showToast(); // Appelle la méthode showToast
      } else {
        console.error("La référence à successNotification est introuvable ou showToast est non définie");
      }
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
    getPermission() {
      this.currentUser.role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-programme") {
          this.programmeVisible = true;
        }
        if (element.slug === "creer-un-programme") {
          this.programmeAdd = true;
        }
        if (element.slug === "modifier-un-programme") {
          this.programmeUpdate = true;
        }
        if (element.slug === "supprimer-un-programme") {
          this.programmeDelete = true;
        }
      });
    },
    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setProgramme: "programmes/FILL", // map `this.CREATE_INSTANCE_PROGRAMME()` to `this.$store.commit('CREATE_INSTANCE_PROGRAMME')`
    }),

    ...mapActions("programmes", {
      fetchProgrammes: "FETCH_LIST_PROGRAMME",
      saveProgramme: "STORE_PROGRAMME",
      updateProgramme: "UPDATE_PROGRAMME",
      deleteProgramme: "DESTROY_PROGRAMME",
    }),

    switch1() {
      this.mosaique = true;
      this.line = false;
    },
    switch2() {
      this.mosaique = false;
      this.line = true;
    },

    addProgramme() {
      // this.title = "Ajouter";

      // this.submitText = "Enregistrer";

      this.showCloseModal(true);
    },

    modifier(programme) {
      this.title = "Modification du programme ";

      this.submitText = "Modifier";

      this.setProgramme(programme);

      this.programmeAttributs.forEach((item) => {
        this.champs.find((value, index) => {
          if (value.key === item) {
            this.champs[index]["data"] = this.programme[item];
          }
        });
      });

      this.showCloseModal(true);
    },

    async supprimer(programme) {
      if (window.confirm("Voulez-vous supprimer ce programme " + programme.nom)) await this.deleteProgramme(programme.id);
    },

    dupliquer(programme) {
      this.title = "Ajout du programme { programme.nom }";

      this.submitText = "Enregistrer";

      this.programmeAttributs.forEach((item) => {
        this.champs.find((value, index) => {
          if (value.key === item) {
            if (value.key === "debut" || value.key === "fin") {
              this.champs[index]["data"] = programme[item] + "-01";
            } else {
              this.champs[index]["data"] = programme[item];
            }
          }
        });
      });

      this.showCloseModal(true);
    },

    close() {
      this.showCloseModal();

      this.resetForm();
    },

    showCloseModal(value = false) {
      this.showModal = value;
    },

    resetForm() {
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });

      window.document.getElementById("vform")?.reset();

      this.setProgramme({});
    },

    sendForm() {
      // this.champs = this.champs.map((item) => {
      //   item.errors = [];
      //   return item;
      // });
      // let programme = extractFormData(this.champs, this.programmeAttributs);

      // programme["debut"] = formatDate(programme["debut"], { year: "year", month: "month" });

      this.formAjoutProgramme.debut = formatDate(this.formAjoutProgramme.debut, { year: "year", month: "month" });
      this.formModifierProgramme.debut = formatDate(this.formModifierProgramme.debut, { year: "year", month: "month" });

      // programme["fin"] = formatDate(programme["fin"], { year: "year", month: "month" });

      this.formAjoutProgramme.fin = formatDate(this.formAjoutProgramme.fin, { year: "year", month: "month" });
      this.formModifierProgramme.fin = formatDate(this.formModifierProgramme.fin, { year: "year", month: "month" });

      //this.programme?.id
      if (this.update) {
        this.updateProgramme({ programme: this.formModifierProgramme, id: this.programme?.id }).then((response) => {
          this.addProgrammeLoader = true;
          if (response.status == 200 || response.status == 201) {
            this.addProgrammeLoader = false;
            this.messages.type = "success";
            this.messages.message = "Programme modifié avec succès";
            this.update = false;
            this.showModal = false;
            this.successNotificationToggle();
            this.fetchProgrammes();
            this.close();
          } else {
            this.addProgrammeLoader = false;
            console.log(response);
          }
        });
      } else {
        this.addProgrammeLoader = true;
        this.saveProgramme(this.formAjoutProgramme).then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.addProgrammeLoader = false;
            this.clearObjectValues(this.formAjoutProgramme);
            this.messages.type = "success";
            this.messages.message = "Programme ajouté avec succès";
            this.successNotificationToggle();
            this.fetchProgrammes();
            this.showModal = false;
          } else {
            this.addProgrammeLoader = false;
          }
        });
      }
    },
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
  },

  mounted() {
    this.active();
    this.fetchProgrammes();
    this.getPermission();
    // if(!this.programmeVisible) {
    // this.$router.push('/401-non-autorise')
    // }
    this.disabled();
  },
};
</script>

<template>
  <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
    <CheckCircleIcon v-if="messages.type === 'success'" class="text-success" />
    <AlertOctagonIcon v-else class="text-success" />
    <div class="ml-4 mr-4">
      <div :class="{ 'text-red-500 capitalize ': messages.type != 'success' }" class="font-medium">{{ messages.type }}</div>
      <div class="text-slate-500 mt-1">
        {{ messages.message }}
      </div>
    </div>
  </Notification>
  <h2 class="intro-y text-lg font-medium mt-10">Programme</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap justify-between sm:flex-nowrap items-center mt-2">
      <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
        <div class="w-56 relative text-slate-500">
          <input type="text" class="form-control w-56 box pr-10" placeholder="Recherche..." />
          <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
        </div>
      </div>
      <div class="flex">
        <button class="btn btn-primary shadow-md mr-2" @click="addProgramme()">Ajouter un Programme</button>
        <Dropdown>
          <DropdownToggle class="btn px-2 box">
            <span class="w-5 h-5 flex items-center justify-center">
              <PlusIcon class="w-4 h-4" />
            </span>
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem> <PrinterIcon class="w-4 h-4 mr-2" /> Print </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export to Excel </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export to PDF </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <div v-for="(program, index) in programmes" :key="index" class="intro-y col-span-12 md:col-span-6 lg:col-span-4 _xl:col-span-3">
      <div class="box" v-if="program">
        <!-- {{ program }} -->
        <div class="p-5">
          <div class="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
            <div class="absolute bottom-0 text-white px-5 pb-6 z-10">
              <a href="" class="block font-medium text-base">{{ program.nom }}</a>
              <span class="text-white/90 text-xs mt-3">{{ program.description }}</span>
            </div>
          </div>
          <div class="text-slate-600 dark:text-slate-500 mt-5">
            <div class="flex items-center"><LinkIcon class="w-4 h-4 mr-2" /> Budget: ${{ program.budgetNational }}</div>
            <div class="flex items-center mt-2">
              <LayersIcon class="w-4 h-4 mr-2" /> Organisme de tutelle:
              {{ program.organismeDeTutelle }}
            </div>
            <div class="flex items-center mt-2">
              <CheckSquareIcon class="w-4 h-4 mr-2" /> Début du programe:
              {{ program.debut }}
            </div>
            <div class="flex items-center mt-2">
              <CheckSquareIcon class="w-4 h-4 mr-2" /> Fin du programe:
              {{ program.fin }}
            </div>
          </div>
        </div>
        <div class="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <a class="flex items-center text-primary mr-auto" href="javascript:;"> <EyeIcon class="w-4 h-4 mr-1" /> Détail </a>
          <a class="flex items-center mr-3" href="javascript:;" @click="editProgramme(program)"> <CheckSquareIcon class="w-4 h-4 mr-1" /> Modifier </a>
          <a class="flex items-center text-danger" href="javascript:;" @click="deletePrograms()"> <Trash2Icon class="w-4 h-4 mr-1" /> Supprimer </a>
        </div>
      </div>
    </div>

    <!-- END: Users Layout -->
    <!-- BEGIN: Pagination -->
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
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
  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal :show="deleteModal" @hidden="deleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Etes vous sûr?</div>
        <div class="text-slate-500 mt-2">Voulez vous vraiment supprimer ce programme? <br />Ce processus ne peut pas être annulé.</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="deleteModal = false" class="btn btn-outline-secondary w-24 mr-1">Annuler</button>
        <button v-if="deleteLoader" class="btn btn-primary mr-1 mb-2">
          Chargement
          <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
        </button>
        <button v-else type="button" class="btn btn-danger w-24" @click="supprimer">Supprimer</button>
      </div>
    </ModalBody>
  </Modal>

  <Modal size="modal-xl" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="font-medium text-base mr-auto">Ajouter un programme</h2>
      <h2 v-else class="font-medium text-base mr-auto">Modifier un programme</h2>
    </ModalHeader>
    <ModalBody v-if="!update" class="grid grid-cols-12 gap-4 gap-y-3">
       <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-3" class="form-label">Nom</label>
        <input id="modal-form-3" v-model="formAjoutProgramme.nom" type="text" class="form-control" placeholder="Nom du programme" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-4" class="form-label">Code</label>
        <input id="modal-form-4" v-model="formAjoutProgramme.code" type="text" class="form-control" placeholder="Ex: 4.1" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-datepicker-1" class="form-label">Début</label>
        <Litepicker
          id="modal-datepicker-1"
          v-model="formAjoutProgramme.debut"
          :options="{
            autoApply: false,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
          class="form-control"
        />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-datepicker-2" class="form-label">Fin</label>
        <Litepicker
          id="modal-datepicker-2"
          v-model="formAjoutProgramme.fin"
          :options="{
            autoApply: false,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
          class="form-control"
        />
      </div>
     
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-5" class="form-label">Description</label>
        <textarea id="validation-form-6" class="form-control" v-model="formAjoutProgramme.description" placeholder="Ecriver une description du projet"></textarea>
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-5" class="form-label">Objectif globaux</label>
        <input id="modal-form-5" type="text" v-model="formAjoutProgramme.objectifGlobaux" class="form-control" placeholder="Objectif du programme" />
      </div>
    </ModalBody>
    <ModalBody v-else class="grid grid-cols-12 gap-4 gap-y-3">
       <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-3" class="form-label">Nom</label>
        <input id="modal-form-3" v-model="formModifierProgramme.nom" type="text" class="form-control" placeholder="Nom du programme" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-4" class="form-label">Code</label>
        <input id="modal-form-4" v-model="formModifierProgramme.code" type="text" class="form-control" placeholder="Ex: 4.1" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-datepicker-1" class="form-label">Début</label>
        <Litepicker
          id="modal-datepicker-1"
          v-model="formModifierProgramme.debut"
          :options="{
            autoApply: false,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
          class="form-control"
        />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-datepicker-2" class="form-label">Fin</label>
        <Litepicker
          id="modal-datepicker-2"
          v-model="formModifierProgramme.fin"
          :options="{
            autoApply: false,
            showWeekNumbers: true,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }"
          class="form-control"
        />
      </div>
     
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-5" class="form-label">Description</label>
        <textarea id="validation-form-6" class="form-control" v-model="formModifierProgramme.description" placeholder="Ecriver une description du projet"></textarea>
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label for="modal-form-5" class="form-label">Objectif globaux</label>
        <input id="modal-form-5" type="text" v-model="formModifierProgramme.objectifGlobaux" class="form-control" placeholder="Objectif du programme" />
      </div>
    </ModalBody>
    <ModalFooter>
      <button type="button" @click="showModal = false" class="btn btn-outline-secondary w-20 mr-1">Annuler</button>
      <button v-if="addProgrammeLoader" class="btn btn-primary mr-1 mb-2">
        Chargement
        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
      </button>
      <button v-else type="button" class="btn btn-primary w-20" @click="sendForm">
        <span v-if="!update"> Ajouter</span>
        <span v-else> Modifier</span>
      </button>
    </ModalFooter>
  </Modal>
</template>

<style></style>
