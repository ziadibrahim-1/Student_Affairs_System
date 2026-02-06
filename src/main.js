
import AuthService from "./services/AuthService.js";
import AuthController from "./controllers/AuthController.js";

import StudentService from "./services/StudentService.js";
import StudentView from "./views/StudentView.js";
import StudentController from "./controllers/StudentController.js";

import CourseService from "./services/CourseService.js";
import CourseView from "./views/CourseView.js";
import CourseController from "./controllers/CourseController.js";

import InstructorService from "./services/InstructorService.js";
import InstructorView from "./views/InstructorView.js";
import InstructorController from "./controllers/InstructorController.js";

let currentEntity = null;
let currentController = null;


function resetUIBindings() {
  const idsToReset = [
    "searchInput",
    "addBtn",
    "prevBtn",
    "nextBtn",
    "cancelBtn",
    "saveBtn",
    "tableBody",
    "modal"
  ];

  idsToReset.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const clone = el.cloneNode(true);
    el.replaceWith(clone);
  });
}

function updateTableHeaders(headers, sortKeys) {
  
  headers.forEach((label, idx) => {
    const th = document.getElementById(`thField${idx + 1}`);
    if (!th) return;

    th.textContent = label;

    
    if (sortKeys?.[idx]) th.dataset.sort = sortKeys[idx];
  });
}


const entityConfigs = {
  students: {
    service: () => new StudentService("http://localhost:3000"),
    view: () => new StudentView(),
    controller: (service, view) => new StudentController(service, view),
    headers: ["Name", "Age", "Salary", "Phone", "Email", "Department"],
    sortKeys: ["name", "age", "salary", "phone", "email", "department"]
  },

  instructors: {
    service: () => new InstructorService("http://localhost:3000"),
    view: () => new InstructorView(),
    controller: (service, view) => new InstructorController(service, view),
    headers: ["Name", "Age", "Salary", "Phone", "Email", "Department"],
    sortKeys: ["name", "age", "salary", "phone", "email", "department"]
  },

  courses: {
    service: () => new CourseService("http://localhost:3000"),
    view: () => new CourseView(),
    controller: (service, view) => new CourseController(service, view),
    headers: ["Name", "Description", "Credits", "Department", "Instructor", "Duration"],
    sortKeys: ["name", "description", "credits", "department", "instructor", "duration"]
  }
};


async function initializeEntity(entity) {
  if (currentEntity === entity && currentController) return;

  const config = entityConfigs[entity];
  if (!config) return;

  
  resetUIBindings();

  
  updateTableHeaders(config.headers, config.sortKeys);

 
  const service = config.service();
  const view = config.view();
  const controller = config.controller(service, view);

  currentEntity = entity;
  currentController = controller;

  await controller.init();
}

window.addEventListener("DOMContentLoaded", async () => {
  
  const authService = new AuthService();
  const authController = new AuthController(authService);

  const allowed = await authController.requireAuth?.();
  if (allowed === false) return;

  const entitySelect = document.querySelector("#entitySelect");
  if (entitySelect) {
    entitySelect.addEventListener("change", async (e) => {
      await initializeEntity(e.target.value);
    });
  }
  await initializeEntity("students");
});
