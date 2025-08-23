let userID = '';
let toolID = '';
let scanningFor = '';

const userIdDisplay = document.getElementById('userIdDisplay');
const toolIdDisplay = document.getElementById('toolIdDisplay');
const html5QrCode = new Html5Qrcode("qr-reader");

function startScanner(target) {
  scanningFor = target;
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      if (scanningFor === 'user') {
        userID = decodedText;
        userIdDisplay.textContent = userID;
      } else if (scanningFor === 'tool') {
        toolID = decodedText;
        toolIdDisplay.textContent = toolID;
      }
      html5QrCode.stop();
    }
  );
}

document.getElementById('scanUserBtn').addEventListener('click', () => startScanner('user'));
document.getElementById('scanToolBtn').addEventListener('click', () => startScanner('tool'));

async function postData(url = '', data = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (e) {
    alert('Network unavailable. Please reconnect to complete this action.');
  }
}

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  if (userID && toolID) {
    const result = await postData('/api/checkout', { userID, toolID });
    if (result?.message) alert(result.message);
  } else {
    alert('Scan both User and Tool QR codes first!');
  }
});

document.getElementById('checkinBtn').addEventListener('click', async () => {
  if (toolID) {
    const result = await postData('/api/checkin', { toolID });
    if (result?.message) alert(result.message);
  } else {
    alert('Scan Tool QR code first!');
  }
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.log('SW failed', err));
  });
}