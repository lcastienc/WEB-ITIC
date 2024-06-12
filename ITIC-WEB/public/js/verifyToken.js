(function() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/Login';
      return;
    }
  
    fetch('http://localhost:3000/verifyToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (!response.ok) {
        window.location.href = '/Login';
      }
      return response.json();
    }).then(data => {
      if (!data.valid) {
        window.location.href = '/Login';
      }
    }).catch(error => {
      console.error('Error verifying token:', error);
      window.location.href = '/Login';
    });
  })();
  