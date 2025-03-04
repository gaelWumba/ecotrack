import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

// Types
interface ConsumptionData {
  date: string
  electricity: number
  water: number
  gas: number
}

interface Alert {
  id: number
  type: 'electricity' | 'water' | 'gas'
  message: string
  date: string
  read: boolean
}

interface Recommendation {
  id: number
  type: 'electricity' | 'water' | 'gas' | 'general'
  title: string
  description: string
  potentialSavings: number
}

export const useEnergyStore = defineStore('energy', () => {
  // State
  const dailyConsumption = ref<ConsumptionData[]>([])
  const neighborhoodAverage = ref<ConsumptionData[]>([])
  const alerts = ref<Alert[]>([])
  const recommendations = ref<Recommendation[]>([])
  const loading = ref(false)
  
  // Generate mock data for the last 30 days
  function generateMockData() {
    loading.value = true
    
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 30)
    
    // Generate daily consumption data
    dailyConsumption.value = eachDayOfInterval({ start: thirtyDaysAgo, end: today }).map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      // Random values with some variation
      const electricity = Math.round(8 + Math.random() * 4) // 8-12 kWh
      const water = Math.round(120 + Math.random() * 60) // 120-180 liters
      const gas = Math.round(2 + Math.random() * 1.5) // 2-3.5 m³
      
      return { date: dateStr, electricity, water, gas }
    })
    
    // Generate neighborhood average (slightly lower than user's consumption)
    neighborhoodAverage.value = dailyConsumption.value.map(day => ({
      date: day.date,
      electricity: Math.round(day.electricity * 0.85),
      water: Math.round(day.water * 0.9),
      gas: Math.round(day.gas * 0.8)
    }))
    
    // Generate some alerts
    alerts.value = [
      {
        id: 1,
        type: 'electricity',
        message: 'Votre consommation d\'électricité a augmenté de 15% par rapport à la semaine dernière',
        date: format(subDays(today, 2), 'yyyy-MM-dd'),
        read: false
      },
      {
        id: 2,
        type: 'water',
        message: 'Consommation d\'eau anormalement élevée détectée hier soir',
        date: format(subDays(today, 1), 'yyyy-MM-dd'),
        read: false
      },
      {
        id: 3,
        type: 'gas',
        message: 'Votre consommation de gaz est 20% au-dessus de la moyenne du quartier',
        date: format(subDays(today, 5), 'yyyy-MM-dd'),
        read: true
      }
    ]
    
    // Generate recommendations
    recommendations.value = [
      {
        id: 1,
        type: 'electricity',
        title: 'Remplacez vos ampoules par des LED',
        description: 'Les ampoules LED consomment jusqu\'à 90% moins d\'électricité que les ampoules incandescentes traditionnelles.',
        potentialSavings: 120
      },
      {
        id: 2,
        type: 'water',
        title: 'Installez des économiseurs d\'eau',
        description: 'Les économiseurs d\'eau pour robinets et douches peuvent réduire votre consommation d\'eau jusqu\'à 50%.',
        potentialSavings: 80
      },
      {
        id: 3,
        type: 'gas',
        title: 'Baissez votre thermostat de 1°C',
        description: 'Baisser votre thermostat de seulement 1°C peut réduire votre facture de chauffage de 7%.',
        potentialSavings: 150
      },
      {
        id: 4,
        type: 'general',
        title: 'Programmez vos appareils en heures creuses',
        description: 'Utilisez vos appareils électroménagers pendant les heures creuses pour bénéficier de tarifs réduits.',
        potentialSavings: 90
      }
    ]
    
    loading.value = false
  }
  
  // Computed properties for different time periods
  const weeklyConsumption = computed(() => {
    const today = new Date()
    const sevenDaysAgo = subDays(today, 7)
    return dailyConsumption.value.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= sevenDaysAgo && itemDate <= today
    })
  })
  
  const monthlyConsumption = computed(() => {
    const today = new Date()
    const firstDayOfMonth = startOfMonth(today)
    const lastDayOfMonth = endOfMonth(today)
    return dailyConsumption.value.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= firstDayOfMonth && itemDate <= lastDayOfMonth
    })
  })
  
  // Calculate totals
  const totals = computed(() => {
    const daily = weeklyConsumption.value.reduce(
      (acc, curr) => {
        acc.electricity += curr.electricity
        acc.water += curr.water
        acc.gas += curr.gas
        return acc
      },
      { electricity: 0, water: 0, gas: 0 }
    )
    
    return {
      daily: {
        electricity: daily.electricity / 7,
        water: daily.water / 7,
        gas: daily.gas / 7
      },
      weekly: daily,
      monthly: monthlyConsumption.value.reduce(
        (acc, curr) => {
          acc.electricity += curr.electricity
          acc.water += curr.water
          acc.gas += curr.gas
          return acc
        },
        { electricity: 0, water: 0, gas: 0 }
      )
    }
  })
  
  // Calculate estimated bill
  const estimatedBill = computed(() => {
    const electricityRate = 0.1740 // €/kWh
    const waterRate = 0.0035 // €/liter
    const gasRate = 0.0850 // €/m³
    
    return {
      electricity: totals.value.monthly.electricity * electricityRate,
      water: totals.value.monthly.water * waterRate,
      gas: totals.value.monthly.gas * gasRate,
      total: (
        totals.value.monthly.electricity * electricityRate +
        totals.value.monthly.water * waterRate +
        totals.value.monthly.gas * gasRate
      )
    }
  })
  
  // Mark alert as read
  function markAlertAsRead(id: number) {
    const alert = alerts.value.find(a => a.id === id)
    if (alert) {
      alert.read = true
    }
  }
  
  return {
    dailyConsumption,
    weeklyConsumption,
    monthlyConsumption,
    neighborhoodAverage,
    alerts,
    recommendations,
    loading,
    totals,
    estimatedBill,
    generateMockData,
    markAlertAsRead
  }
})