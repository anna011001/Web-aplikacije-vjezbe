<script setup>
// Logika komponente (JS/TS)
// app/pizza-vue/src/components/PizzaList.vue
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'
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
  FaSearch,
  GiHamShank,
  MdKeyboardarrowupRound,
  MdKeyboardarrowdownRound
} from 'oh-vue-icons/icons'
import OrderFooter from './OrderFooter.vue'
import DualSlider from './DualSlider.vue'
const pizze = ref(null)
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
  FaSearch,
  CoHotjar,
  GiMilkCarton,
  MdKeyboardarrowupRound,
  MdKeyboardarrowdownRound
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

// u ovom slučaju onMounted ne treba biti async zato što ne koristimo await direktno unutar njega
onMounted(() => {
  fetchPizze() // pozivanje funkcije za dohvaćanje podataka o pizzama
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      odabrana_pizza.value = null // poništavamo odabir pizze
    }
  })
})

const odabrana_pizza = ref(null) // reaktivna varijabla za pohranu naziva odabrane pizze

function odaberiPizzu(pizza) {
  odabrana_pizza.value = pizza // pohranjujemo cijeli objekt pizze
  console.log('Odabrana pizza:', pizza)
}

const naziv = ref("");
const sort = ref("asc");
const minValue = ref(0);
const maxValue = ref(30);

async function fetchPizze() {
  try {
    const params = new URLSearchParams([["naziv", naziv.value], ["sort", sort.value], ["cijena_min", minValue.value], ["cijena_max", maxValue.value]]).toString()

    const response = await axios.get(`http://localhost:3000/pizze?${params}`)
    // dodajemo await kako bi sačekali odgovor asiknrone funkcije
    pizze.value = response.data // pohrana podataka o pizzama u reaktivnu varijablu
    console.log(pizze.value) // ispisuje podatke o pizzama nakon dohvaćanja HTTP odgovora
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka o pizzama:', error)
  }
}
</script>

<template>
  <!-- HTML struktura komponente -->
  <div class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">

    <div class="flex justify-center items-center gap-6">
      <div class="relative mb-3">
        <v-icon name="fa-search" scale="1.25" @click="fetchPizze"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input v-model="naziv" class="border border-gray-400 rounded-xl pl-2 pr-10 py-2" type="text"
          placeholder="Traži..." aria-label="Pretraži" @keyup.enter="fetchPizze"/>
      </div>

      <div class="w-1/10">
        <DualSlider :min="0" :max="30" @update:min-value="(value) => minValue = value"
          @update:max-value="(value) => maxValue = value"></DualSlider>
      </div>

      <div class="-translate-y-2">
        <v-icon scale="2" name="md-keyboardarrowup-round" @click="sort = 'asc'"
          :color="sort == 'asc' ? 'var(--color-orange-500)' : undefined" />
        <v-icon scale="2" name="md-keyboardarrowdown-round" @click="sort = 'desc'"
          :color="sort == 'desc' ? 'var(--color-orange-500)' : undefined" />
      </div>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Pizza 1 -->
      <!-- <div @click="odaberiPizzu(pizza.value)"> -->
      <div v-for="pizza in pizze" :key="pizza.id" @click="odaberiPizzu(pizza)" :class="[
        'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
        odabrana_pizza?.naziv === pizza.naziv
          ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
          : 'hover:scale-[1.01]',
      ]">
        <div class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl">
          <img :src="pizza.slika_url" alt="pizza.naziv" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>

            <div class="flex space-x-2">
              <div v-for="sastojak in pizza.sastojci" :key="sastojak"
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">
                <v-icon :name="ikoneSastojaka[sastojak]" />
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Mala</span>
              <span>€{{ pizza.cijene.mala }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Srednja</span>
              <span>€{{ pizza.cijene.srednja }}</span>
            </div>

            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Jumbo</span>
              <span>€{{ pizza.cijene.jumbo }}</span>
            </div>
          </div>

          <RouterLink class="mt-3 rounded-lg underline text-white bg-orange-500 p-1 ml-auto"
            :to="`/pizze/${pizza.naziv}`">Više</RouterLink>

        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
  <OrderFooter v-if="odabrana_pizza" :odabrana-pizza="odabrana_pizza" @close="odabrana_pizza = null" />
  <!-- ako je odabrana pizza, prikaži OrderFooter komponentu i proslijedit taj objekt -->
</template>
