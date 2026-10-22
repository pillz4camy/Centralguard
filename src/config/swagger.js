import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Rondas - CentralGuard',
      version: '1.0.0',
      description: 'Registro de rondas/recorridos de los vigilantes. Roles: 1 = Administrador, 2 = Supervisor, 3 = Vigilante.'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Ronda: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66f1c0a2b1d2c3e4f5a6b7c8' },
            sector: { type: 'string', example: 'Torre 2 - Parqueaderos' },
            observaciones: { type: 'string', example: 'Sin novedades' },
            vigilante: { type: 'string', example: 'Carlos' },
            idusuario: { type: 'string', example: '66f1bfe0b1d2c3e4f5a6b7c1' },
            fecha_hora: { type: 'string', format: 'date-time' }
          }
        },
        RondaInput: {
          type: 'object',
          required: ['sector'],
          properties: {
            sector: { type: 'string', example: 'Torre 2 - Parqueaderos' },
            observaciones: { type: 'string', example: 'Iluminación en orden' }
          }
        },
        Error: { type: 'object', properties: { error: { type: 'string' }, detalles: { type: 'array', items: { type: 'string' } } } }
      }
    }
  },
  apis: ['./src/routes/*.js']
})
