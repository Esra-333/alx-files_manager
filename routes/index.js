// eslint-disable-next-line no-unused-vars
import { Express } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';
import { basicAuthenticate, xTokenAuthenticate } from '../middlewares/auth';
import { APIError, errorResponse } from '../middlewares/error';

/**
 * Injects routes with their handlers to the given Express application.
 * @param {Express} api - The Express application to which the routes will be added.
 */
const injectRoutes = (api) => {
  // AppController routes
  api.get('/status', AppController.getStatus);  // GET /status endpoint
  api.get('/stats', AppController.getStats);    // GET /stats endpoint

  // AuthController routes
  api.get('/connect', basicAuthenticate, AuthController.getConnect);    // Auth: Basic Authentication
  api.get('/disconnect', xTokenAuthenticate, AuthController.getDisconnect);  // Auth: Token-based Authentication

  // UsersController routes
  api.post('/users', UsersController.postNew);  // Create new user
  api.get('/users/me', xTokenAuthenticate, UsersController.getMe);  // Get current user info (token required)

  // FilesController routes
  api.post('/files', xTokenAuthenticate, FilesController.postUpload);  // Upload a file
  api.get('/files/:id', xTokenAuthenticate, FilesController.getShow);  // Get specific file by ID
  api.get('/files', xTokenAuthenticate, FilesController.getIndex);     // Get all files
  api.put('/files/:id/publish', xTokenAuthenticate, FilesController.putPublish);  // Publish a file
  api.put('/files/:id/unpublish', xTokenAuthenticate, FilesController.putUnpublish);  // Unpublish a file
  api.get('/files/:id/data', FilesController.getFile);  // Get file data

  // Catch-all route for undefined routes
  api.all('*', (req, res, next) => {
    errorResponse(new APIError(404, `Cannot ${req.method} ${req.url}`), req, res, next);  // Handle 404 errors
  });

  // Middleware for handling errors
  api.use(errorResponse);  // General error handling middleware
};

export default injectRoutes;

