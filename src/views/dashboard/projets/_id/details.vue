<template>
  <!-- New sample -->
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="flex justify-between my-4 items-center">
      <h2 class="text-lg font-medium intro-y">Détail projet</h2>
      <button class="btn btn-primary" @click="router.go(-1)">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
    </div>
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="">
        <h1 class="text-xl font-semibold text-gray-800">{{ graphiqueData?.nom }}</h1>
        <p class="text-sm text-gray-600" v-if="graphiqueData?.description">{{ graphiqueData?.description }}.</p>
      </div>
      <!-- <div class="">
        <p class="text-sm text-gray-600">
          Manager: <span class="font-medium text-primary">{{ graphiqueData?.projet_manager ?? "" }}</span>
        </p>
      </div> -->
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
        <div class="report-box zoom-in">
          <div class="p-5 text-center box">
            <div class="flex items-center justify-between">
              <UserIcon class="size-10 text-success" />
              <div class="mt-2 text-lg font-medium leading-8">Manager</div>
            </div>
            <div class="flex items-center justify-around mt-4">
              <div class="flex gap-2 text-lg text-left">
                <div class="mt-1 text-primary">
                  <span class="font-semibold">
                    {{ graphiqueData?.projet_manager ?? "" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
        <div class="report-box zoom-in">
          <div class="p-5 text-center box">
            <div class="flex items-center justify-between">
              <UsersIcon class="size-10 text-pending" />
              <div class="mt-2 text-lg font-medium leading-8">Membres ({{ graphiqueData?.equipes ? graphiqueData?.equipes?.length : 0 }})</div>
            </div>
            <div class="flex items-center justify-around mt-4">
              <div class="flex gap-2 text-sm text-left">
                <div v-if="graphiqueData?.equipes" class="mt-1 text-primary">
                  <span class="font-semibold">{{ graphiqueData?.equipes.map((item) => item.nom).join(", ") }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
        <div class="report-box zoom-in">
          <div class="p-5 text-center box">
            <div class="flex items-center justify-between">
              <CalendarIcon class="size-10 text-primary" />
              <div class="mt-2 text-lg font-medium leading-8">Jours Restants</div>
            </div>
            <div class="flex items-center justify-around mt-4">
              <div class="flex gap-2 text-lg text-left">
                <div class="mt-1 text-primary">
                  <span class="font-semibold"> {{ convertDaysToYearsMonthsDays(graphiqueData?.nbrJourRestant) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
        <div class="report-box zoom-in">
          <div class="p-5 text-center box">
            <div class="flex items-center justify-between">
              <BarChart2Icon class="size-10 text-success" />
              <div class="mt-2 text-lg font-medium leading-8">Fonds Propres</div>
            </div>
            <div class="flex items-center justify-around mt-4">
              <div class="flex gap-2 text-lg text-left">
                <div class="mt-1 text-primary">
                  <span class="font-semibold"> {{ formatterUSD.format(graphiqueData?.budgetNational || 0) }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
        <div class="report-box zoom-in">
          <div class="p-5 text-center box">
            <div class="flex items-center justify-between">
              <BarChart2Icon class="size-10 text-pending" />
              <div class="mt-2 text-lg font-medium leading-8">Prêt</div>
            </div>
            <div class="flex items-center justify-around mt-4">
              <div class="flex gap-2 text-lg text-left">
                <div class="mt-1 text-primary">
                  <span class="font-semibold"> {{ formatterUSD.format(graphiqueData?.pret) }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
        <div class="report-box zoom-in">
          <div class="p-5 text-center box">
            <div class="flex items-center justify-between">
              <BarChart2Icon class="size-10 text-primary" />
              <div class="mt-2 text-lg font-medium leading-8">Budget Total</div>
            </div>
            <div class="flex items-center justify-around mt-4">
              <div class="flex gap-2 text-lg text-left">
                <div class="mt-1 text-primary">
                  <span class="font-semibold"> {{ formatterUSD.format(graphiqueData?.pret + graphiqueData?.budgetNational) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 gap-6 my-6 md:grid-cols-2 lg:grid-cols-3">
      <div class="p-6 mb-3 bg-white rounded-md shadow">
        <p class="text-xl font-bold text-center">Activités</p>
        <div class="relative mt-8">
          <!-- v-if="graphiqueData?.statistiqueActivite > 0" -->
          <ReportDonutChart2 v-if="graphiqueData?.statistiqueActivite" :activite="extractProperties(graphiqueData?.statistiqueActivite || [0, 0, 0])" :height="215" />
          <div class="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
            <div class="text-xl font-medium 2xl:text-2xl">{{ graphiqueData?.statistiqueActivite?.total }}</div>
            <div class="text-slate-500 mt-0.5">Total Activités</div>
          </div>
        </div>
        <div class="flex items-center justify-center w-full gap-2 mx-auto mt-8">
          <div class="flex items-center">
            <div class="w-2 h-2 mr-3 rounded-full bg-primary"></div>
            <span class="truncate">Terminer : {{ graphiqueData?.statistiqueActivite?.effectue }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-2 h-2 mr-3 rounded-full bg-pending"></div>
            <span class="truncate">En cours {{ graphiqueData?.statistiqueActivite?.enCours }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-2 h-2 mr-3 rounded-full bg-warning"></div>
            <span class="truncate">En retard : {{ graphiqueData?.statistiqueActivite?.enRetard }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center p-6 mb-3 bg-white rounded-md shadow">
        <p class="text-xl font-bold text-center">TEP</p>
        <ChartJauge label="TEP" :temperature="graphiqueData?.tep * 100 ?? 0" />
      </div>
      <div class="flex flex-col items-center p-6 mb-3 bg-white rounded-md shadow">
        <p class="text-xl font-bold text-center">TEF</p>
        <ChartJauge label="TEF" :temperature="graphiqueData?.tef * 100 ?? 0" />
      </div>
      <!-- Map and Data -->
      <div class="col-span-12 p-6 bg-white rounded-md shadow" v-if="graphiqueData?.sites?.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-700">Cartes géographiques</h2>
        <div class="grid grid-cols-2 gap-4">
          <!-- Map -->
          <!-- <div  style="height: 40vh"></div> -->
          <div class="col-span-8">
            <div id="map" class="mb-4 bg-gray-200 rounded-md" style="height: 400px;"></div>
          </div>
          <!-- Data Table -->
          <div class="col-span-4 overflow-x-auto">
            <table class="w-full text-sm text-gray-600">
              <thead>
                <tr class="text-left bg-gray-100">
                  <th class="px-4 py-2">Sites</th>
                  <th class="px-4 py-2">Longitudes</th>
                  <th class="px-4 py-2">Latitudes</th>
                </tr>
              </thead>
              <tbody v-for="(item, index) in graphiqueData.sites" :key="index">
                <tr>
                  <td class="px-4 py-2">{{ item.nom }}</td>
                  <td class="px-4 py-2">{{ item.latitude }}</td>
                  <td class="px-4 py-2 text-red-500">{{ item.longitude }}</td>
                </tr>
                <!-- <tr>
                  <td class="px-4 py-2">Seoul</td>
                  <td class="px-4 py-2">454</td>
                  <td class="px-4 py-2 text-green-500">+5.64%</td>
                </tr> -->
                <!-- Add more rows as needed -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- </section> -->
    </div>

    <!-- Activities Section -->
    <section class="p-6 mb-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-700">Liste des Activités</h2>
        <div class="max-w-[200px] w-full">
          <label class="form-label">Status</label>
          <TomSelect v-model="filterStatut" @change="applyFilter" :options="{ placeholder: 'Selectionez un statut' }" class="w-full">
            <option value="10">Tout</option>
            <option value="0">En cours</option>
            <option value="2">Terminé</option>
            <option value="-1">En attente</option>
            <option value="1">En retard</option>
            <option value="-2">Non valide</option>
          </TomSelect>
        </div>
      </div>

      <div class="overflow-x-auto scrollbar-hidden">
        <div id="activity" class="my-5 table-report table-report--tabulator"></div>
      </div>
    </section>

    <!-- Performance Metrics Section -->
    <!-- <section class="p-6 bg-white rounded-md shadow-md">
      <h2 class="text-lg font-semibold text-gray-700">Suivi Indicateurs</h2>
      <div class="mt-4 overflow-x-auto">
        <TabulatorSuiviIndicateurDetail v-if="suivis.length > 0" :data="suivis" :years="annees" />
        <p v-else>Pas de suivi disponible pour l'instant</p>
      </div>
    </section> -->

    <!-- Performance Metrics Section -->
    <section class="p-6 bg-white rounded-md shadow-md">
      <h2 class="text-lg font-semibold text-gray-700">Suivi Indicateurs</h2>
      <div class="mt-4 overflow-x-auto">
        <TabulatorSuiviIndicateur :data="suivis" :years="annees" :isDataLoading="isLoadingDataCadre"/>
      </div>
    </section>
  </div>
  <!-- fin new sample -->
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import ProjetService from "@/services/modules/projet.service.js";
import ReportDonutChart2 from "@/components/report-donut-chart-2/Main.vue";
import { toast } from "vue3-toastify";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
// import TabulatorSuiviIndicateurDetail from "@/components/TabulatorSuiviIndicateurDetail.vue";
import TabulatorSuiviIndicateur from "@/components/TabulatorSuiviIndicateur.vue";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { addressPoints } from "../markerDemo";
import icon from "../icon.png";
import markerShadow from "../marker-shadow.png";
import { useRouter, useRoute } from "vue-router";
import IndicateursService from "@/services/modules/indicateur.service";
import AuthService from "@/services/modules/auth.service";
import ChartJauge from "../../../../components/news/ChartJauge.vue";
import Tabulator from "tabulator-tables";

const tabulator = ref();
const filterStatut = ref(0);
const initTabulator = () => {
  tabulator.value = new Tabulator("#activity", {
    data: graphiqueData.value.suivis,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 10,
    columns: [
      {
        title: "Activité",
        field: "nom",
      },
      {
        title: "TEP actuel",
        field: "poidsActuel",
        formatter: (cell) => {
          return `<span>${cell.getValue().toFixed(2)}</span>`;
        },
        formatterParams: {
          htmlOutput: true, // Active l'insertion HTML dans la cellule
        },
      },
      {
        title: "Status",
        field: "statut",
        hozAlign: "center",
        formatter: (cell) => {
          const statut = getStringValueOfStatutCode(cell.getValue());
          const backgroundColor = statut.couleur;
          const label = statut.libelle;

          return `<span class="py-1 px-1.5 text-xs font-medium text-white rounded-full" style="background-color: ${backgroundColor};">${label}</span>`;
        },
        formatterParams: {
          htmlOutput: true, // Active l'insertion HTML dans la cellule
        },
      },
    ],
  });
};

const applyFilter = () => {
  if (tabulator.value) {
    const query = +filterStatut.value;
    query === 10 ? tabulator.value.setFilter("", "", "") : tabulator.value.setFilter("statut", "=", query);
  }
};
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
        couleur: "#1e293b",
      };
      break;

    case -1:
      data = {
        code: statut,
        libelle: "En attente",
        couleur: "#1e293b",
      };
      break;

    case 0:
      data = {
        code: statut,
        libelle: "En cours",
        couleur: "#f59e0b",
      };
      break;

    case 1:
      data = {
        code: statut,
        libelle: "En retard",
        couleur: "#e11d48",
      };
      break;

    case 2:
      data = {
        code: statut,
        libelle: "Terminé",
        couleur: "#064e3b",
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

const suivis = ref([]);
const isLoadingDataCadre = ref(false);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");

// Fetch data
const getDatasCadre = async () => {
  isLoadingDataCadre.value = true;
  try {
    /* const { data } = await IndicateursService.getCadreRendement(idProgramme.value);
    suivis.value = data.data; */

    const { data } = await IndicateursService.getAllSuivis();
    suivis.value = data.data;
    console.log("suivis.value : ", suivis.value);
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataCadre.value = false;
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
      initTabulator();
      initMap();
    })
    .catch((error) => {
      console.log(error);
    });
};

const initMap = () => {
  if (graphiqueData.value?.sites?.length > 0) {
    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      const mapElement = document.getElementById("map");
      if (!mapElement) return;

      // Initialiser la carte si elle n'existe pas
      if (!initialMap.value) {
        // Créer l'icône personnalisée
        myIcon.value = L.icon({
          iconUrl: icon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Calculer le centre et le zoom pour afficher tous les marqueurs
        const bounds = [];

        graphiqueData.value.sites.forEach(site => {
          const lat = parseFloat(site.latitude);
          const lng = parseFloat(site.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.push([lat, lng]);
          }
        });

        // Prendre le premier site comme centre par défaut
        const firstSite = graphiqueData.value.sites[0];
        const centerLat = parseFloat(firstSite.latitude);
        const centerLng = parseFloat(firstSite.longitude);

        initialMap.value = L.map("map").setView([centerLat, centerLng], 8);

        // Ajouter les tuiles
        L.tileLayer(url.value, {
          attribution: attribution.value,
        }).addTo(initialMap.value);

        // Créer un groupe de marqueurs avec MarkerCluster
        const markers = L.markerClusterGroup();

        // Parcourir tous les sites et ajouter les marqueurs au cluster
        graphiqueData.value.sites.forEach(site => {
          const lat = parseFloat(site.latitude);
          const lng = parseFloat(site.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            const popupContent = `
              <b>${site.nom}</b><br>
              ${site.quartier ? `Quartier: ${site.quartier}<br>` : ''}
              ${site.commune ? `Commune: ${site.commune}<br>` : ''}
              ${site.departement ? `Département: ${site.departement}<br>` : ''}
              Lat: ${lat}<br>
              Lng: ${lng}
            `;

            const marker = L.marker([lat, lng], { icon: myIcon.value })
              .bindPopup(popupContent);

            markers.addLayer(marker);
          }
        });

        // Ajouter le groupe de marqueurs à la carte
        initialMap.value.addLayer(markers);

        // Ajuster la vue pour afficher tous les marqueurs
        if (bounds.length > 1) {
          initialMap.value.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }, 300);
  }
};

onMounted(() => {
  getStat();
  getcurrentUser();
});
</script>
<style scoped></style>
