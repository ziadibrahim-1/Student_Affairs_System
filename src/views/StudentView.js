export default class StudentView {
  constructor() {
    this.tbody = document.querySelector("#tableBody");
    this.searchInput = document.querySelector("#searchInput");
    this.addBtn = document.querySelector("#addBtn");
    this.prevBtn = document.querySelector("#prevBtn");
    this.nextBtn = document.querySelector("#nextBtn");
    this.pageLabel = document.querySelector("#pageLabel");

    this.modal = document.querySelector("#modal");
    this.modalTitle = document.querySelector("#modalTitle");
    this.modalErr = document.querySelector("#modalErr");
    this.cancelBtn = document.querySelector("#cancelBtn");
    this.saveBtn = document.querySelector("#saveBtn");

    this.mName = document.querySelector("#mName");
    this.mAge = document.querySelector("#mAge");
    this.mSalary = document.querySelector("#mSalary");
    this.mPhone = document.querySelector("#mPhone");
    this.mEmail = document.querySelector("#mEmail");
    this.mDepartment = document.querySelector("#mDepartment");

    this.state = {
      all: [],
      filtered: [],
      page: 1,
      pageSize: 6,
      sortKey: "id",
      sortDir: "asc",
      editingId: null
    };
  }

  bindHandlers({ onAdd, onEdit, onDelete, onSearch, onPageChange, onSort }) {
    // Open "Add" modal
    this.addBtn.addEventListener("click", () => onAdd());

    // Search
    this.searchInput.addEventListener("input", (e) => onSearch(e.target.value));

    // Pagination
    this.prevBtn.addEventListener("click", () => onPageChange(-1));
    this.nextBtn.addEventListener("click", () => onPageChange(+1));

    // Sort
    document.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => onSort(th.dataset.sort));
    });

    // Modal close
    this.cancelBtn.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Save (Add/Edit)
    this.saveBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const payload = this.readModal();
      if (!payload.ok) return;

      if (this.state.editingId == null) onAdd(payload.data);
      else onEdit(this.state.editingId, payload.data);
    });

    // Row actions (Edit/Delete)
    this.tbody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const id = btn.dataset.id; // keep as string
      const action = btn.dataset.action;

      if (action === "edit") onEdit(id);
      if (action === "delete") onDelete(id);
    });
  }

  setData(rows) {
    this.state.all = rows || [];
    this.applyFilterSortPaginate();
  }

  applySearch(term) {
    const t = (term || "").toLowerCase();
    this.state.filtered = this.state.all.filter((x) =>
      String(x.name || "").toLowerCase().includes(t)
    );
    this.state.page = 1;
    this.applySort();
    this.render();
  }

  setSort(key) {
    if (this.state.sortKey === key) {
      this.state.sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
    } else {
      this.state.sortKey = key;
      this.state.sortDir = "asc";
    }
    this.applySort();
    this.render();
  }

  changePage(delta) {
    this.state.page += delta;
    this.render();
  }

  applyFilterSortPaginate() {
    this.state.filtered = [...this.state.all];
    this.applySort();
    this.render();
  }

  applySort() {
    const { sortKey, sortDir } = this.state;
    const dir = sortDir === "asc" ? 1 : -1;

    this.state.filtered.sort((a, b) => {
      const av = a?.[sortKey];
      const bv = b?.[sortKey];

      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
    });
  }

  render() {
    const { filtered, page, pageSize } = this.state;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    this.state.page = safePage;

    const start = (safePage - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);

    this.tbody.innerHTML = pageRows.map((s) => this.rowHtml(s)).join("");

    this.pageLabel.textContent = `Page ${safePage}`;
    this.prevBtn.disabled = safePage <= 1;
    this.nextBtn.disabled = safePage >= totalPages;
  }

  rowHtml(s) {
    const id = s?.id ?? "";
    return `
      <tr>
        <td class="chk"><input type="checkbox" /></td>
        <td>${id}</td>
        <td>${s.name ?? ""}</td>
        <td>${s.age ?? ""}</td>
        <td>${s.salary ?? ""}</td>
        <td>${s.phone ?? ""}</td>
        <td>${s.email ?? ""}</td>
        <td>${s.department ?? ""}</td>
        <td class="actions">
          <button class="actionsBtn edit" data-action="edit" data-id="${id}">✏️</button>
          <button class="actionsBtn del" data-action="delete" data-id="${id}">🗑️</button>
        </td>
      </tr>
    `;
  }

  openModal({ title, student }) {
    this.modalTitle.textContent = title;
    this.modalErr.textContent = "";
    this.modal.classList.remove("hidden");

    this.mName.value = student?.name ?? "";
    this.mAge.value = student?.age ?? "";
    this.mSalary.value = student?.salary ?? "";
    this.mPhone.value = student?.phone ?? "";
    this.mEmail.value = student?.email ?? "";
    this.mDepartment.value = student?.department ?? "";

    // Focus first input (nice UX)
    setTimeout(() => this.mName.focus(), 0);
  }

  closeModal() {
    this.modal.classList.add("hidden");
    this.state.editingId = null;
  }

  readModal() {
    const name = this.mName.value.trim();
    if (!name) return this.fail("Name is required");

    const data = {
      name,
      age: Number(this.mAge.value || 0),
      salary: Number(this.mSalary.value || 0),
      phone: this.mPhone.value.trim(),
      email: this.mEmail.value.trim(),
      department: this.mDepartment.value.trim()
    };

    this.modalErr.textContent = "";
    return { ok: true, data };
  }

  fail(msg) {
    this.modalErr.textContent = msg;
    return { ok: false };
  }
}
