
export default class AuthController {
  constructor(authService, loginView = null) {
    this.authService = authService;
    this.loginView = loginView;
  }

  requireAuth() {
    if (!this.authService.isAuthorized()) {
      window.location.href = "login.html";
    }
  }

  initLoginPage() {
    // لو already logged in -> روح للـindex
    if (this.authService.isAuthorized()) {
      window.location.href = "index.html";
      return;
    }

    this.loginView.onSubmit(async ({ username, password }) => {
      this.loginView.showError("");
      this.loginView.setLoading(true);

      try {
        const session = await this.authService.login(username, password);
        if (!session) {
          this.loginView.showError("Invalid username or password");
          return;
        }
        window.location.href = "index.html";
      } catch (e) {
        this.loginView.showError("Server error. Make sure json-server is running.");
        console.error(e);
      } finally {
        this.loginView.setLoading(false);
      }
    });
  }
}
