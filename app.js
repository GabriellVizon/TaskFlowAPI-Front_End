// URLs bases da sua API ajustadas conforme o Scalar
const API_LISTAR_USUARIOS = 'http://localhost:5089/api/Usuarios';
const API_CADASTRAR_USUARIO = 'http://localhost:5089/api/Auth/register';
const API_BARBEIROS = 'http://localhost:5089/api/Barbeiros';

// ==========================================
// FUNÇÕES PARA GERENCIAR USUÁRIOS
// ==========================================

// Listar Usuários
document.getElementById('btnBuscarUsuarios').addEventListener('click', async () => {
    const painel = document.getElementById('listaUsuarios');
    painel.innerText = 'Carregando...';
    try {
        const resposta = await fetch(API_LISTAR_USUARIOS);
        if (!resposta.ok) throw new Error('Erro na API');
        const dados = await resposta.json();
        painel.innerText = JSON.stringify(dados, null, 2);
    } catch (erro) {
        painel.innerText = 'Erro ao buscar usuários: ' + erro.message;
    }
});

// Cadastrar Usuário
document.getElementById('btnCadastrarUsuario').addEventListener('click', async () => {
    const nome = document.getElementById('nomeUsuario').value;
    const email = document.getElementById('emailUsuario').value;
    const senha = document.getElementById('senhaUsuario').value; // Pegando a senha da tela

    try {
        const resposta = await fetch(API_CADASTRAR_USUARIO, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                Nome: nome, 
                Email: email,
                Senha: senha // Se no seu DTO estiver "Password", mude aqui para Password: senha
            })
        });

        if (resposta.ok) {
            alert('Usuário cadastrado com sucesso!');
            document.getElementById('nomeUsuario').value = '';
            document.getElementById('emailUsuario').value = '';
            document.getElementById('senhaUsuario').value = '';
            document.getElementById('btnBuscarUsuarios').click();
        } else {
            alert('Erro ao cadastrar usuário. Verifique se a senha atende aos requisitos ou mude "Senha" para "Password" no js se o erro persistir.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
});


// ==========================================
// FUNÇÕES PARA GERENCIAR BARBEIROS
// ==========================================

// Listar Barbeiros
document.getElementById('btnBuscarBarbeiros').addEventListener('click', async () => {
    const painel = document.getElementById('listaBarbeiros');
    painel.innerText = 'Carregando...';
    try {
        const resposta = await fetch(API_BARBEIROS);
        if (!resposta.ok) throw new Error('Erro na API');
        const dados = await resposta.json();
        painel.innerText = JSON.stringify(dados, null, 2);
    } catch (erro) {
        painel.innerText = 'Erro ao buscar barbeiros: ' + erro.message;
    }
});

// Cadastrar Barbeiro
// Cadastrar Barbeiro atualizado
document.getElementById('btnCadastrarBarbeiro').addEventListener('click', async () => {
    const nome = document.getElementById('nomeBarbeiro').value;
    const especialidade = document.getElementById('especialidadeBarbeiro').value;
    const telefone = document.getElementById('telefoneBarbeiro').value; // Pegando o telefone da tela

    try {
        const resposta = await fetch(API_BARBEIROS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nome: nome,              // Letras minúsculas conforme o Scalar
                especialidade: especialidade, 
                telefone: telefone       // Novo campo obrigatório incluído
            })
        });

        if (resposta.ok) {
            alert('Barbeiro cadastrado com sucesso!');
            // Limpa os campos da tela
            document.getElementById('nomeBarbeiro').value = '';
            document.getElementById('especialidadeBarbeiro').value = '';
            document.getElementById('telefoneBarbeiro').value = '';
            // Recarrega a lista automaticamente
            document.getElementById('btnBuscarBarbeiros').click();
        } else {
            alert('Erro ao cadastrar barbeiro. Verifique os campos.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
});

