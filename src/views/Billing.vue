<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEnergyStore } from '../stores/energy'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const energyStore = useEnergyStore()

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

// Chart data
const chartData = computed(() => {
  return {
    labels: ['Électricité', 'Eau', 'Gaz'],
    datasets: [
      {
        backgroundColor: ['#fbbf24', '#3b82f6', '#ef4444'],
        data: [
          energyStore.estimatedBill.electricity,
          energyStore.estimatedBill.water,
          energyStore.estimatedBill.gas
        ]
      }
    ]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Mock billing history
const billingHistory = [
  {
    id: 1,
    period: 'Avril 2025',
    amount: 95.42,
    status: 'Payée',
    dueDate: '15/04/2025',
    paidDate: '12/04/2025'
  },
  {
    id: 2,
    period: 'Mars 2025',
    amount: 102.18,
    status: 'Payée',
    dueDate: '15/03/2025',
    paidDate: '14/03/2025'
  },
  {
    id: 3,
    period: 'Février 2025',
    amount: 118.75,
    status: 'Payée',
    dueDate: '15/02/2025',
    paidDate: '10/02/2025'
  },
  {
    id: 4,
    period: 'Janvier 2025',
    amount: 124.32,
    status: 'Payée',
    dueDate: '15/01/2025',
    paidDate: '13/01/2025'
  },
  {
    id: 5,
    period: 'Décembre 2024',
    amount: 115.67,
    status: 'Payée',
    dueDate: '15/12/2024',
    paidDate: '12/12/2024'
  }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Factures et paiements
        </h2>
      </div>
    </div>

    <!-- Current bill estimation -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Estimation de votre prochaine facture</h3>
        <div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total estimé pour Mai 2025
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">
                    {{ formatCurrency(energyStore.estimatedBill.total) }}
                  </dd>
                  <dd class="mt-3 text-sm text-gray-500">
                    Basé sur votre consommation actuelle. Cette estimation peut varier en fonction de votre consommation future.
                  </dd>
                </dl>
                <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Électricité
                    </dt>
                    <dd class="mt-1 text-lg font-medium text-energy-electricity">
                      {{ formatCurrency(energyStore.estimatedBill.electricity) }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Eau
                    </dt>
                    <dd class="mt-1 text-lg font-medium text-energy-water">
                      {{ formatCurrency(energyStore.estimatedBill.water) }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Gaz
                    </dt>
                    <dd class="mt-1 text-lg font-medium text-energy-gas">
                      {{ formatCurrency(energyStore.estimatedBill.gas) }}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="bg-gray-50 overflow-hidden shadow rounded-lg h-full">
              <div class="px-4 py-5 sm:p-6 flex flex-col h-full">
                <h4 class="text-sm font-medium text-gray-500 mb-4">Répartition des coûts</h4>
                <div class="flex-grow">
                  <Doughnut :data="chartData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing history -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Historique des factures</h3>
        <div class="mt-4 flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'échéance
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de paiement
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="bill in billingHistory" :key="bill.id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ bill.period }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatCurrency(bill.amount) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {{ bill.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ bill.dueDate }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ bill.paidDate }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" class="text-primary-600 hover:text-primary-900">Détails</a>
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

    <!-- Payment methods -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Moyens de paiement</h3>
        <div class="mt-4">
          <div class="bg-gray-50 p-4 rounded-lg mb-4 flex items-center">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">Carte bancaire terminant par 4242</p>
              <p class="text-sm text-gray-500">Expire le 12/26</p>
            </div>
            <div class="ml-auto">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Par défaut
              </span>
            </div>
          </div>
          <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Ajouter un moyen de paiement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>