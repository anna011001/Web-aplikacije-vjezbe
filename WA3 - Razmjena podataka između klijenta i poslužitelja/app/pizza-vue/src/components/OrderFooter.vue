<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const prezime = ref('');
const adresa = ref('');
const telefon = ref('');

const props = defineProps({
  odabranaPizza: {
    type: Object,
    required: true,
    slika_url: String
  }
});

const narucene_pizze = ref([]);

const odabranaVelicina = ref('mala');
const kolicina = ref(1);

const status_narudzbe = ref();

const ukupna_cijena_stavke = computed(() => {
  const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value];
  return (cijenaPoKomadu * kolicina.value).toFixed(2);
});

function dodajUNarudzbu() {
  const novaStavka = {
    naziv: props.odabranaPizza.naziv,
    velicina: odabranaVelicina.value,
    kolicina: kolicina.value
  };
  narucene_pizze.value.push(novaStavka);
  console.log('Naručene pizze:', narucene_pizze.value);
}

function ukloni_stavku(index) {
  if (--narucene_pizze.value[index].kolicina <= 0) {
    narucene_pizze.value.splice(index, 1);
  }
}

async function posaljiNarudzbu() {
  if (narucene_pizze.value.length === 0) {
    alert('Košarica je prazna! Molimo dodajte pizze prije narudžbe.');
    return;
  }

  if (!prezime.value.trim()) {
    alert('Prezime mora biti uneseno.');
    return;
  }
  if (!adresa.value.trim() || !/\d/.test(adresa.value)) {
    alert('Adresa mora sadržavati i ulicu i broj.');
    return;
  }
  if (!telefon.value.trim() || !/^\d+$/.test(telefon.value) || telefon.value.length !== 10) {
    alert('Telefon mora sadržavati točno 10 znamenki.');
    return;
  }

  const podaciZaDostavu = {
    prezime: prezime.value,
    adresa: adresa.value,
    telefon: telefon.value
  };

  try {
    const odgovor = await axios.post('http://localhost:3000/narudzbe', {
      narucene_pizze: narucene_pizze.value,
      podaci_dostava: podaciZaDostavu
    });
    console.log('Narudžba uspješno poslana:', odgovor.data);
    status_narudzbe.value = 'Hvala! Vaša narudžba je uspješno poslana.';
    narucene_pizze.value = [];
  } catch (error) {
    let error_msg = "";
    if (error.response.data) {
        error_msg = ` Povratna poruka: ${error.response.data}`;
    }
    console.error('Greška pri slanju narudžbe:', error);
    narucene_pizze.value = 'Došlo je do greške pri slanju narudžbe. Molimo pokušajte ponovno.' + error_msg;
  }
}

const emit = defineEmits(['close']);
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-slate-700 backdrop-blur-sm border-t border-slate-600 shadow-xl p-4 sm:p-6 text-white">
    <button class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer" @click="emit('close')">×</button>
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

      <!-- Pizza info -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <img :src="props.odabranaPizza.slika_url" alt="slika pizze" class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40" />
        <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">{{ props.odabranaPizza.naziv }}</h3>
      </div>

      <!-- Form fields -->
      <div class="flex flex-col gap-2 w-full sm:w-auto">
        <label>
          Prezime:
          <input v-model="prezime" class="ml-2 px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base" />
        </label>
        <label>
          Adresa:
          <input v-model="adresa" class="ml-2 px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base" />
        </label>
        <label>
          Telefon:
          <input v-model="telefon" class="ml-2 px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base" />
        </label>
      </div>

      <!-- Size selection -->
      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <button
          v-for="(cijena, velicina) in props.odabranaPizza.cijene"
          :key="velicina"
          @click="odabranaVelicina = velicina"
          :class="['px-3 py-1 rounded-lg border text-sm sm:text-base hover:bg-orange-500 hover:text-white transition cursor-pointer', odabranaVelicina === velicina ? 'bg-orange-500 text-white' : 'bg-slate-600/40 text-white']"
        >
          {{ velicina }} – {{ cijena }}€
        </button>
      </div>

      <!-- Quantity -->
      <div class="flex items-center space-x-2 w-full sm:w-auto">
        <button @click="kolicina > 1 && kolicina--" class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 cursor-pointer">-</button>
        <div class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border text-sm sm:text-base">{{ kolicina }}</div>
        <button @click="kolicina++" class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 cursor-pointer">+</button>
      </div>

      <!-- Price and actions -->
      <div class="font-semibold text-lg text-orange-400 tracking-wide w-full sm:w-auto text-center">Ukupno: {{ ukupna_cijena_stavke }}€</div>
      <button @click="dodajUNarudzbu" class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 cursor-pointer w-full sm:w-auto">Dodaj u košaricu</button>
      <button @click="posaljiNarudzbu" class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 cursor-pointer w-full sm:w-auto">Naruči</button>
      <Transition 
        enter-active-class="transition-opacity duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <p v-if="status_narudzbe" class="text-white font-extralight text-center">{{ status_narudzbe }}</p>
    </Transition>
    </div>

    <!-- Cart items -->
    <div v-if="narucene_pizze.length" class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
      <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
      <ul class="space-y-2">
        <li v-for="(stavka, index) in narucene_pizze" :key="index" class="flex items-center justify-between bg-slate-700/50 rounded-md p-2">
          <div class="text-white">{{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}</div>
          <div class="flex items-center gap-2">
            <button @click="ukloni_stavku(index)">-</button>
            <span class="text-orange-400 font-semibold">{{ (props.odabranaPizza.cijene[stavka.velicina] * stavka.kolicina).toFixed(2) }}€</span>
          </div>
        </li>
      </ul>
    </div>
  </footer>
</template>
