document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const timeSelect = document.getElementById('time');
    const appointmentsList = document.getElementById('appointmentsList');
    const dateInput = document.getElementById('date');

    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Filtro por data base
    const filterDateInput = document.createElement('input');
    filterDateInput.type = 'date';
    filterDateInput.value = today;
    filterDateInput.style.margin = '10px';

    // Inserir o filtro antes da lista de agendamentos
    appointmentsList.parentElement.insertBefore(filterDateInput, appointmentsList);

    function generateTimeSlots() {
        for (let hour = 9; hour < 19; hour++) {
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = dateInput.value;  // "YYYY-MM-DD"
        const service = document.getElementById('service').value;
        const time = timeSelect.value; // "HH:mm"

        // 🚫 Verifica se o horário é no passado
        const now = new Date();
        const selectedDateTime = new Date(`${date}T${time}`);
        if (selectedDateTime < now) {
            alert('Não é possível agendar para um horário anterior ao atual.');
            return;
        }

        const existingAppointmentsRes = await fetch('http://localhost:3000/api/appointments');
        const existingAppointments = await existingAppointmentsRes.json();

        const conflict = existingAppointments.some(a => {
            const appointmentDate = a.date.slice(0, 10); // extrair só a parte da data
            return appointmentDate === date && a.time === time;
        });

        if (conflict) {
            alert(`Já existe um agendamento para ${date} às ${time}. Escolha outro horário.`);
            return;
        }

        const confirmation = confirm(`Confirma agendamento para ${name} no dia ${date} às ${time} para ${service}?`);
        if (!confirmation) return;

        const response = await fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, date, time, service })
        });

        const data = await response.json();
        alert(data.message);
        form.reset();
        dateInput.setAttribute('min', today);
        loadAppointments();
    });

    async function deleteAppointment(id) {
        try {
            const res = await fetch(`http://localhost:3000/api/appointments/${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                loadAppointments();
            } else {
                alert('Erro: ' + data.message);
            }
        } catch (error) {
            console.error('Erro na exclusão:', error);
            alert('Erro ao excluir agendamento.');
        }
    }

    async function loadAppointments() {
        const res = await fetch('http://localhost:3000/api/appointments');
        const appointments = await res.json();

        const selectedDate = filterDateInput.value; // string no formato "YYYY-MM-DD"
        appointmentsList.innerHTML = '';

        appointments
            .filter(a => {
                const appointmentDate = a.date.slice(0, 10);
                return appointmentDate === selectedDate;
            })
            .forEach(a => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${a.date} às ${a.time} - ${a.name} (${a.phone}) - Serviço: ${a.service}
                    <button data-id="${a.id}">Excluir</button>
                `;
                appointmentsList.appendChild(li);
            });

        appointmentsList.querySelectorAll('button[data-id]').forEach(btn => {
            btn.addEventListener('click', () => deleteAppointment(btn.getAttribute('data-id')));
        });
    }

    filterDateInput.addEventListener('change', loadAppointments);

    loadAppointments();
});
