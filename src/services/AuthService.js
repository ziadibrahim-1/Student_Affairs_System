
export default class AuthService {
  constructor(baseUrl = "http://localhost:3000", storageKey = "sas_auth") {
    this.baseUrl = baseUrl;
    this.storageKey = storageKey;
  }

  async login(username, password) {
    const url = `${this.baseUrl}/employees?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Login request failed");

    const data = await res.json();
    if (!data || data.length === 0) throw new Error("Invalid credentials");

    const emp = data[0];
    const session = {
      isAuth: true,
      employeeId: emp.id,
      name: emp.name || emp.username,
      ts: Date.now()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(session));
    return session;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }

  getSession() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  isAuthorized() {
    return !!this.getSession()?.isAuth;
  }
}
