<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = authStore.user

// Form data
const name = ref(user?.name || '')
const email = ref(user?.email || '')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Notification settings
const emailNotifications = ref(true)
const pushNotifications = ref(false)
const smsNotifications = ref(false)

// Alert thresholds
const electricityThreshold = ref(10)
const waterThreshold = ref(15)
const gasThreshold = ref(20)

// Success/error messages
const successMessage = ref('')
const errorMessage = ref('')

// Handle profile update
const updateProfile = () => {
  // In a real app, this would call an API
  successMessage.value = 'Profil mis à jour avec succès'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

// Handle password change
const changePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (newPassword.value.length < 8) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }
  
  // In a real app, this would call an API
  successMessage.value = 'Mot de passe modifié avec succès'
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

// Handle notification settings update
const updateNotificationSettings = () => {
  // In a real app, this would call an API
  successMessage.value = 'Paramètres de notification mis à jour avec succès'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

// Handle alert thresholds update
const updateAlertThresholds = () => {
  // In a real app, this would call an API
  successMessage.value = 'Seuils d\'alerte mis à jour avec succès'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Profil utilisateur
        </h2>
      </div>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-green-700">
            {{ successMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Profile information -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Informations personnelles</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Modifiez vos informations personnelles.</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form @submit.prevent="updateProfile">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <label for="name" class="block text-sm font-medium text-gray-700">Nom complet</label>
                <input type="text" name="name" id="name" v-model="name" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div class="col-span-6 sm:col-span-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                <input type="email" name="email" id="email" v-model="email" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div class="col-span-6">
                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Change password -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Changer de mot de passe</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Assurez-vous d'utiliser un mot de passe sécurisé.</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form @submit.prevent="changePassword">
            <div class="space-y-4">
              <div>
                <label for="current-password" class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                <input type="password" name="current-password" id="current-password" v-model="currentPassword" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div>
                <label for="new-password" class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                <input type="password" name="new-password" id="new-password" v-model="newPassword" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <input type="password" name="confirm-password" id="confirm-password" v-model="confirmPassword" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div>
                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Changer le mot de passe
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Notification settings -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Paramètres de notification</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Choisissez comment vous souhaitez être informé.</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form @submit.prevent="updateNotificationSettings">
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="email-notifications" name="email-notifications" type="checkbox" v-model="emailNotifications" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="email-notifications" class="font-medium text-gray-700">Notifications par e-mail</label>
                  <p class="text-gray-500">Recevez des alertes et des rapports hebdomadaires par e-mail.</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="push-notifications" name="push-notifications" type="checkbox" v-model="pushNotifications" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="push-notifications" class="font-medium text-gray-700">Notifications push</label>
                  <p class="text-gray-500">Recevez des alertes en temps réel sur votre appareil.</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="sms-notifications" name="sms-notifications" type="checkbox" v-model="smsNotifications" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="sms-notifications" class="font-medium text-gray-700">Notifications SMS</label>
                  <p class="text-gray-500">Recevez des alertes importantes par SMS.</p>
                </div>
              </div>

              <div>
                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Enregistrer les préférences
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Alert thresholds -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Seuils d'alerte</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Définissez à partir de quel pourcentage d'augmentation vous souhaitez être alerté.</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form @submit.prevent="updateAlertThresholds">
            <div class="space-y-4">
              <div>
                <label for="electricity-threshold" class="block text-sm font-medium text-gray-700">Seuil d'alerte pour l'électricité (%)</label>
                <input type="number" name="electricity-threshold" id="electricity-threshold" v-model="electricityThreshold" min="0" max="100" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div>
                <label for="water-threshold" class="block text-sm font-medium text-gray-700">Seuil d'alerte pour l'eau (%)</label>
                <input type="number" name="water-threshold" id="water-threshold" v-model="waterThreshold" min="0" max="100" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div>
                <label for="gas-threshold" class="block text-sm font-medium text-gray-700">Seuil d'alerte pour le gaz (%)</label>
                <input type="number" name="gas-threshold" id="gas-threshold" v-model="gasThreshold" min="0" max="100" class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              <div>
                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Enregistrer les seuils
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>