export enum GameStatus {
  SUCESSO = "sucesso",
  ERRO = "erro",
}

export interface GameState {
  status: GameStatus;
  feedback: string;
  nivel_ods4: number;
  background_color: string;
  elementos_ativos: string[];
  proximo_desafio: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  initialIcons: string[];
}

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "lixo-patio",
    title: "Lixo no Pátio",
    description: "O recreio acabou e o pátio está cheio de papéis e restos de lanche. O que devemos fazer?",
    initialIcons: ["Trash2", "Wind"],
  },
  {
    id: "colega-excluido",
    title: "Colega Sozinho",
    description: "Um novo colega está sentado sozinho no banco enquanto todos brincam. Qual a melhor atitude?",
    initialIcons: ["UserMinus", "Users"],
  },
  {
    id: "desperdicio-agua",
    title: "Torneira Aberta",
    description: "Alguém esqueceu a torneira do banheiro aberta e a água está correndo. Como ajudar?",
    initialIcons: ["Droplets", "Waves"],
  },
  {
    id: "livro-estragado",
    title: "Livro da Biblioteca",
    description: "Você encontrou um livro da biblioteca com páginas rasgadas. O que é o certo a fazer?",
    initialIcons: ["BookOpen", "Scissors"],
  },
  {
    id: "brincadeira-perigosa",
    title: "Escada Correndo",
    description: "Muitas crianças estão correndo e empurrando na hora de descer a escada. O que evitar?",
    initialIcons: ["ArrowDownCircle", "ShieldAlert"],
  },
  {
    id: "lanche-compartilhado",
    title: "Lanche do Amigo",
    description: "Um colega esqueceu o lanche hoje e está com fome. Como a turma pode agir?",
    initialIcons: ["Apple", "HeartHandshake"],
  },
  {
    id: "material-espalhado",
    title: "Material no Chão",
    description: "Lápis e borrachas estão espalhados pela sala depois da aula de artes. O que fazer?",
    initialIcons: ["Pencil", "Box"],
  },
  {
    id: "ajuda-estudo",
    title: "Dificuldade no Dever",
    description: "Um amigo não entendeu a explicação da professora. Como você pode ajudar?",
    initialIcons: ["HelpCircle", "GraduationCap"],
  },
  {
    id: "respeito-fila",
    title: "Fila da Cantina",
    description: "Alguém tentou passar na frente de todo mundo na fila. Como resolver com educação?",
    initialIcons: ["ListOrdered", "MessagesSquare"],
  },
  {
    id: "brinquedo-quebrado",
    title: "Brinquedo Coletivo",
    description: "Um brinquedo da brinquedoteca quebrou enquanto você usava. Qual o próximo passo?",
    initialIcons: ["Puzzle", "Tool"],
  },
  {
    id: "plantar-horta",
    title: "Horta na Escola",
    description: "A escola quer criar uma horta, mas as plantas precisam de cuidado todos os dias. Quem ajuda?",
    initialIcons: ["Sprout", "Sun"],
  },
  {
    id: "bullying-recreio",
    title: "Apelido Chato",
    description: "Algumas crianças estão colocando um apelido que um colega não gosta. Como parar isso?",
    initialIcons: ["Megaphone", "ShieldCheck"],
  },
  {
    id: "economia-luz",
    title: "Luz Acesa",
    description: "A aula acabou, mas as luzes e o ventilador continuam ligados. O que fazer?",
    initialIcons: ["Lightbulb", "Zap"],
  },
  {
    id: "professor-cansado",
    title: "Silêncio na Aula",
    description: "A professora está tentando falar, mas está muita barulheira. Como a turma colabora?",
    initialIcons: ["Volume2", "Smile"],
  },
  {
    id: "projeto-reciclagem",
    title: "Papel de Rascunho",
    description: "Sobraram muitos papéis que só foram usados de um lado. Jogamos fora ou reaproveitamos?",
    initialIcons: ["Recycle", "FileText"],
  },
  {
    id: "incluir-cadeirante",
    title: "Novo Amigo",
    description: "Um colega que usa cadeira de rodas chegou na escola. Como adaptar a brincadeira?",
    initialIcons: ["Accessibility", "PlayCircle"],
  },
  {
    id: "palavras-magicas",
    title: "Gentileza",
    description: "Um colega esbarrou em você sem querer. Qual a melhor reação?",
    initialIcons: ["MessageCircleHeart", "Handshake"],
  },
  {
    id: "cuidados-jardim",
    title: "Flores no Jardim",
    description: "As crianças estão pisando nas flores novas do jardim. Como proteger a natureza da escola?",
    initialIcons: ["Flower2", "MapPin"],
  },
  {
    id: "diversidade-cultural",
    title: "Dia das Nações",
    description: "Um colega de outro país trouxe uma comida diferente. Como a turma deve reagir?",
    initialIcons: ["Globe2", "Utensils"],
  },
  {
    id: "uso-tablet",
    title: "Tecnologia na Aula",
    description: "Os tablets da escola devem ser usados para o projeto, mas alguém quer jogar. Como agir?",
    initialIcons: ["Tablet", "Search"],
  },
  {
    id: "limpeza-quadro",
    title: "Quadro Negro",
    description: "O quadro está todo riscado de giz e a aula vai começar. Quem se voluntaria?",
    initialIcons: ["Eraser", "Layers"],
  },
  {
    id: "seguranca-quadra",
    title: "Jogo de Futebol",
    description: "O jogo está ficando muito agressivo e alguém pode se machucar. Como acalmar os ânimos?",
    initialIcons: ["Trophy", "Siren"],
  },
  {
    id: "dia-da-leitura",
    title: "Silêncio na Biblioteca",
    description: "É hora da leitura silenciosa, mas tem gente conversando alto. Como lembrar as regras?",
    initialIcons: ["Library", "VolumeX"],
  },
  {
    id: "feira-ciencias",
    title: "Trabalho em Grupo",
    description: "Um colega do grupo não quer fazer nada da tarefa. Como motivar o amigo?",
    initialIcons: ["Atom", "BrainCircuit"],
  },
  {
    id: "banheiro-limpo",
    title: "Higiene Escolar",
    description: "O banheiro está com papel no chão e a pia molhada. Como todos podem manter limpo?",
    initialIcons: ["ShowerHead", "Sparkles"],
  },
  {
    id: "coleta-seletiva",
    title: "Latas de Lixo",
    description: "Onde jogamos a casca de banana e onde jogamos a garrafa plástica?",
    initialIcons: ["Orbit", "Trash"],
  },
  {
    id: "respeito-diferenca",
    title: "Estilos Diferentes",
    description: "Um colega veio com um penteado novo e alguns riram. O que você diria?",
    initialIcons: ["VenetianMask", "SmileIcon"],
  },
  {
    id: "economia-papel",
    title: "Toalha de Papel",
    description: "Alguém pegou 10 folhas de papel para secar a mão. Quantas são necessárias de verdade?",
    initialIcons: ["Leaf", "Fingerprint"],
  },
  {
    id: "ouvir-opiniao",
    title: "Conselho de Classe",
    description: "A turma está escolhendo o tema da festa. Como garantir que todos decidam juntos?",
    initialIcons: ["Users2", "Vote"],
  },
  {
    id: "amizade-sincera",
    title: "Amigo Triste",
    description: "Seu melhor amigo tirou uma nota baixa e está chorando. Como consolar?",
    initialIcons: ["Frown", "HandHeart"],
  },
  {
    id: "organizar-mochila",
    title: "Mochilas no Caminho",
    description: "As mochilas estão no corredor e as pessoas estão tropeçando. O que fazer?",
    initialIcons: ["Backpack", "TriangleAlert"],
  },
  {
    id: "pintura-parede",
    title: "Muro da Escola",
    description: "Alguem riscou o muro da escola com canetinha. Como a turma pode cuidar do patrimônio?",
    initialIcons: ["Paintbrush", "BrickWall"],
  },
  {
    id: "dia-do-meio-ambiente",
    title: "Economia de Energia",
    description: "Vimos que o monitor do computador fica ligado a noite toda. O que sugerir à direção?",
    initialIcons: ["Monitor", "Power"],
  },
  {
    id: "respeito-ao-idoso",
    title: "Visita de Avós",
    description: "Hoje os avós vieram contar histórias. Como ouvir com atenção e carinho?",
    initialIcons: ["Ghost", "Baby"],
  },
  {
    id: "uso-uniforme",
    title: "Identidade Escolar",
    description: "Um colega não tem o uniforme completo. Como a escola pode ser acolhedora?",
    initialIcons: ["Shirt", "CheckCircle2"],
  },
  {
    id: "paz-no-recreio",
    title: "Briga por Espaço",
    description: "Duas turmas querem usar a quadra ao mesmo tempo. Como dividir o tempo?",
    initialIcons: ["Timer", "Scale"],
  },
  {
    id: "alimentacao-saudavel",
    title: "Fruta ou Doce?",
    description: "A escola trocou a bolacha por frutas, mas alguns não gostaram. Por que é importante?",
    initialIcons: ["Citrus", "Stethoscope"],
  },
  {
    id: "cuidado-animais",
    title: "Gatinho no Pátio",
    description: "Um gatinho entrou na escola e as crianças querem correr atrás dele. O que fazer?",
    initialIcons: ["Cat", "Info"],
  },
  {
    id: "falar-em-publico",
    title: "Apresentação",
    description: "Um colega está com muita vergonha de falar na frente da sala. Como incentivar?",
    initialIcons: ["Mic2", "PartyPopper"],
  },
  {
    id: "combate-ao-desperdicio",
    title: "Prato Limpo",
    description: "Muitas crianças pegam muita comida e jogam metade fora. Como conscientizar?",
    initialIcons: ["Soup", "Ban"],
  },
  {
    id: "inovacao-escolar",
    title: "Novas Ideias",
    description: "Como podemos usar sucata para criar algo novo para a escola?",
    initialIcons: ["Lightbulb", "Construction"],
  },
  {
    id: "inclusao-auditiva",
    title: "Língua de Sinais",
    description: "Aprendemos a dizer 'Oi' em Libras hoje. Como usar isso com amigos?",
    initialIcons: ["Ear", "Languages"],
  },
  {
    id: "resgate-brincadeiras",
    title: "Brincadeiras Antigas",
    description: "Vimos que ninguém mais brinca de amarelinha. Como ensinar aos menores?",
    initialIcons: ["Gamepad2", "Footprints"],
  },
  {
    id: "cuidado-com-equipamento",
    title: "Laboratório",
    description: "Os microscópios são delicados. Quais as regras para não quebrar?",
    initialIcons: ["Microscope", "HandMetal"],
  },
  {
    id: "sustentabilidade-transporte",
    title: "Vindo para a Escola",
    description: "Muita gente vem de carro e trava a rua. Existe um jeito mais sustentável?",
    initialIcons: ["Bike", "Bus"],
  },
  {
    id: "empatia-digital",
    title: "Grupo de Whatsapp",
    description: "Alguém mandou uma figurinha chata de um colega no grupo. O que você faz?",
    initialIcons: ["Smartphone", "XCircle"],
  },
  {
    id: "valorizar-funcionarios",
    title: "Equipe da Limpeza",
    description: "O tio da limpeza acabou de passar o pano. Como agradecer e manter limpo?",
    initialIcons: ["Wind", "ThumbsUp"],
  },
  {
    id: "dia-da-arvore",
    title: "Nova Muda",
    description: "Vamos plantar uma árvore hoje! Quem vai ser o guardião da rega?",
    initialIcons: ["Trees", "CupSoda"],
  },
  {
    id: "solidariedade-natal",
    title: "Doação de Brinquedos",
    description: "Temos brinquedos que não usamos mais. Como organizar uma feira de troca ou doação?",
    initialIcons: ["Gift", "PackageSearch"],
  },
  {
    id: "respeito-religioso",
    title: "Crenças Diferentes",
    description: "Um colega usa um acessório por causa da religião dele. Como respeitar?",
    initialIcons: ["Milestone", "HeartPulse"],
  },
  {
    id: "protecao-solar",
    title: "Sol Forte",
    description: "Está muito sol e um colega esqueceu o boné. Como brincar na sombra?",
    initialIcons: ["Umbrella", "VenetianMask"],
  },
  {
    id: "autonomia-estudantil",
    title: "Organizar a Sala",
    description: "A sala está uma bagunça e o sinal vai bater. Como dividir as tarefas rápido?",
    initialIcons: ["LayoutGrid", "ListCheck"],
  },
  {
    id: "seguranca-na-internet",
    title: "Senha Segura",
    description: "Um colega quer contar a senha dele para todo mundo. O que você aconselha?",
    initialIcons: ["Lock", "EyeOff"],
  },
  {
    id: "fazer-o-bem",
    title: "Boa Ação",
    description: "O que a turma pode fazer hoje para deixar a escola mais brilhante?",
    initialIcons: ["SunDim", "Star"],
  }
];
