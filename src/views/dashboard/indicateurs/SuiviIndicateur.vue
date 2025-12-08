<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Dashboard Suivi des Indicateurs</h2>
    
    <!-- Section Statistiques KPI -->
    <div v-if="!isLoadingDataCadre && suivis.length > 0" class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4 intro-y">
      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="flex-none w-2/4 2xl:w-3/4">
              <div class="text-lg font-semibold leading-8">{{ totalSuivis }}</div>
              <div class="text-base text-slate-500 mt-1">Total Suivis</div>
            </div>
            <div class="flex-none w-2/4 2xl:w-1/4 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="flex-none w-2/4 2xl:w-3/4">
              <div class="text-lg font-semibold leading-8 text-success">{{ averagePerformance }}%</div>
              <div class="text-base text-slate-500 mt-1">Performance Moyenne ({{ getKeyLabel(selectedKey) }})</div>
            </div>
            <div class="flex-none w-2/4 2xl:w-1/4 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="flex-none w-2/4 2xl:w-3/4">
              <div class="text-lg font-semibold leading-8 text-warning">{{ indicateursActifs }}</div>
              <div class="text-base text-slate-500 mt-1">Indicateurs Actifs</div>
            </div>
            <div class="flex-none w-2/4 2xl:w-1/4 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="flex-none w-2/4 2xl:w-3/4">
              <div class="text-lg font-semibold leading-8 text-danger">{{ suivisRecentCount }}</div>
              <div class="text-base text-slate-500 mt-1">Suivis ce Mois</div>
            </div>
            <div class="flex-none w-2/4 2xl:w-1/4 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.5a2.5 2.5 0 012.5 2.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5A2.5 2.5 0 016.5 7H8z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    <!-- Section Filtres Améliorés -->
    <div v-if="!isLoadingDataCadre" class="mt-6 intro-y">
      <div class="box p-6 bg-gradient-to-br from-white to-gray-50">
        <!-- En-tête avec compteur de résultats -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtres Avancés
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              <span class="font-semibold text-blue-600">{{ filteredData.length }}</span> résultat(s) sur {{ totalSuivis }}
            </p>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Badges des filtres actifs -->
            <div v-if="hasActiveFilters" class="flex items-center gap-2">
              <span class="text-xs font-medium text-gray-600">Filtres actifs:</span>
              <div class="flex gap-2 flex-wrap">
                <span v-if="search" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  🔍 {{ search }}
                  <button @click="search = ''" class="ml-1 hover:text-blue-900">×</button>
                </span>
                <span v-if="selectedTrimestre" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  📅 T{{ selectedTrimestre }}
                  <button @click="selectedTrimestre = ''" class="ml-1 hover:text-green-900">×</button>
                </span>
                <span v-if="selectedYear" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  📆 {{ selectedYear }}
                  <button @click="selectedYear = ''" class="ml-1 hover:text-purple-900">×</button>
                </span>
                <span v-if="selectedIndicateur" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  📊 Indicateur
                  <button @click="selectedIndicateur = ''" class="ml-1 hover:text-orange-900">×</button>
                </span>
              </div>
            </div>

            <!-- Bouton Export Excel -->
            <button @click="generateExcel" class="btn btn-outline-success flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Exporter Excel
            </button>
          </div>
        </div>

        <!-- Grille de filtres -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Recherche -->
          <div class="relative">
            <label class="form-label text-sm font-semibold text-gray-700 mb-2">
              🔍 Rechercher
            </label>
            <div class="relative">
              <input 
                v-model="search" 
                type="text" 
                class="form-control pl-10 pr-10 border-2 focus:border-blue-500 transition-all" 
                placeholder="Nom indicateur ou auteur..."
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Trimestre -->
          <div>
            <label class="form-label text-sm font-semibold text-gray-700 mb-2">
              📅 Trimestre
            </label>
            <select v-model="selectedTrimestre" class="form-select border-2 focus:border-green-500 transition-all">
              <option value="">Tous les trimestres</option>
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </select>
          </div>

          <!-- Année -->
          <div>
            <label class="form-label text-sm font-semibold text-gray-700 mb-2">
              📆 Année
            </label>
            <select v-model="selectedYear" class="form-select border-2 focus:border-purple-500 transition-all">
              <option value="">Toutes les années</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Bouton Réinitialiser -->
          <div class="flex items-end">
            <button 
              @click="resetFilters" 
              :disabled="!hasActiveFilters"
              :class="hasActiveFilters ? 'btn-outline-secondary hover:bg-gray-100' : 'btn-outline-secondary opacity-50 cursor-not-allowed'"
              class="btn w-full transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Graphiques Améliorée avec Support Agrégé -->
    <div v-if="!isLoadingDataCadre && suivis.length > 0" class="mt-6 intro-y">
      <!-- Sélecteur de clé pour indicateurs agrégés -->
      <div class="box p-5 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Analyse Graphique des Indicateurs</h3>
              <p class="text-sm text-gray-600">Visualisez les données selon différentes dimensions</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Sélecteur de clé -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-semibold text-gray-700">📊 Dimension:</label>
              <select v-model="selectedKey" @change="updateAllCharts" class="form-select w-48 border-2 border-indigo-300 focus:border-indigo-500">
                <option v-for="key in availableKeys" :key="key" :value="key">
                  {{ getKeyLabel(key) }}
                </option>
              </select>
            </div>
            
            <!-- Bouton export -->
            <button @click="exportAllCharts" class="btn btn-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Exporter
            </button>
          </div>
        </div>
      </div>

      <!-- Première ligne avec 2 graphiques -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <!-- Graphique 1 : Répartition par Trimestre -->
        <div class="box p-5 relative group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
              Répartition par Trimestre
            </h3>
            <div class="flex gap-2">
              <button @click="exportChart('trimestre')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Exporter">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px;">
            <canvas ref="trimestreChart"></canvas>
          </div>
        </div>
        
        <!-- Graphique 2 : Performance Moyenne -->
        <div class="box p-5 relative group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Performance Moyenne par Mois
            </h3>
            <div class="flex gap-2">
              <button @click="exportChart('performance')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Exporter">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px;">
            <canvas ref="performanceChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Deuxième ligne : Graphique de comparaison -->
      <div class="box p-5 relative group">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
              Comparaison Cibles vs Réalisées
              <span class="text-sm font-normal text-gray-600">
                ({{ getKeyLabel(selectedKey) }})
              </span>
            </h3>
          </div>
          
          <div class="flex items-center gap-3 flex-wrap">
            <!-- Filtre par indicateur -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">🎯 Indicateur:</label>
              <select v-model="selectedIndicateur" @change="updateComparisonChart" class="form-select w-64 border-2 border-purple-300 focus:border-purple-500">
                <option value="">Tous les indicateurs</option>
                <option v-for="indicateur in availableIndicateurs" :key="indicateur.id" :value="indicateur.id">
                  {{ indicateur.nom.length > 50 ? indicateur.nom.substring(0, 50) + '...' : indicateur.nom }}
                </option>
              </select>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button @click="exportChart('comparison')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Exporter">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="relative" style="height: 400px;">
          <canvas ref="comparisonChart"></canvas>
        </div>
      </div>
    </div>

    <LoaderSnipper v-if="isLoadingDataCadre" />
    <TabulatorSuiviIndicateur v-else :data="filteredData" :years="annees" :isDataLoading="isLoadingDataCadre" @refreshData="getDatasCadre"/>
    
    <!-- Pagination -->
    <div v-if="!isLoadingDataCadre" class="flex justify-center gap-3 my-8">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-3 btn btn-outline-primary"><ChevronsLeftIcon class="size-5" /></button>
      <div class="flex items-center justify-center gap-3 overflow-x-auto scroll-pagination custom-scroll">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn">
          {{ page }}
        </button>
      </div>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-3 btn btn-outline-primary"><ChevronsRightIcon class="size-5" /></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import IndicateursService from "@/services/modules/indicateur.service";
