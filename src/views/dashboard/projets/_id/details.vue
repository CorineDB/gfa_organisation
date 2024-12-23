<template>
  <!-- New sample -->
  <div class="bg-gray-50 min-h-screen p-6">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white rounded-md shadow p-4 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-800">{{ graphiqueData?.nom }}</h1>
        <p class="text-sm text-gray-600" v-if="graphiqueData?.description !== null">{{ graphiqueData?.description }}.</p>
        <p class="text-gray-500">
          Equipe en charge : <span class="font-medium">{{ graphiqueData?.projet_manager }}</span>
        </p>
      </div>

      <div>
        <p class="text-sm text-gray-600"><strong>TEP :</strong> {{ graphiqueData?.tep }} %</p>
        <p class="text-sm text-gray-600"><strong>TEF :</strong> {{ graphiqueData?.tef }} %</p>
        <p class="text-sm text-gray-600">
          Effectif de l'organisation: <span class="font-semibold text-gray-800"> {{ graphiqueData?.nombreEmploie }}</span>
        </p>
      </div>
    </div>
    <div class="bg-white shadow-md rounded-md p-6 my-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Résumé du Budget</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <!-- Budget Total -->
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold">Budget Total</h3>
          <!-- {{ formatterUSD.format(graphiqueData?.budgetTotal) }} -->
          <p class="text-2xl font-bold">{{ formatterUSD.format(graphiqueData?.pret + graphiqueData?.budgetNational) }}</p>
        </div>

        <!-- Détails du Budget -->
        <div class="space-y-2">
          <!-- <p class="flex justify-between items-center text-gray-600">
            <span>Fond Fosir :</span>
            {{ formatterUSD.format(graphiqueData?.consommer) }}
            <span class="font-medium text-red-500"> Non disponible pour l'instant</span>
          </p> -->
          <p class="flex justify-between items-center text-gray-600">
            <span>Prêt :</span>
            <span class="font-medium">{{ formatterUSD.format(graphiqueData?.pret) }}</span>
          </p>
          <p class="flex justify-between items-center text-gray-600">
            <span>Fonds Propres :</span>
            <span class="font-medium text-green-500">{{ formatterUSD.format(graphiqueData?.budgetNational || 0) }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- Content Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-md shadow p-6 mb-3">
        <p class="text-xl font-bold text-center">Activités</p>
        <div class="relative mt-8">
          <!-- v-if="graphiqueData?.statistiqueActivite > 0" -->
          <ReportDonutChart2 v-if="graphiqueData?.statistiqueActivite" :activite="extractProperties(graphiqueData?.statistiqueActivite || [0, 0, 0])" :height="215" />
          <div class="flex flex-col justify-center items-center absolute w-full h-full top-0 left-0">
            <div class="text-xl 2xl:text-2xl font-medium">{{ graphiqueData?.statistiqueActivite?.total }}</div>
            <div class="text-slate-500 mt-0.5">Total Activité</div>
          </div>
        </div>
        <div class="mx-auto w-10/12 2xl:w-2/3 mt-8">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
            <span class="truncate">terminer : {{ graphiqueData?.statistiqueActivite?.effectue }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
            <span class="font-medium xl:ml-auto" v-if="graphiqueData?.statistiqueActivite?.total > 0">{{ graphiqueData?.statistiqueActivite?.effectue / graphiqueData?.statistiqueActivite?.total }} %</span>
          </div>
          <div class="flex items-center mt-4">
            <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
            <span class="truncate">En cour {{ graphiqueData?.statistiqueActivite?.enCours }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
            <span class="font-medium xl:ml-auto" v-if="graphiqueData?.statistiqueActivite?.total > 0">{{ graphiqueData?.statistiqueActivite?.enCours / graphiqueData?.statistiqueActivite?.total }} %</span>
          </div>
          <div class="flex items-center mt-4">
            <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
            <span class="truncate">En retard : {{ graphiqueData?.statistiqueActivite?.enRetard }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
            <span class="font-medium xl:ml-auto" v-if="graphiqueData?.statistiqueActivite?.total > 0">{{ graphiqueData?.statistiqueActivite?.enRetard / graphiqueData?.statistiqueActivite?.total }} %</span>
          </div>
        </div>
      </div>

      <!-- Map and Data -->
      <div class="col-span-2 bg-white rounded-md shadow p-6" v-if="graphiqueData?.sites?.length > 0">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Cartes géographiques</h2>
        <div class="grid grid-cols-2 gap-4">
          <!-- Map -->
          <!-- <div  style="height: 40vh"></div> -->
          <div>
            <div id="map" class="bg-gray-200 rounded-md h-48 mb-4"></div>
            <p class="text-sm text-gray-500">Total Number of Sessions within Date Range Users</p>
          </div>
          <!-- Data Table -->
          <div>
            <table class="w-full text-sm text-gray-600">
              <thead>
                <tr class="bg-gray-100 text-left">
                  <th class="py-2 px-4">Sites</th>
                  <th class="py-2 px-4">Longitudes</th>
                  <th class="py-2 px-4">Latitudes</th>
                </tr>
              </thead>
              <tbody v-for="(item, index) in graphiqueData.sites" :key="index">
                <tr>
                  <td class="py-2 px-4">{{ item.nom }}</td>
                  <td class="py-2 px-4">{{ item.latitude }}</td>
                  <td class="py-2 px-4 text-red-500">{{ item.longitude }}</td>
                </tr>
                <!-- <tr>
                  <td class="py-2 px-4">Seoul</td>
                  <td class="py-2 px-4">454</td>
                  <td class="py-2 px-4 text-green-500">+5.64%</td>
                </tr> -->
                <!-- Add more rows as needed -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- </section> -->

      <!-- Activity Stream -->
      <div class="bg-white rounded-md shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Listes des activités</h2>
        <ul class="space-y-4">
          <li class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">✓</div>
            <div class="ml-4">
              <p class="text-gray-800 font-semibold">Order Verification</p>
              <p class="text-sm text-gray-500">Product ID: #9823</p>
            </div>
          </li>
          <li class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500">✓</div>
            <div class="ml-4">
              <p class="text-gray-800 font-semibold">Order Completed</p>
              <p class="text-sm text-gray-500">Product ID: #9823</p>
            </div>
          </li>
          <!-- Add more items as needed -->
        </ul>
      </div>

      <div class="bg-white shadow-md rounded-md p-6">
        <h2 class="text-lg font-semibold text-gray-700">Jours Restants</h2>
        <p class="mt-4 text-2xl font-bold text-gray-800">{{ convertDaysToYearsMonthsDays(graphiqueData?.nbrJourRestant) }}</p>
      </div>

      <!-- Sales Analytics -->
      <div class="bg-white rounded-md shadow p-6 col-span-1 mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Sales Analytics</h2>
        <div class="grid grid-cols-2 gap-4">
          <!-- Chart Placeholder -->
          <div class="bg-gray-200 rounded-md h-40"></div>
          <!-- Data -->
          <div>
            <p class="text-gray-500">Audience Breakdown</p>
            <div class="mt-4">
              <p class="text-sm text-gray-700">Online Sales</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-700">Offline Sales</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-orange-500 h-2 rounded-full" style="width: 40%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

    <!-- Activities Section -->
    <section class="bg-white shadow-md rounded-md p-6 mb-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-700">Liste des Activités</h2>
        <select class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600">
          <option>Filtrer par Statut</option>
          <option>En cours</option>
          <option>Terminé</option>
          <option>Non commencé</option>
        </select>
      </div>
      <div class="mt-4 overflow-x-auto" v-if="graphiqueData?.suivis?.length > 0">
        <table class="table-auto w-full text-left border-collapse">
          <thead class="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th class="px-4 py-2">Activité</th>
              <th class="px-4 py-2">TEP Actuel</th>
              <th class="px-4 py-2">STATUS</th>
              <!-- <th class="px-4 py-2">Responsable</th>
              <th class="px-4 py-2">Statut</th>
              <th class="px-4 py-2">Début</th>
              <th class="px-4 py-2">Fin prévue</th> -->
            </tr>
          </thead>

          <tbody class="text-gray-600">
            <tr v-for="(suivi, index) in graphiqueData?.suivis" :key="index">
              <td class="border px-4 py-2">{{ suivi.nom }}</td>
              <td class="border px-4 py-2">{{ suivi.poidsActuel.toFixed(2) }}</td>
              <td class="border px-4 py-2">
                <span class="text-green-500"> {{ getStringValueOfStatutCode(suivi.statut).libelle }} </span>
              </td>
            </tr>
            <!-- <tr>
              <td class="border px-4 py-2">Conception</td>
              <td class="border px-4 py-2">Jean Dupont</td>
              <td class="border px-4 py-2">En cours</td>
              <td class="border px-4 py-2">01/01/2024</td>
              <td class="border px-4 py-2">31/01/2024</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Développement</td>
              <td class="border px-4 py-2">Marie Curie</td>
              <td class="border px-4 py-2">Non commencé</td>
              <td class="border px-4 py-2">01/02/2024</td>
              <td class="border px-4 py-2">30/06/2024</td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div v-else>Pas d'activité disponible pour le moment</div>
    </section>

    <!-- Performance Metrics Section -->
    <section class="bg-white shadow-md rounded-md p-6">
      <h2 class="text-lg font-semibold text-gray-700">Suivi Indicateurs</h2>
      <div class="mt-4 overflow-x-auto">
        <TabulatorSuiviIndicateurDetail v-if="suivis.length > 0" :data="suivis" :years="annees" />
        <p v-else>Pas de suivi disponible pour l'instant</p>
      </div>
    </section>
  </div>
  <!-- fin new sample -->
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import ChartCircular from "../../../../components/news/ChartCircular.vue";
import ReportBarChart from "@/components/report-bar-chart/Main.vue";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import ProjetService from "@/services/modules/projet.service.js";
import VerticalBarChart from "@/components/vertical-bar-chart/Main.vue";
import ReportLineChart from "@/components/report-line-chart/Main.vue";
import PieChart from "@/components/pie-chart/Main.vue";
import ReportDonutChart2 from "@/components/report-donut-chart-2/Main.vue";
import { toast } from "vue3-toastify";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import TabulatorSuiviIndicateurDetail from "@/components/TabulatorSuiviIndicateurDetail.vue";
import { LMap, LTileLayer, LMarker, LPolygon, LPopup } from "@vue-leaflet/vue-leaflet";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { addressPoints } from "../markerDemo";
import icon from "../icon.png";
import markerShadow from "../marker-shadow.png";
import { useRouter, useRoute } from "vue-router";
import IndicateursService from "@/services/modules/indicateur.service";
import AuthService from "@/services/modules/auth.service";

const getStringValueOfStatutCode = (statut) => {
  let data = {
    code: statut,
    libelle: "Statut code inconnu",
    couleur: "bg-blue-500",
  };

  switch (statut) {
    case -2:
      data = {
        code: statut,
        libelle: "Non validé",
        couleur: "bg-black-500",
      };
      break;

    case -1:
      data = {
        code: statut,
        libelle: "En attente",
        couleur: "bg-gray-700",
      };
      break;

    case 0:
      data = {
        code: statut,
        libelle: "En cours",
        couleur: "bg-yellow-400",
      };
      break;

    case 1:
      data = {
        code: statut,
        libelle: "En retard",
        couleur: "bg-red-500",
      };
      break;

    case 2:
      data = {
        code: statut,
        libelle: "Terminé",
        couleur: "bg-green-400",
      };
      break;

    default:
      data;
      break;
  }

  return data;
};

function extractProperties(array, properties) {
  if (array.length) {
    return array.map((item) => properties.map((prop) => item[prop])).flat();
  }
}

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

function convertDaysToYearsMonthsDays(totalDays) {
  const daysInYear = 365;
  const daysInMonth = 30; // approximation pour simplifier

  const years = Math.floor(totalDays / daysInYear);
  const remainingDaysAfterYears = totalDays % daysInYear;

  const months = Math.floor(remainingDaysAfterYears / daysInMonth);
  const days = remainingDaysAfterYears % daysInMonth;

  const result = [];
  if (years > 0) result.push(`${years} ${years > 1 ? "années" : "année"}`);
  if (months > 0) result.push(`${months} ${months > 1 ? "mois" : "mois"}`);
  if (days > 0) result.push(`${days} ${days > 1 ? "jours" : "jour"}`);

  return result.join(", ");
}

const formatterUSD = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
});

console.log(formatterUSD.format(1234567.89)); // "$1,234,567.89"

const suivis = ref([]);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");

// Fetch data
const getDatasCadre = async () => {
  //isLoadingDataCadre.value = true;
  try {
    const { data } = await IndicateursService.getCadreRendement(idProgramme.value);
    suivis.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    // isLoadingDataCadre.value = false;
  }
};

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      idProgramme.value = result.data.data.programme.id;
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
      getDatasCadre();
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const router = useRouter();
const route = useRoute();
const url = ref("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
const attribution = ref('&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors');
const zoom = ref(8);
const center = ref([47.31322, -1.319482]);
const polygon = ref({
  latlngs: [
    [47.2263299, -1.6222],
    [47.21024000000001, -1.6270065],
    [47.1969447, -1.6136169],
    [47.18527929999999, -1.6143036],
    [47.1794457, -1.6098404],
    [47.1775788, -1.5985107],
    [47.1676598, -1.5753365],
    [47.1593731, -1.5521622],
    [47.1593731, -1.5319061],
    [47.1722111, -1.5143967],
    [47.1960115, -1.4841843],
    [47.2095404, -1.4848709],
    [47.2291277, -1.4683914],
    [47.2533687, -1.5116501],
    [47.2577961, -1.5531921],
    [47.26828069, -1.5621185],
    [47.2657179, -1.589241],
    [47.2589612, -1.6204834],
    [47.237287, -1.6266632],
    [47.2263299, -1.6222],
  ],
  color: "green",
});

const myIcon = ref(null);
const initialMap = ref(null);
const markerLatLng = ref([47.31322, -1.319482]);

//console.log("projetId", route.params.id);

const loadingOption = ref(true);
const graphiqueData = ref([]);
const getStat = function () {
  ProjetService.statistiques(route.params.id)
    .then((data) => {
      graphiqueData.value = data.data.data;
      if (graphiqueData.value?.sites?.length > 0) {
        // alert("ok");
        myIcon.value = L.icon({
          iconUrl: icon,
          iconSize: [30, 30],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowUrl: markerShadow,
          shadowSize: [60, 30],
          shadowAnchor: [22, 94],
        });

        // Initialiser la carte
        initialMap.value = L.map("map", {
          zoomControl: true,
          zoom: 1,
          zoomAnimation: false,
          fadeAnimation: true,
          markerZoomAnimation: true,
        }).setView([6.8041, 2.4152], 6);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(initialMap.value);

        // Ajouter des marqueurs individuels
        L.marker([6.3746, 2.6004], { icon: myIcon.value }).addTo(initialMap.value);
        L.marker([6.3752, 2.8349], { icon: myIcon.value }).addTo(initialMap.value);

        // Créer un groupe de marqueurs
        const markers = L.markerClusterGroup();

        // Ajouter des marqueurs à partir de `addressPoints`
        addressPoints.forEach((element, index) => {
          const each_marker = new L.marker([element.latitude, element.longitude], { icon: myIcon.value }).bindPopup(`<strong> Hello Bangladesh! </strong> <br> I am a popup number ${index}`);
          markers.addLayer(each_marker);
        });

        initialMap.value.addLayer(markers);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  console.log("projetId", route.params.id);
  getStat();
  getcurrentUser();
});
</script>
<style scoped></style>
