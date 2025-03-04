<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEnergyStore } from '../stores/energy'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const energyStore = useEnergyStore()

// Computed properties
const unreadAlerts = computed(() => {
  return energyStore.alerts.filter(alert => !alert.read).length
})

const dailyData = computed(() => {
  return {
    labels: ['Électricité (kWh)', 'Eau (L)', 'Gaz (m³)'],
    datasets: [
      {
        label: 'Votre consommation',
        backgroundColor: ['#fbbf24', '#3b82f6', '#ef4444'],
        data: [
          energyStore.totals.daily.electricity,
          energyStore.totals.daily.water / 10, // Scaled for better visualization
          energyStore.totals.daily.gas * 10 // Scaled for better visualization
        ]
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

// Mark all alerts as read
const markAllAlertsAsRead = () => {
  energyStore.alerts.forEach(alert => {
    if (!alert.read) {
      energyStore.markAlertAsRead(alert.id)
    }
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Tableau de bord
        </h2>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Electricity card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-energy-electricity rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Électricité
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ Math.round(energyStore.totals.daily.electricity * 10) / 10 }} kWh/jour
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <span class="font-medium text-primary-600 hover:text-primary-500">
              {{ energyStore.totals.weekly.electricity }} kWh cette semaine
            </span>
          </div>
        </div>
      </div>

      <!-- Water card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-energy-water rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Eau
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ Math.round(energyStore.totals.daily.water) }} L/jour
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <span class="font-medium text-primary-600 hover:text-primary-500">
              {{ energyStore.totals.weekly.water }} L cette semaine
            </span>
          </div>
        </div>
      </div>

      <!-- Gas card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-energy-gas rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Gaz
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ Math.round(energyStore.totals.daily.gas * 10) / 10 }} m³/jour
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <span class="font-medium text-primary-600 hover:text-primary-500">
              {{ energyStore.totals.weekly.gas }} m³ cette semaine
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart and alerts section -->
    <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <!-- Chart -->
      <div class="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Consommation quotidienne</h3>
          <div class="mt-4 h-64">
            <Bar :data="dailyData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Alertes</h3>
          <span v-if="unreadAlerts > 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {{ unreadAlerts }} nouvelle{{ unreadAlerts > 1 ? 's' : '' }}
          </span>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6 max-h-64 overflow-y-auto">
          <div v-if="energyStore.alerts.length === 0" class="text-center text-gray-500">
            Aucune alerte pour le moment
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="alert in energyStore.alerts" :key="alert.id" class="py-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <span v-if="alert.type === 'electricity'" class="h-6 w-6 text-energy-electricity">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  <span v-else-if="alert.type === 'water'" class="h-6 w-6 text-energy-water">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </span>
                  <span v-else class="h-6 w-6 text-energy-gas">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  </span>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm text-gray-700">
                    {{ alert.message }}
                    <span v-if="!alert.read" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Nouveau
                    </span>
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ alert.date }}
                  </p>
                </div>
                <button v-if="!alert.read" @click="energyStore.markAlertAsRead(alert.id)" class="ml-2 text-gray-400 hover:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
          <button @click="markAllAlertsAsRead" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            Marquer toutes comme lues
          </button>
        </div>
      </div>
    </div>

    <!-- Estimated bill -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Estimation de votre facture mensuelle</h3>
        <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Électricité
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-energy-electricity">
                  {{ formatCurrency(energyStore.estimatedBill.electricity) }}
                </dd>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Eau
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-energy-water">
                  {{ formatCurrency(energyStore.estimatedBill.water) }}
                </dd>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Gaz
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-energy-gas">
                  {{ formatCurrency(energyStore.estimatedBill.gas) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="mt-5 bg-gray-50 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total estimé
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatCurrency(energyStore.estimatedBill.total) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>