import AuthService from "@/services/modules/auth.service";
import { toast } from "vue3-toastify";
import TabulatorSuiviIndicateur from "@/components/TabulatorSuiviIndicateur.vue";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getColorForExcel } from "@/utils/findColorIndicator";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Chart } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const suivis = ref([]);
const isLoadingDataCadre = ref(false);
const debutProgramme = ref("");
const finProgramme = ref("");
const search = ref("");
const selectedTrimestre = ref("");
const selectedYear = ref("");
const selectedIndicateur = ref("");
const selectedKey = ref(""); 

const currentPage = ref(1);
const itemsPerPage = 20;

const trimestreChart = ref(null);
const performanceChart = ref(null);
const comparisonChart = ref(null);
let trimestreChartInstance = null;
let performanceChartInstance = null;
let comparisonChartInstance = null;

const getKeyLabel = (key) => {
  return key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Standard';
};

const availableKeys = computed(() => {
  const keys = new Set();
  suivis.value.forEach(suivi => {
    if (suivi.indicateur?.taux_realisation) {
      Object.keys(suivi.indicateur.taux_realisation).forEach(k => keys.add(k));
    }
    if (suivi.valeurCible?.valeurCible) {
      Object.keys(suivi.valeurCible.valeurCible).forEach(k => keys.add(k));
    }
  });
  const arr = Array.from(keys);
  return arr.length > 0 ? arr : ['moy'];
});

