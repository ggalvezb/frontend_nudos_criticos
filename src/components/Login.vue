<!-- src/views/LoginView.vue -->
<template>
  <v-container class="login-page" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <div class="text-center mb-6">
          <h1 class="title">Registro Nudos Críticos</h1>
        </div>

        <v-card class="pa-6" elevation="3" rounded="lg">
          <h2 class="section-title mb-4">Inicio de sesión</h2>

          <v-form v-model="isValid" @submit.prevent="onSubmit">
            <v-text-field
              v-model="form.username"
              label="Usuario"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              autocomplete="username"
              class="mb-3"
            />

            <v-text-field
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              label="Contraseña"
              variant="outlined"
              density="comfortable"
              :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPass = !showPass"
              :rules="[rules.required]"
              autocomplete="current-password"
              class="mb-4"
            />

            <v-btn
              type="submit"
              block
              class="mb-2"
              color="primary"
              size="large"
              :loading="loading"
            >
              INGRESAR
            </v-btn>


          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isValid = ref(false)
const loading = ref(false)
const showPass = ref(false)
//Defino usuarios
const users = [
  { username: 'ggalvezb', password: 'Serviu2025' },
  { username: 'cespinosaa', password: 'Serviu2025' },
  { username: 'mguerram', password: 'Serviu2025' },
  { username: 'cpastenesr', password: 'Serviu2025' },
  { username: 'krodriguez', password: 'Serviu2025' },
  { username: 'alobos', password: 'Serviu2025' },
  { username: 'jdiazc', password: 'Serviu2025' },
  { username: 'jcaceresr', password: 'Serviu2025' },
  { username: 'jcaceresf', password: 'Serviu2025' },
]

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  required: v => (!!v && String(v).trim().length > 0) || 'Requerido',
}

async function onSubmit() {
  if (!isValid.value) return
  loading.value = true
  try {
    // TODO: reemplaza por tu endpoint de autenticación
    // const { data } = await api.post('/auth/login', form)
    // guarda token, redirige, etc.
    await new Promise(r => setTimeout(r, 800)) // simula petición
    //checa usuario y clave
    const user = users.find(
      u => u.username === form.username && u.password === form.password
    )
    if (!user) throw new Error('Usuario o contraseña incorrectos')
    //llevo a la página principal
    router.push('inicio')
    console.log('Login OK', { ...form })
  } catch (e) {
    // maneja error (muestra mensaje, etc.)
    alert(e.message || 'Error en el login')
    console.error('Error de login', e)
  } finally {
    loading.value = false
  }
}

function recover() {
  // Navega a recuperación o abre un diálogo
  console.log('Recuperar contraseña')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f5f5f5; /* gris claro como tu UI */
  padding: 24px;
}

.title {
  font-weight: 800;
  font-size: 2.25rem; /* similar a display-6 */
  letter-spacing: 0.2px;
}

.section-title {
  font-weight: 700;
  font-size: 1.25rem;
}
</style>
