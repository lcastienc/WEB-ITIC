export default function verifyToken(allowedRoles = []) {
  if (typeof window === 'undefined') {
    // Esto asegura que el script solo se ejecute en el cliente
    return;
  }

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
      return;
    }
    return response.json();
  }).then(data => {
    if (!data.valid || (allowedRoles.length > 0 && !allowedRoles.includes(data.role))) {
      window.location.href = '/Login';
      return;
    }
  }).catch(error => {
    console.error('Error verifying token:', error);
    window.location.href = '/Login';
  });
}