// Set default key when availableKeys changes
watch(availableKeys, (newKeys) => {
  if (newKeys.length > 0 && !selectedKey.value) {
    selectedKey.value = newKeys[0];
  }
});

const exportChart = (chartType) => {
  let chartInstance = null;
  let fileName = "";
  switch(chartType) {
    case 'trimestre': chartInstance = trimestreChartInstance; fileName = "trimestre.png"; break;
    case 'performance': chartInstance = performanceChartInstance; fileName = "performance.png"; break;
    case 'comparison': chartInstance = comparisonChartInstance; fileName = "comparison.png"; break;
  }
  if (chartInstance) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = chartInstance.toBase64Image();
    link.click();
    toast.success(`Exporté: ${fileName}`);
  }
};

const exportAllCharts = () => {
  exportChart('trimestre');
  setTimeout(() => exportChart('performance'), 200);
  setTimeout(() => exportChart('comparison'), 400);
};

const generateExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Suivi Indicateurs");

    // Headers
    worksheet.columns = [
      { header: "Indicateur", key: "indicateur", width: 40 },
      { header: "Trimestre", key: "trimestre", width: 10 },
      { header: "Année", key: "annee", width: 10 },
      { header: "Cible", key: "cible", width: 15 },
      { header: "Réalisé", key: "realise", width: 15 },
      { header: "Taux (%)", key: "taux", width: 15 },
      { header: "Auteur", key: "auteur", width: 20 },
      { header: "Date Suivi", key: "date", width: 15 },
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add rows
    filteredData.value.forEach(suivi => {
      const ind = suivi.indicateur;
      const key = selectedKey.value;
      
      let cible = "";
      if (suivi.valeurCible?.valeurCible) {
         cible = suivi.valeurCible.valeurCible[key] || "";
      }
      
      let realise = "";
      if (suivi.valeurRealise) {
         realise = suivi.valeurRealise[key] || "";
      }
      
      let taux = "";
      if (ind?.taux_realisation) {
         taux = ind.taux_realisation[key] || "";
      }

      const row = worksheet.addRow({
        indicateur: ind?.nom || "",
        trimestre: suivi.trimestre || "",
        annee: suivi.dateSuivie ? new Date(suivi.dateSuivie).getFullYear() : "",
        cible: cible,
        realise: realise,
        taux: taux,
        auteur: suivi.auteur?.nom || "",
        date: suivi.dateSuivie || ""
      });

      // Apply color to Taux column (index 6)
      if (taux !== "") {
        const tauxValue = parseFloat(taux);
        // Assuming taux is 0-100, convert to 0-1 for getColorForExcel
        const color = getColorForExcel(tauxValue / 100);
        
        row.getCell(6).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color },
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Suivi_Indicateurs_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success("Fichier Excel généré avec succès");
  } catch (error) {
    console.error("Erreur export Excel:", error);
    toast.error("Erreur lors de la génération du fichier Excel");
  }
};

const updateAllCharts = () => {
  setTimeout(() => {
    renderTrimestreChart();
    renderPerformanceChart();
    renderComparisonChart(true);
  }, 100);
};

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const goToPage = (page) => { currentPage.value = page; };

const getcurrentUser = async () => {
  isLoadingDataCadre.value = true;
  try {
    const result = await AuthService.getCurrentUser();
    debutProgramme.value = result.data.data.programme.debut;
    finProgramme.value = result.data.data.programme.fin;
  } catch (e) {
    toast.error("Erreur utilisateur.");
  }
};

const getDatasCadre = async () => {
  try {
    const { data } = await IndicateursService.getAllSuivis();
    suivis.value = data.data;
    // Set default key if not set
    if (!selectedKey.value && availableKeys.value.length > 0) {
      selectedKey.value = availableKeys.value[0];
    }
  } catch (e) {
    toast.error("Erreur données.");
  } finally {
    isLoadingDataCadre.value = false;
  }
};

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  if (!isNaN(anneeDebut) && !isNaN(anneeFin)) {
    for (let annee = anneeDebut; annee <= anneeFin; annee++) annees.push(annee);
  }
  return annees;
});

