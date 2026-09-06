// ==========================================
// 1. ANIMAÇÕES MATRIX LATERAIS
// ==========================================
function initMatrixEffect(canvasId, colorHex, charsList) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops = Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(5, 7, 15, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = colorHex;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = charsList[Math.floor(Math.random() * charsList.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 40);
}

// Inicializa as duas chuvas de código ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const malchars = '☠️⚠️01@#$X¥Øµ§!SPOOF_ERR_PHISH_BAD_MALWARE';
    const secchars = '🛡️✓01@#$OK_SECURE_PASS_MX_VALID_TRUST';

    initMatrixEffect('canvasMalicious', '#ef4444', malchars);
    initMatrixEffect('canvasSecure', '#10b981', secchars);
});


// ==========================================
// 2. MOTOR DE VALIDAÇÃO DE E-MAILS
// ==========================================
let stats = { total: 0, erros: 0, phishing: 0, validos: 0 };

const KNOWN_PROVIDERS = {
    'gmail.com': ['gmai.com', 'gmaill.com', 'gmil.com', 'g00gle.com'],
    'hotmail.com': ['hotmai.com', 'hotmial.com'],
    'outlook.com': ['outlok.com', 'outloo.com'],
    'banco.com.br': ['banc0.com.br', 'b@nco.com.br', 'banc0.com'],
    'bradesco.com.br': ['bradesc0.com.br', 'br@desco.com.br'],
    'alura.com.br': ['alur@.com.br', 'alural.com.br']
};

const DISPOSABLE_DOMAINS = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'yopmail.com'];

function carregarExemploInvalido() {
    const exemplos = [
        'sup0rte-b@nc0.com.br',
        'contat0@alura.com.br',
        'usuario@gmai.com',
        'suporte@g00gle.com',
        'admin@192.168.1.1'
    ];
    const sorteio = exemplos[Math.floor(Math.random() * exemplos.length)];
    document.getElementById('emailInput').value = sorteio;
    validarEmail();
}

