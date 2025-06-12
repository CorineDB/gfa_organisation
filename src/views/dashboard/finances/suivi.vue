<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SuiviFinancierService from "@/services/modules/suiviFinancier.service";
import ProgrammeService from "@/services/modules/programme.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import AuthService from "@/services/modules/auth.service";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { helper as $h } from "@/utils/helper";
import SuiviFinancier from "@/services/modules/suiviFinancier.service";
import ActiviteService from "@/services/modules/activite.service";
import PlanDeCaissement from "@/services/modules/plan.decaissement.service";
import PlanDeDecaissementService from "@/services/modules/plan.decaissement.service";

// import SuiviFinancierService from "@/services/modules/suiviFinancier.service";
// import SuiviFinancierService from "@/services/modules/suiviFinancier.service";

// Ajout de plan de décaissement

const store = useStore();

// Définition des actions
const prolongerDureeActivite = async (payload) => {
  await store.dispatch("activites/PROLONGER_DATE", payload);
};

const storePlanDecaissement = async (payload) => {
  await store.dispatch("planDeDecaissements/STORE_PLAN_DE_DECAISSEMENT", payload);
};

// ...mapActions({
//       // Mapping des actions pour le module activites
//       prolongerDureeActivite: "activites/PROLONGER_DATE",
//       // Mapping des actions pour le module planDeDecaissements
//       storePlanDecaissement: "planDeDecaissements/STORE_PLAN_DE_DECAISSEMENT",
//     }),

const erreurPlanDeDecaissement = ref(null);
const planDeDecaissement = ref([]);
const loadingPlanDeDecaissement = ref(false);
const showModalPlanDeDecaissement = ref(false);

const getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
};

const planDeDecaissementPayload = ref({
  activiteId: null,
  trimestre: getCurrentQuarter(), // Trimestre actuel
  annee: new Date().getFullYear(), // Set current year as default
  budgetNational: 0,
  pret: 0,
});

const removePlanDeDecaissement = function (index) {
  planDeDecaissement.value.splice(index, 1);
};

const planDeDecaissementActivite = async function () {
  loadingPlanDeDecaissement.value = true;

  let errorIndex = [];

  for (let index = 0; index < planDeDecaissement.value.length; index++) {
    let plan = listePlanDeDecaissement.value.filter((plan) => plan.annee == planDeDecaissement.value[index].annee && plan.trimestre == planDeDecaissement.value[index].trimestre);

    const action = plan.length > 0 ? PlanDeCaissement.update(plan[0].id, planDeDecaissement.value[index]) : PlanDeDecaissementService.create(planDeDecaissement.value[index]);

    try {
      await action;

      toast.success(`Plan  de decaissement n° ${index + 1} enrégistré avec succès`);

      errorIndex.push(index);

      if (index === planDeDecaissement.value.length - 1) {
        showModalPlanDeDecaissement.value = false;

        setTimeout(() => {
          this.planDeDecaissement = [];
        }, 500);
      }
    } catch (error) {
      loadingPlanDeDecaissement.value = false;

      // Mettre à jour les messages d'erreurs dynamiquement
      if (error.response && error.response.data && error.response.data.errors.length > 0) {
        erreurPlanDeDecaissement.value = error.response.data.errors;
        toast.error("Une erreur s'est produite dans votre formualaire");
      } else {
        toast.error(`Plan ${index + 1} : ${error.response.data.message}`);
      }
    } finally {
      loadingPlanDeDecaissement.value = false;
      getListePlanDeDecaissement(planDeDecaissement.value[0].activiteId);
    }

    if (planDeDecaissement.value.length > 0) {
      if (errorIndex.length > 0) {
        errorIndex.forEach((item) => {
          removePlan(item);
        });
      }
    }
  }
};

const loaderListePlan = ref(false);

const listePlanDeDecaissement = ref([]);

const getListePlanDeDecaissement = (id) => {
  loaderListePlan.value = true;

  ActiviteService.plansDeDecaissement(id)
    .then((data) => {
      loaderListePlan.value = false;
      //console.log(data.data.data);
      listePlanDeDecaissement.value = data.data.data;

      // console.log("listePlanDeDecaissement.value", listePlanDeDecaissement);
    })
    .catch((error) => {
      loaderListePlan.value = false;
      //console.log(error);
    });
};

