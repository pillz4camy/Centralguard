import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api/api'   // <- ya no se usa supabase aquí

const claseEstado = (e) =>
  e === 'Dañado' ? 'bg-danger' : e === 'Regular' ? 'bg-warning text-dark' : 'bg-success'

export default function MisEquipos({ usuario }) {
  const [equipos, setEquipos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    try {
      const data = await api(`/usuarios/${usuario.idusuario}/equipos`)
      setEquipos(data)
      setError('')
    } catch (e) {
      setError(e.message)
    }
    setCargando(false)
  }, [usuario.idusuario])

  useEffect(() => {
    cargar()
    const t = setInterval(cargar, 15000)
    return () => clearInterval(t)
  }, [cargar])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <div>
          <span className="eyebrow">DOTACIÓN</span>
          <h3 className="h5 mb-1">Mis equipos asignados</h3>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={cargar}>↻ Actualizar</button>
      </div>

      {error && <div className="alert alert-warning border-0">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr><th>Equipo</th><th>Serial</th><th>Estado</th><th>Entregado el</th><th>Devuelto el</th></tr>
          </thead>
          <tbody>
            {equipos.map(a => (
              <tr key={a._id}>
                <td className="fw-semibold">{a.equipo?.nombre_activo}</td>
                <td>{a.equipo?.serial_unico || '—'}</td>
                <td><span className={`badge ${claseEstado(a.equipo?.estado)}`}>{a.equipo?.estado || '—'}</span></td>
                <td>{String(a.fecha_entrega || '—').slice(0, 10)}</td>
                <td>{a.fecha_devolucion ? String(a.fecha_devolucion).slice(0, 10) : 'En uso'}</td>
              </tr>
            ))}
            {!equipos.length && (
              <tr><td colSpan="5" className="text-center py-4 text-muted">
                {cargando ? 'Cargando...' : 'Por ahora no tienes equipos asignados.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
