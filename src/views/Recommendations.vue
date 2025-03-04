<script setup lang="ts">
import { ref } from 'vue'
import { useEnergyStore } from '../stores/energy'

const energyStore = useEnergyStore()
const selectedType = ref('all')

// Filter recommendations by type
const filteredRecommendations = computed(() => {
  if (selectedType.value === 'all') {
    return energyStore.recommendations
  } else {
    return energyStore.recommendations.filter(rec => rec.type === selectedType.value)
  }
})

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

// Calculate total potential savings
const totalPotentialSavings = computed(() => {
  return filteredRecommendations.value.reduce((total, rec) => total + rec.potentialSavings, 0)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Recommandations personnalisées
        </h2>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Filtrer par type</label>
          <select id="type" v-model="selectedType" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            <option value="all">Toutes les recommandations</option>
            <option value="electricity">Électricité</option>
            <option value="water">Eau</option>
            <option value="gas">Gaz</option>
            <option value="general">Général</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Potential savings -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Économies potentielles</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>En suivant toutes ces recommandations, vous pourriez économiser jusqu'à :</p>
        </div>
        <div class="mt-5">
          <div class="text-3xl font-semibold text-green-600">
            {{ formatCurrency(totalPotentialSavings) }} / an
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations list -->
    <div class="mt-8 space-y-6">
      <div v-for="recommendation in filteredRecommendations" :key="recommendation.id" class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <span v-if="recommendation.type === 'electricity'" class="inline-flex items-center justify-center h-12 w-12 rounded-md bg-energy-electricity text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <span v-else-if="recommendation.type === 'water'" class="inline-flex items-center justify-center h-12 w-12 rounded-md bg-energy-water text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </span>
              <span v-else-if="recommendation.type === 'gas'" class="inline-flex items-center justify-center h-12 w-12 rounded-md bg-energy-gas text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </span>
              <span v-else class="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div class="ml-4">
              <h4 class="text-lg font-medium text-gray-900">{{ recommendation.title }}</h4>
              <p class="mt-2 text-base text-gray-500">{{ recommendation.description }}</p>
              <div class="mt-3 flex items-center">
                <span class="text-sm font-medium text-green-600">Économies potentielles : {{ formatCurrency(recommendation.potentialSavings) }} / an</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- General tips -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Conseils généraux pour économiser l'énergie</h3>
        <div class="mt-4 text-sm text-gray-500">
          <div class="space-y-4">
            <div>
              <h4 class="text-base font-medium text-gray-700">Électricité</h4>
              <ul class="mt-2 list-disc pl-5 space-y-1">
                <li>Éteignez les lumières lorsque vous quittez une pièce</li>
                <li>Débranchez les appareils électroniques lorsqu'ils ne sont pas utilisés</li>
                <li>Utilisez des multiprises avec interrupteur pour éviter la consommation en veille</li>
                <li>Privilégiez les programmes éco de vos appareils électroménagers</li>
                <li>Remplacez vos anciens appareils par des modèles plus économes en énergie</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-base font-medium text-gray-700">Eau</h4>
              <ul class="mt-2 list-disc pl-5 space-y-1">
                <li>Prenez des douches plutôt que des bains</li>
                <li>Fermez le robinet pendant le brossage des dents</li>
                <li>Réparez rapidement les fuites d'eau</li>
                <li>Récupérez l'eau de pluie pour arroser vos plantes</li>
                <li>Faites tourner votre lave-linge et lave-vaisselle uniquement lorsqu'ils sont pleins</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-base font-medium text-gray-700">Chauffage</h4>
              <ul class="mt-2 list-disc pl-5 space-y-1">
                <li>Maintenez une température de 19°C dans les pièces à vivre</li>
                <li>Baissez le chauffage à 16-17°C la nuit et en votre absence</li>
                <li>Fermez les volets et les rideaux la nuit pour conserver la chaleur</li>
                <li>Évitez de placer des meubles devant les radiateurs</li>
                <li>Entretenez régulièrement votre système de chauffage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>