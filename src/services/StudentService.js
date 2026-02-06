export default class StudentService {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  async list() {
    const res = await fetch(`${this.baseUrl}/students`);
    if (!res.ok) throw new Error("Failed to load students");
    return await res.json();
  }

  async create(student) {
    const res = await fetch(`${this.baseUrl}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error("Failed to create student");
    return await res.json();
  }

  async update(id, student) {
    const safeId = encodeURIComponent(String(id));
    const res = await fetch(`${this.baseUrl}/students/${safeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error("Failed to update student");
    return await res.json();
  }

  async remove(id) {
    const safeId = encodeURIComponent(String(id));
    const res = await fetch(`${this.baseUrl}/students/${safeId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete student");
    return true;
  }
}
