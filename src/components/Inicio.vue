<template>
  <h1 class="text-h4 font-weight-bold text-center" style="background-color: #f5f5f5;">Registro Nudos Críticos</h1>
  <v-container class="fill-height" fluid style="padding: 0; max-width:100% !important; background-color: #f5f5f5;">
      
      <v-row>
        <!-- Lista de proyectos -->
        <v-col cols="12" md="4">
          <v-card class="pa-4" style="height: 100%;">
            <h2 class="text-h5 font-weight-bold">Proyectos</h2>
            <div class="mb-4">
              <!-- Buscador por Nombre o Código -->
              <v-text-field
                v-model="busquedaProyecto"
                label="Buscar Proyecto"
                placeholder="Nombre o Código"
                outlined
                dense
              />
            </div>
            <div class="mb-4">
              <!-- Filtro por Monitor -->
              <v-select
                v-model="busquedaMonitor"
                :items="monitores"
                label="Filtrar por Monitor"
                outlined
                dense
              />
            </div>
            <div class="lista-scroll">
              <v-list>
                <template v-for="(proyecto, index) in proyectosFiltrados" :key="proyecto.id">
                  <v-list-item @click="seleccionarProyecto(proyecto)" class="cursor-pointer">
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">{{ proyecto.Nombre_Proyecto }}</v-list-item-title>
                      <v-list-item-subtitle>Código: {{ proyecto.Codigo }}</v-list-item-subtitle>
                      <v-list-item-subtitle>Monitor: {{ proyecto.Monitor }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider v-if="index < proyectos.length - 1" />
                </template>
                <v-list-item v-if="proyectos.length === 0">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">No hay proyectos registrados.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

            </div>

          </v-card>
        </v-col>

        <!-- Lista de Nudos Críticos -->
        <v-col cols="12" md="4">
          <v-card class="pa-4" style="height: 100%;">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h5 font-weight-bold">Nudos Críticos</h2>
              <v-btn color="primary" @click="dialogoNuevoNudo = true">Nuevo Nudo</v-btn>
            </div>
            <div class="mb-4">
              <!-- Filtro por Estado -->
              <v-select
                v-model="busquedaEstado"
                :items="estados"
                label="Estado"
                outlined
                dense
              />
            </div>
            <div class="mb-4">
              <!-- Filtro por Clasificación -->
              <v-select
                v-model="busquedaClasificacion"
                :items="clasificaciones"
                label="Clasificación"
                outlined
                dense
              />
            </div>
            <p class="text-subtitle-1">Proyecto: {{ proyectoSeleccionado?.Nombre_Proyecto || 'Seleccione un proyecto' }}</p>
            <div class="lista-scroll">
              <v-list>
                <template v-for="(nudo, index) in nudosFiltrados" :key="index">
                  <v-list-item @click="seleccionarNudoCritico(nudo)" class="cursor-pointer">
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">Estado: {{ nudo.Estado }}</v-list-item-title>
                      <v-list-item-subtitle>Clasificación: {{ nudo.Clasificacion }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider v-if="index < proyectoSeleccionado.Nudo_Critico.length - 1" />
                </template>
                <v-list-item v-if="!proyectoSeleccionado || proyectoSeleccionado.Nudo_Critico.length === 0">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">No hay nudos críticos registrados.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list> 
            </div>
          </v-card>
        </v-col>

        <!-- Detalle del Nudo Crítico -->
        <v-col cols="12" md="4">
          <v-card class="pa-4" style="height: 100%;" v-if="nudoCriticoSeleccionado">
            <h2 class="text-h5 font-weight-bold">Detalle del Nudo Crítico</h2>
            <v-form ref="form">
              <v-select
                v-model="nudoCriticoSeleccionado.Estado"
                :items="['Abierto', 'Resuelto']"
                label="Estado"
                outlined
                dense
              />
              <v-select
                v-model="nudoCriticoSeleccionado.Clasificacion"
                :items="['ENEL', 'Aguas Andinas', 'SEREMI']"
                label="Clasificación"
                outlined
                dense
              />
              <v-textarea
                v-model="nudoCriticoSeleccionado.Descripcion"
                label="Descripción"
                outlined
                dense
              />
              <v-text-field
                v-model="nudoCriticoSeleccionado.Fecha_Creacion"
                label="Fecha de Creación"
                outlined
                dense
              />
              <v-text-field
                v-model="nudoCriticoSeleccionado.Fecha_Cierre"
                label="Fecha de Cierre"
                outlined
                dense
              />
              <v-btn color="primary" class="mt-4" @click="guardarCambios">Guardar Cambios</v-btn>
            </v-form>
          </v-card>
          <v-card class="pa-4" style="height: 100%;" v-else>
            <h2 class="text-h5 font-weight-bold">Seleccione un Nudo Crítico</h2>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dialogo para agregar nuevo nudo crítico -->
      <v-dialog v-model="dialogoNuevoNudo" persistent max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Agregar Nuevo Nudo Crítico</v-card-title>
          <v-card-text>
            <v-form ref="formNuevoNudo">
              <v-select
                v-model="nuevoNudo.Estado"
                :items="['Abierto', 'Resuelto']"
                label="Estado"
                outlined
                dense
              />
              <v-select
                v-model="nuevoNudo.Clasificacion"
                :items="['DGA',	'ENEL',	'ENEL COLINA',	'AGUAS ANDINAS',	'CGE',	'CNM',	'UOCT',	'DOM',	'IMIV',	'PAVEL',	'DIA',	'SACYR',	'MOP',	'SEREMITT',	'BOMBEROS',	'DGAC',	'SEC']"
                label="Clasificación"
                outlined
                dense
              />
              <v-textarea
                v-model="nuevoNudo.Descripcion"
                label="Descripción"
                outlined
                dense
              />
              <v-text-field
                v-model="nuevoNudo.Fecha_Creacion"
                label="Fecha de Creación"
                outlined
                dense
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="guardarNuevoNudo">Guardar</v-btn>
            <v-btn text @click="dialogoNuevoNudo = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue'
const API_BASE = import.meta.env.VITE_API_URL

// Datos de ejemplo para proyectos y nudos críticos
const proyectos_local_respaldo = [
  {
    id: 1,
    Codigo: 10045,
    Decreto: "D.S. N°25/2024",
    Nombre_Proyecto: "Conjunto Habitacional Los Robles",
    Monitor: "María González",
    Nudo_Critico: [
      {
        Estado: "Abierto",
        Clasificacion: "Aguas Andinas",
        Descripcion: "Retraso en la entrega de materiales.",
        Fecha_Creacion: "2024-05-10"

      },
      {
        Estado: "Resuelto",
        Clasificacion: "ENEL",
        Descripcion: "Problemas con permisos municipales.",
        Fecha_Creacion: "2024-04-22"
      }
    ]
  },
  {
    id: 2,
    Codigo: 20087,
    Decreto: "D.S. N°14/2023",
    Nombre_Proyecto: "Villa Nueva Esperanza",
    Monitor: "Carlos Rivas",
    Nudo_Critico: [
      {
        Estado: "Abierto",
        Clasificacion: "Aguas Andinas",
        Descripcion: "Retraso en la entrega de materiales.",
        Fecha_Creacion: "2024-05-10"
      },
      {
        Estado: "Resuelto",
        Clasificacion: "Legal",
        Descripcion: "Retraso en la entrega de materiales.",
        Fecha_Creacion: "2024-05-10"
      },
      {
        Estado: "Abierto",
        Clasificacion: "Aguas Andinas",
        Descripcion: "Retraso en la entrega de materiales.",
        Fecha_Creacion: "2024-05-10"
      },
      {
        Estado: "Abierto",
        Clasificacion: "Aguas Andinas",
        Descripcion: "Retraso en la entrega de materiales.",
        Fecha_Creacion: "2024-05-10"
      },
      {
        Estado: "Resuelto",
        Clasificacion: "ENEL",
        Descripcion: "Problemas con permisos municipales.",
        Fecha_Creacion: "2024-04-22"
      }
    ]
  },
  {
    id: 3,
    Codigo: 30112,
    Decreto: "D.S. N°33/2025",
    Nombre_Proyecto: "Edificio Altos del Maipo",
    Monitor: "Fernanda López",
    Nudo_Critico: [
      {
        Estado: "Abierto",
        Clasificacion: "Legal",
        Descripcion: "Conflictos laborales.",
        Fecha_Creacion: "2024-03-15"
      },
      {
        Estado: "Abierto",
        Clasificacion: "ENEL",
        Descripcion: "Conflictos laborales.",
        Fecha_Creacion: "2024-03-15"
      },
      {
        Estado: "Abierto",
        Clasificacion: "Aguas Andinas",
        Descripcion: "Conflictos laborales.",
        Fecha_Creacion: "2024-03-15"
      }
    ]
  }
]

// Lista de monitores
const monitores = ["Todos", "Carolina Espinosa","Macarena Guerra","Claudia Pastenes","Katherinne Rodriguez","Alejandra Lobos","Javiera Diaz","Javiera Caceres","Joel Cáceres"]
const clasificaciones = ["Todas", "DGA",	"ENEL",	"ENEL COLINA",	"AGUAS ANDINAS",	"CGE",	"CNM",	"UOCT",	"DOM",	"IMIV",	"PAVEL",	"DIA",	"SACYR",	"MOP",	"SEREMITT",	"BOMBEROS",	"DGAC",	"SEC"]
const estados = ["Todos", "Abierto", "Resuelto"]

// Estado para el diálogo y nuevo nudo crítico
const dialogoNuevoNudo = ref(false)
function obtenerFechaActualFormateada() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}-${mes}-${año}`;
}
const nuevoNudo = ref({
  Estado: "",
  Clasificacion: "",
  Descripcion: "",
  id_nudo: "", // Se generará al guardar
  Fecha_Creacion:obtenerFechaActualFormateada()
  //Fecha_Creacion: new Date().toISOString().split("T")[0] // Fecha actual
})

// Función para guardar el nuevo nudo crítico
async function guardarNuevoNudo() {
  if (proyectoSeleccionado.value) {
    // Asigno un id_nudo basado en el código del proyecto y la cantidad de nudos existentes
    nuevoNudo.value.id_nudo = proyectoSeleccionado.value.Codigo + "/" + (proyectoSeleccionado.value.Nudo_Critico.length)
    // Agrego el nuevo nudo crítico al proyecto seleccionado
    proyectoSeleccionado.value.Nudo_Critico.push({ ...nuevoNudo.value })
  try {
    const campo = "Nudo_Critico";
    const resp = await fetch(
      `${API_BASE}/proyecto/${encodeURIComponent(proyectoSeleccionado.value.id)}/${encodeURIComponent(campo)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proyectoSeleccionado.value),
      }
    );

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`PATCH falló: ${resp.status} ${resp.statusText} ${txt}`);
    }

  } catch (err) {
    // Rollback si falla el PATCH
    proyectoSeleccionado.value.Nudo_Critico.pop();
    dialogoNuevoNudo.value = true; // opcional: reabrir el diálogo
    console.error("Error al agregar nudo crítico (BD):", err);
  }

    dialogoNuevoNudo.value = false
    console.log("Nuevo nudo crítico agregado:", nuevoNudo.value)
    // Reiniciar el formulario
    nuevoNudo.value = {
      Estado: "",
      Clasificacion: "",
      Descripcion: "",
      Fecha_Creacion: new Date().toISOString().split("T")[0],
    }
  } else {
    console.log("Seleccione un proyecto antes de agregar un nudo crítico.")
  }
}

