<div>

#  Pegasus Shield

### Anti-Phishing & Mail Auditor — Cyber MVP

Ferramenta web para **verificar e-mails suspeitos** (phishing, spoofing e golpes online) e ajudar você a se proteger de fraudes digitais.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white).
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white).
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black).
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white).

</div>

---

##  Sobre o projeto

Golpes por e-mail estão entre as formas mais comuns de fraude online. Criminosos criam endereços que **imitam empresas, bancos e provedores conhecidos** (por exemplo `sup0rte@b@nc0.com.br`) para enganar vítimas e roubar dados, senhas e dinheiro.

O **Pegasus Shield** é um MVP (Produto Mínimo Viável) que analisa um endereço de e-mail digitado pelo usuário e devolve, em segundos:

- um diagnóstico (Válido, Suspeito ou Inválido/Ameaça);
- um score de risco de 0 a 100;
- um checklist de auditoria explicando cada alerta encontrado.

Tudo roda direto no navegador, sem back-end e sem instalação de dependências.

---

##  Funcionalidades

  Validação de sintaxe : Verifica a estrutura do e-mail: exatamente um `@`, caracteres permitidos no usuário e formato do domínio. 
  Detecção de Leetspeak : Identifica trocas de letras por números/símbolos (ex.: `sup0rte`, `contat0`, `b@nc0`, `g00gle`). 
  Detecção de Typosquatting : Compara o domínio com uma lista de erros de digitação e imitações de provedores conhecidos (Gmail, Hotmail, Outlook, bancos etc.). 
  Consulta DNS MX real  Consulta a API DNS do Google para confirmar se o domínio possui servidores de e-mail (MX) ativos. 
  Bloqueio de IP direto : Sinaliza e-mails que usam endereço IP numérico no lugar de um domínio. 
  E-mails descartáveis : Detecta domínios temporários como `mailinator.com`, `yopmail.com` e similares. 
  Score de risco (0–100) : Soma a gravidade de cada alerta e classifica o e-mail. 
  Histórico da sessão : Tabela com horário, e-mail testado, domínio extraído, diagnóstico e score. 
  Métricas em tempo real : Contadores de total de checagens, bloqueados, suspeitos e legítimos. 
 Interface Cyber : Visual futurista com efeito scanline (CRT) e "chuva de código" estilo Matrix nas laterais. 

---

##  Como o score de risco funciona

Cada verificação soma pontos ao risco. O valor final é limitado a 100.

 Quantidade de `@` diferente de 1 : +100 
 Domínio sem servidores MX (DNS) : +95 
 IP numérico no lugar de domínio : +90 
 Typosquatting de provedor conhecido : +85 
 Domínio com números/símbolos trocados (spoofing) : +80 
 E-mail descartável/temporário : +70 
 Caracteres inválidos no usuário : +60 
 Leetspeak no nome de usuário : +40 

Classificação final:

 Score / Resultado 

 `0 – 29`   **Válido** — aprovado nos testes formais 
 `30 – 69`   **Suspeito** — possui alertas de segurança 
 `70 – 100`   **Inválido / Ameaça** — reprovado pela auditoria 

---

##  Exemplos para testar

O botão "Exemplo com Erro" sorteia um destes casos:

 E-mail / O que a ferramenta detecta 

 `sup0rte-b@nc0.com.br` -> Leetspeak + domínio falso imitando banco 
 `contat0@alura.com.br`  -> Leetspeak no usuário 
 `usuario@gmai.com` -> Typosquatting do Gmail 
 `suporte@g00gle.com` -> Spoofing com números no domínio 
 `admin@192.168.1.1` -> Uso de IP direto no lugar de domínio 

---

##  Tecnologias

