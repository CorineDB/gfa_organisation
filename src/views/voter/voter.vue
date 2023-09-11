<template>
  <div class=" bg  text-black  relative ">


    <div class="overflow-y-scroll  border  h-full ">

      <div class="w-full z-30 mx-auto   rounded-md mb-3 ">

        <div class="intro-y box mt-5 px-3">
          <div class="flex flex-col sm:flex-row items-center justify-between h-auto border-b border-slate-200/60 dark:border-darkmode-400 bg-[#0E74BC]">
             <img class="bg-white h-20" src="../../assets/images/logo-gouv.webp" alt="">
             <p class="text-2xl font-bold text-white" > Programme Redevabilité phase 2 </p>
             <img class="bg-white h-20" src="../../assets/images/Logo_der_Schweizerischen_Eidgenossenschaft.svg" alt="">
          </div>
          <div class="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-3 pb-5 -mx-5">
            <div class="flex flex-1 px-5 items-center justify-center lg:justify-start">
              <div class="p-5">
                <div class=" my-5 lg:my-0">
                  <img v-if="entrepriseLogo" class="mx-auto max-h-[100px]   " :src="entrepriseLogo">
                  <img v-else class="mx-auto w-auto max-w-prose " src="../../assets/images/logo.png">

                </div>
              </div>
              <div class="ml-5">
                <div class="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">
                  {{ campagneEnCours.entreprise.nom }}
                </div>
                <div class="text-slate-500">{{ $f()[0].jobs[0] }}</div>
              </div>
            </div>
            <div
              class="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
              <div class="font-medium text-center lg:text-left lg:mt-3">
                Détails de l'organisation
              </div>
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
            <div
              class="mt-6 lg:mt-0 flex-1 px-5 border-t lg:border-0 border-slate-200/60 dark:border-darkmode-400 pt-5 lg:pt-0">
              <div class="font-medium text-center lg:text-left lg:mt-5">
                Sales Growth
              </div>
              <div class="flex items-center justify-center lg:justify-start mt-2">
                <div class="mr-2 w-20 flex">
                  USP: <span class="ml-3 font-medium text-success">+23%</span>
                </div>
                <div class="w-3/4">
                  <SimpleLineChart1 :height="55" class="-mr-5" />
                </div>
              </div>
              <div class="flex items-center justify-center lg:justify-start">
                <div class="mr-2 w-20 flex">
                  STP: <span class="ml-3 font-medium text-danger">-2%</span>
                </div>
                <div class="w-3/4">
                  <SimpleLineChart2 :height="55" class="-mr-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- DEBUT CARD jout des conjoints et enfants -->
      <div class="w-2/3 mx-auto rounded-md" v-for="item in campagneEnCours.indicateurSelect">
        <div class=" intro-x">
          <div class="flex items-center justify-between mb-5 px-5 py-4 box zoom-in ">
            <div>
              <p v-if="campagneEnCours.nom" class="text-lg  intro-x  text-center my-3">{{ campagneEnCours.nom
              }}</p>

              <h1 v-if="indicateurEnCours.nom"
                class="text-xl w-2/3 sm:w-full sm:text-xl md:text-2xl lg:text-3xl intro-x   xl:text-2xl  2xl:text-4xl  font-black text-black  _text-violet-900  border-blue-700 inline-block mx-auto ">
                {{ i + 1 }} - {{ indicateurEnCours.nom }}
              </h1>
            </div>
            <div class="mt-3">
              <div class="flex flex-col sm:flex-row mt-2">
                <div class="form-check mr-2">
                  <input id="radio-switch-4" class="form-check-input" type="radio" name="horizontal_radio_button"
                    value="horizontal-radio-chris-evans" />
                  <label class="form-check-label" for="radio-switch-4"> Oui </label>
                </div>
                <div class="form-check mr-2 mt-2 sm:mt-0">
                  <input id="radio-switch-5" class="form-check-input" type="radio" name="horizontal_radio_button"
                    value="horizontal-radio-liam-neeson" />
                  <label class="form-check-label" for="radio-switch-5"> Non </label>
                </div>
              </div>
            </div>

          </div>


        </div>

      </div>

      <div
        class="text-xs sm:text-sm w-full items-center  text-center  bg-[#0E74BC]  p-1 border  flex  bottom-0     flex-col  text-white ">
        <img class="w-[50px] inline-block" src="../../assets/images/logo.png" alt="">
        <span class="text-[11px] text-white inline-block font-medium">Made by CELERITE HOLDING ioz</span>
      </div>

    </div>


    <svg class=" hidden  absolute bottom-0 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#0099ff" fill-opacity="1"
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
      </path>
    </svg>



    <Modal :show="organisationModal" @hidden="organisationModal = false">
      <ModalBody class="p-10 ">
        <form key="ajouter" @submit.prevent="storeBSD" class="space-y-3">
          <div>
            <label for="regular-form-1" class="form-label">Organisation </label>
            <TomSelect v-model="formData.organisation" :options="{ placeholder: 'Selectionez le type' }" class="w-full">

              <option v-for="(type, index) in types" :key="index" :value="type.id">{{ type.nom }}
              </option>
            </TomSelect>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nomResponsable" class="form-control"
              placeholder="Nom chef organisation" />
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Prénom</label>
            <input id="regular-form-1" type="text" required v-model="formData.prenomResponsable" class="form-control"
              placeholder="prénom chef organisation" />
          </div>

          <button @click="organisationModal == false" class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              Continuer
            </span>
            <span v-else class="flex justify-center items-center space-x-2">
              <span class=" px-4 font-semibold ">
                chargement ...
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>

      </ModalBody>
    </Modal>







  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from 'vue'; import { helper as $h } from "@/utils/helper";

