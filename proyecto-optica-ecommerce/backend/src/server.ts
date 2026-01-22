import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import productsRoutes from './routes/productsRoutes';
import cartRoutes from './routes/cartRoutes';
import adminOrdersRoutes from './routes/adminOrdersRoutes';
import adminUsersRoutes from './routes/adminUsersRoutes';
import configRoutes from './routes/configRoutes';
import uploadRoutes from './routes/uploadRoutes';
import domainRoutes from './routes/domainRoutes';

const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS - configuración para producción y desarrollo
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://liney-vision.vercel.app',
  'https://optica-rho.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // En producción, permitir cualquier subdominio de vercel.app
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Temporalmente permitir todos para debug
      }
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    error: 'Demasiadas solicitudes, intenta de nuevo más tarde',
  },
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Liney Visión API Docs',
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/domains', domainRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Liney Visión funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
  console.log(`📦 Ambiente: ${config.nodeEnv}`);
});

export default app;
