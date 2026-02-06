
export default class CourseView {
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
    this.addBtn.addEventListener("click", () => onAdd());
    this.searchInput.addEventListener("input", (e) => onSearch(e.target.value));
    this.prevBtn.addEventListener("click", () => onPageChange(-1));
    this.nextBtn.addEventListener("click", () => onPageChange(+1));

    document.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => onSort(th.dataset.sort));
    });

    this.cancelBtn.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    this.saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const payload = this.readModal();
      if (!payload.ok) return;

      if (this.state.editingId == null) onAdd(payload.data);
      else onEdit(this.state.editingId, payload.data);
    });

    this.tbody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const id = btn.dataset.id;
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
    const t = (term || "").toLowerCase()
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

    this.tbody.innerHTML = pageRows.map((x) => this.rowHtml(x)).join("");

    this.pageLabel.textContent = `Page ${safePage}`;
    this.prevBtn.disabled = safePage <= 1;
    this.nextBtn.disabled = safePage > totalPages;
  }

  rowHtml(c) {
    const id = c?.id ?? "";
    return `
      <tr>
        <td class="chk"><input type="checkbox" /></td>
        <td>${id}</td>
        <td>${c.name ?? ""}</td>
        <td>${c.description ?? ""}</td>
        <td>${c.credits ?? ""}</td>
        <td>${c.department ?? ""}</td>
        <td>${c.instructor ?? ""}</td>
        <td>${c.duration ?? ""}</td>
        <td class="actions">
          <button class="actionsBtn edit" data-action="edit" data-id="${id}">✏️</button>
          <button class="actionsBtn del" data-action="delete" data-id="${id}">🗑️</button>
        </td>
      </tr>
    `;
  }

  openModal({ title, course }) {
    this.modalTitle.textContent = title;
    this.modalErr.textContent = "";
    this.modal.classList.remove("hidden");

    
    this.mAge.type = "text";      
    this.mSalary.type = "number"; 

    
    this.mName.value = course?.name ?? "";
    this.mAge.value = course?.description ?? "";
    this.mSalary.value = course?.credits ?? "";
    this.mPhone.value = course?.department ?? "";
    this.mEmail.value = course?.instructor ?? "";
    this.mDepartment.value = course?.duration ?? "";

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
      description: this.mAge.value.trim(),
      credits: Number(this.mSalary.value || 0),
      department: this.mPhone.value.trim(),
      instructor: this.mEmail.value.trim(),
      duration: this.mDepartment.value.trim()
    };

    this.modalErr.textContent = "";
    return { ok: true, data };
  }

  fail(msg) {
    this.modalErr.textContent = msg;
    return { ok: false };
  }
}
