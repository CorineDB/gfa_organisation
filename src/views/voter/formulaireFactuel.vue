<template>
  <div class="bg text-black relative">
    <div class="overflow-y-scroll border h-full">
      <div class="w-full z-30 mx-auto rounded-md mb-3">
        <div class="intro-y box mt-5 p-3">
          <div class="flex flex-col sm:flex-row items-center justify-between h-auto border-b border-slate-200/60 dark:border-darkmode-400 bg-[#0E74BC]">
            <img class="bg-white h-20" src="../../assets/images/logo-gouv.webp" alt="" />
            <p class="text-2xl font-bold text-white">{{ campagneEnCours.nom }}</p>
            <img class="bg-white h-20" src="../../assets/images/Logo_der_Schweizerischen_Eidgenossenschaft.svg" alt="" />
          </div>
          <div class="flex flex-col text-center lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-3 pb-5">
            <div class="flex flex-1 px-5 items-center justify-center">
              <div class="p-5">
                <div class="my-5 lg:my-0">
                  <img v-if="entrepriseLogo" class="mx-auto max-h-[100px]" :src="entrepriseLogo" />
                  <img v-else class="mx-auto w-auto max-w-prose" src="../../assets/images/logo.png" />
                </div>
              </div>
              <div class="ml-5">
                <div class="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">
                  {{ campagneEnCours.entreprise.nom }}
                </div>
                <div class="text-slate-500">{{ $f()[0].jobs[0] }}</div>
              </div>
            </div>
            <div class="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
              <div class="font-medium text-center lg:text-left lg:mt-3">Détails de l'organisation</div>
              <div class="flex flex-col justify-center items-center lg:items-start mt-4">
                <div class="truncate sm:whitespace-normal flex items-center">
                  <MailIcon class="w-4 h-4 mr-2" />
                  {{ $f()[0].users[0].email }}
                </div>
                <div class="truncate sm:whitespace-normal flex items-center mt-3">
                  <InstagramIcon class="w-4 h-4 mr-2" /> Instagram
                  {{ $f()[0].users[0].name }}
                </div>
                <div class="truncate sm:whitespace-normal flex items-center mt-3">
                  <TwitterIcon class="w-4 h-4 mr-2" /> Twitter
                  {{ $f()[0].users[0].name }}
                </div>
              </div>
            </div>
          </div>
          <p v-if="principeTab.length" class="text-3xl w-2/3 mx-auto font-black text-center intro-x my-3">{{ principeTab[etape].nom }}</p>
        </div>
      </div> 

      <!-- DEBUT CARD indicateurs -->
      <div v-if="principeTab.length" class="w-2/3 mx-auto rounded-md">
        <div>
          <div v-for="(principe, bigIndex) in principeTab" :key="bigIndex">
            <div v-if="etape == bigIndex" class="intro-x" v-for="(element, index) in principe.indicateurs" :key="index">
              <div class="flex flex-col items-center justify-between mb-5 px-5 py-4 box zoom-in relative">
                <hr class="h-full w-2 bg-[#0E74BC] absolute left-0 top-0 rounded-l-xl" />
                <div>
                  <h1 class="text-xl w-2/3 sm:w-full sm:text-xl intro-x font-black text-center border-blue-700 inline-block mx-auto text-blue-500">{{ element.nom }}</h1>
                </div>
                <div class="mt-3">
                  <div class="grid grid-cols-12 gap-4" v-if="element.choises.length">
                    <div class="col-span-6 lg:col-span-4 mr-2">
                      <input id="radio-switch-4" class="form-check-input" type="radio" :name="'option' + index" :value="element.choises[0].id" @change="showValue(element.choises[0].id, element.id, index)" />

                      <label class="form-check-label" for="radio-switch-4"> {{ element.choises[0].nom }} </label>
                    </div>
                    <div class="col-span-6 lg:col-span-4 mr-2 mt-2 sm:mt-0">
                      <input id="radio-switch-5" class="form-check-input" type="radio" :name="'option' + index" :value="element.choises[1].id" @change="showValue(element.choises[1].id, element.id, index)" />

                      <label class="form-check-label" for="radio-switch-5"> {{ element.choises[1].nom }} </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-2/3 mx-auto text-center">
            <!-- Responsive Arrow Progress Bar -->
            <div class="">
              <div class="arrow-steps clearfix">
                <div class="step current">
                  <span> <a href="#">1</a></span>
                </div>
                <div class="step">
                  <span><a href="#">2</a></span>
                </div>
                <div class="step">
                  <span><a href="#">3</a></span>
                </div>
                <div class="step">
                  <span><a href="#">4</a></span>
                </div>
              </div>
            </div>
          </div>

          <div class="intro-y w-2/3 my-6 mx-auto flex items-center justify-center mt-5">
            <button @click="precedent()" class="btn btn-secondary w-24 prev">Previous</button>
            <button v-if="!submitTable" @click="continuer()" :disabled="desableNext" class="btn btn-primary w-24 ml-2 next pull-right">Next</button>
            <button v-else @click="soumettre()" :disabled="desableNext" class="btn btn-primary w-24 ml-2 next pull-right">Soumettre</button>
          </div>
        </div>
      </div>
      
    </div>

    <div class="text-xs sm:text-sm w-full items-center text-center bg-[#0E74BC] p-1 border flex bottom-0 flex-col text-white">
      <img class="w-[50px] inline-block" src="../../assets/images/logo.png" alt="" />
      <span class="text-[11px] text-white inline-block font-medium">Made by CELERITE HOLDING ioz</span>
    </div>
  </div>

  <svg class="hidden absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path fill="#0099ff" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>

  <Modal backdrop="static" :show="organisationModal" @hidden="organisationModal = false">
    <ModalBody class="p-10">
      <form key="ajouter" @submit.prevent="storeInfoOrganisation" class="space-y-3">
        <div>
          <label for="regular-form-1" class="form-label">Nom</label>
          <input id="regular-form-1" type="text" required v-model="infoOrganisation.nom" class="form-control" placeholder="Nom chef organisation" />
        </div>
        <div>
          <label for="regular-form-1" class="form-label">Structures </label>
          <TomSelect v-model="infoOrganisation.structureId" :options="{ placeholder: 'Selectionez le type' }" class="w-full">
            <option v-for="(element, index) in structures" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>
        <div>
          <label for="regular-form-1" class="form-label">Types de prospect </label>
          <TomSelect v-model="infoOrganisation.prospect" :options="{ placeholder: 'Selectionez le type' }" class="w-full">
            <option value="0">Membre association</option>
            <option value="1">Membre conseil d'administration</option>
            <option value="2">Employé</option>
            <option value="3">Partenaire</option>
          </TomSelect>
        </div>
        <p v-if="champVide" class="text-red-500 font-bold text-xs text-left">Veuillez remplir les champs structure et type les champs pour continuer</p>

        <button type="submit" class="btn btn-primary py-3 px-4 w-full my-3 xl:mr-3 align-top">
          <span class="text-sm font-semibold uppercase" v-if="!chargement"> Continuer </span>
          <span v-else class="flex justify-center items-center space-x-2">
            <span class="px-4 font-semibold"> chargement ... </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </span>
        </button>
      </form>
    </ModalBody>
  </Modal>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed, watch } from "vue";
