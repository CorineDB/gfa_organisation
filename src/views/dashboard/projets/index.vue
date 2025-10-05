<template>
  <div class="flex flex-col items-center mt-8 mb-4 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Dashboard projet : {{ currentUser.projet?.nom }}</h2>
  </div>

  <div class="grid grid-cols-1 gap-6 my-6 md:grid-cols-2 lg:grid-cols-3">
    <div href="#" class="relative shadow-2xl box group _bg-white zoom-in border-l-4 border-primary hover:border-secondary transition-all duration-500">
      <div class="relative m-5 bg-white">
        <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">{{ projet.codePta }} - {{ projet.nom }}</div>
      </div>

      <div class="relative mt-[12px] m-5 h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
        <div class="absolute top-0 left-0 w-1/2 h-0 group-hover:h-full bg-[#02008052] transition-all duration-[.5s]"></div>
        <div class="absolute bottom-0 right-0 w-1/2 h-0 group-hover:h-full bg-[#02008052] transition-all duration-[.5s]"></div>

        <div class="relative h-64 overflow-hidden group/hw hway hway-active">
          <!-- <img class="object-contain group-hover:opacity-30 transition-all duration-[.5s] h-auto" :src="projetsImg[index]" alt="" /> -->
          <!-- Description cachée avec effet de survol -->
          <div class="absolute inset-0 flex items-start justify-center p-5 text-white transition-opacity duration-500 bg-black opacity-0 bg-opacity-80 group-hover:opacity-100">
            <div>
              <p class="text-base font-bold lg:text-lg">Description du projet</p>
              <p class="px-2 text-sm lg:text-base line-clamp-7">{{ projet.description }} {{ key }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="m-5 text-slate-600 dark:text-slate-500">
        <div class="flex items-center">
          <LinkIcon class="w-4 h-4 mr-2" /> Fond propre: {{ $h.formatCurrency(projet.budgetNational) }}
          <div class="italic font-bold ml-2">Fcfa</div>
        </div>
        <div class="flex items-center">
          <LinkIcon class="w-4 h-4 mr-2" /> Montant financier: {{ $h.formatCurrency(projet.pret) }}
          <div class="italic font-bold ml-2">Fcfa</div>
        </div>
        <div v-if="projet.owner !== null" class="flex items-center">
          <GlobeIcon class="w-4 h-4 mr-2" /> Organisation:
          <span class="pl-2 shadow-md p-1 rounded-md bg-green-400 text-white">{{ projet?.owner?.user?.nom }}</span>
        </div>
        <div class="flex items-center mt-2">
          <ClockIcon class="w-4 h-4 mr-2" />
          <div>
            Date : Du <span class="pr-1 font-bold"> {{ projet.debut ? $h.reformatDate(projet.debut) : "non defini" }}</span> au <span class="font-bold"> {{ projet.fin ? $h.reformatDate(projet.fin) : "non defini" }}</span>
          </div>
        </div>
        <div class="flex items-center mt-2">
          <CheckSquareIcon class="w-4 h-4 mr-2" /> Statut :
          <span class="pl-2 shadow-md p-1 rounded-md bg-black text-white" v-if="projet.statut == -2"> Non validé </span>
          <span class="pl-2 shadow-md p-1 rounded-md bg-green-500 text-white" v-else-if="projet.statut == -1"> Validé </span>
          <span class="pl-1 shadow-md p-1 rounded-md bg-yellow-500 text-white" v-else-if="projet.statut == 0"> En cours </span>
          <span class="pl-1 shadow-md p-1 rounded-md bg-red-500 text-white" v-else-if="projet.statut == 1"> En retard </span>
          <span class="pl-2" v-else-if="projet.statut == 2">Terminé</span>
        </div>

        <!-- Budget restant -->
        <div class="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 class="text-xs font-semibold text-gray-700 mb-2">Budget disponible</h4>
          <div class="grid grid-cols-2 gap-2">
            <div class="text-center">
              <p class="text-xs text-gray-500">Fond propre restant</p>
              <p class="text-sm font-bold" :class="getFondRestant(projet) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ getFondRestant(projet) === 0 ? '0' : $h.formatCurrency(getFondRestant(projet)) }} FCFA
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500">Subvention restante</p>
              <p class="text-sm font-bold" :class="getSubventionRestant(projet) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ getSubventionRestant(projet) === 0 ? '0' : $h.formatCurrency(getSubventionRestant(projet)) }} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
        <a class="flex items-center mr-auto text-primary" href="javascript:;" v-if="verifyPermission('voir-details-projet')" @click="goToDetail(projet)"> <EyeIcon class="w-4 h-4 mr-1" /> Détail </a>
        <a class="flex items-center mr-3" href="javascript:;" v-if="verifyPermission('modifier-un-projet')" @click="modifierProjet(projet)"> <CheckSquareIcon class="w-4 h-4 mr-1" /> Modifier </a>
        <a class="flex items-center text-danger" href="javascript:;" v-if="verifyPermission('supprimer-un-projet')" @click="supprimerProjet(projet)"> <Trash2Icon class="w-4 h-4 mr-1" /> Supprimer </a>
      </div>

      <div class="absolute bottom-0 flex w-full">
        <div class="w-1/3 p-1 bg-green-500"></div>
        <div class="flex flex-col w-2/3">
          <div class="p-0.5 bg-yellow-500"></div>
          <div class="p-0.5 bg-red-500"></div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <!-- <h3>An interactive leaflet map</h3> -->
    <div id="map" style="height: 40vh"></div>
  </div>
</template>

<script>
import ProjetService from "@/services/modules/projet.service.js";
import BailleurService from "@/services/modules/bailleur.service";
import { mapGetters, mapActions, mapState } from "vuex";
import { API_BASE_URL } from "@/services/configs/environment.js";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import { helper as $h } from "@/utils/helper";
import { toast } from "vue3-toastify";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { LMap, LTileLayer, LMarker, LPolygon, LPopup } from "@vue-leaflet/vue-leaflet";
import verifyPermission from "@/utils/verifyPermission";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { addressPoints } from "./markerDemo";
import icon from "./icon.png";
import markerShadow from "./marker-shadow.png";

export default {
  components: { InputForm, VButton, LMap, LTileLayer, LMarker, LPolygon, LPopup },
  data() {
    return {
      initialMap: null,
      myIcon: null,
      showModal: false,
      isUpdate: false,
      programmeId: this.currentUser?.programme?.id,
      projetId: this.currentUser?.projet?.id,
      title: "",
      search: "",
      projet: {},
      projets: [],

      isLoading: false,
      selectedFile: null,
      imagePreview: null,
      sites: [],
    };
  },

  computed: {
    
    ...mapGetters({
      // projet: "getProjet",
      currentUser: "auths/GET_AUTHENTICATE_USER",
    }),
  },

  methods: {
    goToDetail(projet) {
      console.log(projet);
      this.$router.push({ name: "projets_id_details", params: { id: projet.id, projet: projet } });
    },

    getFondRestant(projet) {
      let totalFondUtilise = 0;
      if (projet.composantes && projet.composantes.length > 0) {
        projet.composantes.forEach((item) => {
          totalFondUtilise += item.budgetNational ? item.budgetNational : 0;
        });
      }
      return (projet.budgetNational || 0) - totalFondUtilise;
    },

    getSubventionRestant(projet) {
      let totalSubventionUtilise = 0;
      if (projet.composantes && projet.composantes.length > 0) {
        projet.composantes.forEach((item) => {
          totalSubventionUtilise += item.pret ? item.pret : 0;
        });
      }
      return (projet.pret || 0) - totalSubventionUtilise;
    },

    verifyPermission, // Étape 1 : Préparation des données - transformer sites en coordonnées
    prepareCoordinatesData() {
      if (!this.sites || !Array.isArray(this.sites)) {
        return [];
      }

      return this.sites.map((site) => ({
        lat: parseFloat(site.latitude),
        lng: parseFloat(site.longitude),
        label: `${site.nom}<br>Quartier: ${site.quartier}<br>Commune: ${site.commune}`,
      }));
    },
     detailProjet(){
      ProjetService.getDetailProjet(this.projetId)
      .then((response) => {
        this.projet = response.data.data;
        this.sites = this.projet.sites || [];
        // Initialiser la carte après avoir récupéré les sites
        this.$nextTick(() => {
          this.initMap();
        });
      }).catch((error) => {
        console.error("Erreur lors de la récupération des détails du projet:", error);
        toast.error("Erreur lors de la récupération des détails du projet.");
      });
    },

    initMap() {
      if (this.sites && this.sites.length > 0) {
        // Configurer l'icône
        this.myIcon = L.icon({
          iconUrl: icon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Calculer les bounds pour tous les sites
        const bounds = [];
        this.sites.forEach(site => {
          const lat = parseFloat(site.latitude);
          const lng = parseFloat(site.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.push([lat, lng]);
          }
        });

        // Centre par défaut (Bénin)
        const centerLat = bounds.length > 0 ? bounds[0][0] : 6.8041;
        const centerLng = bounds.length > 0 ? bounds[0][1] : 2.4152;

        // Initialiser la carte
        this.initialMap = L.map("map", {
          zoomControl: true,
          zoom: 8,
          zoomAnimation: false,
          fadeAnimation: true,
          markerZoomAnimation: true,
        }).setView([centerLat, centerLng], 8);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.initialMap);

        // Créer un groupe de marqueurs avec MarkerCluster
        const markers = L.markerClusterGroup();

        // Parcourir tous les sites et ajouter les marqueurs au cluster
        this.sites.forEach(site => {
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

            const marker = L.marker([lat, lng], { icon: this.myIcon })
              .bindPopup(popupContent);

            markers.addLayer(marker);
          }
        });

        // Ajouter le groupe de marqueurs à la carte
        this.initialMap.addLayer(markers);

        // Ajuster la vue pour afficher tous les marqueurs
        if (bounds.length > 1) {
          this.initialMap.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }

  },
  mounted() {
    // La carte sera initialisée après le chargement des données
  },
  created() {
    if (this.currentUser) {
      this.programmeId = this.currentUser.programme.id;
      this.projetId = this.currentUser.projet?.id;
      this.detailProjet();
    }
  },
};
</script>

<style scoped>
.icon-bold {
  font-weight: 800;
}
.dropdown-content {
  transform: translate(200px, 200px);
}
.custom_height {
  height: 288px;
}

.block_img {
  height: 208px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
