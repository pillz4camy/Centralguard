import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Registro de Vehículos - CentralGuard',
      version: '1.0.0',
      description: 'Control de ingreso y salida de vehículos (residentes y visitantes) en la portería. Roles: 1 = Administrador, 2 = Supervisor, 3 = Vigilante.'
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Vehiculo: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66f1c0a2b1d2c3e4f5a6b7c8' },
            placa: { type: 'string', example: 'ABC123' },
            tipo_vehiculo: { type: 'string', enum: ['carro', 'moto', 'camioneta', 'otro'] },
            marca: { type: 'string', example: 'Mazda' },
            color: { type: 'string', example: 'Rojo' },
            tipo_registro: { type: 'string', enum: ['residente', 'visitante'] },
            propietario: { type: 'string', example: 'Juan Pérez' },
            destino: { type: 'string', example: 'Apto 501' },
            observaciones: { type: 'string' },
            estado: { type: 'string', enum: ['dentro', 'salio'] },
            fecha_ingreso: { type: 'string', format: 'date-time' },
            fecha_salida: { type: 'string', format: 'date-time', nullable: true },
            vigilante: { type: 'string', example: 'Carlos' },
            vigilante_salida: { type: 'string' }
          }
        },
        VehiculoInput: {
          type: 'object',
          required: ['placa', 'propietario', 'destino'],
          properties: {
            placa: { type: 'string', example: 'ABC-123' },
            tipo_vehiculo: { type: 'string', enum: ['carro', 'moto', 'camioneta', 'otro'], example: 'carro' },
            marca: { type: 'string', example: 'Mazda' },
            color: { type: 'string', example: 'Rojo' },
            tipo_registro: { type: 'string', enum: ['residente', 'visitante'], example: 'visitante' },
            propietario: { type: 'string', example: 'Juan Pérez' },
            destino: { type: 'string', example: 'Apto 501' },
            observaciones: { type: 'string', example: 'Deja el vehículo en el parqueadero de visitas' }
          }
        },
        Error: { type: 'object', properties: { error: { type: 'string' }, detalles: { type: 'array', items: { type: 'string' } } } }
      }
    }
  },
  apis: ['./src/routes/*.js']
})
