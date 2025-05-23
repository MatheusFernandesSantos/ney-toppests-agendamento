document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const timeSelect = document.getElementById('time');
    const appointmentsList = document.getElementById('appointmentsList');
    const dateInput = document.getElementById('date');

    const nameSelect = document.getElementById('nameSelect');
    const phoneSelect = document.getElementById('phoneSelect');
    const emailSelect = document.getElementById('emailSelect');

    // Função para preencher os selects com placeholder
    function fillSelect(selectElement, optionsArray, placeholder) {
        const defaultOption = document.createElement('option');
        defaultOption.text = placeholder;
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        optionsArray.forEach(option => {
            const opt = document.createElement('option');
            opt.text = option;
            opt.value = option;
            selectElement.appendChild(opt);
        });
    }

    const names = [
        "Adriana", "Afonso", "Alex", "Alice", "Aline", "Amanda", "Anderson", "André", "Antônia", "Arthur",
        "Barbara", "Beatriz", "Benício", "Bernardo", "Bianca", "Bruno", "Bryan", "Caio", "Camila", "Carla",
        "Carlos", "Carolina", "Catarina", "Cauã", "Cecília", "Clara", "Cláudio", "Cristina", "César", "Daniel",
        "Daniele", "Davi", "Débora", "Diego", "Eduardo", "Elena", "Elias", "Elisa", "Emanuel", "Emilly",
        "Enzo", "Erick", "Estela", "Eva", "Fábio", "Fernanda", "Felipe", "Fernando", "Flávia", "Francisco",
        "Gabriel", "Gabriela", "Giovana", "Gisele", "Guilherme", "Gustavo", "Heitor", "Helena", "Henrique", "Hugo",
        "Ian", "Igor", "Ingrid", "Isabel", "Isabela", "Isadora", "Isaque", "Ítalo", "Ivana", "Ivo",
        "Jéssica", "Joana", "João", "Joaquim", "Jonas", "Jonathan", "José", "Julia", "Juliana", "Júlio",
        "Karen", "Karina", "Kauã", "Kelly", "Kevin", "Kléber", "Lara", "Larissa", "Laura", "Leandro",
        "Leonardo", "Letícia", "Lia", "Lígia", "Lilian", "Livia", "Lorena", "Lucas", "Luciana", "Luiz",
        "Luiza", "Luna", "Manuela", "Marcela", "Marcelo", "Marcos", "Maria", "Mariana", "Marina", "Mateus",
        "Matheus", "Melissa", "Miguel", "Milena", "Murilo", "Natália", "Nathan", "Nicole", "Nicolas", "Noah",
        "Olga", "Otávio", "Paola", "Patrícia", "Paulo", "Pedro", "Pietro", "Priscila", "Rafael", "Rafaela",
        "Raul", "Rebeca", "Renan", "Renata", "Ricardo", "Roberta", "Rodrigo", "Rogério", "Rosa", "Rúbia",
        "Sabrina", "Samuel", "Sandra", "Sara", "Sebastião", "Selma", "Sérgio", "Sofia", "Sophia", "Sueli",
        "Tainá", "Tainara", "Talita", "Tatiane", "Tatiana", "Teodoro", "Thiago", "Tomas", "Tomás", "Valentina",
        "Valéria", "Vanessa", "Vera", "Verônica", "Vicente", "Vicentina", "Victor", "Victoria", "Vinícius", "Vitor",
        "Vitória", "Vivian", "Vivi", "Vladimir", "Wallace", "Walter", "Wanderley", "Wellington", "Wesley", "William",
        "Wilson", "Xavier", "Yara", "Yasmin", "Yuri", "Zacarias", "Zélia", "Zenaide", "Zilda", "Zuleica"
    ];

    const phones = names.map((_, i) => {
        const num = (100000000 + i).toString().padStart(9, '0');
        return `(99) ${num.slice(0, 5)}-${num.slice(5)}`;
    });

    const emails = names.map(name => {
        const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return `${normalized}@email.com`;
    });

    // Preenche os selects com placeholder
    fillSelect(nameSelect, names, 'Nome');
    fillSelect(phoneSelect, phones, 'Telefone');
    fillSelect(emailSelect, emails, 'Email');

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

    // Função para resetar selects para placeholder
    function resetSelects() {
        nameSelect.selectedIndex = 0;
        phoneSelect.selectedIndex = 0;
        emailSelect.selectedIndex = 0;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameSelect.value;
        const phone = phoneSelect.value;
        const email = emailSelect.value;
        const date = dateInput.value;
        const service = document.getElementById('service').value;
        const time = timeSelect.value;

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

        const confirmation = confirm(`Confirma agendamento para ${name} no dia e horário (Brasil): ${dateTimeBrFormatted} para ${service}?`);

        if (confirmation) {
            const li = document.createElement('li');
            li.textContent = `${date} às ${time} - ${name} (${phone}, ${email}) - Serviço: ${service}`;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.classList.add('remove-btn');
            removeBtn.title = 'Remover agendamento';

            removeBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja remover este agendamento?')) {
                    appointmentsList.removeChild(li);
                    resetSelects();
                }
            });

            li.appendChild(removeBtn);
            appointmentsList.appendChild(li);

            alert(`Agendamento marcado com sucesso para ${dateTimeBrFormatted}!`);

            form.reset();
            dateInput.setAttribute('min', today);

            resetSelects();  // resetar selects após confirmar agendamento
        } else {
            // Usuário cancelou a confirmação do agendamento
            resetSelects();
        }
    });
});
