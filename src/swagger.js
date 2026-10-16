const err = { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } };
const sec = [{ bearerAuth: [] }];
const idParam = (n = 'id') => ({ name: n, in: 'path', required: true, schema: { type: 'string', example: '665f1c2e8b3a4d0012ab34cd' } });
const body = (ref) => ({ required: true, content: { 'application/json': { schema: { $ref: `#/components/schemas/${ref}` } } } });
const ok = (d, ref) => ({ description: d, content: { 'application/json': { schema: ref ? { $ref: `#/components/schemas/${ref}` } : { type: 'object' } } } });

module.exports = {
  openapi: '3.0.3',
  info: { title: 'API de Equipos', version: '2.0.0', description: 'API REST (Express + MongoDB/Mongoose) para gestionar equipos y sus asignaciones. Seguridad con JWT.' },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Error: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } },
      Login: { type: 'object', required: ['correo', 'contrasena'], properties: { correo: { type: 'string' }, contrasena: { type: 'string' } } },
      Register: { type: 'object', required: ['correo', 'contrasena', 'nombre_completo'], properties: { correo: { type: 'string' }, contrasena: { type: 'string', minLength: 6 }, nombre_completo: { type: 'string' } } },
      Equipo: { type: 'object', required: ['nombre_activo', 'serial_unico', 'estado'], properties: { _id: { type: 'string', readOnly: true }, nombre_activo: { type: 'string' }, serial_unico: { type: 'string' }, estado: { type: 'string', enum: ['Bueno', 'Regular', 'Dañado'] } } },
      Asignacion: { type: 'object', required: ['idusuario', 'idequipos'], properties: { idusuario: { type: 'string' }, idequipos: { type: 'string' }, observaciones_entrega: { type: 'string' } } },
    },
  },
  paths: {
    '/api/auth/login': { post: { tags: ['Auth'], summary: 'Iniciar sesión (devuelve JWT)', requestBody: body('Login'), responses: { 200: ok('Token y usuario'), 400: err, 401: err, 500: err } } },
    '/api/auth/register': { post: { tags: ['Auth'], summary: 'Registrar usuario', requestBody: body('Register'), responses: { 201: ok('Usuario creado'), 400: err, 500: err } } },
    '/api/equipos': {
      get: { tags: ['Equipos'], security: sec, summary: 'Listar equipos', parameters: [{ name: 'estado', in: 'query', schema: { type: 'string' } }], responses: { 200: ok('Lista de equipos'), 401: err, 500: err } },
      post: { tags: ['Equipos'], security: sec, summary: 'Crear equipo (admin)', requestBody: body('Equipo'), responses: { 201: ok('Creado', 'Equipo'), 400: err, 401: err, 403: err, 500: err } },
    },
    '/api/equipos/{id}': {
      get: { tags: ['Equipos'], security: sec, summary: 'Obtener un equipo', parameters: [idParam()], responses: { 200: ok('Equipo', 'Equipo'), 400: err, 401: err, 404: err, 500: err } },
      put: { tags: ['Equipos'], security: sec, summary: 'Actualizar equipo (admin)', parameters: [idParam()], requestBody: body('Equipo'), responses: { 200: ok('Actualizado', 'Equipo'), 400: err, 401: err, 403: err, 404: err, 500: err } },
      delete: { tags: ['Equipos'], security: sec, summary: 'Eliminar equipo (admin)', parameters: [idParam()], responses: { 200: ok('Eliminado'), 400: err, 401: err, 403: err, 404: err, 500: err } },
    },
    '/api/usuarios/{id}/equipos': { get: { tags: ['Asignaciones'], security: sec, summary: 'Equipos asignados a un usuario', parameters: [idParam()], responses: { 200: ok('Lista de asignaciones'), 400: err, 401: err, 403: err, 500: err } } },
    '/api/asignaciones': { post: { tags: ['Asignaciones'], security: sec, summary: 'Asignar equipo a usuario (admin)', requestBody: body('Asignacion'), responses: { 201: ok('Asignación creada'), 400: err, 401: err, 403: err, 500: err } } },
    '/api/asignaciones/{id}/devolver': { put: { tags: ['Asignaciones'], security: sec, summary: 'Registrar devolución (admin)', parameters: [idParam()], responses: { 200: ok('Devuelto'), 400: err, 401: err, 403: err, 404: err, 500: err } } },
  },
};
