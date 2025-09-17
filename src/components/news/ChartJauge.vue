<template>
  <div id="gauge">
    <div id="major-ticks">
      <span>0</span>
      <span>50</span>
      <span>100</span>
    </div>
    <div id="minor-ticks">
      <span v-for="i in 20" :key="i" :style="{ '--i': i }"></span>
    </div>
    <div id="minor-ticks-bottom-mask"></div>
    <div id="bottom-circle"></div>
    <svg version="1.1" baseProfile="full" width="190" height="190" xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#064e3b" />
      </linearGradient>
      <path 
        ref="arc" 
        d="M5 95 A80 80 0 0 1 185 95" 
        stroke="url(#gradient)" 
        fill="none" 
        stroke-width="10" 
        stroke-linecap="round" 
        :style="{ strokeDasharray: `${strokeDashValue} ${arcLength - strokeDashValue}` }" 
      />
    </svg>
    <div id="center-circle">
      <span id="name">{{ label }}</span>
      <span id="temperature">{{ displayValue }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from "vue";

// Props pour la valeur de température et le label
const props = defineProps({
  temperature: {
    type: [Number, String],
    required: true,
  },
  label: {
    type: String,
    default: ''
  },
});

// Références pour l'arc SVG
const arc = ref(null);
const arcLength = ref(0);

// Extraire la valeur numérique de la température
const numericValue = computed(() => {
  if (typeof props.temperature === 'number') {
    return props.temperature;
  }
  
  // Si c'est une string, extraire le nombre
  const match = String(props.temperature).match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
});

// Valeur d'affichage (garde le format original)
const displayValue = computed(() => {
  return props.temperature;
});

// Calculer la valeur du stroke dash basée sur la température
const strokeDashValue = computed(() => {
  if (arcLength.value === 0) return 0;
  
  const value = Math.min(Math.max(numericValue.value, 0), 100); // Limiter entre 0 et 100
  const step = arcLength.value / 100;
  return value * step;
});

// Initialiser la longueur de l'arc quand le composant est monté
onMounted(async () => {
  await nextTick(); // Attendre que le DOM soit rendu
  if (arc.value) {
    arcLength.value = arc.value.getTotalLength();
  }
});
</script>

<style scoped>
#gauge {
  position: relative;
  width: 300px;
  height: 300px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#major-ticks {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 5px;
}

#major-ticks span {
  position: absolute;
  font-size: 0.7em;
  color: #afafaf;
  font-weight: 600;
}

#major-ticks span:nth-child(1) {
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
}

#major-ticks span:nth-child(2) {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
}

#major-ticks span:nth-child(3) {
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
}

#minor-ticks {
  position: absolute;
  width: 80%;
  height: 80%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

#minor-ticks span {
  position: absolute;
  width: 100%;
  height: 1px;
  border-top: 1px solid #afafaf;
  transform: rotate(calc((var(--i) - 1) * 9deg));
  transform-origin: center;
}

#minor-ticks::after {
  content: "";
  position: absolute;
  width: 93%;
  height: 93%;
  background: #fff;
  border-radius: 50%;
}

#minor-ticks-bottom-mask {
  position: absolute;
  width: 80%;
  height: 49%;
  bottom: 0;
  background: #fff;
}

#bottom-circle {
  position: absolute;
  width: 70%;
  height: 70%;
  background: linear-gradient(#efefef, #ffffff);
  border-radius: 50%;
  box-shadow: inset 0 5px 5px #e7e7e7;
}

svg {
  position: absolute;
}

svg path {
  transition: stroke-dasharray 1s ease-in-out;
}

#center-circle {
  position: absolute;
  width: 170px;
  height: 170px;
  background: linear-gradient(180deg, #ffffff 0%, #e7ecf1 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

#center-circle::before {
  content: "";
  position: absolute;
  width: 145px;
  height: 145px;
  background: linear-gradient(0deg, #ffffff 0%, #e7ecf1 100%);
  border-radius: 50%;
  z-index: -1;
}

#name {
  font-size: 1em;
  color: #7f7f7f;
  font-weight: 700;
  margin-bottom: 10px;
}

#temperature {
  font-size: 2.5em;
  color: #afafaf;
  font-weight: bold;
}
</style>