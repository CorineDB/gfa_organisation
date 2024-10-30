<script setup>
import { ref, watch, computed, onMounted } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import PreviewDetailFactuelForm from "@/components/create-form/PreviewDetailFactuelForm.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";

const prop = defineProps({
  fetchData: Boolean,
});

const tabulator = ref();
const isLoading = ref(false);
const isLoadingOneForm = ref(false);
const showModal = ref(false);
const showModalDelete = ref(false);
const listForms = ref([]);
const previewForm = ref({});
const idSelectedForm = ref("");
const nameSelect = ref("");
const getListForm = async () => {
  isLoading.value = true;
  try {
    const { data } = await FormulaireFactuel.get();
    listForms.value = data.data;
  } catch (e) {
    toast.error("Erreur récupération liste des formulaires.");
    console.log(e);
  } finally {
    isLoading.value = false;
  }
  initTabulator();
};
const getOneForm = async () => {
  isLoadingOneForm.value = true;
  try {
    const { data } = await FormulaireFactuel.getOne(idSelectedForm.value);
    previewForm.value = data.data;
  } catch (e) {
    toast.error("Erreur récupération du  formulaire.");
    console.log(e);
  } finally {
    isLoadingOneForm.value = false;
  }
};
const deleteOneForm = async () => {
  isLoadingOneForm.value = true;
  try {
    await FormulaireFactuel.destroy(idSelectedForm.value);
    showModalDelete.value = false;
    toast.success("Formulaire supprimé.");
    getListForm();
  } catch (e) {
    toast.error("Erreur lors de la suppression.");
    console.log(e);
  } finally {
    isLoadingOneForm.value = false;
  }
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: listForms.value,
    placeholder: "Aucune donnée disponible.",
    headerHozAlign: "center",
    layout: "fitColumns",

    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
        hozAlign: "center",
      },
      {
        title: "Année",
        field: "annee_exercice",
        vertAlign: "middle",
        hozAlign: "center",
      },
      {
        title: "Actions",
        field: "actions",
        vertAlign: "middle",
        hozAlign: "center",

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

          const modifyButton = createButton("Voir", "btn btn-primary", () => {
            handlepreview(cell.getData());
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(modifyButton, deleteButton);

          return container;
        },
      },
    ],
  });
};
const handlepreview = (params) => {
  idSelectedForm.value = params.id;
  getOneForm();
  showModal.value = true;
};

const handleDelete = (params) => {
  idSelectedForm.value = params.id;
  nameSelect.value = params.libelle;
  showModalDelete.value = true;
};

const cancelDelete = () => {
  idSelectedForm.value = "";
  showModalDelete.value = false;
};

const optionPreviewForm = computed(() => {
  if (previewForm.value.options_de_reponse)
    return previewForm.value.options_de_reponse.map((option) => ({
      id: option.id,
      point: option.point,
      libelle: option.libelle,
    }));
});

watch(
  () => prop.fetchData,
  () => {
    getListForm();
  }
);

onMounted(() => {
  getListForm();
});
</script>

<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Formulaires Factuels</h2>
    <LoaderSnipper v-if="isLoading" />
    <div v-show="!isLoading" class="overflow-x-auto scrollbar-hidden">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <!-- <div v-if="!isLoading" class="grid gap-3 mx-auto grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] mt-5" v-for="form in listForms" :key="form.id">
      <div class="p-3 space-y-3 bg-white rounded shadow-md">
        <p class="text-lg font-semibold">{{ form.libelle }}</p>
        <div class="flex justify-between border-t border-gray-300">
          <div class="flex items-center gap-1 space-x-3 transition-all">
            <button class="p-1.5 text-white btn btn-primary">
              <Edit3Icon class="size-5" />
            </button>
            <button class="p-1.5 text-white btn btn-danger">
              <TrashIcon class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>

  <!-- BEGIN: Modal Content -->
  <Modal size="modal-xl" :show="showModal" @hidden="showModal = false">
    <LoaderSnipper v-if="isLoadingOneForm" />
    <div v-else class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ previewForm.libelle }}</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="optionPreviewForm" />
        </div>
        <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <p class="mb-3">Formulaire</p>
          <PreviewDetailFactuelForm :datas="previewForm.categories_de_gouvernance" />
        </div>
      </ModalBody>
    </div>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModal = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->

  <!-- Modal for deleting -->
  <Modal :show="showModalDelete" @hidden="showModalDelete = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Ce formulaire sera supprimé</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoadingOneForm" @click="deleteOneForm" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style scoped></style>
