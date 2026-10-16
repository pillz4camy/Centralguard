// En SupervisorPanel.jsx, reemplaza la constante fija
//   const PUESTOS = ['Portería principal', 'Portería secundaria', ...]
// por el estado cargado desde la API:

import { useEffect, useState } from 'react'
import { listarPuestos } from '../../api/puestosApi'

// dentro del componente:
const [puestos, setPuestos] = useState([])
useEffect(() => {
  listarPuestos('?activo=true')
    .then((data) => setPuestos(data.map((p) => p.nombre)))   // ModalProgramarTurno espera un array de textos
    .catch((e) => console.error(e.message))
}, [])

// y donde se usa el modal:
// <ModalProgramarTurno puestos={puestos} ... />