// Estado reactivo para el proyecto y nudo crítico seleccionados
const proyectoSeleccionado = ref(null)
const busquedaProyecto = ref("")
const busquedaMonitor = ref("Todos")
const busquedaClasificacion = ref("Todas")
const busquedaEstado = ref("Todos")
const nudoCriticoSeleccionado = ref(null)

// Computed para filtrar los proyectos según la búsqueda y el monitor
const proyectosFiltrados = computed(() => {
  let filtrados = proyectos.value
  if (busquedaProyecto.value) {
    const textoBusqueda = busquedaProyecto.value.toLowerCase()
    filtrados = filtrados.filter(
      (proyecto) =>
        proyecto.Nombre_Proyecto.toLowerCase().includes(textoBusqueda) ||
        proyecto.Codigo.toString().includes(textoBusqueda)
    )
  }
  if (busquedaMonitor.value !== "Todos") {
    filtrados = filtrados.filter((proyecto) => proyecto.Monitor === busquedaMonitor.value)
  }
  return filtrados
})

// Computed para filtrar los nudos críticos según la clasificación y el estado
const nudosFiltrados = computed(() => {
  if (!proyectoSeleccionado.value) return []
  let filtrados = proyectoSeleccionado.value.Nudo_Critico
  if (busquedaClasificacion.value !== "Todas") {
    filtrados = filtrados.filter((nudo) => nudo.Clasificacion === busquedaClasificacion.value)
  }
  if (busquedaEstado.value !== "Todos") {
    filtrados = filtrados.filter((nudo) => nudo.Estado === busquedaEstado.value)
  }
  // Ordeno los nudos criticos por Estado (Abierto primero) y luego por Fecha_Creacion (más reciente primero)
  filtrados.sort((a, b) => {
    if (a.Estado === b.Estado) {
      return new Date(b.Fecha_Creacion) - new Date(a.Fecha_Creacion)
    }
    return a.Estado === "Abierto" ? -1 : 1
  })
  return filtrados
})