const totalPages = computed(() => {
  if (hasActiveFilters.value) return 1;
  return Math.ceil(suivis.value ? suivis.value.length / itemsPerPage : 0);
});

const totalSuivis = computed(() => suivis.value.length);

const averagePerformance = computed(() => {
  if (suivis.value.length === 0) return 0;
  const rates = suivis.value.map(suivi => {
    const taux = suivi.indicateur?.taux_realisation?.[selectedKey.value];
    return taux ? parseFloat(taux) : 0;
  }).filter(r => !isNaN(r));
  if (rates.length === 0) return 0;
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
});

const indicateursActifs = computed(() => new Set(suivis.value.map(s => s.indicateur?.id)).size);

const suivisRecentCount = computed(() => {
  const now = new Date();
  return suivis.value.filter(s => {
    if (!s.dateSuivie) return false;
    const d = new Date(s.dateSuivie);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
});

const availableYears = computed(() => {
  const years = new Set();
  suivis.value.forEach(s => {
    if (s.dateSuivie) years.add(new Date(s.dateSuivie).getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
});

const availableIndicateurs = computed(() => {
  const map = new Map();
  suivis.value.forEach(s => {
    if (s.indicateur?.id) map.set(s.indicateur.id, s.indicateur);
  });
  return Array.from(map.values()).sort((a, b) => a.nom.localeCompare(b.nom));
});

const filteredData = computed(() => {
  let res = suivis.value;
  if (search.value) {
    const term = search.value.toLowerCase();
    res = res.filter(s => s.indicateur?.nom.toLowerCase().includes(term) || s.auteur?.nom.toLowerCase().includes(term));
  }
  if (selectedTrimestre.value) res = res.filter(s => s.trimestre === parseInt(selectedTrimestre.value));
  if (selectedYear.value) res = res.filter(s => s.dateSuivie && new Date(s.dateSuivie).getFullYear() === parseInt(selectedYear.value));
  if (selectedIndicateur.value) res = res.filter(s => s.indicateur?.id === parseInt(selectedIndicateur.value));
  
  if (hasActiveFilters.value) return res;
  const start = (currentPage.value - 1) * itemsPerPage;
  return res.slice(start, start + itemsPerPage);
});

const resetFilters = () => {
  search.value = ""; selectedTrimestre.value = ""; selectedYear.value = ""; selectedIndicateur.value = "";
};

const hasActiveFilters = computed(() => search.value || selectedTrimestre.value || selectedYear.value || selectedIndicateur.value);

const renderTrimestreChart = () => {
  if (!trimestreChart.value) return;
  if (trimestreChartInstance) trimestreChartInstance.destroy();
  
  const counts = {1:0, 2:0, 3:0, 4:0};
  suivis.value.forEach(s => { if(s.trimestre) counts[s.trimestre]++; });
  
  trimestreChartInstance = new Chart(trimestreChart.value.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4'],
      datasets: [{ data: Object.values(counts), backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });
};

const renderPerformanceChart = () => {
  if (!performanceChart.value) return;
  if (performanceChartInstance) performanceChartInstance.destroy();
  
  const monthly = {};
  suivis.value.forEach(s => {
    if (s.dateSuivie) {
      const d = new Date(s.dateSuivie);
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const val = parseFloat(s.indicateur?.taux_realisation?.[selectedKey.value] || 0);
      if (!monthly[k]) monthly[k] = {sum:0, count:0};
      monthly[k].sum += val; monthly[k].count++;
    }
  });
  
  const labels = Object.keys(monthly).sort();
  const data = labels.map(k => Math.round(monthly[k].sum / monthly[k].count));
  
  performanceChartInstance = new Chart(performanceChart.value.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Perf. Moyenne (${getKeyLabel(selectedKey.value)})`,
        data,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
};

const renderComparisonChart = () => {
  if (!comparisonChart.value) return;
  if (comparisonChartInstance) comparisonChartInstance.destroy();
  
  const dataPoints = [];
  const key = selectedKey.value;
  
  // Filter based on selectedIndicateur if present
  const source = selectedIndicateur.value 
    ? suivis.value.filter(s => s.indicateur?.id === parseInt(selectedIndicateur.value))
    : suivis.value;

  source.forEach(s => {
    const ind = s.indicateur;
    if (ind?.valeursCible) {
      ind.valeursCible.forEach(vc => {
        // Check if we have target and realized values for the selected key
        // Note: valeur_realiser can be an object or empty array.
        const target = parseFloat(vc.valeurCible?.[key] || 0);
        let realized = 0;
        
        // Handle valeur_realiser which might be array (empty) or object
        if (vc.valeur_realiser && !Array.isArray(vc.valeur_realiser)) {
             realized = parseFloat(vc.valeur_realiser[key] || 0);
        }
        
        if (target > 0 || realized > 0) {
           dataPoints.push({
             label: `${ind.nom.substring(0, 15)}.. [${vc.annee}]`,
             target,
             realized,
             annee: vc.annee,
             nom: ind.nom
           });
        }
      });
    }
  });
  
  // Sort
  dataPoints.sort((a, b) => a.annee - b.annee || a.nom.localeCompare(b.nom));
  
  comparisonChartInstance = new Chart(comparisonChart.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: dataPoints.map(d => d.label),
      datasets: [
        { label: 'Cible', data: dataPoints.map(d => d.target), backgroundColor: '#EF4444' },
        { label: 'Réalisé', data: dataPoints.map(d => d.realized), backgroundColor: '#10B981' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
};

const updateComparisonChart = () => renderComparisonChart();

onMounted(async () => {
  await getcurrentUser();
  await getDatasCadre();
  setTimeout(() => {
    renderTrimestreChart();
    renderPerformanceChart();
    renderComparisonChart();
  }, 500);
});

onUnmounted(() => {
  if (trimestreChartInstance) trimestreChartInstance.destroy();
  if (performanceChartInstance) performanceChartInstance.destroy();
  if (comparisonChartInstance) comparisonChartInstance.destroy();
});
</script>

<style>
.custom-scroll { scrollbar-width: thin; }
.custom-scroll::-webkit-scrollbar { height: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
</style>