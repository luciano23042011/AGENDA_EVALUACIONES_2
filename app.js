document.addEventListener('DOMContentLoaded', () => {
  let eventos = [];

  const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    initialView: 'dayGridMonth',
    dateClick: function (info) {
      const fecha = info.dateStr;
      document.getElementById('modal').classList.remove('hidden');
      document.getElementById('guardar').onclick = () => {
        const materia = document.getElementById('materia').value;
        const descripcion = document.getElementById('descripcion').value;
        const recordatorio = document.getElementById('recordatorio').checked;
        const hora = document.getElementById('hora-recordatorio').value;

        if (materia.trim() === '') return alert('Escribe la materia');

        eventos.push({
          title: materia,
          start: fecha,
          backgroundColor: 'var(--evaluacion)',
          extendedProps: {
            descripcion,
            recordatorio,
            hora,
          }
        });

        calendar.addEvent({
          title: materia,
          start: fecha,
          backgroundColor: '#2196f3'
        });

        if (recordatorio) {
          scheduleNotification(materia, descripcion, fecha, hora);
        }

        document.getElementById('modal').classList.add('hidden');
      };
    },
    events: [
      // Feriados (resaltados)
      { title: 'Feriado Año Nuevo', start: '2025-01-01', backgroundColor: 'orange' },
      { title: 'Feriado Independencia', start: '2025-07-09', backgroundColor: 'orange' }
    ]
  });

  calendar.render();

  document.getElementById('cerrar').onclick = () => {
    document.getElementById('modal').classList.add('hidden');
  };

  // Modo oscuro/claro
  const toggleBtn = document.getElementById('toggle-theme');
  toggleBtn.onclick = () => {
    document.body.classList.toggle('light');
  };

  // Notificación diaria para agendar
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }

  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 7 && now.getMinutes() === 0) {
      showNotification("¿TIENES QUE AGENDAR UNA EVALUACIÓN??");
    }
  }, 60000);
});

function scheduleNotification(title, desc, dateStr, timeStr) {
  const target = new Date(dateStr + 'T' + timeStr);
  const delay = target.getTime() - Date.now() - 86400000;
  if (delay > 0) {
    setTimeout(() => {
      showNotification("Mañana tienes: " + title + "\n" + desc);
    }, delay);
  }
}

function showNotification(msg) {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg.showNotification(msg);
    });
  }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}