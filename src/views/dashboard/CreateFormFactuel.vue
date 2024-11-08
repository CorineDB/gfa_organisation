<script setup>
import { onBeforeUnmount, reactive, ref, computed } from "vue";
import { toast } from "vue3-toastify";
import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import TypeGouvernance from "@/components/create-form/TypeGouvernance.vue";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import CritereGouvernance from "@/components/create-form/CritereGouvernance.vue";
import IndicateurGouvernance from "@/components/create-form/IndicateurGouvernance.vue";
import FactuelStructure from "@/components/create-form/FactuelStructure.vue";
import ListAccordionIndicateur from "@/components/create-form/ListAccordionIndicateur.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import PreviewFactuelForm from "@/components/create-form/PreviewFactuelForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormFactuel from "@/components/create-form/ListFormFactuel.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";

const tabs = [
  {
    label: "FORMULAIRE FACTUEL",
    key: 0,
  },
  {
    label: "LISTE FORMULAIRE FACTUEL",
    key: 1,
  },
];

const currentTab = ref(0);
const indexAccordion = ref(0);
const resetCurrentForm = ref(false);
const modalForm = ref(false);
const isLoadingForm = ref(false);
const resetOptions = ref(false);
const fetchListForms = ref(false);
const previewFormFactuelData = ref([]);
const globalFormFactuelData = ref([]);
const previewTypesGouvernance = ref({});
const globalTypesGouvernance = ref({});
const previewOptionResponses = ref({ options_de_reponse: [] });
const globalOptionResponses = ref({ options_de_reponse: [] });
const typesGouvernance = ref({ types_de_gouvernance: [] });
const uniqueKeys = new Map();

const isAvailable = reactive({
  option: true,
  type: true,
  principe: true,
  critere: true,
  indicateur: true,
  question: true,
});

const payload = reactive({
  libelle: "",
  annee_exercice: new Date().getFullYear(),
  type: "factuel",
  factuel: { options_de_reponse: globalOptionResponses.value.options_de_reponse, types_de_gouvernance: typesGouvernance.value.types_de_gouvernance },
});

const currentPreviewFactuelFormData = reactive({
  type: { id: "", nom: "" },
  principe: { id: "", nom: "" },
  critere: { id: "", nom: "" },
  indicateur: { id: "", nom: "" },
});

const currentGlobalFactuelFormData = reactive({
  type: "",
  principe: "",
  critere: "",
  indicateur: "",
});

// Fonction pour générer une clé unique pour chaque soumission
const generateKey = (id) => {
  return `${id}`;
};

const organiseGlobalFormFactuelData = (submissions) => {
  submissions.forEach((submission) => {
    // Trouver ou créer le type de gouvernance
    let type = typesGouvernance.value.types_de_gouvernance.find((t) => t.id === submission.type);
    if (!type) {
      type = { id: submission.type, principes_de_gouvernance: [] };
      typesGouvernance.value.types_de_gouvernance.push(type);
    }

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe);
    if (!principe) {
      principe = { id: submission.principe, criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere);
    if (!critere) {
      critere = { id: submission.critere, indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    }

    // Ajouter l'indicateur de gouvernance s'il n'est pas déjà présent
    if (!critere.indicateurs_de_gouvernance.includes(submission.indicateur)) {
      critere.indicateurs_de_gouvernance.push(submission.indicateur);
    }
  });

  return typesGouvernance.value;
};
const organisePreviewFormFactuelData = (submissions) => {
  const organisedData = { types_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le type de gouvernance
    let type = organisedData.types_de_gouvernance.find((t) => t.id === submission.type.id);
    if (!type) {
      type = { id: submission.type.id, nom: submission.type.nom, principes_de_gouvernance: [] };
      organisedData.types_de_gouvernance.push(type);
    }

    // Assurer que principes_de_gouvernance est un tableau
    type.principes_de_gouvernance = type.principes_de_gouvernance || [];

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe.id);
    if (!principe) {
      principe = { id: submission.principe.id, nom: submission.principe.nom, criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Assurer que criteres_de_gouvernance est un tableau
    principe.criteres_de_gouvernance = principe.criteres_de_gouvernance || [];

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere.id);
    if (!critere) {
      critere = { id: submission.critere.id, nom: submission.critere.nom, indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    }

    // Assurer que indicateurs_de_gouvernance est un tableau
    critere.indicateurs_de_gouvernance = critere.indicateurs_de_gouvernance || [];

    // Trouver ou créer l'indicateur de gouvernance
    let indicateur = critere.indicateurs_de_gouvernance.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      indicateur = { id: submission.indicateur.id, nom: submission.indicateur.nom };
      critere.indicateurs_de_gouvernance.push(indicateur);
    }
  });

  return organisedData;
};

