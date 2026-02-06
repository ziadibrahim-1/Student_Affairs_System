
export default class LoginView {
  constructor() {
    this.form = document.querySelector("#loginForm");
    this.errorBox = document.querySelector("#loginError");
    this.username = document.querySelector("#username");
    this.password = document.querySelector("#password");
    this.submitBtn = this.form.querySelector('button[type="submit"]');
  }

  onSubmit(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler({
        username: this.username.value.trim(),
        password: this.password.value.trim()
      });
    });
  }

  showError(msg) {
    this.errorBox.textContent = msg || "";
  }

  setLoading(isLoading) {
    this.submitBtn.disabled = isLoading;
    this.submitBtn.textContent = isLoading ? "Logging in..." : "Login";
  }
}
