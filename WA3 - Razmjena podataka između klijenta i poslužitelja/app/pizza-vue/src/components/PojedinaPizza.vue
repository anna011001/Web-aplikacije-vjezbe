<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { addIcons } from 'oh-vue-icons'
import {
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  CoHotjar,
  GiMilkCarton,
  GiBellPepper,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  GiHamShank,
} from 'oh-vue-icons/icons'
// registracija ikona koje ćemo koristiti
addIcons(
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  GiBellPepper,
  GiHamShank,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  CoHotjar,
  GiMilkCarton,
)
const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton',
}

const route = useRoute()
const pizza = ref(null)
const naziv = ref(route.params.naziv)

async function fetchPizza(name) {
  try {
    const res = await axios.get(`http://localhost:3000/pizze/${encodeURIComponent(name)}`)
    pizza.value = res.data
  } catch (e) {
    console.error('Greška pri dohvaćanju detalja pizze:', e)
  }
}

onMounted(() => {
  fetchPizza(naziv.value)
})

watch(
  () => route.params.naziv,
  (newNaziv) => {
    naziv.value = newNaziv
    fetchPizza(newNaziv)
  },
)
</script>

<template>
  <div class="p-8 max-w-3xl mx-auto">
    <button @click="$router.push('/')"
      class="mb-6 px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition">
      ← Natrag
    </button>

    <div v-if="pizza" class="bg-white rounded-xl shadow p-6">
      <h1 class="text-2xl font-bold text-orange-500 mb-4">{{ pizza.naziv }}</h1>
      <img :src="pizza.slika_url" alt="pizza slika" class="w-full h-64 object-cover rounded-lg mb-4" />

      <h2 class="text-xl font-semibold mr-2 inline text-orange-500">Sastojci:</h2>
      <div class="inline-flex gap-x-2 mb-4">
        <div v-for="sastojak in pizza.sastojci" :key="sastojak"
          class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">
          <v-icon :name="ikoneSastojaka[sastojak]" />
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Mala</span><span>€{{ pizza.cijene.mala }}</span>
        </div>
        <div class="flex justify-between">
          <span>Srednja</span><span>€{{ pizza.cijene.srednja }}</span>
        </div>
        <div class="flex justify-between">
          <span>Jumbo</span><span>€{{ pizza.cijene.jumbo }}</span>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-10">Učitavanje...</div>
  </div>
</template>