const resetCurrentPreviewFactuelFormData = () => {
  // for (const key in currentPreviewFactuelFormData) {
  //   currentPreviewFactuelFormData[key] = { id: "", nom: "" };
  // }
  currentPreviewFactuelFormData.indicateur = { id: "", nom: "" };
};
const resetCurrentGlobalFactuelFormData = () => {
  // Object.keys(currentGlobalFactuelFormData).forEach((key) => {
  //   currentGlobalFactuelFormData[key] = "";
  // });
  currentGlobalFactuelFormData.indicateur = "";
};
const resetAllForm = () => {
  resetCurrentGlobalFactuelFormData();
  resetCurrentPreviewFactuelFormData();
  // resetOptions.value = !resetOptions.value;
  // resetCurrentForm.value = !resetCurrentForm.value;
  // globalOptionResponses.value.options_de_reponse = [];
  // principesGouvernance.value.principes_de_gouvernance = [];
  // globalTypesGouvernance.value.types_de_gouvernance = [];
  // previewTypesGouvernance.value.types_de_gouvernance = [];
  globalFormFactuelData.value = [];
  previewFormFactuelData.value = [];
};

const updateAllTypesGouvernance = () => {
  globalTypesGouvernance.value = organiseGlobalFormFactuelData(globalFormFactuelData.value);
  previewTypesGouvernance.value = organisePreviewFormFactuelData(previewFormFactuelData.value);
  // console.log("GLOBAL", globalTypesGouvernance.value);
  // console.log("PREVIEW", previewTypesGouvernance.value);
};

const changeIndexAccordion = (index) => {
  indexAccordion.value = index;
};

const getType = (type) => {
  changeIndexAccordion(1);
  currentGlobalFactuelFormData.type = type.id;
  currentPreviewFactuelFormData.type = { id: type.id, nom: type.nom };
};
const getPrincipe = (principe) => {
  changeIndexAccordion(4);
  currentGlobalFactuelFormData.principe = principe.id;
  currentPreviewFactuelFormData.principe = { id: principe.id, nom: principe.nom };
};
const getCritere = (critere) => {
  changeIndexAccordion(3);
  currentGlobalFactuelFormData.critere = critere.id;
  currentPreviewFactuelFormData.critere = { id: critere.id, nom: critere.nom };
};
const getIndicateur = (indicateur) => {
  changeIndexAccordion(2);
  currentGlobalFactuelFormData.indicateur = indicateur.id;
  currentPreviewFactuelFormData.indicateur = { id: indicateur.id, nom: indicateur.nom };
};

const addNewIndicator = () => {
  const key = generateKey(currentGlobalFactuelFormData.indicateur);

  // Ajouter la soumission si la clé est absente
  if (!uniqueKeys.has(key)) {
    globalFormFactuelData.value.unshift({ ...currentGlobalFactuelFormData });
    previewFormFactuelData.value.unshift(JSON.parse(JSON.stringify(currentPreviewFactuelFormData)));
    uniqueKeys.set(key, true);
    // console.log("global:", globalFormFactuelData.value);
    // console.log("preview:", previewFormFactuelData.value);
    updateAllTypesGouvernance();
    resetCurrentPreviewFactuelFormData();
    resetCurrentGlobalFactuelFormData();
    resetCurrentForm.value = !resetCurrentForm.value;
    toast.success("Indicateur ajouté.");
  } else {
    toast.info("Indicateur exisant.");
  }
};
const removeIndicator = (indicateur) => {
  const key = generateKey(indicateur.id);
  // Trouver l'index de la soumission à supprimer
  const index = globalFormFactuelData.value.findIndex((s) => s.indicateur === indicateur.id);
  // Supprimer la soumission et sa clé si elle est trouvée
  if (index !== -1) {
    globalFormFactuelData.value.splice(index, 1);
    previewFormFactuelData.value.splice(index, 1);
    uniqueKeys.delete(key);
    updateAllTypesGouvernance();
    toast.success("Indicateur supprimé.");
    // console.log("Nouvelle Global:", globalFormFactuelData.value);
    // console.log("Nouvelle preview:", previewFormFactuelData.value);
  }
};
const clearUniqueKeys = () => {
  uniqueKeys.clear(); // Supprime toutes les clés de uniqueKeys
};

