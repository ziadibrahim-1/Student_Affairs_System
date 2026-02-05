import AuthService from "./services/AuthService.js";
import AuthController from "./controllers/AuthController.js";

import StudentService from "./services/StudentService.js";
import StudentView from "./views/StudentView.js";
import StudentController from "./controllers/StudentController.js";

window.addEventListener("DOMContentLoaded", async () => {
  // 1) Auth guard
  const authService = new AuthService();
  const authController = new AuthController(authService);

  // لو requireAuth بيرجع true/false يبقى ممتاز
  // لو بيعمل redirect لوحده، برضه تمام
  const allowed = await authController.requireAuth?.();

  // لو فيه منع (redirect) وقف هنا
  if (allowed === false) return;

  // 2) Students table
  const service = new StudentService("http://localhost:3000");
  const view = new StudentView();
  const controller = new StudentController(service, view);

  await controller.init();
});
