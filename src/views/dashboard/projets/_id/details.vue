<template>
  <div class="container p-6 mx-auto">
  <!-- Titre et Sous-titre -->
  <header class="mb-8 text-center">
    <h1 class="mb-2 text-4xl font-bold">Nom du Projet</h1>
    <p class="text-lg text-gray-600">Description courte du projet</p>
  </header>

  <!-- Entreprise / Organisation -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Entreprise ou Organisation</h2>
    <p class="text-gray-700">Nom de l'entreprise responsable du projet...</p>
  </section>

  <!-- Budget -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Budget</h2>
    <p class="text-gray-700">Montant du budget alloué : <strong>$500,000</strong></p>
  </section>

  <!-- Durée du projet -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Durée du Projet</h2>
    <p class="text-gray-700">Début : 01/01/2024 - Fin : 31/12/2024</p>
  </section>

  <!-- Description du projet -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Description du Projet</h2>
    <p class="text-gray-700">
      Contexte, enjeux et objectifs globaux du projet...
    </p>
  </section>

  <!-- Indicateurs -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Indicateurs Clés</h2>
    <ul class="space-y-2 text-gray-700 list-disc list-inside">
      <li>Indicateur 1 : Augmentation de 20% des utilisateurs actifs</li>
      <li>Indicateur 2 : Taux de satisfaction client supérieur à 90%</li>
    </ul>
  </section>

  <!-- Activités -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Activités du Projet</h2>
    <ul class="space-y-2 text-gray-700 list-disc list-inside">
      <li>Développement de la plateforme</li>
      <li>Tests utilisateurs</li>
      <li>Déploiement et maintenance</li>
    </ul>
  </section>

  <!-- Objectifs -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Objectifs du Projet</h2>
    <p class="text-gray-700">
      Objectifs spécifiques à atteindre, comme l'amélioration de la performance, etc.
    </p>
  </section>

  <!-- Carte -->
  <section class="mb-8">
    <h2 class="mb-4 text-2xl font-semibold">Localisation</h2>
    <div class="aspect-w-16 aspect-h-9">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345092345!2d144.9537353158079!3d-37.8162797427091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5776e59b2da110!2sMelbourne%20Victoria%2C%20Australie!5e0!3m2!1sfr!2sfr!4v1616912117925!5m2!1sfr!2sfr" 
        width="100%" 
        height="450" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy">
      </iframe>
    </div>
  </section>

  <!-- Lien vers le site -->
  <section class="mb-8 text-center">
    <a href="https://example.com" class="px-6 py-2 text-white bg-blue-500 rounded shadow hover:bg-blue-600">
      Visiter le Site Web du Projet
    </a>
  </section>
</div>

</template>

<script>



import { mapGetters, mapActions, mapMutations, mapState} from "vuex";



import ProjetService from "@/services/modules/projet.service.js";

export default {
  components: {
   
  },
  data() {
    return {
      
    }
  },

  computed:{
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
  },

  methods: {
   
  },

  created() {
  
  },
};



</script>
<style scoped>

</style>