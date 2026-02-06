export default class StudentController {
  constructor(service, view) {
    this.service = service;
    this.view = view;
  }

  async init() {
    this.view.bindHandlers({
      onAdd: (payload) => this.handleAdd(payload),
      onEdit: (idOrPayload, payload) => this.handleEdit(idOrPayload, payload),
      onDelete: (id) => this.handleDelete(id),
      onSearch: (term) => this.view.applySearch(term),
      onPageChange: (delta) => this.view.changePage(delta),
      onSort: (key) => this.view.setSort(key)
    });

    await this.reload();
  }

  async reload() {
    const rows = await this.service.list();
    this.view.setData(rows);
  }

  async handleAdd(payload) {

    if (!payload) {
      this.view.state.editingId = null;
      this.view.openModal({ title: "Add Student", student: null });
      return;
    }

    await this.service.create(payload);
    this.view.closeModal();
    await this.reload();
  }

  async handleEdit(idOrPayload, payload) {
    if (payload == null && typeof idOrPayload === "string") {
      const id = idOrPayload;
      const current = this.view.state.all.find((x) => String(x.id) === String(id));
      this.view.state.editingId = id;
      this.view.openModal({ title: "Edit Student", student: current });
      return;
    }

    
    const id = idOrPayload;

    await this.service.update(id, { ...payload, id });

    this.view.closeModal();
    await this.reload();
  }

  async handleDelete(id) {
    const ok = confirm("Delete this row?");
    if (!ok) return;

    await this.service.remove(id);
    await this.reload();
  }
}