import { helper as $h } from "@/utils/helper";
import StructureService from "@/services/modules/structure.service";

import { useRouter, useRoute } from "vue-router";
import BsdService from "@/services/modules/bsd.service";
import CampagneService from "@/services/modules/campagne.service";
import { API_BASE_URL } from "@/services/configs/environment";
import { useFactuelStore } from "@/stores/factuel";
import PrincipeService from "@/services/modules/principe.service";

import $ from "jquery";

const router = useRouter();
const route = useRoute();
const factuelStore = useFactuelStore();
const principeTab = ref([]);
const champVide = ref(false);
const etape = ref(0);

const desableNext = ref(true);

const organisationModal = ref(false);
const infoOrganisation = reactive({
  structureId: "",
  prospect: "",
  nom: "",
});

const dataTable = ref([]);
const modeleTab = ref([]);
const storeInfoOrganisation = function () {
  localStorage.setItem("infoStructure", JSON.stringify(infoOrganisation));
  if (infoOrganisation.prospect == "" || infoOrganisation.nom == "") {
    champVide.value = true;
    setTimeout(() => {
      champVide.value = false;
    }, 2000);
  } else {
    organisationModal.value = false;
  }
};

const showValue = function (choixId, indicateurId, index) {
  modeleTab.value = [];

  const info = JSON.parse(localStorage.getItem("infoStructure"));

  modeleTab.value = [info.structureId, indicateurId, choixId, info.nom, info.prospect];

  bigTable.value[etape.value][index] = modeleTab.value;

  factuelStore.setDataTable(bigTable.value[etape.value]);

  factuelStore.setBigTable(bigTable.value);
};

