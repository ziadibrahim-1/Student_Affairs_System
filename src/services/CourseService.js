
export default class CourseService {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  async list() {
    const res = await fetch(`${this.baseUrl}/courses`);
    if (!res.ok) throw new Error("Failed to load courses");
    return await res.json();
  }

  async create(course) {
    const res = await fetch(`${this.baseUrl}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error("Failed to create course");
    return await res.json();
  }

  async update(id, course) {
    const safeId = encodeURIComponent(String(id));
    const res = await fetch(`${this.baseUrl}/courses/${safeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error("Failed to update course");
    return await res.json();
  }

  async remove(id) {
    const safeId = encodeURIComponent(String(id));
    const res = await fetch(`${this.baseUrl}/courses/${safeId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete course");
    return true;
  }
}
