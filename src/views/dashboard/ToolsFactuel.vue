<script setup>
import { onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import OngService from "../../services/modules/ong.service";
import AuthService from "@/services/modules/auth.service";
import InputForm from "@/components/news/InputForm.vue";
import { useRouter } from "vue-router";

const TYPE_ORGANISATION = "organisation";

const router = useRouter();

const payload = reactive({
  organisationId: "",
  formulaireDeGouvernanceId: "",
  factuel: {
    comite_members: [],
    response_data: [],
  },
});
const responses = reactive({});
const formData = reactive({});
const organisations = ref([]);
// const formDataFactuel = ref([]);
const formulaireFactuel = ref({});
const isOrganisation = ref(false);
const isLoading = ref(false);
const isLoadingDataFactuel = ref(true);
const currentPage = ref(0);
const nomProgram = ref("");
const idEvaluation = "JVpw9BrNk0wMNlBjQrXVAe2Y6pZzgE79nD8G4vL3On51JPbWaKyR9mdonZgy56RG";
const sources = [
  {
    nom: "Document",
    id: "a383538Y",
  },
  {
    nom: "Fichier",
    id: "a383587Y",
  },
  {
    nom: "pdf",
    id: "a383568Y",
  },
];
const formDataFactuel = [
  {
    id: "vr8pVBwnWQnDeLlqJodOv3GZxK4wjP7Lymba6zE5pY2Ny0AgR1VkB8r9Ql0OJR5N",
    libelle: "FORMULAIRE TOOOO",
    description: null,
    type: "factuel",
    lien: null,
    annee_exercice: 2010,
    created_by: "VApb6mXWVzR91opYNBe0D6ng5yLw2AJmpOE4GxQdXMrWbkl7qjaPKmZv9Gnk45ez",
    programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
    created_at: "2024-10-31",
    options_de_reponse: [
      {
        id: "gm03MOVWNRp2mq0dW4XYywb5G7vAkxlLqEeaVOrMg1j83ZQ9Pn6LKJoDd9JjZrkG",
        libelle: "Oui",
        slug: "oui",
        point: 0.15,
      },
      {
        id: "7WY5me2VdWywZNej85XMp3LkGg04mazjeBVq9xvQ6R7brDKoAYnOJ2P1bJLdNADk",
        libelle: "Non",
        slug: "non",
        point: 0.1,
      },
    ],
    categories_de_gouvernance: [
      {
        id: "lGMAPX0Y2AZv1zBxlY8XM7OdKw60Neqlz9Pjk4n5yo3aWRJDrmGQLbpE5amoN2RE",
        nom: "Gouvernance politique",
        categorieDeGouvernanceId: null,
        programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
        created_at: "2024-10-31",
        categories_de_gouvernance: [
          {
            id: "K0w2XPMoyMor3wP2DEAknX0RZBxOvpqKXVbm5jzGW86Keal47YQ1dLNJmYGnDzke",
            nom: "Efficacité et efficience",
            categorieDeGouvernanceId: "lGMAPX0Y2AZv1zBxlY8XM7OdKw60Neqlz9Pjk4n5yo3aWRJDrmGQLbpE5amoN2RE",
            programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
            created_at: "2024-10-31",
            categories_de_gouvernance: [
              {
                id: "RzbXMG6ePXLYDJkpOmzbor2x5GvaW0VOmg3Q7K6Ad1jER8BNlne4ywMZBvP7E54p",
                nom: "Alternance",
                categorieDeGouvernanceId: "K0w2XPMoyMor3wP2DEAknX0RZBxOvpqKXVbm5jzGW86Keal47YQ1dLNJmYGnDzke",
                programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
                created_at: "2024-10-31",
                questions_de_gouvernance: [
                  {
                    id: "lp1eMNXKKkr1YGqiojielWjzxZEoRvX4y0L4ema7nJbNAw8VB32M59gP6pQdE6zrJj8a",
                    nom: "Les instances de prise de décision rende régulièrement compte",
                    type: "indicateur",
                    indicateur_de_gouvernance: {
                      id: "2nYUHjwrmNVrQVEd3OB6ky02XqLRewpz1Wdrel7goKnZa5D8NbvmYx4jGM9AyqagdpL",
                      nom: "Les instances de prise de décision rende régulièrement compte",
                    },
                    formulaireDeGouvernanceId: "vr8pVBwnWQnDeLlqJodOv3GZxK4wjP7Lymba6zE5pY2Ny0AgR1VkB8r9Ql0OJR5N",
                    programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
                    created_at: "2024-10-31",
                  },
                  {
                    id: "lp1eMNXKKkr1YGqelWjzxZEoRvX4y0L4ema7nJbNAw8VB32M59gP6pQdE6zrJj8a",
                    nom: "Les Perception de prise de décision rende régulièrement compte",
                    type: "indicateur",
                    indicateur_de_gouvernance: {
                      id: "2nkwrmNVrQVEd3OB6ky02XqLRewpz1Wdrel7goKnZa5D8NbvmYx4jGM9AyqagdpL",
                      nom: "Les instances de prise de décision rende régulièrement compte",
                    },
                    formulaireDeGouvernanceId: "vr8pVBwnWQnDeLlqJodOv3GZxK4wjP7Lymba6zE5pY2Ny0AgR1VkB8r9Ql0OJR5N",
                    programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
                    created_at: "2024-10-31",
                  },
                ],
              },
              {
                id: "eQ6WdZr8oKzeJvr8NnWZymx2Q4walpgxw9Od1ARP3b6BE70L5YkGXDjMp0E2A4xy",
                nom: "Gestion de l’information",
                categorieDeGouvernanceId: "K0w2XPMoyMor3wP2DEAknX0RZBxOvpqKXVbm5jzGW86Keal47YQ1dLNJmYGnDzke",
                programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
                created_at: "2024-10-31",
                questions_de_gouvernance: [
                  {
                    id: "67o4dVQEjvGe5ZR3y7JpQ8zb1n6wxVm82OoWXNMdKEPk02lgq49YAarBjKqRzb52",
                    nom: "La mission et les objectifs actions de l’organisation sont en adéquation avec les besoins de ses bénéficiaires",
                    type: "indicateur",
                    indicateur_de_gouvernance: {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP988lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "La mission et les objectifs actions de l’organisation sont en adéquation avec les besoins de ses bénéficiaires",
                    },
                    formulaireDeGouvernanceId: "vr8pVBwnWQnDeLlqJodOv3GZxK4wjP7Lymba6zE5pY2Ny0AgR1VkB8r9Ql0OJR5N",
                    programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
                    created_at: "2024-10-31",
                  },
                  {
                    id: "G6aewxr796apBwYj3WJyEovPNqA0ZrDx1On4Xkz785blQKxRgdVM2Ge1NE1yYl9q",
                    nom: "Les rôles et responsabilités des organes de gestion sont clairement définis",
                    type: "indicateur",
                    indicateur_de_gouvernance: {
                      id: "3OwZvnk4KXY4L9z3RoN1abMg86EBn5P7bwlxm2kA0yOrjpqVZ7evdQGwDyjDamrG",
                      nom: "Les rôles et responsabilités des organes de gestion sont clairement définis",
                    },
                    formulaireDeGouvernanceId: "vr8pVBwnWQnDeLlqJodOv3GZxK4wjP7Lymba6zE5pY2Ny0AgR1VkB8r9Ql0OJR5N",
                    programmeId: "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
                    created_at: "2024-10-31",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    organisations: [
      {
        id: "KGBPA6YzWbB4268gaVLEZjp9eoKnNP7MB3rydwmlJRk0XGMzD1Av5xOYWgMN8r1J",
        nom: "CARE BENIN TOGO",
        sigle: "CARE",
        code: 7,
        nom_point_focal: null,
        prenom_point_focal: null,
        contact_point_focal: null,
      },
      {
        id: "x0JMGN9oKr5lJkoBYbP0axOEmzVp8yQ5X3djD16XMgvL4n2wAGNeR9ZW14vV8KWE",
        nom: "PEOSC",
        sigle: "PEOSC",
        code: 4,
        nom_point_focal: null,
        prenom_point_focal: null,
        contact_point_focal: null,
      },
      {
        id: "265zwj1Bwyb9LJpBgDVNnkdZ2a0PMo7kAQzm4l81EARjx6OXYerK5WGvrDAXxylb",
        nom: "TI/SWB",
        sigle: "TI/SWB",
        code: 10,
        nom_point_focal: null,
        prenom_point_focal: null,
        contact_point_focal: null,
      },
      {
        id: "OPj9RMWrWK5XBrod19MJNlgx2waEGV3aZQyLeObY80p46zjnZDPkvRmA1ny5e6Zb",
        nom: "FeRCAB",
        sigle: "FeRCAB",
        code: 8,
        nom_point_focal: null,
        prenom_point_focal: null,
        contact_point_focal: null,
      },
    ],
  },
];

const getDataFormFactuel = async () => {
  try {
    isLoadingDataFactuel.value = true;
    const { data } = await EvaluationService.getOneEvaluation(idEvaluation);
    formDataFactuel.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataFactuel.value = false;
  }
};
const getOrganizations = async () => {
  await OngService.get()
    .then((result) => {
      organisations.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des organisations .");
    });
};
const getcurrentUserAndFetchOrganization = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      payload.organisationId = result.data.data.id;
      if (result.data.data.type != TYPE_ORGANISATION) {
        getOrganizations();
        isOrganisation.value = true;
      }
      nomProgram.value = result.data.data.programme.nom;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};
const submitData = async () => {
  isLoading.value = true;
  filterFormData();
  const response = {
    factuel: Object.keys(formData).map((indicateurId) => ({
      indicateurDeGouvernanceId: indicateurId,
      optionDeReponseId: formData[indicateurId].selectedOption,
      source: formData[indicateurId].source,
    })),
  };
  payload.response_data = response;
  console.log("response:", response);
  await EvaluationService.create(idEvaluation, payload)
    .then((result) => {
      isLoading.value = false;
      // payload.response_data = [];
      toast.success(`${result.data.message}`);
    })
    .catch((e) => {
      console.error(e);
      isLoading.value = false;
      // payload.response_data = [];
      toast.error("Erreur pour la collecte des données");
    });

  console.log("payload:", payload);
};
const initializeFormData = () => {
  // Initialisation des réponses
  formDataFactuel[0].categories_de_gouvernance.forEach((typeGouvernance) => {
    typeGouvernance.categories_de_gouvernance.forEach((principe) => {
      principe.categories_de_gouvernance.forEach((critere) => {
        critere.questions_de_gouvernance.forEach((question) => {
          responses[question.id] = {
            questionId: question.id,
            optionDeReponseId: "default",
            sourceDeVerificationId: sources[0].id,
            preuves: [],
          };
        });
      });
    });
  });
};
const handleFileUpload = (event, questionIndex) => {
  const files = Array.from(event.target.files);
  responses[questionIndex].preuves = files.map((file) => ({
    name: file.name,
    file,
  }));
};
const changePage = (pageNumber) => {
  currentPage.value = pageNumber;
};
const saveFormData = () => {
  localStorage.setItem("formData", JSON.stringify(formData));
};
const filterFormData = () => {
  Object.keys(formData).forEach((key) => {
    if (!formData[key].selectedOption) {
      delete formData[key]; // Supprime l'objet si 'selectedOption' est vide
    }
  });
};
function findFormulaireFactuel() {
  const item = formDataFactuel[0];
  const formulaireFactuelId = item.formulaire_factuel_de_gouvernance;
  formulaireFactuel.value = item.formulaires_de_gouvernance.find((formulaire) => formulaire.id === formulaireFactuelId);
}
// watch(
//   formData,
//   (newValue) => {
//     localStorage.setItem("formData", JSON.stringify(newValue));
//   },
//   { deep: true }
// );

onMounted(async () => {
  // await getcurrentUserAndFetchOrganization();
  // await getDataFormFactuel();
  initializeFormData();
  findFormulaireFactuel();
});
</script>
<template>
  <h2 class="mt-10 text-lg font-medium intro-y"></h2>
  <div class="w-full p-4 font-bold text-center text-white uppercase rounded bg-primary">Outil Factuel</div>
  <div v-if="formulaireFactuel.organisations.length" class="flex justify-end mt-5">
    <div class="min-w-[250px] flex items-center gap-3">
      <label class="form-label">Organisations</label>
      <TomSelect v-model="payload.organisationId" :options="{ placeholder: 'Selectionez une organisation' }" class="w-full">
        <option v-for="(ong, index) in formulaireFactuel.organisations" :key="index" :value="ong.id">{{ ong.nom }}</option>
      </TomSelect>
    </div>
  </div>
  <div>
    <div v-if="!isLoadingDataFactuel" class="py-5 intro-x">
      <div class="space-y-8">
        <!-- v-for type_gouvernance -->
        <div v-for="(typeGouvernance, typeGouvernanceIndex) in formulaireFactuel.categories_de_gouvernance" :key="typeGouvernanceIndex" class="transition-all">
          <h1 class="mb-5 text-2xl font-semibold text-gray-800">{{ typeGouvernance.nom }}</h1>
          <!-- v-for Principe -->
          <div class="space-y-6">
            <AccordionGroup v-for="(principe, principeIndex) in typeGouvernance.categories_de_gouvernance" :key="principeIndex" class="border-primary">
              <AccordionItem>
                <Accordion class="text-xl !px-4 font-semibold bg-primary !text-white flex items-center justify-between">
                  <h2>{{ principe.nom }}</h2>
                  <ChevronDownIcon />
                </Accordion>
                <AccordionPanel class="!px-8 !shadow-md !bg-white !py-6">
                  <!-- v-for Critere -->
                  <AccordionGroup class="space-y-2">
                    <AccordionItem v-for="(critere, critereIndex) in principe.categories_de_gouvernance" :key="critereIndex" class="!px-0">
                      <Accordion class="text-xl !p-4 font-semibold bg-primary/90 !text-white flex items-center justify-between">
                        <h2>{{ critere.nom }}</h2>
                        <ChevronDownIcon />
                      </Accordion>
                      <!-- v-for Indicateur -->
                      <AccordionPanel class="!border-none pt-1">
                        <div v-for="(question, questionIndex) in critere.questions_de_gouvernance" :key="questionIndex" class="relative px-4 pt-2 my-3 transition-all">
                          <div class="p-2 py-3 space-y-2 border-l-8 border-yellow-500 rounded shadow box">
                            <p class="w-full text-lg font-semibold text-center text-primary">{{ questionIndex + 1 }} - {{ question.nom }}</p>
                            <div class="flex flex-col items-center justify-center w-full gap-3">
                              <!-- v-for Option -->
                              <div class="inline-flex flex-wrap items-center gap-3">
                                <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}`" class="form-check-input" type="hidden" :name="`${question.id}`" value="default" v-model="responses[question.id].optionDeReponseId" />
                                <div v-for="(option, optionIndex) in formulaireFactuel.options_de_reponse" :key="optionIndex">
                                  <input v-if="responses[question.id]?.optionDeReponseId" :id="`radio${question.id}${optionIndex}`" class="form-check-input" type="radio" :name="`${question.id}-${question.slug}`" :value="option.id" v-model="responses[question.id].optionDeReponseId" />
                                  <label class="text-base form-check-label" :for="`radio${question.id}${optionIndex}`">
                                    {{ option.libelle }}
                                  </label>
                                </div>
                              </div>
                              <div class="flex items-center gap-3">
                                <div class="flex items-center gap-3">
                                  <label class="">Source</label>
                                  <div class="min-w-[230px]">
                                    <TomSelect v-if="responses[question.id]?.sourceDeVerificationId" :options="{ placeholder: 'Sélectionnez une source' }" class="w-full" v-model="responses[question.id].sourceDeVerificationId">
                                      <option v-for="(source, indexSource) in sources" :key="indexSource" :value="source.id">{{ source.nom }}</option>
                                    </TomSelect>
                                  </div>
                                </div>
                                <div>
                                  <input type="file" :id="question.id" multiple :ref="question.id" @change="handleFileUpload($event, question.id)" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionPanel>
                    </AccordionItem>
                  </AccordionGroup>
                </AccordionPanel>
              </AccordionItem>
            </AccordionGroup>
          </div>
        </div>
      </div>
      <div class="flex justify-end w-full mt-5">
        <VButton label="Pousuivre" class="px-8 py-3 w-max" :loading="isLoading" @click="submitData" />
      </div>
      <div class="flex justify-center gap-3 my-8">
        <button v-for="(item, index) in formDataFactuel" @click="changePage(index)" :class="index === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn" :key="index">{{ index + 1 }}</button>
      </div>
    </div>
    <LoaderSnipper v-else />
  </div>
</template>
