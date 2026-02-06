import AuthService from "./services/AuthService.js";
import LoginView from "./views/LoginView.js";
import AuthController from "./controllers/AuthController.js"

const service = new AuthService();
const view = new LoginView();
const controller = new AuthController(service, view);

controller.initLoginPage();
