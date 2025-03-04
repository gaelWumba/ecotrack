<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd" />
    </svg>
    {{ percentageDifference.water > 0 ? '+' : '' }}{{ percentageDifference.water }}%
    
    <!-- Gas card -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-energy-gas rounded-md p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Gaz
              </dt>
              <dd>
                <div class="text-lg font-medium text-gray-900">
                  {{ Math.round(userAverage.gas * 10) / 10 }} m³/jour
                </div>
              </dd>
            </dl>
          </div>
        </div>
        <div class="mt-5 flex items-center">
          <span class="text-sm text-gray-500">Moyenne du quartier: {{ Math.round(neighborhoodAverage.gas * 10) / 10 }}
            m³/jour</span>
          <span :class="`ml-2 inline-flex items-center text-sm ${getColorClass(percentageDifference.gas)}`">
            <svg v-if="percentageDifference.gas <= 0" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
              viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
            {{ percentageDifference.gas > 0 ? '+' : '' }}{{ percentageDifference.gas }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Tips section -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Comment se situer par rapport à la moyenne ?</h3>
        <div class="mt-4 text-sm text-gray-500">
          <p class="mb-2">Votre consommation est comparée à la moyenne des foyers similaires dans votre quartier. Cette
            comparaison vous permet de situer votre consommation énergétique et d'identifier les domaines où vous pourriez
            réaliser des économies.</p>

          <div class="mt-4">
            <h4 class="text-base font-medium text-gray-700">Comment interpréter les résultats :</h4>
            <ul class="mt-2 list-disc pl-5 space-y-1">
              <li><span class="text-green-600 font-medium">En dessous de la moyenne</span> : Félicitations ! Votre
                consommation est inférieure à celle de vos voisins.</li>
              <li><span class="text-yellow-600 font-medium">Jusqu'à 10% au-dessus</span> : Votre consommation est
                légèrement supérieure à la moyenne. Quelques ajustements mineurs pourraient vous aider à réduire votre
                consommation.</li>
              <li><span class="text-red-600 font-medium">Plus de 10% au-dessus</span> : Votre consommation est
                significativement plus élevée que la moyenne. Consultez nos recommandations pour identifier les sources
                potentielles de surconsommation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      percentageDifference: {
        water: 0,
        gas: 0
      },
      userAverage: {
        gas: 0
      },
      neighborhoodAverage: {
        gas: 0
      }
    };
  },
  methods: {
    getColorClass(value) {
      if (value > 10) return 'text-red-600';
      if (value > 0) return 'text-yellow-600';
      return 'text-green-600';
    }
  }
};
</script>