const ouvrirModalPlanDeDecaissementActivite = function (data) {
  console.log(data);

  planDeDecaissement.value = [];

  const newItem = {
    activiteId: data.activite.id,
    trimestre: this.getCurrentQuarter(),
    annee: new Date().getFullYear(),
    budgetNational: 0,
    pret: 0,
    id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
  };

  getListePlanDeDecaissement(data.activite.id);

  showModalPlanDeDecaissement.value = true;
  planDeDecaissementPayload.value.activiteId = data.activite.id;
  planDeDecaissement.value.push(planDeDecaissementPayload.value);
  showModalPlanDeDecaissement.value = true;
};

const router = useRouter();
const showModalFiltre = ref(false);
const annees = ref("");
const filterPayload = reactive({
  trimestre: getCurrentQuarter(),
  annee: new Date().getFullYear(),
});
const isLoadingFilter = ref(false);

const suiviFinancier = ref([]);
const suiviFinancierPayload = reactive({
  activiteId: null,
  trimestre: 1, // Trimestre actuel
  annee: new Date().getFullYear(), // Set current year as default
  consommer: 0,
  // type: 0,
});

const resetFilter = function () {
  filterPayload.trimestre = 1;
  filterPayload.annee = new Date().getFullYear();

  filterSuiviFinancierActivite();
};

const getPlageActivitePlan = computed(() => {
  let obj = null;

  if (planDeDecaissementPayload.value.activiteId !== "") {
    obj = datas.value.suiviFinanciers?.find((item) => item.activite.id === planDeDecaissementPayload.value.activiteId);
  }

  console.log("obj", obj);

  return obj ? obj : null;
  // Retourne le nom ou `null` si non trouvé
});

const getPlageActivite = computed(() => {
  let obj = null;

  console.log("payload.activiteId", payload.activiteId);

  console.log("datas.value.suiviFinanciers", datas.value.suiviFinanciers);

  if (suiviFinancierPayload.activiteId !== "") {
    obj = datas.value.suiviFinanciers?.find((item) => item.activite.id === suiviFinancierPayload.activiteId);
  }

  console.log("obj", obj);

  return obj ? obj : null;
  // Retourne le nom ou `null` si non trouvé
});

const showModalSuiviFinancier = ref(false);
const loadingSuiviFinancier = ref(false);
const erreurSuiviFinancier = ref(null);

const payload = reactive({
  consommer: "",
  type: "",
  annee: "",
  activiteId: "",
  trimestre: "",
});

const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const activites = ref([]);
const datas = ref([]);

const debutProgramme = ref("");
const finProgramme = ref("");

// const years = ref([]);

const years = computed(() => {
  console.log("debut", `${debutProgramme.value.split("-")}`);
  console.log("fin", `${finProgramme.value.split("-")}`);
  let anneeDebut = parseInt(`${debutProgramme.value.split("-")[0]}`);
  let anneeFin = parseInt(`${finProgramme.value.split("-")[0]}`);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    if (annee <= new Date().getFullYear()) {
      annees.push(annee);
    }
  }
  return annees;
});

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      // responsablesForm.value.ug = result.data.data.profil.id;
      // ugs.value.push({ id: result.data.data.profil.id, nom: result.data.data.profil.nom });
      // idProgramme.value = result.data.data.programme.id;
      console.log("debut", result.data.data.programme.debut);
      console.log("fin", result.data.data.programme.debut);
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const createData = async () => {
  console.log("payload", payload);
  isLoading.value = true;
  await SuiviFinancierService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi Financier créer.");
    })
    .catch((e) => {
      console.log(e);
      isLoading.value = false;
      toast.error("Vérifier les informations et ressayer.");
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await SuiviFinancierService.get()
    .then((result) => {
      datas.value = result.data.data;
      console.log(datas.value);
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
  // initTabulator();
};
const updateData = async () => {
  isLoading.value = true;
  await SuiviFinancierService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi Financier modifiée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await SuiviFinancierService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Suivi Financier supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};

const handleInput = function (data) {
  console.log(data);
  getactivites(data);
};

const getactivites = (year) => {
  ProgrammeService.filtreActivites({ annee: year })
    .then((result) => {
      activites.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Programmes.");
    });
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Libelle",
        field: "libelle",
      },
      {
        title: "Description",
        field: "description",
      },
      {
        title: "Clé",
        field: "key",
        hozAlign: "center",
        width: 200,
      },
      {
        title: "Type",
        field: "type",
        hozAlign: "center",
        width: 200,
      },
      {
        title: "Actions",
        field: "actions",
        formatter: (cell) => {
          const container = document.createElement("div");
          container.className = "flex items-center justify-center gap-3";

          const createButton = (label, className, onClick) => {
            const button = document.createElement("button");
            button.className = className;
            button.innerText = label;
            button.addEventListener("click", onClick);
            return button;
          };

          const voirDetail = createButton("Voir détail", "btn btn-primary", () => {
            console.log("cell.getData().id", cell.getData().id);
            handleDetail(cell.getData().id);
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(voirDetail, deleteButton);

          return container;
        },
      },
    ],
  });
};
const handleDetail = (data) => {
  // console.log("handleDetail id", id);
  router.push({
    name: "Détail du suivi financier",
    params: { id: data.activite.id },
  });
};

const handleDelete = (params) => {
  idSelect.value = params.id;
  deleteModalPreview.value = true;
};
const cancelSelect = () => {
  deleteModalPreview.value = false;
  idSelect.value = "";
};
const resetForm = () => {
  payload.consommer = "";
  payload.type = "";
  payload.annee = "";
  payload.activiteId = "";
  payload.trimestre = "";
  showModalCreate.value = false;
};
const openCreateModal = () => {
  years.value = [];
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0]);
  let anneeFin = parseInt(finProgramme.value.split("-")[0]);

  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    years.value.push(annee);
  }

  console.log("years", years.value);

  showModalCreate.value = true;
  isCreate.value = true;
};

