import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Roles - CentralGuard',
      version: '1.0.0',
      description: 'Gestión de los roles del sistema y asignación de roles a usuarios. Roles base: 1 = Administrador, 2 = Supervisor, 3 = Vigilante.'
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Rol: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66f1c0a2b1d2c3e4f5a6b7c8' },
            idroles: { type: 'integer', example: 3 },
            nombre_rol: { type: 'string', example: 'Vigilante' },
            descripcion: { type: 'string', example: 'Registra novedades, rondas y accesos' }
          }
        },
        RolInput: {
          type: 'object',
          required: ['nombre_rol'],
          properties: {
            idroles: { type: 'integer', description: 'Opcional: si no se envía, se asigna el siguiente número', example: 4 },
            nombre_rol: { type: 'string', example: 'Contador' },
            descripcion: { type: 'string', example: 'Consulta reportes administrativos' }
          }
        },
        Error: { type: 'object', properties: { error: { type: 'string' }, detalles: { type: 'array', items: { type: 'string' } } } }
      }
    }
  },
  apis: ['./src/routes/*.js']
})
