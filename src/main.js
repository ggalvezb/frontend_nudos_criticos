/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 * 
 * PARA INICIAR EL PROYECTO: npm run dev
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'



const app = createApp(App)

registerPlugins(app)

app.mount('#app')
