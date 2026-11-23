
const botoes = document.querySelectorAll('nav button');
const secoes = document.querySelectorAll('.modo');
const botaoTema = document.getElementById('alternar-tema');
const logo = document.getElementById('logo');

const verificadores = {
    email: verificarEmail,
    senha: verificarSenha,
    site: verificarSite
};

const estatisticas = {
    email: { total: 0, validos: 0, invalidos: 0 },
    senha: { total: 0, validos: 0, invalidos: 0 },
    site: { total: 0, validos: 0, invalidos: 0 }
};

const historico = carregar('historico', { email: [], senha: [], site: []});

botoes.forEach(botao => {
    botao.addEventListener('click', () => {

        botoes.forEach(b => b.classList.remove('ativo'));
        secoes.forEach(s => s.classList.remove('ativo'));

        botao.classList.add('ativo');

        document.getElementById('modo-' + botao.dataset.mode).classList.add('ativo');

    });
});


function salvar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function carregar(chave, padrao) {
    const guardado = localStorage.getItem(chave);
    return guardado ? JSON.parse(guardado) : padrao;
}

function verificarEmail(v) {

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    return {
        ok,
        texto: ok ? 'E-mail com formato válido.' : 'Formato de e-mail inválido.'
    };

}

function verificarSenha(v) {

    let pontos = 0;

    if (v.length >= 8) pontos++;
    if (/[A-Z]/.test(v)) pontos++;
    if (/[0-9]/.test(v)) pontos++;
    if (/[^A-Za-z0-9]/.test(v)) pontos++;

    const niveis = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];

    const ok = pontos >= 3;

    return {
        ok,
        texto: 'Força: ' + niveis[pontos]
    };

}

function verificarSite(v) {

    const ok = /^https:\/\//i.test(v.trim());

    return {
        ok,
        texto: ok ? 'URL usa HTTPS.' : 'URL não usa HTTPS ou está incompleta.'
    };

}

function atualizarEstatisticas(tipo, resultado) {

    const dados = estatisticas[tipo];

    dados.total++;

    if (resultado.ok) {
        dados.validos++;
    } else {
        dados.invalidos++;
    }

    document.getElementById(tipo + '-total').textContent = dados.total;
    document.getElementById(tipo + '-validos').textContent = dados.validos;
    document.getElementById(tipo + '-invalidos').textContent = dados.invalidos;

}

function adicionarItemNaTela(tipo, entrada) {

    const lista = document.querySelector('#modo-' + tipo + ' .historico-lista');

    const item = document.createElement('li');

    item.textContent =  entrada.valor + ' - ' + entrada.texto;

    lista.prepend(item);

}

document.querySelectorAll('form[data-tipo]').forEach(form => {

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        const tipo = form.dataset.tipo;
        const input = form.querySelector('input');
        const valor = input.value.trim();

        if (!valor) return;

        const resultado = verificadores[tipo](valor);

        atualizarEstatisticas(tipo, resultado);

        const divResultado = form.querySelector('.resultado');

        divResultado.textContent = resultado.texto;
        divResultado.className = 'resultado ' + (resultado.ok ? 'ok' : 'ruim');                                                     
        
        const entrada = {
        valor: tipo === 'senha' ? '•'.repeat(valor.length) : valor,
        texto: resultado.texto
        };

        adicionarItemNaTela(tipo, entrada);

        historico[tipo].push(entrada);
        salvar('historico', historico);
        input.value = '';

    });

});

botaoTema.addEventListener('click', () => {

    const temaAtual = document.documentElement.dataset.tema;

    if (temaAtual === 'claro') {

        document.documentElement.dataset.tema = 'escuro';
        botaoTema.textContent = '☀️ Tema claro';

        logo.src = "Imagens/Securitry_Logo_Horizontal_Escuro.png";

    } else {

        document.documentElement.dataset.tema = 'claro';
        botaoTema.textContent = '🌙 Tema escuro';

        logo.src = "Imagens/Securitry_Logo_Horizontal_Claro.png";

    }

});

['email', 'senha', 'site'].forEach(tipo => {
    historico[tipo].forEach(entrada => adicionarItemNaTela(tipo, entrada));
});

