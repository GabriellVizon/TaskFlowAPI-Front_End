// URLs da sua API .NET
const API_REGISTER = 'http://localhost:5089/api/Auth/register';
const API_LOGIN = 'http://localhost:5089/api/Auth/login';

// ==========================================
// 👥 INTEGRAÇÃO DA TELA DE CADASTRO
// ==========================================
const formCadastro = document.getElementById('registrationForm');
if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault(); // Controlamos o envio aqui

        const btn = formCadastro.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        // Ativa a sua animação visual original
        btn.innerText = 'PROCESSANDO...';
        btn.classList.add('opacity-80');
        btn.disabled = true;

        // Captura os dados usando os IDs exatos do seu HTML
        const nome = document.getElementById('full_name').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('phone').value;
        const senha = document.getElementById('password').value;

        try {
            const resposta = await fetch(API_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    senha: senha
                })
            });

            if (resposta.ok) {
                // Finaliza a animação com sucesso antes de redirecionar
                btn.innerText = 'CONTA CRIADA!';
                btn.classList.add('bg-green-500', 'text-white');
                
                setTimeout(() => {
                    window.location.href = 'login.html'; // Manda para o login original
                }, 1500);
            } else {
                const erroTxt = await resposta.text();
                alert('Erro ao registrar: ' + erroTxt);
                // Restaura o botão em caso de erro da API
                btn.innerText = originalText;
                btn.classList.remove('opacity-80');
                btn.disabled = false;
            }
        } catch (erro) {
            console.error(erro);
            alert('Erro ao conectar com a API .NET');
            btn.innerText = originalText;
            btn.classList.remove('opacity-80');
            btn.disabled = false;
        }
    });
}

// ==========================================
// 🔑 INTEGRAÇÃO DA TELA DE LOGIN
// ==========================================
const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Usa os IDs configurados no seu login.html
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;

        try {
            const resposta = await fetch(API_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            });

            if (resposta.ok) {
                const dados = await resposta.json();
                
                // Salva o Token JWT de segurança no navegador
                localStorage.setItem('token_navalha', dados.token); 
                
                alert('Login efetuado com sucesso!');
                window.location.href = 'index.html'; // Redireciona para sua home
            } else {
                alert('E-mail ou senha incorretos.');
            }
        } catch (erro) {
            console.error(erro);
            alert('Erro ao conectar com a API .NET');
        }
    });
}
