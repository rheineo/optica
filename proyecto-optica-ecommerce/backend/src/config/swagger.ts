import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Liney Visión API',
      version: '1.0.0',
      description: 'API REST para el e-commerce de óptica Liney Visión',
      contact: {
        name: 'Liney Visión Support',
        email: 'soporte@lineyvision.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['CLIENTE', 'ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            sku: { type: 'string' },
            nombre: { type: 'string' },
            marca: { type: 'string' },
            categoria: { type: 'string', enum: ['MONTURAS_SOL', 'MONTURAS_OFTALMICA', 'LENTES_CONTACTO', 'ACCESORIOS'] },
            precio: { type: 'number' },
            descuento: { type: 'number' },
            imagenes: { type: 'array', items: { type: 'string' } },
            descripcion: { type: 'string' },
            caracteristicas: { type: 'object' },
            stock: { type: 'integer' },
            activo: { type: 'boolean' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            slug: { type: 'string' },
            descripcion: { type: 'string' },
            imagen: { type: 'string' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
            totalItems: { type: 'integer' },
            totalPrice: { type: 'number' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            productId: { type: 'string', format: 'uuid' },
            cantidad: { type: 'integer' },
            product: { $ref: '#/components/schemas/Product' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string' },
            phone: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autenticación y registro de usuarios' },
      { name: 'Products', description: 'Gestión de productos' },
      { name: 'Categories', description: 'Categorías de productos' },
      { name: 'Cart', description: 'Carrito de compras' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
