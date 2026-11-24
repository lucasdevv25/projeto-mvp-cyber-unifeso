// ==========================================
// SECURITRY - JAVASCRIPT COMPLETO E INTEGRADO
// ==========================================

// Seletores
const $ = (seletor, contexto = document) =>
    contexto.querySelector(seletor);

const $$ = (seletor, contexto = document) =>
    [...contexto.querySelectorAll(seletor)];

// Elementos principais
const botoes = $$('nav button[data-mode]');
const secoes = $$('.modo');
const botaoTema = $('#alternar-tema');
const logo = $('#logo');

// Tipos de verificação
const TIPOS = ['email', 'senha', 'site'];

// Chaves do armazenamento
const CHAVE_HISTORICO = 'historico';
const CHAVE_TEMA = 'tema';

// Estatísticas
const estatisticas = {
    email: { total: 0, validos: 0, invalidos: 0 },
    senha: { total: 0, validos: 0, invalidos: 0 },
    site: { total: 0, validos: 0, invalidos: 0 }
};

// ==========================================
// LOCAL STORAGE
// ==========================================

function carregar(chave, padrao) {
    try {
        const dado = localStorage.getItem(chave);
        return dado === null ? padrao : JSON.parse(dado);
    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
        return padrao;
    }
}

function salvar(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
        console.error('Erro ao salvar dados:', erro);
    }
}

// ==========================================
// VERIFICAÇÃO DE E-MAIL
// ==========================================

function verificarEmail(valor) {
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    return {
        ok: valido,
        texto: valido
            ? 'E-mail com formato válido.'
            : 'Formato de e-mail inválido.'
    };
}

// ==========================================
// VERIFICAÇÃO DE SENHA
// ==========================================

function verificarSenha(valor) {
    let pontos = 0;

    if (valor.length >= 8) pontos++;
    if (/[A-Z]/.test(valor)) pontos++;
    if (/[0-9]/.test(valor)) pontos++;
    if (/[^A-Za-z0-9]/.test(valor)) pontos++;

    const niveis = [
        'Muito fraca',
        'Fraca',
        'Média',
        'Forte',
        'Muito forte'
    ];

    return {
        ok: pontos >= 3,
        texto: 'Força da senha: ' + niveis[pontos]
    };
}

// ==========================================
// VERIFICAÇÃO DE SITE
// ==========================================

function verificarSite(valor) {
    const endereco = valor.trim();

    let valido = false;

    try {
        const url = new URL(endereco);
        valido = url.protocol === 'https:';
    } catch (erro) {
        valido = false;
    }

    return {
        ok: valido,
        texto: valido
            ? 'Site utiliza conexão HTTPS.'
            : 'URL inválida ou sem conexão HTTPS.'
    };
}

// Funções de verificação
const verificadores = {
    email: verificarEmail,
    senha: verificarSenha,
    site: verificarSite
};

// ==========================================
// HISTÓRICO E COMPATIBILIDADE
// ==========================================

function normalizarEntrada(entrada, tipo) {
    if (typeof entrada === 'string') {
        return {
            valor: tipo === 'senha' ? '••••••••' : entrada,
            texto: '',
            ok: false,
            dataHora: ''
        };
    }

    if (!entrada || typeof entrada !== 'object') {
        return null;
    }

    const resultado = entrada.ok ??
        entrada.valido ??
        entrada.validado ??
        entrada.status === 'válido';

    const dataHora =
        entrada.dataHora ||
        entrada.data ||
        entrada.horario ||
        '';

    return {
        valor: tipo === 'senha'
            ? '••••••••'
            : String(entrada.valor ?? entrada.email ?? entrada.site ?? ''),
        texto: String(entrada.texto ?? entrada.mensagem ?? ''),
        ok: Boolean(resultado),
        dataHora
    };
}

const dadosSalvos = carregar(CHAVE_HISTORICO, {});

const historico = Object.fromEntries(
    TIPOS.map(tipo => [
        tipo,
        Array.isArray(dadosSalvos[tipo])
            ? dadosSalvos[tipo]
                .map(item => normalizarEntrada(item, tipo))
                .filter(Boolean)
            : []
    ])
);

function salvarHistorico() {
    salvar(CHAVE_HISTORICO, historico);
}

// ==========================================
// ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas(tipo, resultado) {
    const dados = estatisticas[tipo];

    dados.total++;

    if (resultado.ok) {
        dados.validos++;
    } else {
        dados.invalidos++;
    }

    mostrarEstatisticas(tipo);
}

function mostrarEstatisticas(tipo) {
    const dados = estatisticas[tipo];

    const total = $('#' + tipo + '-total');
    const validos = $('#' + tipo + '-validos');
    const invalidos = $('#' + tipo + '-invalidos');

    if (total) total.textContent = dados.total;
    if (validos) validos.textContent = dados.validos;
    if (invalidos) invalidos.textContent = dados.invalidos;
}

function reconstruirEstatisticas() {
    TIPOS.forEach(tipo => {
        historico[tipo].forEach(entrada => {
            const dados = estatisticas[tipo];

            dados.total++;

            if (entrada.ok) {
                dados.validos++;
            } else {
                dados.invalidos++;
            }
        });

        mostrarEstatisticas(tipo);
    });
}