import { useRouter, useRoute } from 'vue-router'
import BsdService from "@/services/modules/bsd.service";
import CampagneService from "@/services/modules/campagne.service";
import { API_BASE_URL } from "@/services/configs/environment";


const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const successNotification = ref();
const search = ref('')
const refresh = ref(0)
const resolutions = ref([])
const boiteDialog = ref(false)
const desactiverBouton = ref(false)
const plainte = ref('') // contenu de la plainte du client

const organisationModal = ref(false)

const infoModal = function () {
  organisationModal.value = true

}


const messages = reactive({
  type: 'success',
  message: '',
})

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggles = () => {
  // Show notification
  successNotification.value.showToast();
};


const saveUpdate = reactive({})
const chargement = ref(false)
const isUpdate = ref(false)
const campagneId = ref(0)
const end = ref(0)
const lastRequete = ref(new Date().getTime())
const bsdId = ref([])
const updateTypeId = ref([])
const campagnes = ref([])
const bsdCampagnes = ref([])
const bien = ref(false)
const passable = ref(false)
const mauvais = ref(false)
const emoticonModal = ref(true)
const info = ref({
  campagnesListe: [],
  lastDate: []
})

const campagneEnCours = reactive({
  nom: '',
  id: '',
  index: "",
  entreprise: {
    nom: '',
    arrondissement: "",
    contact:"",
    ville:"",
    refresh: 0
  },
  indicateurSelect: []
})
const indicateurEnCours = reactive({
  nom: '',
  id: '',
})
const c = ref(0)
const i = ref(0)
const formData = reactive({
  valeur: '',
  indicateurId: Number,
  bsdCampagneId: Number,
  commentaire: '',
})

const message = reactive({
  type: 'success',
  message: '',
})

const getLocalStorageInfo = ref({})

onMounted(function () {

  if (localStorage.getItem('infoVotes')) {
    getLocalStorageInfo.value = JSON.parse(localStorage.getItem('infoVotes'))
  }





  getCampagne()
  lancerMaFonction()

  // organisationModal.value = true

})

const entrepriseLogo = ref('')


 
function getCampagne() {
  BsdService.campagnes(route.params.code).then((data) => {
    campagnes.value = data.data.data[0]


    console.log(data.data.data)

    entrepriseLogo.value = API_BASE_URL + campagnes.value[0].entreprise.admin.profil



    bsdCampagnes.value = data.data.data[1]

    bsdId.value = data.data.data[2]

    c.value = 0
    i.value = 0
    campagneEnCours.nom = campagnes.value[c.value].nom
    campagneEnCours.id = campagnes.value[c.value].id
    campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
    campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.refresh
    campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

    indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
    indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id

    refresh.value = campagneEnCours.entreprise.refresh




  }).catch((e) => {
    // disabled()
    //alert(e)
  })
}

// provide("bind[successNotification]", (el) => {
//   // Binding
//   successNotification.value = el;
// });
// const successNotificationToggle = () => {
//   // Show notification
//   successNotification.value.showToast();
// };

function maFonction() {
  if ((new Date().getTime() - lastRequete.value >= (refresh.value * 1000)) && i.value) {
    getCampagne()
  }
}


