import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Turnos - CentralGuard',
      version: '1.0.0',
      description: 'El supervisor programa turnos a los vigilantes y cada vigilante consulta los suyos. Roles: 1 = Administrador, 2 = Supervisor, 3 = Vigilante.'
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Turno: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66f1c0a2b1d2c3e4f5a6b7c8' },
            idusuario: { type: 'string', description: 'Id del vigilante asignado', example: '66f1bfe0b1d2c3e4f5a6b7c1' },
            vigilante: { type: 'string', example: 'Carlos' },
            supervisor: { type: 'string', example: 'Supervisor' },
            fecha: { type: 'string', example: '2026-11-05' },
            hora_inicio: { type: 'string', example: '06:00' },
            hora_fin: { type: 'string', example: '14:00' },
            puesto: { type: 'string', example: 'Portería principal' },
            observaciones: { type: 'string', example: 'Revisar cámaras del sótano cada hora' }
          }
        },
        TurnoInput: {
          type: 'object',
          required: ['idusuario', 'fecha', 'hora_inicio', 'hora_fin', 'puesto'],
          properties: {
            idusuario: { type: 'string', description: 'Id del vigilante (sale de GET /api/usuarios)', example: '66f1bfe0b1d2c3e4f5a6b7c1' },
            fecha: { type: 'string', example: '2026-11-05' },
            hora_inicio: { type: 'string', example: '06:00' },
            hora_fin: { type: 'string', example: '14:00' },
            puesto: { type: 'string', example: 'Portería principal' },
            observaciones: { type: 'string', example: 'Revisar cámaras del sótano cada hora' }
          }
        },
        Error: { type: 'object', properties: { error: { type: 'string' }, detalles: { type: 'array', items: { type: 'string' } } } }
      }
    }
  },
  apis: ['./src/routes/*.js']
})
