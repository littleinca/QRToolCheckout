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