- HTML5 — estrutura da aplicação
- CSS3 — efeitos customizados (neon, glow, scanlines)
- JavaScript (Vanilla) — motor de validação, animações em `<canvas>` e histórico
- [Tailwind CSS](https://tailwindcss.com/) (CDN) — estilização utilitária
- [Google DNS over HTTPS](https://developers.google.com/speed/public-dns/docs/doh) — consulta de registros MX

---

##  Estrutura do projeto

```
projeto-mvp-cyber-unifeso/
├── index.html        # Interface principal
├── style.css         # Estilos customizados (neon, scanlines, canvas)
├── script.js         # Lógica de validação, animações e histórico
├── logo_pegasus.png  # Logo do projeto
└── README.md         # Documentação
```

---

##  Dicas de segurança contra golpes por e-mail

Mesmo com ferramentas de apoio, o olhar atento do usuário é a principal defesa.

###  Sinais de que um e-mail pode ser golpe

- Remetente estranho: o nome parece legítimo, mas o endereço não (`suporte@banc0-seguro.com`).
- Urgência ou ameaça: "sua conta será bloqueada em 24h", "última chance", "ação imediata".
- Promessas boas demais: prêmios, sorteios, restituições, ofertas milagrosas.
- Erros de português ou formatação amadora, logos distorcidos.
- Pedido de dados sensíveis: senhas, códigos de verificação, CPF, dados de cartão.
- Anexos inesperados (`.zip`, `.exe`, `.scr`, PDF ou Office com macros).
- Links suspeitos: o texto exibido é diferente do endereço real do link.

###  Boas práticas de prevenção

1. Nunca clique em links de e-mails duvidosos. Acesse o site oficial digitando o endereço no navegador.
2. Passe o mouse sobre o link (sem clicar) para ver o endereço de destino real.
3. Confirme por outro canal: ligue para a empresa usando o telefone oficial do site ou do cartão.
4. Ative a autenticação em dois fatores (2FA) em todas as contas importantes.
5. Use senhas únicas e fortes, com um gerenciador de senhas.
6. Nunca compartilhe códigos de verificação (SMS, e-mail, app autenticador) com ninguém.
7. Mantenha sistema, navegador e antivírus atualizados.
8. Desconfie de anexos inesperados, mesmo de contatos conhecidos (a conta deles pode estar invadida).
9. Desconfie de e-mails que pedem "atualização cadastral": bancos e órgãos públicos não pedem senha por e-mail.

###  Caiu em um golpe? O que fazer

1. Troque imediatamente as senhas das contas afetadas (e de qualquer outra que use a mesma senha).
2. Entre em contato com o banco/empresa para bloquear cartões e contas.
3. Registre um Boletim de Ocorrência (a maioria dos estados aceita B.O. online).
4. Ative o 2FA e revise os dispositivos conectados às suas contas.
5. Denuncie o golpe: encaminhe o e-mail de phishing para o provedor e para o [CERT.br](https://www.cert.br/) (`cert@cert.br`).

---

##  Limitações conhecidas

Este é um MVP com finalidade educacional. Ele não substitui soluções profissionais de segurança.

- A detecção é heurística (baseada em regras) e pode gerar falsos positivos — por exemplo, domínios legítimos que contenham números.
- A lista de provedores e domínios descartáveis é estática e reduzida.
- Um domínio com MX ativo não garante que o e-mail seja legítimo: golpistas também registram domínios reais.
- A ferramenta analisa apenas o endereço — não avalia o conteúdo, os links ou os anexos do e-mail.
- O histórico é mantido somente durante a sessão** (não é salvo).

---

##  Roadmap

- [ ] Seção de dicas de segurança integrada à interface
- [ ] Verificação de registros SPF, DKIM e DMARC
- [ ] Análise de links e cabeçalhos de e-mail
- [ ] Ampliar a base de domínios, marcas e provedores monitorados
- [ ] Cálculo de similaridade (distância de Levenshtein) para detectar typosquatting
- [ ] Exportar histórico em CSV/PDF
- [ ] Modo claro/escuro
- [ ] Testes automatizados

---

##  Integrantes da Equipe

- Marcus Faria — [@Mrqunhss](https://github.com/Mrqunhss)
- Vinicius Rodrigues — [@viniciusrodrigues2008](https://github.com/viniciusrodrigues2008)
- Victor Camacho — [@WV2307](https://https://github.com/WV2307)
- Lucas Ribeiro — [@lucasdevv25](https://https://github.com/lucasdevv25)
- Jonathan duarte — [@Mrqunhss](https://github.com/Mrqunhss)

Projeto desenvolvido no contexto acadêmico — UNIFESO.

---

<div align="center">

** Pegasus Shield ** — *Pense antes de clicar.*

</div>