async function fetchData(endpoint){
  try{
    const res = await fetch(endpoint);
    return await res.json();
  } catch(e){
    alert('Unable to fetch data. Check network.');
    return [];
  }
}

async function loadTools(){
  const tools = await fetchData('/api/getTools');
  const table = document.getElementById('toolsTable');
  tools.forEach(t=>{
    const row = table.insertRow();
    row.insertCell(0).innerText = t.toolID;
    row.insertCell(1).innerText = t.name;
    row.insertCell(2).innerText = t.checkedOutBy || '-';
  });
}

async function loadTransactions(){
  const txs = await fetchData('/api/getTransactions');
  const table = document.getElementById('transactionsTable');
  txs.forEach(tx=>{
    const row = table.insertRow();
    row.insertCell(0).innerText = tx.toolID;
    row.insertCell(1).innerText = tx.userID || '-';
    row.insertCell(2).innerText = tx.action;
    row.insertCell(3).innerText = new Date(tx.timestamp).toLocaleString();
  });
}

loadTools();
loadTransactions();

// Register service worker
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.log('SW failed', err));
  });
}