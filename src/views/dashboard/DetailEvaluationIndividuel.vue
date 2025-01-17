<template>
  <div>
    <nav aria-label="breadcrumb" class="h-full mt-4 mr-auto -intro-x">
      <ol class="breadcrumb breadcrumb-dark">
        <li class="cursor-pointer breadcrumb-item"><span @click="$router.back()">Évaluations</span></li>
        <li class="breadcrumb-item active" aria-current="page">Soumissions</li>
      </ol>
    </nav>
    <!-- <h2 class="mt-10 text-lg font-medium intro-y">Détails de l'evaluation</h2> -->
    <LoaderSnipper v-if="isLoadingData" />
    <div v-else class="mt-5">
      <p class="my-4 text-lg font-medium intro-y">Liste des soumissions</p>
      <div class="flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
        <div @click="goToPageSoumission(soumission.id)" v-for="(soumission, index) in datas" :key="index" class="flex items-center justify-between w-full gap-2 px-2 py-3 text-base font-medium text-black truncate transition-all bg-white border border-l-4 rounded shadow-md cursor-pointer border-primary">
          <p>
            Soumission n° {{ index + 1 }}
            <!-- <span :class="[true ? 'bg-green-500' : 'bg-yellow-500']" class="px-2 py-1 mr-1 text-xs text-white rounded-full">{{ true ? "Terminé" : "En cours" }}</span> -->
          </p>
          <!-- <ProgressBar :percent="20" class="max-w-[200px]" /> -->
          <!-- <div class="flex items-center gap-4">
                        <button class="text-sm btn btn-primary" @click="goToPageSynthese(soumission.id)">Fiche Synthèse</button>
                        <button v-if="!soumission.statut" class="p-2 text-danger" @click="handleDelete(soumission.id)">
                          <TrashIcon class="size-5" />
                        </button>
                      </div> -->
        </div>
      </div>
    </div>

    <div v-if="!isLoadingData && !datas.length" class="flex justify-center mt-5 text-lg text-slate-500">Aucune données disponibles</div>
  </div>
  <Modal size="modal-xl " :show="previewResponse" @hidden="previewResponse = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Réponses</h2>
    </ModalHeader>
    <ModalBody>
      <table class="w-full max-w-full my-5 border border-collapse table-auto border-slate-500" cellpadding="2" cellspacing="0">
        <thead class="text-left bg-gray-400">
          <tr class="font-semibold text-white bg-blue-900">
            <th class="py-2 text-center border border-slate-600">Questions</th>
            <th class="py-2 text-center border border-slate-600">Réponses</th>
          </tr>
        </thead>
        <tbody class="max-w-full text-black">
          <tr v-for="(value, key) in currentResponse" :key="key">
            <td class="py-2 border border-slate-600">{{ key }}</td>
            <td class="py-2 border border-slate-600">
              <template v-if="Array.isArray(value)">
                <!-- Si la réponse est un tableau (images/fichiers) -->
                <div v-for="(file, index) in value" :key="index" class="my-2">
                  <template v-if="file.type && file.type.startsWith('image/')">
                    <!-- Afficher les images avec lien -->
                    <a :href="file.content" target="_blank" :title="file.name">
                      <img :src="file.content" :alt="file.name" class="max-w-xs border border-gray-300 hover:shadow-lg" />
                    </a>
                  </template>
                  <template v-else>
                    <!-- Afficher un lien pour les autres fichiers -->
                    <a :href="file.content" :download="file.name" class="text-blue-500 underline">
                      {{ file.name }}
                    </a>
                  </template>
                </div>
              </template>
              <template v-else>
                <!-- Sinon, afficher la réponse textuelle -->
                {{ value }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="previewResponse = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
</template>

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import ProgressBar from "../../components/news/ProgressBar.vue";

const route = useRoute();
const router = useRouter();

const datas = ref([]);
const evaluation = route.params.id;
const isLoadingData = ref(false);
const previewResponse = ref(false);
const currentResponse = ref({});

const getDatas = async () => {
  isLoadingData.value = true;
  try {
    const { data } = await EnqueteIndividuelService.getResponseEvaluation(evaluation);
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

const goToPageSoumission = (id) => {
  currentResponse.value = datas.value.find((soumission) => soumission.id == id).response_data;
  previewResponse.value = true;
};

onMounted(() => {
  getDatas();
});
</script>

<style scoped></style>