function lancerMaFonction() {
  setInterval(() => {
    maFonction();
  }, 1000);
  setInterval(() => {
    if (i.value == 0) {

      // const synth = window.speechSynthesis;

      // // Création d'un objet d'énoncé (phrase) 
      // const utterance = new SpeechSynthesisUtterance('Welcome to our company, please leave your complaint here. Thank you');

      // // Sélection de la voix féminine
      // utterance.voice = synth.getVoices().find((voice) => voice.name === 'Google UK English Female');

      // // Lancement de la synthèse vocale
      // synth.speak(utterance);

      // const audiotest = new SpeechSynthesisUtterance("Bienvenue Chez nous ,veuillez laisser votre plainte ici");

      // window.speechSynthesis.speak(audiotest);
    }

  },

    15200);


}



// show emoticon   -------------------------------->
const showImage = ref(false);
const hideImageAfterDelay = () => {

  setTimeout(() => {
    showImage.value = false;

    //  console.log('ok')
  }, 1500);
};
// show emoticon   -------------------------------->




let couple = reactive({
  campagneId: '',
  indicateurId: ''

})

const verification = ref(false);



function voter(value) {

  //  desactiverBouton.value = true

  if (!end.value) {



    formData.valeur = value
    formData.indicateurId = indicateurEnCours.id
    formData.bsdCampagneId = bsdCampagnes.value[c.value]

    couple.campagneId = formData.bsdCampagneId
    couple.indicateurId = formData.indicateurId

    if (!localStorage.getItem("infoVotes")) {


      if (value == '1') {
        showImage.value = true
        bien.value = true
        passable.value = false
        mauvais.value = false
        hideImageAfterDelay()


      }


      if (value == '2') {
        showImage.value = true


        bien.value = false
        passable.value = true
        mauvais.value = false
        hideImageAfterDelay()

      }


      if (value == '3') {
        showImage.value = true
        bien.value = false
        passable.value = false
        mauvais.value = true
        hideImageAfterDelay()


      }


      BsdService.voter(bsdId.value, formData).then((data) => {

        // desactiverBouton.value = false /




        messages.message = "Votre avis a été pris en compte"
        successNotificationToggles()



        const audio = new Audio('../src/assets/son/son1.mp3');
        audio.play();
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 800);
        lastRequete.value = new Date().getTime()
        i.value++


        info.value.campagnesListe.push(couple)

        couple = {
          campagneId: '',
          indicateurId: ''
        }

        info.value.lastDate.push(new Date)

        localStorage.setItem('infoVotes', JSON.stringify(info.value))

        // desactiverBouton.value = false

        if (i.value == campagneEnCours.indicateurSelect.length) {
          i.value = 0
          c.value++

          if (c.value == campagnes.value.length) {
            i.value = 0
            c.value = 0
            // end.value = 1

            // afficher message de fin

            message.type = 'success'
            message.message = 'Merci pour le temps que vous nous avez accordé ,Aurevoir'

            console.log(message.message)
            successNotificationToggles()
            const audiotest = new SpeechSynthesisUtterance(message.message);
            window.speechSynthesis.speak(audiotest);

            // setTimeout(messageFin.value = false, 5000);
          }
        }

        campagneEnCours.nom = campagnes.value[c.value].nom
        campagneEnCours.id = campagnes.value[c.value].id
        campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
        campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
        campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect
        if (i.value == 1) {
          const message = new SpeechSynthesisUtterance(campagneEnCours.nom);
          window.speechSynthesis.speak(message);

        }
        indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
        indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id
        setTimeout(function () {
          const message = new SpeechSynthesisUtterance(indicateurEnCours.nom);
          window.speechSynthesis.speak(message);
        }, 2000);



      }).catch((e) => {


        // disabled()
        //alert(e)
      })


    } else {




      // let objetPresent = getLocalStorageInfo.value.campagnesListe.find(item => item.campagneId === couple.campagneId && item.indicateurId === couple.indicateurId) 

      for (var a = 0; a < getLocalStorageInfo.value.campagnesListe.length; a++) {

        if (couple.campagneId == getLocalStorageInfo.value.campagnesListe[a].campagneId && couple.indicateurId == getLocalStorageInfo.value.campagnesListe[a].indicateurId) {

          verification.value = true


        }
      }


      console.log(verification.value)

      if (verification.value) {

        verification.value = false



        messages.message = "Vous avez déja donné votre avis pour ce indicateur"
        successNotificationToggles()

        // desactiverBouton.value = false

        i.value++

        if (i.value == campagneEnCours.indicateurSelect.length) {
          i.value = 0
          c.value++

          if (c.value == campagnes.value.length) {
            i.value = 0
            c.value = 0
            // end.value = 1

            // afficher message de fin

            message.type = 'success'
            message.message = 'Merci pour le temps que vous nous avez accordé ,Aurevoir'

            console.log(message.message)
            successNotificationToggles()
            const audiotest = new SpeechSynthesisUtterance(message.message);
            window.speechSynthesis.speak(audiotest);

            // setTimeout(messageFin.value = false, 5000);
          }
        }



        campagneEnCours.nom = campagnes.value[c.value].nom
        campagneEnCours.id = campagnes.value[c.value].id
        campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
        campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
        campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

        if (i.value == 1) {
          const message = new SpeechSynthesisUtterance(campagneEnCours.nom);
          window.speechSynthesis.speak(message);

        }


        indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
        indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id





      } else {


        if (value == '1') {
          showImage.value = true
          bien.value = true
          passable.value = false
          mauvais.value = false
          hideImageAfterDelay()


        }


        if (value == '2') {
          showImage.value = true


          bien.value = false
          passable.value = true
          mauvais.value = false
          hideImageAfterDelay()

        }


        if (value == '3') {
          showImage.value = true
          bien.value = false
          passable.value = false
          mauvais.value = true
          hideImageAfterDelay()


        }



        BsdService.voter(bsdId.value, formData).then((data) => {

          // desactiverBouton.value = false



          messages.message = "Votre avis a été pris en compte"
          successNotificationToggles()

          const audio = new Audio('../src/assets/son/son1.mp3');
          audio.play();
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, 800);
          lastRequete.value = new Date().getTime()
          i.value++


          // couple.campagneId = formData.bsdCampagneId

          // couple.indicateurId = formData.indicateurId


          info.value = JSON.parse(localStorage.getItem('infoVotes'))

          info.value.campagnesListe.push(couple)

          couple = {
            campagneId: '',
            indicateurId: ''
          }

          info.value.lastDate.push(new Date)

          localStorage.setItem('infoVotes', JSON.stringify(info.value))



          if (i.value == campagneEnCours.indicateurSelect.length) {
            i.value = 0
            c.value++

            if (c.value == campagnes.value.length) {
              i.value = 0
              c.value = 0
              // end.value = 1

              // afficher message de fin

              message.type = 'success'
              message.message = 'Merci pour le temps que vous nous avez accordé ,Aurevoir'

              console.log(message.message)
              successNotificationToggles()
              const audiotest = new SpeechSynthesisUtterance(message.message);
              window.speechSynthesis.speak(audiotest);

              // setTimeout(messageFin.value = false, 5000);
            }
          }

          campagneEnCours.nom = campagnes.value[c.value].nom
          campagneEnCours.id = campagnes.value[c.value].id
          campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
          campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
          campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

          if (i.value == 1) {
            const message = new SpeechSynthesisUtterance(campagneEnCours.nom);
            window.speechSynthesis.speak(message);

          }

          indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
          indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id

          setTimeout(function () {
            const message = new SpeechSynthesisUtterance(indicateurEnCours.nom);
            window.speechSynthesis.speak(message);
          }, 2000);



        }).catch((e) => {
          // disabled()
          //alert(e)
        })
      }




    }


  }

}