// const getCurrentQuarter = () => {
//   const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
//   return Math.ceil(month / 3); // Calcul du trimestre actuel
// };

const loaderListeSuivi = ref(false);
const listeSuivi = ref([]);
const tableauListeSuivi = ref([]);

const filterSuiviFinancierActiviteParAnnee = async function (id, payload, index) {
  loaderListeSuivi.value = true;

  await SuiviFinancier.getSuiviByActivite(id, payload)
    .then((data) => {
      loaderListeSuivi.value = false;

      console.log(data.data.data);

      listeSuivi.value = data.data.data;

      tableauListeSuivi.value[index] = listeSuivi.value;

      console.log("tableauListeSuivi.value", tableauListeSuivi.value);
    })
    .catch((error) => {
      loaderListeSuivi.value = false;
      //console.log(error);
    });
};

const miseAjourTabSuivi = function (id, payLoad, index) {
  console.log("payLoad.length", payLoad.length);
  console.log("index", index);

  let taille = payLoad.length;

  console.log("tableauListeSuivi[index]", tableauListeSuivi.value[index]);

  let form = {
    trimestre: taille < 2 ? payLoad : suiviFinancier.value[index].trimestre,
    annee: taille > 1 ? payLoad : suiviFinancier.value[index].annee,
  };

  console.log("form", form);

  filterSuiviFinancierActiviteParAnnee(id, form, index);
};

const ouvrirModalSuiviFinancierActivite = (item) => {
  suiviFinancier.value = [];
  console.log(item);
  const newItem = {
    activiteId: item.activite.id,
    trimestre: getCurrentQuarter(),
    annee: new Date().getFullYear(),
    consommer: 0,
    id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
  };

  let payLoad = {
    trimestre: getCurrentQuarter(),
    annee: new Date().getFullYear(),
  };

  console.log("item.id", item.activiteId);

  filterSuiviFinancierActiviteParAnnee(item.activite.id, payLoad, 0);

  suiviFinancierPayload.activiteId = item.activite.id;
  suiviFinancierPayload.trimestre = getCurrentQuarter();
  suiviFinancier.value.push(newItem);
  showModalSuiviFinancier.value = true;
};

const resetModalSuiviFinancierActivite = (item) => {
  suiviFinancier.value = [];
  showModalSuiviFinancier.value = false;
};
const addPlan = () => {
  const newItem = {
    activiteId: planDeDecaissementPayload.value.activiteId,
    trimestre: 1, // Trimestre actuel
    annee: new Date().getFullYear(), // Set current year as default
    budgetNational: 0,
    pret: 0,
    id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
  };
  planDeDecaissement.value.push(newItem);
};

const addSuivi = function () {
  const newItem = {
    activiteId: suiviFinancier.value[0].activiteId,
    trimestre: getCurrentQuarter(),
    annee: new Date().getFullYear(),
    consommer: 0,

    id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
  };
  suiviFinancier.value.push(newItem);

  let payLoad = {
    trimestre: getCurrentQuarter(),
    annee: new Date().getFullYear(),
  };

  console.log("suiviFinancierPayload.id", suiviFinancierPayload.id);

  console.log("suiviFinancier.value.length - 1", suiviFinancier.value.length - 1);

  filterSuiviFinancierActiviteParAnnee(suiviFinancier.value[0].activiteId, payLoad, suiviFinancier.value.length - 1);
};