async function validarEmail() {
    const email = document.getElementById('emailInput').value.trim();
    const resultCard = document.getElementById('resultCard');
    const statusBadge = document.getElementById('statusBadge');
    const statusMessage = document.getElementById('statusMessage');
    const auditList = document.getElementById('auditList');
    const riskScore = document.getElementById('riskScore');

    if (!email) {
        alert('Por favor, digite um e-mail para validar!');
        return;
    }

    auditList.innerHTML = '';
    let risk = 0;
    let checks = [];

    // 1. MÚLTIPLOS '@' E SINTAXE BÁSICA
    const atMatches = email.match(/@/g);
    if (!atMatches || atMatches.length !== 1) {
        risk += 100;
        checks.push({ status: 'ERR', text: 'Sintaxe Inválida: O e-mail deve conter exatamente UM caractere "@".' });
    }

    const parts = email.split('@');
    const userPart = parts[0] || '';
    const domainPart = (parts[1] || '').toLowerCase();

    // 2. VALIDAÇÃO RIGOROSA DO USUÁRIO
    const validUserRegex = /^[a-zA-Z0-9._%+-]+$/;
    if (userPart && !validUserRegex.test(userPart)) {
        risk += 60;
        checks.push({ status: 'ERR', text: 'Caracteres inválidos ou símbolos proibidos no nome de usuário.' });
    }

    // 3. DETECÇÃO DE LEETSPEAK E SPOOFING
    if (/[0-9@]/.test(userPart) && /sup0rte|admin1337|contat0/i.test(userPart)) {
        risk += 40;
        checks.push({ status: 'WARN', text: 'Uso de Leetspeak no usuário (ex: "sup0rte" ou "contat0").' });
    }

    if (/[0-9@]/.test(domainPart)) {
        risk += 80;
        checks.push({ status: 'ERR', text: 'Alerta de Spoofing: O domínio contém números ou símbolos trocados (ex: b@nc0, g00gle).' });
    }

    // 4. TYPOSQUATTING
    for (let [realDomain, typos] of Object.entries(KNOWN_PROVIDERS)) {
        if (typos.includes(domainPart)) {
            risk += 85;
            checks.push({ status: 'ERR', text: `Domínio malicioso/falso detectado. Tentativa de imitar "@${realDomain}".` });
            break;
        }
    }

    // 5. IP DIRETO OU DOMÍNIO DESCARTÁVEL
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domainPart)) {
        risk += 90;
        checks.push({ status: 'ERR', text: 'Uso de IP numérico direto no lugar de um domínio válido.' });
    }

    if (DISPOSABLE_DOMAINS.includes(domainPart)) {
        risk += 70;
        checks.push({ status: 'WARN', text: 'E-mail descartável/temporário detectado.' });
    }

    // 6. CONSULTA REAL MX NO GOOGLE DNS
    if (domainPart && !domainPart.includes('@') && atMatches && atMatches.length === 1) {
        try {
            const dnsResponse = await fetch(`https://dns.google/resolve?name=${domainPart}&type=MX`);
            const dnsData = await dnsResponse.json();

            if (dnsData.Status !== 0 || !dnsData.Answer) {
                risk += 95;
                checks.push({ status: 'ERR', text: `Validação DNS Real: O domínio "@${domainPart}" NÃO possui servidores de e-mail (MX) ativos.` });
            } else {
                checks.push({ status: 'OK', text: `Validação DNS Real: Domínio "@${domainPart}" possui servidores MX ativos no Google DNS.` });
            }
        } catch (err) {
            checks.push({ status: 'WARN', text: 'Não foi possível consultar o servidor DNS externo no momento.' });
        }
    }

    // RENDERIZAR RESULTADO
    resultCard.classList.remove('hidden', 'bg-red-950/40', 'border-red-500/50', 'bg-amber-950/40', 'border-amber-500/50', 'bg-emerald-950/40', 'border-emerald-500/50');

    let statusClass = '', category = '';

    if (risk >= 70) {
        category = 'ERRO';
        statusClass = 'bg-red-950/40 border-red-500/50 neon-border-red';
        statusBadge.className = 'px-3 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40';
        statusBadge.innerText = 'E-mail Inválido / Ameaça Bloqueada';
        statusMessage.className = 'text-sm font-semibold text-red-400';
        statusMessage.innerText = 'O e-mail foi REPROVADO pela auditoria do Pegasus Shield.';
        stats.erros++;
    } else if (risk >= 30) {
        category = 'ALERTA';
        statusClass = 'bg-amber-950/40 border-amber-500/50';
        statusBadge.className = 'px-3 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40';
        statusBadge.innerText = 'Alerta de Digitação / Suspeito';
        statusMessage.className = 'text-sm font-semibold text-amber-400';
        statusMessage.innerText = 'O e-mail possui alertas de segurança ou padrões suspeitos.';
        stats.phishing++;
    } else {
        category = 'VALIDO';
        statusClass = 'bg-emerald-950/40 border-emerald-500/50 neon-border-green';
        statusBadge.className = 'px-3 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
        statusBadge.innerText = 'E-mail Seguro & Sintaticamente Válido';
        statusMessage.className = 'text-sm font-semibold text-emerald-400';
        statusMessage.innerText = 'O e-mail foi APROVADO em todos os testes formais.';
        checks.push({ status: 'OK', text: 'Estrutura e sintaxe aprovadas sem alertas.' });
        stats.validos++;
    }

    stats.total++;
    resultCard.classList.add(...statusClass.split(' '));
    riskScore.innerText = `Score de Risco: ${Math.min(risk, 100)}/100`;

    checks.forEach(c => {
        let li = document.createElement('li');
        if (c.status === 'OK') li.className = 'text-emerald-400 flex items-center gap-1.5';
        if (c.status === 'WARN') li.className = 'text-amber-400 flex items-center gap-1.5';
        if (c.status === 'ERR') li.className = 'text-red-400 flex items-center gap-1.5';

        let icon = c.status === 'OK' ? '✓' : c.status === 'WARN' ? '⚠️' : '❌';
        li.innerHTML = `<span class="font-bold">${icon}</span> ${c.text}`;
        auditList.appendChild(li);
    });

    document.getElementById('statTotal').innerText = stats.total;
    document.getElementById('statErros').innerText = stats.erros;
    document.getElementById('statPhishing').innerText = stats.phishing;
    document.getElementById('statValidos').innerText = stats.validos;

    adicionarAoHistorico(email, domainPart || 'Inválido', category, Math.min(risk, 100));
}

function adicionarAoHistorico(email, dominio, categoria, risk) {
    const tableBody = document.getElementById('historyTableBody');
    const emptyRow = document.getElementById('emptyRow');
    if (emptyRow) emptyRow.remove();

    const hora = new Date().toLocaleTimeString('pt-BR');
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/60 transition';

    let badgeHtml = '';
    if (categoria === 'VALIDO') {
        badgeHtml = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VÁLIDO</span>`;
    } else if (categoria === 'ALERTA') {
        badgeHtml = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">SUSPEITO</span>`;
    } else {
        badgeHtml = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">INVÁLIDO</span>`;
    }

    tr.innerHTML = `
        <td class="py-3 px-4 text-slate-500">${hora}</td>
        <td class="py-3 px-4 font-bold text-slate-200">${email}</td>
        <td class="py-3 px-4 text-slate-400">${dominio}</td>
        <td class="py-3 px-4">${badgeHtml}</td>
        <td class="py-3 px-4 font-mono font-bold ${risk >= 70 ? 'text-red-400' : risk >= 30 ? 'text-amber-400' : 'text-emerald-400'}">${risk}/100</td>
    `;

    tableBody.insertBefore(tr, tableBody.firstChild);
}