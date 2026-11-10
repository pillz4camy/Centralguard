export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Centralguard API',
    version: '1.0.0',
    description: 'API REST para el sistema de control de accesos, vigilancia y seguridad Centralguard (Trimestre 5). Solo roles permitidos: administrador y vigilante.',
    contact: {
      name: 'Equipo Centralguard'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local (Desarrollo)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido en el login: Bearer <token>'
      }
    },
    schemas: {
      UsuarioRegistro: {
        type: 'object',
        required: ['nombre', 'apellido', 'correo', 'contrasenia', 'documento'],
        properties: {
          nombre: { type: 'string', example: 'Admin' },
          apellido: { type: 'string', example: 'Principal' },
          documento: { type: 'string', example: '123123' },
          correo: { type: 'string', format: 'email', example: 'admin@centralguard.com' },
          contrasenia: { type: 'string', example: '123456' },
          rol: { type: 'string', enum: ['administrador', 'vigilante'], example: 'administrador' },
          telefono: {
            type: 'object',
            properties: {
              tipo: { type: 'string', example: 'móvil' },
              numero: { type: 'string', example: '3001234567' }
            }
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['correo', 'contrasenia'],
        properties: {
          correo: { type: 'string', format: 'email', example: 'admin@centralguard.com' },
          contrasenia: { type: 'string', example: '123456' }
        }
      },
      ConjuntoInput: {
        type: 'object',
        required: ['nombre_conjunto', 'direccion'],
        properties: {
          nombre_conjunto: { type: 'string', example: 'Conjunto Residencial Los Pinos' },
          nit: { type: 'string', example: '900123456-1' },
          direccion: { type: 'string', example: 'Calle 100 # 15-20' },
          correo_electronico: { type: 'string', example: 'admin@lospinos.com' },
          telefono: {
            type: 'object',
            properties: {
              tipo: { type: 'string', example: 'fijo' },
              numero: { type: 'string', example: '6017654321' }
            }
          }
        }
      },
      TurnoInput: {
        type: 'object',
        required: ['conjunto', 'puesto_vigilancia'],
        properties: {
          conjunto: { type: 'string', example: '60f7b1... (ObjectId)' },
          empleado: { type: 'string', example: '60f7b2... (ObjectId del vigilante, opcional si es el usuario logueado)' },
          puesto_vigilancia: { type: 'string', example: '60f7b3... (ObjectId del puesto)' },
          fecha: { type: 'string', format: 'date-time', example: '2026-11-10T08:00:00Z' },
          observaciones: { type: 'string', example: 'Turno diurno sin novedades iniciales' }
        }
      },
      RegistroAccesoInput: {
        type: 'object',
        required: ['turno', 'persona', 'apartamento_destino'],
        properties: {
          turno: { type: 'string', example: '60f7b1... (ObjectId)' },
          persona: { type: 'string', example: '60f7b2... (ObjectId)' },
          vehiculo: { type: 'string', example: '60f7b3... (ObjectId, opcional)' },
          apartamento_destino: { type: 'string', example: 'Torre 2 Apto 402' },
          observaciones_acceso: { type: 'string', example: 'Visita familiar' }
        }
      },
      NovedadInput: {
        type: 'object',
        required: ['turno', 'tipo_novedad', 'descripcion_hechos'],
        properties: {
          turno: { type: 'string', example: '60f7b1... (ObjectId)' },
          tipo_novedad: { type: 'string', enum: ['Seguridad', 'Mantenimiento', 'Convivencia', 'Emergencia', 'Otra'], example: 'Seguridad' },
          descripcion_hechos: { type: 'string', example: 'Puerta vehicular con falla en motor' },
          evidencias: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url_imagen: { type: 'string', example: 'https://ejemplo.com/foto.jpg' }
              }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Descripción del error' }
        }
      }
    }
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Verificar estado del servicio y base de datos',
        tags: ['Salud'],
        responses: {
          200: { description: 'Servidor y MongoDB en línea' }
        }
      }
    },
    '/api/users': {
      post: {
        summary: 'Crear usuario (Administrador o Vigilante)',
        tags: ['Usuarios & Autenticación'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioRegistro' } } }
        },
        responses: {
          201: { description: 'Usuario creado exitosamente' },
          400: { description: 'Datos inválidos o correo ya registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      get: {
        summary: 'Listar usuarios registrados (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        tags: ['Usuarios & Autenticación'],
        parameters: [
          { name: 'rol', in: 'query', schema: { type: 'string', enum: ['administrador', 'vigilante'] } },
          { name: 'activo', in: 'query', schema: { type: 'boolean' } }
        ],
        responses: {
          200: { description: 'Lista de usuarios' },
          401: { description: 'No autenticado' },
          403: { description: 'Solo administrador' }
        }
      }
    },
    '/api/users/login': {
      post: {
        summary: 'Iniciar sesión (obtiene token JWT)',
        tags: ['Usuarios & Autenticación'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
        },
        responses: {
          200: { description: 'Login exitoso con token' },
          401: { description: 'Credenciales inválidas' }
        }
      }
    },
    '/api/users/perfil': {
      get: {
        summary: 'Obtener datos del usuario autenticado',
        security: [{ bearerAuth: [] }],
        tags: ['Usuarios & Autenticación'],
        responses: {
          200: { description: 'Datos del perfil' },
          401: { description: 'No autenticado o token expirado' }
        }
      }
    },
    '/api/users/{id}': {
      put: {
        summary: 'Actualizar usuario (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        tags: ['Usuarios & Autenticación'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Usuario actualizado' },
          404: { description: 'Usuario no encontrado' }
        }
      },
      delete: {
        summary: 'Eliminar usuario (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        tags: ['Usuarios & Autenticación'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Usuario eliminado' },
          404: { description: 'Usuario no encontrado' }
        }
      }
    },
    '/api/conjuntos': {
      get: {
        summary: 'Listar conjuntos',
        security: [{ bearerAuth: [] }],
        tags: ['Conjuntos'],
        responses: { 200: { description: 'Lista de conjuntos' } }
      },
      post: {
        summary: 'Crear conjunto (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        tags: ['Conjuntos'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ConjuntoInput' } } }
        },
        responses: {
          201: { description: 'Conjunto creado' },
          403: { description: 'Solo administrador' }
        }
      }
    },
    '/api/turnos': {
      get: {
        summary: 'Listar turnos de vigilancia',
        security: [{ bearerAuth: [] }],
        tags: ['Turnos'],
        parameters: [
          { name: 'estado', in: 'query', schema: { type: 'string', enum: ['activo', 'finalizado', 'cancelado'] } }
        ],
        responses: { 200: { description: 'Lista de turnos' } }
      },
      post: {
        summary: 'Registrar nuevo turno (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        tags: ['Turnos'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TurnoInput' } } }
        },
        responses: { 201: { description: 'Turno registrado' } }
      }
    },
    '/api/turnos/{id}/finalizar': {
      patch: {
        summary: 'Finalizar un turno',
        security: [{ bearerAuth: [] }],
        tags: ['Turnos'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Turno finalizado' } }
      }
    },
    '/api/registros-acceso': {
      get: {
        summary: 'Listar registros de acceso',
        security: [{ bearerAuth: [] }],
        tags: ['Registros de Acceso'],
        parameters: [
          { name: 'en_predio', in: 'query', schema: { type: 'boolean' } },
          { name: 'apartamento', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Lista de accesos' } }
      },
      post: {
        summary: 'Registrar entrada de persona o vehículo',
        security: [{ bearerAuth: [] }],
        tags: ['Registros de Acceso'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegistroAccesoInput' } } }
        },
        responses: { 201: { description: 'Acceso registrado' } }
      }
    },
    '/api/registros-acceso/{id}/salida': {
      patch: {
        summary: 'Marcar hora de salida de un registro de acceso',
        security: [{ bearerAuth: [] }],
        tags: ['Registros de Acceso'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Salida registrada con fecha y hora actual' } }
      }
    },
    '/api/novedades': {
      get: {
        summary: 'Listar novedades del servicio',
        security: [{ bearerAuth: [] }],
        tags: ['Novedades'],
        responses: { 200: { description: 'Lista de novedades' } }
      },
      post: {
        summary: 'Reportar novedad o incidente',
        security: [{ bearerAuth: [] }],
        tags: ['Novedades'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NovedadInput' } } }
        },
        responses: { 201: { description: 'Novedad registrada' } }
      }
    },
    '/api/puestos': {
      get: {
        summary: 'Listar puestos de vigilancia',
        security: [{ bearerAuth: [] }],
        tags: ['Puestos de Vigilancia'],
        responses: { 200: { description: 'Lista de puestos' } }
      }
    },
    '/api/equipos': {
      get: {
        summary: 'Listar equipos asignados (radios, linternas, detectores)',
        security: [{ bearerAuth: [] }],
        tags: ['Equipos'],
        responses: { 200: { description: 'Lista de equipos' } }
      }
    },
    '/api/vehiculos': {
      get: {
        summary: 'Listar vehículos',
        security: [{ bearerAuth: [] }],
        tags: ['Vehículos'],
        responses: { 200: { description: 'Lista de vehículos' } }
      }
    },
    '/api/personas-acceso': {
      get: {
        summary: 'Listar visitantes, contratistas y residentes',
        security: [{ bearerAuth: [] }],
        tags: ['Personas de Acceso'],
        responses: { 200: { description: 'Lista de personas' } }
      }
    },
    '/api/objetos-perdidos': {
      get: {
        summary: 'Listar objetos encontrados/perdidos',
        security: [{ bearerAuth: [] }],
        tags: ['Objetos Perdidos'],
        responses: { 200: { description: 'Lista de objetos' } }
      }
    },
    '/api/pedidos': {
      get: {
        summary: 'Listar paquetes y pedidos en recepción',
        security: [{ bearerAuth: [] }],
        tags: ['Pedidos & Paquetería'],
        responses: { 200: { description: 'Lista de pedidos' } }
      }
    }
  }
};
