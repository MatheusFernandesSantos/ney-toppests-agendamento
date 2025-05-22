document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const timeSelect = document.getElementById('time');
    const appointmentsList = document.getElementById('appointmentsList');
    const dateInput = document.getElementById('date');

    // Define data mínima para hoje
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Gerar horários de 30 em 30 minutos das 09:00 às 19:00
    function generateTimeSlots() {
        const startHour = 9;
        const endHour = 19;
        for (let hour = startHour; hour < endHour; hour++) {
            timeSelect.appendChild(createOption(hour, '00'));
            timeSelect.appendChild(createOption(hour, '30'));
        }
    }

    function createOption(hour, minute) {
        const option = document.createElement('option');
        const formattedHour = hour.toString().padStart(2, '0');
        option.value = `${formattedHour}:${minute}`;
        option.textContent = `${formattedHour}:${minute}`;
        return option;
    }

    generateTimeSlots();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const date = dateInput.value;
        const service = document.getElementById('service').value;
        const time = timeSelect.value;

        const confirmation = confirm(`Confirma agendamento para ${name} no dia ${date} às ${time} para ${service}?`);

        if (confirmation) {
            const li = document.createElement('li');
            li.textContent = `${date} às ${time} - ${name} (${phone}, ${email}) - Serviço: ${service}`;
            appointmentsList.appendChild(li);

            form.reset();
            dateInput.setAttribute('min', today);  // Reforça a data mínima após reset
        }
    });
});
