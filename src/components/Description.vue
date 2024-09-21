<template>
  <div class="">
    <div class="grid grid-cols-3 gap-2">

      <div class="bg-white shadow p-3 hover:shadow-md">
        <h2 class="text-indigo-700 font-semibold text-xs">Taux de decaissement</h2>
        <h4 class="text-2xl text-black font-bold mt-3">{{ projet.taux_decaissement.taux }}%</h4>
        <div class="mt-6 flex justify-between items-center">
          <div v-if="projet.taux_decaissement.percent <= 100" class="flex items-center space-x-1">
            <!-- if arrow DOWN -->
            <i class="bx bx-down-arrow-alt bx-sm text-primary"></i>
            <span class="text-sm text-green-700 font-semibold">{{ projet.taux_decaissement.percent }} %</span>
          </div>
          <div v-else class="flex items-center space-x-1">
            <!-- if arrow UP -->
            <i class="bx bx-up-arrow-alt bx-sm text-primary"></i>
            <span class="text-sm text-red-700 font-semibold">{{ projet.taux_decaissement.percent }} %</span>
          </div>
          <p class="text-gray-700 text-small font-semibold">Depuis le 1 janvier</p>
        </div>
      </div>

      <div class="bg-white shadow p-3 hover:shadow-md">
        <h2 class="text-indigo-700 font-semibold text-xs">Taux d'engagement</h2>
        <h4 class="text-2xl text-black font-bold mt-3" v-if="projet.tauxEngagement != null">{{ projet.tauxEngagement }} %
        </h4>
        <h4 class="text-2xl text-black font-bold mt-3" v-else> 0 % </h4>
        <div class="mt-6 flex justify-between items-center">
          <div v-if="projet.taux_financier.percent <= 100" class="flex items-center space-x-1">
            <!-- if arrow UP -->
            <i class="bx bx-up-arrow-alt bx-sm text-primary"></i>
            <span class="text-xs text-green-700 font-semibold"> {{ projet.tauxEngagement }} %</span>
          </div>
          <div v-else class="flex items-center space-x-1">
            <!-- if arrow DOWN -->
            <i class="bx bx-down-arrow-alt bx-sm text-primary"></i>
            <span class="text-xs text-red-700 font-semibold"> {{ projet.tauxEngagement }} %</span>
          </div>

          <p class="text-gray-700 text-small font-semibold">Depuis le 1 janvier</p>
        </div>
      </div>

      <div class="bg-white shadow p-3 hover:shadow-md">
        <h2 class="text-indigo-700 font-semibold text-xs">Taux d'execution physique</h2>
        <h4 class="text-2xl text-black font-bold mt-3">{{ projet.tep }}%</h4>
        <div class="mt-6 flex justify-between items-center">
          <div class="flex items-center space-x-1">
            <!-- if arrow UP -->
            <i class="bx bx-up-arrow-alt bx-sm text-primary"></i>
            <span class="text-xs text-green-700 font-semibold">{{ projet.tepByAnnee }}% </span>
          </div>
          <p class="text-gray-700 text-small font-semibold">Depuis le 1 janvier</p>
        </div>
      </div>

    </div>
    <div class="bg-white my-3 shadow">
      <div class="p-3">
        <div>
          <p class="border border-gray-100 shadow rounded-md relative">
            <img v-if="image != null || image != undefined"
              class=" max-h-52 w-full object-cover transition-transform duration-300 transform group-hover:scale-100"
              :src="`${base_url}${image.url}`">
            <img v-else
              class=" max-h-52 w-full object-cover transition-transform duration-300 transform group-hover:scale-100"
              src="@/assets/images/login/logo-gouv.webp" alt="">

            <!-- nombre de jours restants -->
            <span
              class="absolute bottom-2 right-2 z-10 text-xl bg-red-500 px-2 py-2 font-semibold text-white rounded-lg">
              <table class="text-center">
                <tr class="text-xs">Nombre de jour restant</tr>
                <tr><i class="bx bx-hourglass bx-xs font-bold"></i> {{ projet.nbrJourRestant }}</tr>
              </table>
            </span>
          </p>



          <!-- divide DUREE -->
          <div class="border-b-2 border-gray-700 mx-4 mb-8 relative p-4">
            <span
              class="w-full -mx-4 font-bold absolute bg-gray-700 px-4 py-1 text-white border-2 border-gray-700">Durée du
              projet : <span class="">du {{ projet.debut }} au {{ projet.fin }} </span></span>
          </div>

          <div class="px-4">
            <table class="w-full text-sm border-b mb-2 bg-gray-300 bg-opacity-25">
              <tbody>
                <tr class="p-4 font-semibold">
                  <td class="pl-2">Dernière date d’audit :</td>
                  <td v-if="projet.audit != null">{{ projet.audit.dateDeTransmission }}</td>
                  <td v-else>Audit non disponible</td>
                  <td>
                    <div v-if="projet.audit != null" class="p-2 text-white space-x-2">
                      <span v-if="projet.audit.statut == 1"
                        class="bg-green-600 px-2 py-1 text-xs tracking-wide font-bold rounded-md">Terminer</span>
                      <span v-if="projet.audit.statut == 0"
                        class="bg-purple-600 px-2 py-1 text-xs tracking-wide font-bold rounded-md">En cours</span>
                      <span v-if="projet.audit.statut == -1"
                        class="bg-yellow-600 px-2 py-1 text-xs tracking-wide font-bold rounded-md">En attente</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="w-full text-sm">
              <tbody>
                <tr class="p-2">
                  <td class="font-semibold">Secteur d’activité :</td>
                  <td>
                    <div class="p-2 text-white space-x-2">
                      <span
                        class="bg-blue-500 opacity-50 px-2 py-1 text-xs tracking-wide font-bold rounded-md">{{ projet.secteurActivite }}</span>

                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- divide SITE -->
          <div class="border-b-2 border-blue-500 mx-4 mb-8 relative p-4">
            <span
              class="font-bold absolute bg-blue-500 px-4 py-1 text-white border-2 border-blue-500 rounded-lg uppercase">Zone
              d’intervention</span>
          </div>
          <div class="px-4">
            <table class="w-full text-sm">
              <tbody>
                <tr class="p-2 border-b-2 border-gray-200">
                  <td class="font-semibold">Pays :</td>
                  <td>{{ projet.pays }}</td>
                </tr>
                <tr class="p-2 border-b-2 border-gray-200">
                  <td class="font-semibold">Département :</td>
                  <td>{{ projet.departement }}</td>
                </tr>
                <tr class="p-2 border-b-2 border-gray-200">
                  <td class="font-semibold">Commune :</td>
                  <td>{{ projet.commune }}</td>
                </tr>
                <tr class="p-2 border-b-2 border-gray-200">
                  <td class="font-semibold">Arrondissement :</td>
                  <td>{{ projet.arrondissement }}</td>
                </tr>
                <tr class="p-2 border-b-2 border-gray-200">
                  <td class="font-semibold">Nom de site :</td>
                  <td>
                    <div class="p-2 text-white space-x-2">
                      <span v-for="(item, i) in projet.sites" :key="i" :value="item.id"
                        class="bg-gray-500 px-2 py-1 text-xl tracking-wide font-bold rounded-md">{{ item.nom }}</span>

                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- divide OBJECTIF -->
          <div class="border-b-2 border-blue-500 mx-4 mb-8 relative p-4">
            <span
              class="font-bold absolute bg-blue-500 px-4 py-1 text-white border-2 border-blue-500 rounded-lg">OBJECTIF
              GLOBALE</span>
          </div>
          <p class="p-4 font-bold text-sm text-justify">
            {{ projet.objectifGlobaux }}
          </p>
        </div>

        <!-- divide PROJET -->
        <div class="border-b-2 border-blue-500 mx-4 mb-8 relative p-4">
          <span
            class="font-bold absolute bg-blue-500 px-4 py-1 text-white border-2 border-blue-500 rounded-lg">DESCRIPTION
            DU PROJET</span>
        </div>
        <div class="p-4">
          <p class="h-auto overflow-hidden text-sm italic text-justify">

            <span v-if="isShow"> {{ projet.description.substring(0, 200) }} </span>
            <span v-else> {{ projet.description }} </span>

          </p>
          <button v-if="projet.description.length > 200" @click="isShow = false"
            class="font-semibold bg-gray-700 text-white px-4 py-2 mt-4 hover:bg-blue-500">Lire plus</button>
        </div>
      </div>

      <!-- divide company -->
      <div class="border-b-2 border-blue-500 mx-4 mb-8 relative p-4">
        <span
          class="font-bold absolute bg-blue-500 px-4 py-1 text-white border-2 border-blue-500 rounded-lg uppercase">Entreprises</span>
      </div>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
        <thead
          class="text-xs text-gray-700 uppercase border-b border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-2 px-6">Nom</th>

            <th scope="col" class="p-2">Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entreprise, index) in projet.entreprises" :key="index"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <!-- <hover-ligne :code="suivi.activite.nom" libelle="lorem ipsum dolor"></hover-ligne> -->
            <td class="py-2 px-6 uppercase">{{ entreprise.user.nom }}</td>

            <td class="p-2 uppercase">{{ entreprise.user.contact }}</td>
          </tr>
        </tbody>
      </table>

      <!-- divide Galerie -->
      <div class="border-b-2 mx-4 mb-8 relative p-4">
        <span class="absolute bg-white px-4 py-1 text-gray-500 border-2 rounded-lg">Galerie</span>
      </div>

      <div class="w-5/6 mx-auto p-1">
        <vueper-slides class="no-shadow " :bullets="false" :visible-slides="3" :slide-ratio="1 / 4" :gap="3" autoplay
          arrows-inside :pause-on-hover="pauseOnHover" @autoplay-pause="internalAutoPlaying = false"
          @autoplay-resume="internalAutoPlaying = true" :dragging-distance="70">

          <vueper-slide v-for="i in slide" :key="i.id" :title="i.title" :content="i.content" :image="i.image" />
        </vueper-slides>
      </div>

      <!-- divide of benin color -->
      <div class="grid grid-cols-3 mt-4">
        <div class="h-2 w-full bg-green-700"></div>
        <div class="h-2 w-full bg-yellow-500"></div>
        <div class="h-2 w-full bg-red-700"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from "@/services/configs/environment.js";
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import Vtable from '@/components/Vtable'
export default {
  name: 'Description',
  props: ['projet', 'image'],
  components: {
    VueperSlides,
    VueperSlide,
    Vtable,
  },
  data() {
    return {
      base_url: API_BASE_URL,
      pauseOnHover: true,
      autoPlaying: true,
      isShow: true,
      internalAutoPlaying: true,
      slide: [
        {
          image: 'https://www.gouv.bj/upload/images/articles/0751086001657376878.jpeg',
        },
        {
          image: 'https://live.staticflickr.com/65535/52203050725_5541f81dc9_b.jpg',
        },
        {
          image: 'https://live.staticflickr.com/65535/52202575368_6fc5719f32_b.jpg',
        },
        {
          image: 'https://live.staticflickr.com/65535/52202555101_01232fe4d6_b.jpg',
        },
        {
          image: 'https://live.staticflickr.com/65535/52201567167_260ab83654_b.jpg',
        }
      ],
    };
  },

  computed: {},

  methods: {
  },

  created() {

  }

};
</script>

<style >
/*le carousel*/
.vueperslide--active {

  opacity: 1;
  border: 3px solid black;
  border-radius: 12px;
  border-color: #000;
}

.vueperslides__arrow svg {
  color: rgb(0, 26, 255);
  font-size: 16px;
  stroke-width: 2;
  width: 14px;
}

/* fin de la partie carousel*/
</style>