const removePlan = (index) => {
  suiviFinancier.value.splice(index, 1);
};

const removeSuivi = (index) => {
  suiviFinancier.value.splice(index, 1);
};

const suiviFinancierActivite = async () => {
  loadingSuiviFinancier.value = true;

  let errorIndex = [];

  console.log("suiviFinancier.value.length", suiviFinancier.value.length);

  for (let index = 0; index < suiviFinancier.value.length; index++) {
    console.log("tableauListeSuivi.value", tableauListeSuivi.value);

    console.log("suiviFinancier.value[index]", suiviFinancier.value[index]);

    let suivi = tableauListeSuivi.value.filter((suivi) => suivi.annee == suiviFinancier.value[index].annee && suivi.trimestre == suiviFinancier.value[index].trimestre);

    console.log("suivi", suivi);

    console.log("suivi.length", suivi.length);

    // console.log("suivi[0]?.id", suivi[0]?.id);

    const action = suivi.length > 0 ? SuiviFinancier.update(suivi[0]?.id, suiviFinancier.value[index]) : SuiviFinancierService.create(suiviFinancier.value[index]);

    try {
      await action;

      toast.success(`Suivi financier n° ${index + 1} enrégistré avec succès`);

      errorIndex.push(index);

      console.log("index === suiviFinancier.value.length - 1", index === suiviFinancier.value.length - 1);

      if (index === suiviFinancier.value.length - 1) {
        this.showModalSuiviFinancier = false;

        setTimeout(() => {
          this.planDeDecaissement = [];
        }, 500);
      }

      // getDatas();
      // getDatasCadre();
      // resetForm();
    } catch (error) {
      console.log("error", error);

      loadingSuiviFinancier.value = false;

      // Mettre à jour les messages d'erreurs dynamiquement
      if (error.response && error.response.data && error.response.data.errors.length > 0) {
        this.erreurSuiviFinancier = error.response.data.errors;
        toast.error("Une erreur s'est produite dans votre formualaire");
      } else {
        toast.error(`Suivi ${index + 1} : ${error.response.data.message}`);
      }
    } finally {
      loadingSuiviFinancier.value = false;
      // getListePlanDeDecaissement(suiviFinancier.value[0].activiteId);
    }

    if (suiviFinancier.value.length > 0) {
      console.log("suiviFinancier.value", suiviFinancier.value);

      if (errorIndex.length > 0) {
        console.log("errorIndex", errorIndex);
        errorIndex.forEach((item) => {
          removeSuivi(item);
        });
      }
    }
  }

  this.showModalSuiviFinancier = false;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

const openFilterModal = () => {
  console.log(filterPayload.annee);
  filterPayload.trimestre = 3; //getCurrentQuarter();
  showModalFiltre.value = true;
};

const filterSuiviFinancierActivite = async () => {
  isLoadingFilter.value = true;

  console.log(filterPayload.annee);

  filterPayload.annee = parseInt(filterPayload.annee);
  filterPayload.trimestre = parseInt(filterPayload.trimestre);

  await SuiviFinancierService.filtre(filterPayload)
    .then((result) => {
      datas.value = result.data.data;
      resetFilterModal();
      toast.success("Suivi Financier filtrer.");
    })
    .catch((e) => {
      console.log(e);
      isLoadingFilter.value = false;
      toast.error("Vérifier les informations et ressayer.");
    });
};

const resetFilterModal = () => {
  isLoadingFilter.value = false;
  showModalFiltre.value = false;
  filterPayload.trimestre = getCurrentQuarter();
  filterPayload.annee = new Date().getFullYear();
};

onMounted(() => {
  getDatas();

  getcurrentUser();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Suivi Financier</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openFilterModal"><FilterIcon class="w-4 h-4 mr-3" />Filtrer le suivi financier</button>

        <button class="btn btn-primary" title="Réinitialiser le filtre" @click="resetFilter()">
          <RefreshCwIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <div></div>
      <div class="flex mt-5 sm:mt-0">
        <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Print</button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Export
            <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export CSV </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export JSON </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export XLSX </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export HTML </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <div>
      <div class="border my-4 rounded-lg border-gray-300 shadow-md" v-if="!isLoadingData">
        <!-- suivi budgetaire  current -->
        <div class="current">
          <div class="overflow-y-auto overflow-x-auto flex relative shadow-md sm:rounded-lg">
            <div style="width: 20%; position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
              <table class="top-0 left-0 block w-full text-sm text-left table-fixed border-collaspe table1">
                <thead class="sticky top-0 z-20 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr style="height: 82px">
                    <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Activités</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="height: 49px" v-for="(suivi, index) in datas.suiviFinanciers" :key="index" class="bg-white border-b hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi?.activite?.codePta }}-{{ suivi?.activite?.nom }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="absolute shadow-md perso left-[150px] sm:rounded-lg">
              <table class="w-full overflow-auto text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="sticky top-0 text-xs text-gray-700 uppercase _z-20 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Année</th>
                    <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Trimestre</th>
                    <th scope="col" colspan="4" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Période</th>
                    <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Exercice</th>
                    <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Cumul</th>
                    <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap text-center">Actions</th>
                  </tr>
                  <tr>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                    <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(suivi, index) in datas.suiviFinanciers" :key="index" class="bg-white border-b hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.annee }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.trimestre }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.periode.budget == null || suivi.periode.budget == 0 ? 0 : $h.formatCurrency(suivi.periode.budget) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.periode.consommer == null || suivi.periode.consommer == 0 ? 0 : $h.formatCurrency(suivi.periode.consommer) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.periode.disponible == null || suivi.periode.disponible == 0 ? 0 : $h.formatCurrency(suivi.periode.disponible) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.periode.pourcentage }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.exercice.budget == null || suivi.exercice.budget == 0 ? 0 : $h.formatCurrency(suivi.exercice.budget) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.exercice.consommer == null || suivi.exercice.consommer == 0 ? 0 : $h.formatCurrency(suivi.exercice.consommer) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.exercice.disponible == null || suivi.exercice.disponible == 0 ? 0 : $h.formatCurrency(suivi.exercice.disponible) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.exercice.pourcentage }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.cumul.budget == null || suivi.cumul.budget == 0 ? 0 : $h.formatCurrency(suivi.cumul.budget) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.cumul.consommer == null || suivi.cumul.consommer == 0 ? 0 : $h.formatCurrency(suivi.cumul.consommer) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.cumul.disponible == null || suivi.cumul.disponible == 0 ? 0 : $h.formatCurrency(suivi.cumul.disponible) }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <span class="font-bold">{{ suivi.cumul.pourcentage }}</span>
                    </td>
                    <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700 text-center">
                      <button @click="ouvrirModalSuiviFinancierActivite(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Suivre</button>

                      <button @click="handleDetail(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Voir détail</button>

                      <button @click="ouvrirModalPlanDeDecaissementActivite(suivi)" title="Ajouter un plan de décaissement" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Ajouter un Plan de décaissement</button>

                      <!-- <button @click="handleDelete(suivi)" class="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-xs px-4 py-2">Supprimer</button> -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <Modal backdrop="static" :show="showModalPlanDeDecaissement" @hidden="showModalPlanDeDecaissement = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Plan de décaissement</h2>
    </ModalHeader>

    <form @submit.prevent="planDeDecaissementActivite">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div v-for="(plan, index) in planDeDecaissement" :key="plan.id" class="col-span-12 border-b pb-4 mb-4">
          <h3 class="text-sm font-medium mb-2">Plan {{ index + 1 }}</h3>

          <div class="col-span-12 mt-3">
            <label class="form-label">Année</label>
            <TomSelect v-model="plan.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurPlanDeDecaissement[index].annee }}
            </p>
          </div>

          <!-- <InputForm v-model="plan.annee" :min="2000" class="col-span-12" type="number" :required="true" placeHolder="Saisissez l'année" label="Saisissez l'année de décaissement" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.annee">
            {{ erreurPlanDeDecaissement[index].annee }}
          </p> -->

          <div class="w-full mt-3">
            <label class="form-label">Sélectionnez le trimestre</label>
            <TomSelect v-model="plan.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurPlanDeDecaissement[index].trimestre }}
            </p>
          </div>

          <!-- <InputForm v-model="plan.trimestre" :min="1" :max="4" class="col-span-12" type="number" :required="true" placeHolder="Sélectionnez le trimestre" label="Sélectionnez le trimestre" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.trimestre">
            {{ erreurPlanDeDecaissement[index].trimestre }}
          </p> -->

          <InputForm v-model="plan.budgetNational" :min="0" class="col-span-12" type="number" :required="true" placeHolder="Saisissez le fond propre" label="Saisissez le fond propre" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.budgetNational">
            {{ erreurPlanDeDecaissement[index].budgetNational }}
          </p>

          <InputForm v-model="plan.pret" :min="0" class="col-span-12" type="number" :required="true" placeHolder="Saisissez la subvention" label="Saisissez la subvention" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.pret">
            {{ erreurPlanDeDecaissement[index].pret }}
          </p>

          <button type="button" @click="removePlan(index)" class="mt-2 text-red-600 text-sm underline">Supprimer ce plan</button>

          <div class="col-span-12" v-if="getPlageActivite">
            <div class="flex items-center mt-2" v-for="(plage, t) in getPlageActivite.durees" :key="t">
              <ClockIcon class="w-4 h-4 mr-2" />
              <div>
                Plage de date {{ getPlageActivite.durees.length + 1 }} : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageActivite.durees[getPlageActivite.durees.length - 1].debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageActivite.durees[getPlageActivite.durees.length - 1].fin) }}</span>
              </div>
            </div>
          </div>

          <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
            <ClockIcon class="w-4 h-4 mr-2" />
            <div>
              Durée du projet : Du <span class="px-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
            </div>
          </div>
        </div>

        <button type="button" @click="addPlan" class="col-span-12 btn btn-outline-primary">Ajouter un autre plan</button>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModalPlanDeDecaissement = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingPlanDeDecaissement" :type="submit" :disabled="loaderListePlan" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal Delete -->
  <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer cette Suivi Financier?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->

  <Modal backdrop="static" :show="showModalSuiviFinancier" @hidden="showModalSuiviFinancier = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un Suivi Financier</h2>
    </ModalHeader>

    <form @submit.prevent="suiviFinancierActivite">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div v-for="(suivi, index) in suiviFinancier" :key="index" class="col-span-12 border-b pb-4 mb-4">
          <h3 class="text-sm font-medium mb-3">Plan {{ index + 1 }}</h3>

          <div class="">
            <InputForm label="Consommé" v-model="suivi.consommer" type="number" />

            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.consommer">
              {{ erreurSuiviFinancier[index].consommer }}
            </p>
          </div>

          <!-- <div class="mt-5">
            <InputForm v-model="suivi.trimestre" :min="1" :max="4" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Sélectionnez le trimestre" label="Sélectionnez le trimestre" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div> -->

          <div class="w-full mt-3">
            <label class="form-label">Sélectionnez le trimestre</label>
            <TomSelect v-model="suivi.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full" @change="miseAjourTabSuivi(suivi.activiteId, suivi.trimestre, index)">
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div>

          <!-- <div class="mt-5">
            <InputForm v-model="suivi.annee" :min="2000" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Saisissez l'année" label="Saisissez l'année de décaissement" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.annee">
              {{ erreurSuiviFinancier[index].annee }}
            </p>
          </div> -->

          <div class="col-span-12 mt-3">
            <label class="form-label">Année</label>
            <TomSelect v-model="suivi.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full" @change="miseAjourTabSuivi(suivi.activiteId, suivi.annee, index)">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div>

          <!-- <pre>getPlageActivite :{{ getPlageActivite.activite }}</pre> -->

          <button type="button" @click="removeSuivi(index)" class="mt-2 text-red-600 text-sm underline">Supprimer ce suivi</button>
        </div>

        <button type="button" @click="addSuivi" class="col-span-12 btn btn-outline-primary">Ajouter un autre suivi</button>

        <div class="col-span-12" v-if="getPlageActivite">
          <div class="flex items-center mt-2">
            <ClockIcon class="w-4 h-4 mr-2" />
            <div>
              Durée de l'activité : Du <span class="px-1 font-bold"> {{ $h.reformatDate(getPlageActivite.activite.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageActivite.activite.fin) }}</span>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="resetModalSuiviFinancierActivite" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingSuiviFinancier" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalFiltre" @hidden="showModalFiltre = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer le pta</h2>
    </ModalHeader>
    <form @submit.prevent="filterSuiviFinancierActivite">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <pre>{{years}}</pre> -->
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="filterPayload.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="filterPayload.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option v-for="(i, index2) in 4" :key="index2" :value="i">Trimestre {{ i }}</option>
            </TomSelect>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFilterModal" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingFilter" label="Filtrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->
</template>
