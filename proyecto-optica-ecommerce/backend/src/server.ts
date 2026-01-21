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

const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS - permitir todos los orígenes en desarrollo
app.use(cors({
  origin: true,
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
