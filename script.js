// Initialize projects in local storage
if (!localStorage.getItem("projects")) {
  localStorage.setItem("projects", JSON.stringify([]));
}

// Create a new project
document.getElementById("project-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const goal = parseFloat(document.getElementById("goal").value);

  const newProject = {
    id: Date.now(),
    title: title,
    description: description,
    goal: goal,
    raised: 0,
    updates: [],
  };

  const projects = JSON.parse(localStorage.getItem("projects"));
  projects.push(newProject);
  localStorage.setItem("projects", JSON.stringify(projects));

  displayProjects();
  updateProjectSelect();
  document.getElementById("project-form").reset();
});

// Display all projects
function displayProjects() {
  const projects = JSON.parse(localStorage.getItem("projects"));
  const projectsList = document.getElementById("projects-list");
  const projectSelect = document.getElementById("project-id");

  projectsList.innerHTML = "";
  projectSelect.innerHTML = "";

  projects.forEach(project => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project");
    projectElement.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <p>Funding Goal: $${project.goal}</p>
      <p>Raised: $${project.raised}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${(project.raised / project.goal) * 100}%"></div>
      </div>
    `;
    projectsList.appendChild(projectElement);

    // Add to select options
    const option = document.createElement("option");
    option.value = project.id;
    option.innerText = project.title;
    projectSelect.appendChild(option);
  });
}

// Update the project select dropdown
function updateProjectSelect() {
  const projects = JSON.parse(localStorage.getItem("projects"));
  const projectSelect = document.getElementById("project-id");
  projectSelect.innerHTML = "";
  
  projects.forEach(project => {
    const option = document.createElement("option");
    option.value = project.id;
    option.innerText = project.title;
    projectSelect.appendChild(option);
  });
}

// Handle contribution
document.getElementById("contribute-button").addEventListener("click", function () {
  const projectId = parseInt(document.getElementById("project-id").value);
  const contributionAmount = parseFloat(document.getElementById("contribution-amount").value);

  if (isNaN(contributionAmount) || contributionAmount <= 0) {
    alert("Please enter a valid contribution amount.");
    return;
  }

  const projects = JSON.parse(localStorage.getItem("projects"));
  const project = projects.find(p => p.id === projectId);
  project.raised += contributionAmount;

  localStorage.setItem("projects", JSON.stringify(projects));

  displayProjects();
  alert(`You contributed $${contributionAmount} to the project.`);
  document.getElementById("contribution-amount").value = "";
});

// Post project updates
document.getElementById("update-button").addEventListener("click", function () {
  const projectId = parseInt(document.getElementById("project-id").value);
  const updateMessage = document.getElementById("update-message").value.trim();

  if (!updateMessage) {
    alert("Please enter an update message.");
    return;
  }

  const projects = JSON.parse(localStorage.getItem("projects"));
  const project = projects.find(p => p.id === projectId);
  project.updates.push(updateMessage);

  localStorage.setItem("projects", JSON.stringify(projects));

  displayProjects();
  document.getElementById("update-message").value = "";
  alert("Update posted successfully.");
});

// Display projects on initial load
displayProjects();
updateProjectSelect();
