
export default class InstructorService {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  async list() {
    const res = await fetch(`${this.baseUrl}/instructors`);
    if (!res.ok) throw new Error("Failed to load instructors");
    return await res.json();
  }

  async create(instructor) {
    const res = await fetch(`${this.baseUrl}/instructors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructor)
    });
    if (!res.ok) throw new Error("Failed to create instructor");
    return await res.json();
  }

  async update(id, instructor) {
    const safeId = encodeURIComponent(String(id));
    const res = await fetch(`${this.baseUrl}/instructors/${safeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructor)
    });
    if (!res.ok) throw new Error("Failed to update instructor");
    return await res.json();
  }

  async remove(id) {
    const safeId = encodeURIComponent(String(id));
    const res = await fetch(`${this.baseUrl}/instructors/${safeId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete instructor");
    return true;
  }
}
