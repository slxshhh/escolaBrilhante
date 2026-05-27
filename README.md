# 🏫 Escola Brilhante - Jogo Educativo Interativo (ODS 4)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📝 Descrição do Jogo
O **Escola Brilhante** é um jogo educativo interativo e gamificado focado na **ODS 4 (Educação de Qualidade)**, projetado especialmente para ser exibido em projetores de salas de aula para crianças de 6 a 10 anos (do 1º ao 5º Ano). 

O objetivo do jogo é transformar colaborativamente o Colégio Floresta — que começa bagunçado e triste — em uma escola dos sonhos: limpa, inclusiva, unida e ecologicamente sustentável. O mediador (um acadêmico universitário ou professor) digita as respostas dadas pela turma inteira, e o sistema processa as ações em tempo real para evoluir as cores, plantas, balões e interações do cenário da escola de forma 100% lúdica!

---

## ✨ Recursos & Mecânicas Implementadas

### 🎯 Linguagem Nivelada com a Faixa Etária (1º ao 5º Ano)
* Todas as perguntas e feedbacks de desafios foram reestruturados para ter extrema clareza pedagógica. 
* Removidos termos e linguagens complexas que confundiam a criançada (como "retraído", "pilares éticos", "patrimônio público"), substituindo-as por expressões afetivas e cotidianas como *"amigo triste no cantinho"* ou *"cuidado com nosso corredor e escola feliz"*.

### 📺 Layout Otimizado para Projetores (Full-Screen)
* **Design de Alta Visibilidade**: Tipografias, balões de narrativa e botões otimizados para total legibilidade, mesmo para alunos sentados nas últimas carteiras da sala.
* **Componentes Responsivos Compactos**: A barra de narrativa e os cartões de cenário foram ajustados para que o botão de avançar e o restante das perguntas não se sobreponham, reservando o máximo de espaço dinâmico de tela.
* **Badge de Sala Inteligente**: O seletor de sala e botão para trocar de nível agora ficam unificados no topo da barra de progresso, poupando espaço nas laterais da tela.

### 🛡️ Modo Seguro para Apresentações (Modo Off-line Recorrente)
* **Proteção em Sala de Aula**: Pensando na estabilidade durante exibições públicas onde o Wi-Fi escolar pode oscilar ou a cota da API do Gemini pode esgotar, implementamos um **mecanismo inteligente de fallback off-line**.
* **Heurísticas Locais Instantâneas**: Em caso de falha de conexão ou erro de limite de cota da IA, o jogo ativa imediatamente o **Modo Seguro** em tempo de execução sem travar nem exibir telas de erro para as crianças. O motor local calcula se a resposta é ética e positiva de forma imediata!
* **Controle Manual do Mediador**: Adicionamos um botão de alternância visual inteligente na barra do mediador (**"IA Ativa"** / **"Sem IA (Local)"**). O apresentador pode escolher a qualquer momento desligar o processamento em nuvem economizando requisições, ideal para realizar múltiplos testes rápidos ou exibições seguras de ponta a ponta!

---

## 🏗️ Estrutura & Funcionamento Técnico

1. **Julgamento Cognitivo da Turma**: Quando a resposta é enviada, o backend envia a frase para o modelo **Gemini 3 Flash** com instruções específicas de tolerância pedagógica com base no ano escolar selecionado pelo professor.
2. **Cenário Dinâmico em Tempo Real**:
   * **Nível de ODS 4 < 30:** A escola assume tons cinzentos e decorações que necessitam de carinho (`Skull`, `Trash2`, etc).
   * **Nível de ODS 4 entre 30 e 70:** O cenário começa a florescer e a se pintar (`Brush`, `Sprout`, `Droplets`).
   * **Nível de ODS 4 > 70:** Comemoração completa com sol brilhando, morros alegres e purpurinas multicoloridas.
3. **Feedback Direto dos Formuladores**: O jogo exibe o feedback que o Gemini formulou diretamente em um balão em destaque, estimulando as crianças a verem sua própria ação moldando as reações da inteligência artificial.

---

## 🔧 Como Executar Localmente

1. **Baixar o Código**:
   ```bash
   git clone https://github.com/seu-usuario/escola-brilhante.git
   cd escola-brilhante
   ```
2. **Instalação das Dependências**:
   ```bash
   npm install
   ```
3. **Configuração de Chave**:
   Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base se desejar):
   ```env
   GEMINI_API_KEY=sua_chave_secreta_aqui
   ```
   *(Nota: Se houver ausência de chave de API, o jogo funcionará perfeitamente através de seu inovador motor de Heurísticas Locais ativado por padrão!)*
4. **Execução**:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` em seu navegador para projetar o jogo!

---

### *Cuidado e Educação de Qualidade (ODS 4) em ação, construindo juntos uma Escola Brilhante!* ✨🏫🎒