function next() {

  if (!end.value) {
    i.value++

    if (i.value == campagneEnCours.indicateurSelect.length) {
      i.value = 0



      c.value++

      if (c.value == campagnes.value.length) {

        end.value = 1













        message.type = 'success'
        message.message = 'Merci pour le temps que vous nous avez accordé'
        successNotificationToggles()


      }
    }

    campagneEnCours.nom = campagnes.value[c.value].nom
    campagneEnCours.id = campagnes.value[c.value].id
    campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
    campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
    campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

    indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
    indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id




  }



}







// section discussion

function ouvrirFermerDiscution() {
  boiteDialog.value = !boiteDialog.value
}


function fermerDiscution() {
  boiteDialog.value = false
}

function envoyerCommentaire() {



  CampagneService.addComment(campagneEnCours.id, { contenu: plainte.value }).then((comment) => {
    console.log(campagneEnCours.id)
    plainte.value = ""
    message.type = 'success'
    message.message = 'Plainte envoyée avec succès'
    successNotificationToggles()
    boiteDialog.value = false

  }).catch((e) => {
    // disabled()
    //alert(e)
  })
}

// agrandir le champs de text

function inputChange(e) {
  e.target.style.height = 'auto';
  e.target.style.height = e.target.scrollHeight + 'px';
}

</script>

<style  scoped>
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
  background-color: #F1F5F9;
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


/*  */
</style>