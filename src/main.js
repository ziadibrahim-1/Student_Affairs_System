
import AuthService from "./services/AuthService.js";
import AuthController from "./controllers/AuthController.js";

const authService = new AuthService();
const authController = new AuthController(authService);

authController.requireAuth()
