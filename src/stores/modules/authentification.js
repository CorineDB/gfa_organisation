import AuthentificationService from "@/services/modules/authentification.service";
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'



export const useAuthStore = defineStore('authentification', () => {
	//state 

	const userInfo = reactive({})
	const fullName = ref('')
	const initiale = ref('')
	const loading = ref(false)

	//getters
	const getUserInfo = computed(() => userInfo)
	const getFullName = computed(() => fullName.value)
	const getInitiale = computed(() => initiale.value)
	const getLoading = computed(() => loading.value)
	//les actions 
	const active = () => {
		loading.value = true
	}
	const disabled = () => { loading.value = false }
	const updateFullName = (newFullName) => { fullName.value = newFullName }
	const updateInitiale = (newInitiale) => { initiale.value = newInitiale }
	const resetInfo = () => {
		userInfo.token = null
		userInfo.expirationToken = null
		userInfo.users = null
	}

	const login = (datas) => {
		console.log(datas)
		return new Promise((resolve, reject) => {

			if (loading.value == false) {

				active()

				AuthentificationService.create(datas).then((data) => {

					const response = data.data
					disabled()
					const users = response.data.utilisateur
					const infosUsers = {
						token: response.data.access_token,
						expirationToken: response.data.expired_at,
						users: response.data.utilisateur,
						userInitiale: '',
						permissions: response.data.utilisateur.role.permissions


					}




					userInfo.token = infosUsers.token
					userInfo.expirationToken = infosUsers.expirationToken
					userInfo.users = infosUsers.users

					fullName.value = users.nom
					initiale.value = users.nom[0] + '' + users.prenom[0]
					initiale.value = initiale.value.toUpperCase()
					
                     infosUsers.userInitiale = initiale.value

                //    console.log(infosUsers)

					resolve(infosUsers)
					localStorage.setItem('bsdInfo', JSON.stringify(infosUsers))
				}).catch((error) => {
					disabled()
					if (error.response) {
						// Requête effectuée mais le serveur a répondu par une erreur.
						const message = error.response.data.message
						reject(message)
					} else if (error.request) {
						reject(error.request)
						// Demande effectuée mais aucune réponse n'est reçue du serveur.
						//console.log(error.request);
					} else {
						// Une erreur s'est produite lors de la configuration de la demande
						//console.log('dernier message', error.message);
						reject(error.message)
					}
				})
			}
		})

	}




	return { getUserInfo, getFullName, getInitiale, getLoading, loading, updateFullName, updateInitiale, login, resetInfo }
})
