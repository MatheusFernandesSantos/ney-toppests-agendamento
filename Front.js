const API_URL = "http://localhost:5000";

function gerarHorarios() {
    const selectHorario = document.getElementById("horario");
    selectHorario.innerHTML = "";
    let hora = 9;
    let minuto = 0;
    while (hora < 19 || (hora === 19 && minuto === 0)) {
        const horaFormatada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        const option = document.createElement("option");
        option.value = horaFormatada;
        option.textContent = horaFormatada;
        selectHorario.appendChild(option);
        minuto += 30;
        if (minuto === 60) {
            minuto = 0;
            hora++;
        }
    }
}

async function carregarAgendamentos() {
    try {
        const response = await fetch(`${API_URL}/agendamentos`);
        const agendamentos = await response.json();
        const listaAgendamentos = document.getElementById("lista-agendamentos");
        listaAgendamentos.innerHTML = "";
        agendamentos.forEach(agendamento => {
            const li = document.createElement("li");
            li.textContent = `${agendamento.nome} - ${agendamento.servico} - ${agendamento.horario}`;
            listaAgendamentos.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
    }
}

async function agendarHorario() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const servico = document.getElementById("servico").value;
    const horario = document.getElementById("horario").value;

    if (!nome || !telefone || !email || !horario) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        await fetch(`${API_URL}/agendamentos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, telefone, email, servico, horario })
        });

        carregarAgendamentos();
    } catch (error) {
        console.error("Erro ao agendar horário:", error);
    }
}

window.onload = () => {
    gerarHorarios();
    carregarAgendamentos();
};