const resetForm = () => {
  payload.libelle = "";
  modalForm.value = false;
};
const createForm = async () => {
  isLoadingForm.value = true;
  try {
    await FormulaireFactuel.create(payload);
    toast.success(`Formulaire créé avec succès.`);
    fetchListForms.value = !fetchListForms.value;
    resetForm();
    clearUniqueKeys();
    // resetAllForm();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
    console.log(e);
  } finally {
    isLoadingForm.value = false;
  }
};

const previewForm = () => {
  if (globalOptionResponses.value.options_de_reponse.length >= 2) modalForm.value = true;
  else {
    toast.error("Ajouter au moins deux options de réponses.");
  }
};

const isCurrentFormValid = computed(() => {
  return Object.values(currentPreviewFactuelFormData).every((value) => value.id.trim() !== "");
});

const showForm = computed(() => {
  return globalFormFactuelData.value.length > 0;
});

onBeforeUnmount(() => {
  clearUniqueKeys();
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section class="w-[30%] h-screen pr-1 overflow-y-auto border-r-2 pt-5">
      <AccordionGroup :selectedIndex="indexAccordion" class="space-y-1">
        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponse :is-reset="resetOptions" v-model:previewOptionResponses="previewOptionResponses" v-model:globalOptionResponses="globalOptionResponses" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Indicateurs de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <IndicateurGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.indicateur" @selected="getIndicateur" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Critères de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <CritereGouvernance :to-reset="false" :is-available="isAvailable.critere" @selected="getCritere" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeGouvernance :to-reset="false" :is-available="isAvailable.principe" @selected="getPrincipe" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Type de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <TypeGouvernance :to-reset="false" :is-available="isAvailable.type" @selected="getType" />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class="w-[70%] pt-5">
      <TabGroup :selectedIndex="currentTab">
        <TabList class="nav-boxed-tabs">
          <Tab @click="currentTab = tab.key" v-for="(tab, indexTab) in tabs" :key="indexTab" class="w-full py-2" tag="button">{{ tab.label }}</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <div class="flex flex-col gap-8">
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des options de réponses</p>
                <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Ajouter des indicateurs</p>
                <FactuelStructure :type="currentPreviewFactuelFormData.type.nom" :principe="currentPreviewFactuelFormData.principe.nom" :critere="currentPreviewFactuelFormData.critere.nom" :indicateur="currentPreviewFactuelFormData.indicateur.nom" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary"><PlusIcon class="mr-1 size-4" />Ajouter</button>
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des indicateurs</p>
                <div class="max-h-[25vh] h-[25vh] py-2 border-t overflow-y-auto">
                  <ListAccordionIndicateur :indicateurs-array="previewFormFactuelData" @remove="removeIndicator" />
                </div>
                <div class="flex justify-start py-2">
                  <button :disabled="!showForm" @click="previewForm" class="px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Prévisualiser le formumlaire</button>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel class="">
            <ListFormFactuel :fetch-data="fetchListForms" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" size="modal-xl" :show="modalForm" @hidden="modalForm = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer le formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="createForm">
      <ModalBody class="space-y-5">
        <div class="flex gap-4">
          <InputForm label="Libellé" class="w-full" v-model="payload.libelle" />
          <div class="w-full">
            <label for="annee" class="form-label">Année</label>
            <input id="annee" type="number" required v-model.number="payload.annee_exercice" class="form-control" placeholder="Année" />
          </div>
        </div>
        <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
        </div>
        <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <p class="mb-3">Formulaire factuel</p>
          <PreviewFactuelForm :types-gouvernance="previewTypesGouvernance.types_de_gouvernance" />
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="modalForm = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingForm" label="Enregistrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- END: Modal Content -->
</template>

<style>
.accordion .accordion-item .accordion-header .accordion-button:not(.collapsed) {
  background: rgb(var(--color-primary)) !important;
}

.accordion .accordion-item:first-child {
  margin-top: 0 !important;
}
</style>
