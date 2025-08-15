document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('regForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'index.html'; 
    });
  });

localStorage.setItem('registeredUser', 'true');

