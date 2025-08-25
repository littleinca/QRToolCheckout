const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
async function postData(url = '', data = {}) {
  try {
    const response = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch(e) {
    alert('Network unavailable. Please reconnect.');
  }
}

document.getElementById('addUserBtn').addEventListener('click', async () => {
  const userID = document.getElementById('newUserID').value;
  const name = document.getElementById('newUserName').value;
  if(userID && name){
    const result = await postData('/api/addUser', {userID, name});
    alert(result.message);
    QRCode.toCanvas(document.getElementById('userQRCode'), userID);
  }
});

document.getElementById('addToolBtn').addEventListener('click', async () => {
  const toolID = document.getElementById('newToolID').value;
  const name = document.getElementById('newToolName').value;
  if(toolID && name){
    const result = await postData('/api/addTool', {toolID, name});
    alert(result.message);
    QRCode.toCanvas(document.getElementById('toolQRCode'), toolID);
  }
});

// Register service worker
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.log('SW failed', err));
  });
}
async function loadUsers() {
  const res = await fetch('/api/getUsers');
  const users = await res.json();
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><button onclick="deleteUser(${user.id})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteUser(id) {
  await fetch('/api/deleteUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  loadUsers();
}

async function loadTools() {
  const res = await fetch('/api/getTools');
  const tools = await res.json();
  const tbody = document.querySelector('#toolsTable tbody');
  tbody.innerHTML = '';
  tools.forEach(tool => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${tool.id}</td>
      <td>${tool.name}</td>
      <td>
        <input type="text" value="${tool.notes || ''}" 
          onchange="updateTool(${tool.id}, this.value)" />
      </td>
      <td><button onclick="deleteTool(${tool.id})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteTool(id) {
  await fetch('/api/deleteTool', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  loadTools();
}

async function updateTool(id, notes) {
  await fetch('/api/updateTool', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, notes })
  });
}

// Load on page ready
window.onload = () => {
  loadUsers();
  loadTools();
};

function filterTable(inputId, tableId) {
  const filter = document.getElementById(inputId).value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
}

document.getElementById('userSearch').addEventListener('keyup', () => {
  filterTable('userSearch', 'usersTable');
});

document.getElementById('toolSearch').addEventListener('keyup', () => {
  filterTable('toolSearch', 'toolsTable');
});
