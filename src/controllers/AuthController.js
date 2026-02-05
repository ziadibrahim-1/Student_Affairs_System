export default class AuthController {
  constructor(service, view) {
    this.service = service;
    this.view = view;
  }

  initLoginPage() {
    this.view.onSubmit(async ({ username, password }) => {
      this.view.showError("");
      this.view.setLoading(true);

      try {
        await this.service.login(username, password);
        window.location.href = "index.html";
      } catch (e) {
        if (e?.message === "Invalid credentials") {
          this.view.showError("Invalid username or password");
        } else {
          this.view.showError("Server error. Make sure json-server is running.");
        }
      } finally {
        this.view.setLoading(false);
      }
    });
  }
}