const structures = ref([]);
const getStructure = function () {
  StructureService.get()
    .then((data) => {
      structures.value = data.data.data;
    })
    .catch((e) => {
      // disabled()
      alert(e);
    });
};

const chargement = ref(false);
const bsdId = ref([]);
const campagnes = ref([]);
const bsdCampagnes = ref([]);

const campagneEnCours = reactive({
  nom: "",
  id: "",
  index: "",
  entreprise: {
    nom: "",
    arrondissement: "",
    contact: "",
    ville: "",
    refresh: 0,
  },
  indicateurSelect: [],
});

const i = ref(0);
const formData = reactive({
  valeur: "",
  indicateurId: Number,
  bsdCampagneId: Number,
  commentaire: "",
});

const bigTable = ref([]);
function getPrincipe() {
  PrincipeService.getAll()
    .then((data) => {
      principeTab.value = data.data.data;
      if (principeTab.value) {
        const nbrePrincipe = principeTab.value.length - 1;

        for (let i = 0; i < nbrePrincipe; i++) {
          bigTable.value.push([]);
        }

        for (let y = 0; y < bigTable.value.length; y++) {
          for (let x = 0; x < principeTab.value[y].indicateurs.length; x++) {
            bigTable.value[y].push([]);
          }
        }
        factuelStore.setBigTable(bigTable.value);
      }
    })
    .catch((e) => {
      // disabled()
      //alert(e)
    });
}
const submitTable = ref(false);
watch(bigTable.value, (newValue, oldValue) => {
  for (let i = 0; i < newValue[etape.value].length; i++) {
    if (newValue[etape.value][i].length === 0) {
      desableNext.value = true;
    } else {
      desableNext.value = false;
    }
  }

  for (let i = 0; i < newValue[newValue.length - 1].length; i++) {
    if (newValue[newValue.length - 1][i].length === 0) {
      submitTable.value = false;
    } else {
      submitTable.value = true;
    }
  }
});

watch(etape.value, (newValue, oldValue) => {
  console.log(newValue);
});

const soumettre = function () {
  console.log(bigTable.value);
  const submit = [];
  for (let element = 0; element < bigTable.value.length; element++) {
    for (let y = 0; y < bigTable.value[element].length; y++) {
      submit.push(bigTable.value[element][y]);
    }
  }

  console.log(submit);
  PrincipeService.submit( { reponse :submit })
    .then((data) => {
      // console.log(data);
    })
    .catch((e) => {});
  factuelStore.setSubmitTable(submit);
};

const getLocalStorageInfo = ref({});

onMounted(function () {
  getPrincipe();
  getStructure();
  // organisationModal.value = true;
});

const entrepriseLogo = ref("");
const responseTab = ref([]);

const continuer = function () {
  if (etape.value < bigTable.value.length - 1) {
    etape.value++;
  }
  factuelStore.setEtape(etape.value);
};

const precedent = function () {
  if (etape.value > 0) {
    etape.value--;
    factuelStore.setEtape(etape.value);
  }
};

$(document).ready(function () {
  var back = $(".prev");
  var next = $(".next");
  var steps = $(".step");

  next.bind("click", function () {
    $.each(steps, function (i) {
      if (!$(steps[i]).hasClass("current") && !$(steps[i]).hasClass("done")) {
        $(steps[i]).addClass("current");
        $(steps[i - 1])
          .removeClass("current")
          .addClass("done");
        return false;
      }
    });
  });
  back.bind("click", function () {
    $.each(steps, function (i) {
      if ($(steps[i]).hasClass("done") && $(steps[i + 1]).hasClass("current")) {
        $(steps[i + 1]).removeClass("current");
        $(steps[i]).removeClass("done").addClass("current");
        return false;
      }
    });
  });
});
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.pushable {
  border-radius: 100%;
  border: none;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
}

.front {
  display: block;
  border-radius: 100%;
  font-size: 1.25rem;
  transform: translateY(-6px);
}

