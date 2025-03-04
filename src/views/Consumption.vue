<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEnergyStore } from '../stores/energy'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

const energyStore = useEnergyStore()
const selectedPeriod = ref('week')
const selectedType = ref('electricity')

// Format date
const formatDate = (dateString: string) => {
  const date = parseISO(dateString)
  return format(date, 'dd MMM', { locale: fr })
}

// Get data based on selected period
const periodData = computed(() => {
  let data
  
  if (selectedPeriod.value === 'week') {
    data = energyStore.weeklyConsumption
  } else if (selectedPeriod.value === 'month') {
    data = energyStore.monthlyConsumption
  } else {
    data = energyStore.dailyConsumption
  }
  
  return data
})

// Chart data
const chartData = computed(() => {
  const labels = periodData.value.map(item => formatDate(item.date))
  
  const datasets = []
  
  if (selectedType.value === 'all' || selectedType.value === 'electricity') {
    datasets.push({
      label: 'Électricité (kWh)',
      borderColor: '#fbbf24',
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      data: periodData.value.map(item => item.electricity),
      tension: 0.4
    })
  }
  
  if (selectedType.value === 'all' || selectedType.value === 'water') {
    datasets.push({
      label: 'Eau (L)',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      data: periodData.value.map(item => item.water),
      tension: 0.4
    })
  }
  
  if (selectedType.value === 'all' || selectedType.value === 'gas') {
    datasets.push({
      label: 'Gaz (m³)',
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      data: periodData.value.map(item => item.gas),
      tension: 0.4
    })
  }
  
  return {
    labels,
    datasets
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Get title based on selected type
const getTitle = () => {
  switch (selectedType.value) {
    case 'electricity':
      return 'Consommation d\'électricité'
    case 'water':
      return 'Consommation d\'eau'
    case 'gas':
      return 'Consommation de gaz'
    default:
      return 'Consommation énergétique'
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Suivi de consommation
        </h2>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="period" class="block text-sm font-medium text-gray-700">Période</label>
            <select id="period" v-model="selectedPeriod" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="all">Tout l'historique</option>
            </select>
          </div>
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Type d'énergie</label>
            <select id="type" v-model="selectedType" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="all">Toutes les énergies</option>
              <option value="electricity">Électricité</option>
              <option value="water">Eau</option>
              <option value="gas">Gaz</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ getTitle() }}</h3>
        <div class="mt-4 h-96">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Data table -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Données détaillées</h3>
        <div class="mt-4 flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Électricité (kWh)
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eau (L)
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gaz (m³)
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in periodData" :key="index">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(item.date) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ item.electricity }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ item.water }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ item.gas }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>