// Función para seleccionar un proyecto
function seleccionarProyecto(proyecto) {
  proyectoSeleccionado.value = proyecto
  nudoCriticoSeleccionado.value = null // Reinicia el nudo crítico seleccionado
}

// Función para seleccionar un nudo crítico
function seleccionarNudoCritico(nudo) {
  nudoCriticoSeleccionado.value = { ...nudo } // Clona el objeto para evitar mutaciones directas
}

// Función para guardar cambios en el nudo crítico
async function guardarCambios() {
  console.log("Cambios guardados:", nudoCriticoSeleccionado.value)
  // Buscar índice del nudo crítico dentro del proyecto
  const index = proyectoSeleccionado.value.Nudo_Critico.findIndex(
    (n) => n.id_nudo === nudoCriticoSeleccionado.value.id_nudo);
  if (index === -1) {
    console.error("No se encontró el nudo crítico en el proyecto.");
    return;
  }
  // Reemplazar el nudo crítico en el array del proyecto
  proyectoSeleccionado.value.Nudo_Critico[index] = { ...nudoCriticoSeleccionado.value };
  console.log("Nudo crítico actualizado en el proyecto:", proyectoSeleccionado.value.Nudo_Critico[index]);
  console.log("consulta a enviar: ",proyectoSeleccionado.value);

  try {
    const respuesta = await fetch(`${API_BASE}/proyecto/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify(proyectoSeleccionado.value)
    });
    if (!respuesta.ok) {
      throw new Error(`Error al actualizar el proyecto: ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    console.log("Proyecto actualizado con éxito:", datos);
    alert("Cambios guardados correctamente");
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    alert("Hubo un error al guardar los cambios, contacte al administrador.");
  }
}

// Estado reactivo para los proyectos obtenidos desde la API
const proyectos = ref([])

// Función para obtener los proyectos desde la API
async function obtenerProyectos() {
  
  try {
    
    const respuesta = await fetch(`${API_BASE}/proyecto/`);
    if (!respuesta.ok) {
      throw new Error(`Error al obtener proyectos: ${respuesta.statusText}`);
    }
    const datos = await respuesta.json();
    proyectos.value = JSON.parse(JSON.stringify(datos)); // Normaliza los datos
    console.log("Proyectos obtenidos:", proyectos.value);
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
  }
}



// Llamar a la función obtenerProyectos al montar el componente
onMounted(() => {
  console.log("API_BASE: ",API_BASE);
  obtenerProyectos()
})
</script>


<style scoped>
.lista-scroll {
  max-height: 300px; /* altura máxima antes de activar el scroll */
  overflow-y: auto; /* habilita scroll vertical */
  border: 0px solid #ddd;
  border-radius: 8px;
  padding-right: 8px;
}
</style>