.pushable:active .front {
  transform: translateY(-2px);
}

.custom-bg {
  color: white;
  background-color: red;
  border: 2px solid white;
}

.bg {
  background-color: #f1f5f9;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.chatbox-popup {
  display: flex;
  position: absolute;
  box-shadow: 5px 5px 25px 0 rgba(46, 61, 73, 0.2);
  flex-direction: column;
  /* display: none; */
  top: 115px;
  right: 40px;
  width: 377px;
  height: auto;
  background-color: #fff;
  border-radius: 16px;
  z-index: 10;
}

.chatbox-popup__header {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 16px;
  color: #fff;
  background-color: #0360a5;
  align-items: center;
  justify-content: space-around;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
}

.chatbox-popup__avatar {
  margin-top: -12px;
  background-color: #0360a5;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}

.chatbox-popup__main {
  box-sizing: border-box;
  width: 100%;
  padding: calc(2 * 16px) 16px;
  line-height: calc(16px + 16px / 2);
  color: #888;
  text-align: center;
}

.chatbox-popup__footer {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 16px;
  border-top: 1px solid #ddd;
  align-items: center;

  justify-content: space-around;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
}

.h1_chat {
  margin: 0;
  font-size: 16px;
  line-height: 1;
}

textarea {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding-top: auto;
  display: flex;
  justify-self: center;
  align-items: center;
  font-family: inherit;
  font-size: 16px;
  line-height: calc(16px + 16px / 2);
  color: #888;
  background-color: none;

  /* border: solid 10px; */
  resize: none;
  overflow: hidden;
}

textarea:focus {
  border-style: none;
}

button {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

textarea::placeholder {
  color: #888;
}

@media screen and (max-width: 480px) {
  .chatbox-popup {
    /* display: none; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: 0px;
    height: fit-content;
    width: 300px;
  }

  .chatbox-popup__header {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    padding: 8px;
    color: #fff;
    background-color: #0360a5;
    align-items: center;
    justify-content: space-around;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }

  .chatbox-popup__avatar {
    margin-top: -3px;
    background-color: #0360a5;
    border: 2.5px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    width: 50px;
    height: auto;
  }

  .chatbox-popup__footer {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    padding: 8px;
    border-top: 1px solid #ddd;
    align-items: center;

    justify-content: space-around;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
  }
}

.clearfix:after {
  clear: both;
  content: "";
  display: flex;
  justify-content: center;
  justify-items: center;
  height: 0;
}

/* Responsive Arrow Progress Bar */

.container {
  font-family: "Lato", sans-serif;
}

.arrow-steps .step {
  font-size: 14px;
  text-align: center;
  color: #777;
  cursor: default;
  margin: 0 1px 0 0;
  padding: 10px 0px 10px 0px;
  width: 15%;
  display: inline-block;
  position: relative;
  background-color: #ddd;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.arrow-steps .step a {
  color: #777;
  text-decoration: none;
}

.arrow-steps .step:after,
.arrow-steps .step:before {
  content: "";
  position: absolute;
  top: 0;
  right: -17px;
  width: 0;
  height: 0;
  border-top: 19px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 17px solid #ddd;
  z-index: 2;
}

.arrow-steps .step:before {
  right: auto;
  left: 0;
  border-left: 17px solid #fff;
  z-index: 0;
}

.arrow-steps .step:first-child:before {
  border: none;
}

.arrow-steps .step:last-child:after {
  border: none;
}

.arrow-steps .step:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.arrow-steps .step:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.arrow-steps .step span {
  position: relative;
}

*.arrow-steps .step.done span:before {
  opacity: 1;
  content: "";
  position: absolute;
  top: -2px;
  left: -10px;
  font-size: 11px;
  line-height: 21px;
}

.arrow-steps .step.current {
  color: #fff;
  background-color: #5599e5;
}

.arrow-steps .step.current a {
  color: #fff;
  text-decoration: none;
}

.arrow-steps .step.current:after {
  border-left: 17px solid #5599e5;
}

.arrow-steps .step.done {
  color: #173352;
  background-color: #2f69aa;
}

.arrow-steps .step.done a {
  color: #173352;
  text-decoration: none;
}

.arrow-steps .step.done:after {
  border-left: 17px solid #2f69aa;
}

/*  */
</style>
