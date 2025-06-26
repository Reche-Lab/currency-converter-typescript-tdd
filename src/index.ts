import { createApp } from './app';
import { config } from './config/config';

const app = createApp();

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Currency Converter API is running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Server URL: http://localhost:${config.port}`);
  console.log(`📖 API Documentation: http://localhost:${config.port}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;

