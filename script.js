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

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = dateInput.value;
        const service = document.getElementById('service').value;
        const time = timeSelect.value;

        // Formatação da data e hora para exibição no prompt confirm
        // Ajuste para horário Brasil (UTC-3) com Intl.DateTimeFormat
        const dateTimeBr = new Date(`${date}T${time}:00`);
        const options = {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        const dateTimeBrFormatted = new Intl.DateTimeFormat('pt-BR', options).format(dateTimeBr);

        // Primeiro prompt de confirmação com data/hora Brasil
        const confirmation = confirm(`Confirma agendamento para ${name} no dia e horário (Brasil): ${dateTimeBrFormatted} para ${service}?`);

        if (confirmation) {
            const li = document.createElement('li');
            li.textContent = `${date} às ${time} - ${name} (${phone}, ${email}) - Serviço: ${service}`;

            // Criar botão remover
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.classList.add('remove-btn');
            removeBtn.title = 'Remover agendamento';

            // Evento para remover o agendamento ao clicar no botão
            removeBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja remover este agendamento?')) {
                    appointmentsList.removeChild(li);
                }
            });

            // Inserir botão no li (mantendo texto e botão alinhados)
            li.appendChild(removeBtn);

            appointmentsList.appendChild(li);

            // Segundo prompt de sucesso
            alert(`Agendamento marcado com sucesso para ${dateTimeBrFormatted}!`);

            form.reset();
            dateInput.setAttribute('min', today);  // Reforça a data mínima após reset
        }
    });
});