// ==========================================
// EXIBIÇÃO DO HISTÓRICO
// ==========================================

function adicionarItemNaTela(tipo, entrada) {
    const lista = $('#modo-' + tipo + ' .historico-lista');

    if (!lista) return;

    const item = document.createElement('li');

    item.className = 'historico-item';

    if (!entrada.ok) {
        item.classList.add('historico-invalido');
    }

    const icone = document.createElement('span');

    icone.className = 'historico-icone';

    if (tipo === 'email') {
        icone.textContent = '✉';
    } else if (tipo === 'senha') {
        icone.textContent = '♙';
    } else {
        icone.textContent = '◎';
    }

    const valor = document.createElement('span');

    valor.className = 'historico-valor';

    valor.textContent = tipo === 'senha'
        ? '••••••••'
        : entrada.valor;

    const selo = document.createElement('span');

    selo.className = 'status-badge ' +
        (entrada.ok ? 'status-valido' : 'status-invalido');

    selo.textContent = entrada.ok ? 'Válido' : 'Inválido';

    const horario = document.createElement('time');

    horario.className = 'historico-horario';

    const data = new Date(entrada.dataHora);

    if (entrada.dataHora && !Number.isNaN(data.getTime())) {
        horario.textContent =
            data.toLocaleDateString('pt-BR') +
            ' · ' +
            data.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
    } else {
        horario.textContent = 'Data não registrada';
    }

    item.append(icone, valor, selo, horario);

    lista.prepend(item);
}

// ==========================================
// RESULTADO DA VERIFICAÇÃO
// ==========================================

function mostrarResultado(form, resultado) {
    const area = $('.resultado', form);

    if (!area) return;

    area.replaceChildren();

    area.className = 'resultado ' +
        (resultado.ok ? 'ok' : 'ruim');

    const icone = document.createElement('span');

    icone.className = 'resultado-icone';

    icone.textContent = resultado.ok ? '✓' : '✕';

    const mensagem = document.createElement('span');

    mensagem.textContent = resultado.texto;

    area.append(icone, mensagem);
}

// ==========================================
// NAVEGAÇÃO ENTRE AS ABAS
// ==========================================

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        botoes.forEach(item => {
            item.classList.remove('ativo');
        });

        secoes.forEach(secao => {
            secao.classList.remove('ativo');
        });

        botao.classList.add('ativo');

        const modo = $('#modo-' + botao.dataset.mode);

        if (modo) {
            modo.classList.add('ativo');
        }
    });
});

// ==========================================
// ENVIO DOS FORMULÁRIOS
// ==========================================

$$('form[data-tipo]').forEach(form => {
    form.addEventListener('submit', evento => {
        evento.preventDefault();

        const tipo = form.dataset.tipo;

        const input = $('input', form);

        if (!input) return;

        const valor = input.value.trim();

        if (!valor || !verificadores[tipo]) {
            return;
        }

        // Executa a verificação
        const resultado = verificadores[tipo](valor);

        // Atualiza os números
        atualizarEstatisticas(tipo, resultado);

        // Mostra o resultado
        mostrarResultado(form, resultado);

        // Cria o registro do histórico
        const entrada = {
            valor: tipo === 'senha'
                ? '••••••••'
                : valor,

            texto: resultado.texto,
            ok: resultado.ok,
            dataHora: new Date().toISOString()
        };

        // Salva no histórico
        historico[tipo].unshift(entrada);

        salvarHistorico();

        // Mostra na tela
        adicionarItemNaTela(tipo, entrada);

        // Limpa o campo
        input.value = '';
    });
});

// ==========================================
// ALTERAÇÃO DO TEMA
// ==========================================

function aplicarTema(tema) {
    const claro = tema === 'claro';

    document.documentElement.dataset.tema =
        claro ? 'claro' : 'escuro';

    if (botaoTema) {
        botaoTema.textContent = claro
            ? '🌙 Tema escuro'
            : '☀️ Tema claro';
    }

    if (logo) {
        logo.src = claro
            ? 'Imagens/Securitry_Logo_Horizontal_Claro.png'
            : 'Imagens/Securitry_Logo_Horizontal_Escuro.png';
    }
}

// Clique para trocar o tema
if (botaoTema) {
    botaoTema.addEventListener('click', () => {
        const temaAtual =
            document.documentElement.dataset.tema;

        const novoTema = temaAtual === 'claro'
            ? 'escuro'
            : 'claro';

        aplicarTema(novoTema);

        salvar(CHAVE_TEMA, novoTema);
    });
}

// ==========================================
// CARREGAMENTO DO HISTÓRICO SALVO
// ==========================================

TIPOS.forEach(tipo => {
    const lista = $('#modo-' + tipo + ' .historico-lista');

    if (lista) {
        lista.replaceChildren();
    }

    historico[tipo].forEach(entrada => {
        adicionarItemNaTela(tipo, entrada);
    });
});

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================

// Reconstrói as estatísticas salvas
reconstruirEstatisticas();

// Recupera o tema escolhido anteriormente
const temaSalvo = carregar(CHAVE_TEMA, 'escuro');

aplicarTema(temaSalvo === 'claro' ? 'claro' : 'escuro');

// Salva os dados normalizados
salvarHistorico();

// ==========================================
// FIM DO JAVASCRIPT DO SECURITRY
// ==========================================
