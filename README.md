# 🏫 Escola Brilhante - Jogo Educativo Interativo (ODS 4)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📝 Descrição do Projeto
O **Escola Brilhante** é um jogo educativo interativo e gamificado focado na **ODS 4 (Educação de Qualidade)**, desenvolvido especialmente para crianças de 6 a 10 anos. O objetivo principal é engajar as crianças para resolverem desafios reais do cotidiano escolar (como lixo espalhado, desperdício de lanche, inclusão de novos amigos e economia de água/luz), transformando uma escola inicialmente bagunçada e cinzenta em um ambiente "Brilhante", florido, colorido e sustentável.

Através de uma inteligência artificial que atua como o motor lógico das interações (utilizando o modelo **Gemini 3 Flash**), o jogo interpreta as respostas das crianças de forma lúdica e sensível. Baseando-se na qualidade ética e sustentável das respostas enviadas, a IA altera o estado visual da escola em tempo real: desbloqueando novos ícones, colorindo o cenário, gerando novas flores e motivando a turma a continuar cooperando!

---

## ✨ Recursos & Mecânicas de Gamificação
* **Evolução Dinâmica do Cenário (Jardim Encantado):** 
  * **0% a 30% (Escola em Reforma):** O visual é mais acinzentado, com decorações de poeira, fantasmas e vento forte (`Trash2`, `Skull`, `Ghost`).
  * **30% a 70% (Escola se Recuperando):** Começam a florescer e surgir ferramentas de conserto, como baldes de tinta, gotas d'água e brotos (`Sparkles`, `Brush`, `Sprout`).
  * **70% a 100% (Escola Brilhante!):** O cenário ganha um sol vibrante, morros verdes e floridos, purpurinas em tempo real e ícones de celebração (`PartyPopper`, `Smile`, `Star`).
* **Interação Tátil (Fidget Click):** As crianças podem clicar na Barra de Progresso a qualquer momento para disparar uma física de partículas de limpeza com emojis mágicos (`🧹`, `✨` ou `🌈`), que as ajudam a sentir que estão limpando e cuidando ativamente do cenário.
* **Tipografia e Cores Amigáveis:** Interface totalmente redesenhada usando a fonte arredondada **Fredoka** e paletas de cores pastel vibrantes extremamente atraentes para a faixa etária de 6 a 10 anos.
* **Cards e Ícones Flutuantes:** Elementos visuais em 3D sutil (efeito floating), com sombras profundas e bordas arredondadas e amigáveis (`rounded-[4.5rem]`).

---

## 🚀 Tecnologias Utilizadas
* **Frontend:** React 19, Motion (Framer Motion para transições de mola e efeitos de impacto), Lucide Icons
* **Tipografia & Design:** Google Fonts (Fredoka), Tailwind CSS (Estilo orgânico, cantos super arredondados e gradientes dinâmicos)
* **Backend:** Express (Servidor Node.js seguro atuando como Proxy para proteger segredos de API)
* **Inteligência Artificial:** Google Gemini 3 Flash / SDK `@google/genai` (Lógica de validação pedagógica com JSON estruturado)

---

## 📊 Resultados e Aprendizados
O desenvolvimento deste projeto envolveu grandes desafios técnicos de design responsivo e resiliência de canais de IA:
* **UX Pedagógica Robusta:** Substituímos as estruturas rígidas padrão de componentes web por formas extremamente suaves, bolhas, animações de mola e fontes redondas, gerando um ambiente convidativo para crianças pequenas.
* **Resiliência contra Picos de Demanda (503 UNAVAILABLE):** Implementamos um loop de repetição automática com **Backoff Exponencial** diretamente no backend do Express. Se o serviço do Gemini estiver congestionado, o servidor realiza novas tentativas automáticas antes de retornar um erro amigável na tela de jogo.
* **Proteção Arquitetural de API:** Todas as chamadas para a IA ocorrem sob uma rota proxy segura no Express, garantindo que as chaves de API secretas fiquem completamente ocultadas do navegador do usuário.

---

## 🔧 Como Executar
1. Clone o repositório em sua máquina:
   ```bash
   git clone https://github.com/seu-usuario/escola-brilhante.git
   cd escola-brilhante
   ```
2. Instale todas as dependências do projeto:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto contendo sua chave do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```
4. Inicie o servidor em modo de desenvolvimento local:
   ```bash
   npm run dev
   ```
5. Abra o navegador no endereço indicado (geralmente `http://localhost:3000`) para brincar!

---
[Voltar ao início](https://github.com/slxshhh)
