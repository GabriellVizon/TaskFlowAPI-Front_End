// Endpoint da API .NET obtido no Scalar
const API_AGENDAMENTOS = 'http://localhost:5089/api/Agendamentos';

document.getElementById('formAgendamento').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita recarregar a tela

    // 🔒 Regra de Negócio: Recupera o token de segurança salvo no login
    const token = localStorage.getItem('token_navalha');

    if (!token) {
        alert('Por favor, faça login para realizar um agendamento.');
        window.location.href = 'login.html'; // Redireciona para a sua tela de login
        return;
    }

    // Coleta as escolhas do usuário baseadas no seu design
    const servicoId = document.getElementById('selectServico').value;
    const dataEscolhida = document.getElementById('inputData').value;
    const horarioEscolhido = document.getElementById('selectHorario').value;

    // Combina data e hora no padrão exigido pelo C# DateTime (ISO 8601)
    const dataHoraConcatenada = `${dataEscolhida}T${horarioEscolhido}:00`;

    const agendamentoData = {
        servicoId: parseInt(servicoId),
        dataHora: dataHoraConcatenada
    };

    try {
        const resposta = await fetch(API_AGENDAMENTOS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token JWT para a API .NET autenticar
            },
            body: JSON.stringify(agendamentoData)
        });

        if (resposta.ok) {
            alert('Agendamento confirmado com sucesso! Seu horário foi reservado.');
            document.getElementById('formAgendamento').reset();
        } else if (resposta.status === 401) {
            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = 'login.html';
        } else {
            const erroMensagem = await resposta.text();
            alert('Falha ao agendar: ' + (erroMensagem || 'Verifique as vagas do dia.'));
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Não foi possível conectar ao servidor da Barbearia.');
    }
});
