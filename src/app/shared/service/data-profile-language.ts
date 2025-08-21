// enums/languages.enum.ts
export enum Languages {
  ES = 'es',
  EN = 'en',
  PT = 'pt',
  DE = 'de',
}

// Nombres de idiomas en cada idioma
export const LanguageNames: Record<Languages, Record<Languages, string>> = {
  [Languages.ES]: {
    [Languages.ES]: 'Español',
    [Languages.EN]: 'Inglés',
    [Languages.PT]: 'Portugués',
    [Languages.DE]: 'Alemán',
  },
  [Languages.EN]: {
    [Languages.ES]: 'Spanish',
    [Languages.EN]: 'English',
    [Languages.PT]: 'Portuguese',
    [Languages.DE]: 'German',
  },
  [Languages.PT]: {
    [Languages.ES]: 'Espanhol',
    [Languages.EN]: 'Inglês',
    [Languages.PT]: 'Português',
    [Languages.DE]: 'Alemão',
  },
  [Languages.DE]: {
    [Languages.ES]: 'Spanisch',
    [Languages.EN]: 'Englisch',
    [Languages.PT]: 'Portugiesisch',
    [Languages.DE]: 'Deutsch',
  },
};

// Configuración de UI
export const CONFIGURACIONES = {
  [Languages.ES]: {
    tema: ['Claro', 'Oscuro', 'Visión Nocturna'],
    tituloTema: 'Configuración de Tema',
    tituloIdioma: 'Configuración de Idioma',
    seleccionarIdioma: 'Seleccionar Idioma',
    seleccionarTema: 'Seleccionar Tema',
    skills: ['Desarrollo', 'Diseño', 'Analítica'],
    slogan: 'Creando soluciones digitales que transforman tu negocio',
    buttons: ['Contratar', 'Ver más', 'Descargar CV'],
    coffe: [
      'Invítame un café',
      'Escanea el código QR para invitarme a un café.',
    ],
    callme: ['¿Estás seguro de que quieres llamar?', 'Confirmar Llamada', 'Cancelar', 'Llamar'],
  },
  [Languages.EN]: {
    tema: ['Light', 'Dark', 'Night Vision'],
    tituloTema: 'Theme Settings',
    tituloIdioma: 'Language Settings',
    seleccionarIdioma: 'Select Language',
    seleccionarTema: 'Select Theme',
    skills: ['Development', 'Design', 'Analytics'],
    slogan: 'Creating digital solutions that transform your business',
    buttons: ['Hire Me', 'See more', 'Download CV'],
    coffe: ['Buy me a coffee', 'Scan the QR code to buy me a coffee.'],
    callme: ['Are you sure you want to call?', 'Confirm Call', 'Cancel', 'Call'],
  },
  [Languages.PT]: {
    tema: ['Claro', 'Escuro', 'Visão Noturna'],
    tituloTema: 'Configurações de Tema',
    tituloIdioma: 'Configurações de Idioma',
    seleccionarIdioma: 'Selecionar Idioma',
    seleccionarTema: 'Selecionar Tema',
    skills: ['Desenvolvimento', 'Design', 'Análise'],
    slogan: 'Criando soluções digitais que transformam o seu negócio',
    buttons: ['Contratar', 'Ver mais', 'Baixar CV'],
    coffe: ['Pague-me um café', 'Escaneie o código QR para me pagar um café.'],
    callme: ['Tem certeza de que quer ligar?', 'Confirmar Chamada', 'Cancelar', 'Ligar'],
  },
  [Languages.DE]: {
    tema: ['Hell', 'Dunkel', 'Nachtsicht'],
    tituloTema: 'Themaeinstellungen',
    tituloIdioma: 'Spracheinstellungen',
    seleccionarIdioma: 'Sprache auswählen',
    seleccionarTema: 'Thema auswählen',
    skills: ['Entwicklung', 'Design', 'Analytik'],
    slogan:
      'Erstellen Sie digitale Lösungen, die Ihr Unternehmen transformieren',
    buttons: ['Einstellen', 'Mehr sehen', 'Lebenslauf herunterladen'],
    coffe: [
      'Laden Sie mich auf einen Kaffee ein',
      'Scannen Sie den QR-Code, um mich auf einen Kaffee einzuladen.',
    ],
    callme: ['Sind Sie sicher, dass Sie anrufen möchten?', 'Sind Sie sicher, dass Sie anrufen möchten?',
      'Abbrechen', 'Anrufen'
    ],
  },
};

export const TRANSLATIONS = {
  [Languages.ES]: {
    categories: 'DISEÑO · DESARROLLO · MARKETING',
    helpText: 'Puedo ayudar a tu negocio a',
    mainMessage: 'Conectarse en línea y crecer rápido',
    resume: 'Currículum',
    projects: 'Proyectos',
  },
  [Languages.EN]: {
    categories: 'DESIGN · DEVELOPMENT · MARKETING',
    helpText: 'I can help your business to',
    mainMessage: 'Get online and grow fast',
    resume: 'Resume',
    projects: 'Projects',
  },
  [Languages.PT]: {
    categories: 'DESIGN · DESENVOLVIMENTO · MARKETING',
    helpText: 'Posso ajudar o seu negócio a',
    mainMessage: 'Conectar-se online e crescer rápido',
    resume: 'Currículo',
    projects: 'Projetos',
  },
  [Languages.DE]: {
    categories: 'DESIGN · ENTWICKLUNG · MARKETING',
    helpText: 'Ich kann Ihrem Unternehmen helfen,',
    mainMessage: 'Online zu gehen und schnell zu wachsen',
    resume: 'Lebenslauf',
    projects: 'Projekte',
  },
};

// interfaces/multilang.interface.ts
export interface MultiLangText {
  [Languages.ES]: string;
  [Languages.EN]: string;
  [Languages.PT]: string;
  [Languages.DE]: string;
} 

// Interfaz para la estructura de cada proyecto
export interface Project {
  title: string;
  description: string;
  techStack: string[];
  image: string; // URL o ruta de la imagen
  codeLink: string;
  demoLink: string;
  isLargeCard: boolean;
  credentials: { username: string, password: string };
  isPrivate: boolean
}

// Interfaz para la estructura de los datos de proyectos por idioma
export interface ProjectData {
  [Languages.ES]: Project[];
  [Languages.EN]: Project[];
  [Languages.PT]: Project[];
  [Languages.DE]: Project[];
}

// Objeto principal con la información de todos los proyectos en los 4 idiomas
export const PROJECTS_DATA: ProjectData = { 
  [Languages.ES]: [
    {
      title: 'Laundry ERP Platform',
      description: 'Plataforma completa de gestión electrónica con panel de administración, procesamiento de registros y gestión de inventario.',
      techStack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'SCSS'],
      image: '/assets/projects/laundry-sistem.jpg',
      codeLink: '#',
      demoLink: 'https://scan-albus.web.app',
      isLargeCard: true,
      credentials: { username: 'mmalpica85@gmail.com', password: 'MANU_1234$.mr' },
      isPrivate: false
    },
    {
      title: 'E-school Platform',
      description: 'Plataforma completa de administración estudiantil electrónica con panel de administración, procesamiento de pagos y gestión de alumnos.',
      techStack: ['Javascript', 'CSS', 'HTML', 'PostgreSQL', 'Firebase'],
      image: '/assets/projects/school.jpg',
      codeLink: '#',
      demoLink: 'https://escuela-javascript.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Moviliario Web App',
      description: 'Aplicación de gestión de clientes, préstamos, inventario, usuarios y empresas.',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
      image: '/assets/projects/moviliario.jpg',
      codeLink: '#',
      demoLink: 'https://moviliario-360.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Juego de Ninja',
      description: 'Juego para mejorar la destreza con el mouse, complejo y divertido - compatible solo en ordenadores.',
      techStack: ['Vue.js', 'canvas'],
      image: '/assets/projects/nija-game.jpg',
      codeLink: '#',
      demoLink: 'https://nijagame.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Página empresarial - SISTINCON',
      description: 'Página y blog empresarial.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/sistincon-page.jpg',
      codeLink: '#',
      demoLink: 'https://sistincon.com',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'App de invitación de cumpleaños',
      description: 'Aplicación web para invitar a tus amigos a tu cumpleaños, con contador regresivo, mapa de ubicación y confirmación de asistencia.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/app-briday.jpg',
      codeLink: '#',
      demoLink: 'https://it-s-my-bday.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    }
  ],

  [Languages.EN]: [
    {
      title: 'Laundry ERP Platform',
      description: 'Complete electronic management platform with admin panel, record processing, and inventory management.',
      techStack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'SCSS'],
      image: '/assets/projects/laundry-sistem.jpg',
      codeLink: '#',
      demoLink: 'https://scan-albus.web.app',
      isLargeCard: true,
      credentials: { username: 'mmalpica85@gmail.com', password: 'MANU_1234$.mr' },
      isPrivate: false
    },
    {
      title: 'E-school Platform',
      description: 'Comprehensive electronic student administration platform with admin panel, payment processing, and student management.',
      techStack: ['Javascript', 'CSS', 'HTML', 'PostgreSQL', 'Firebase'],
      image: '/assets/projects/school.jpg',
      codeLink: '#',
      demoLink: 'https://escuela-javascript.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Moviliario Web App',
      description: 'Application for managing clients, loans, inventory, users, and companies.',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
      image: '/assets/projects/moviliario.jpg',
      codeLink: '#',
      demoLink: 'https://moviliario-360.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Ninja Game',
      description: 'Game to improve mouse skills, complex and fun - compatible only with computers.',
      techStack: ['Vue.js', 'canvas'],
      image: '/assets/projects/nija-game.jpg',
      codeLink: '#',
      demoLink: 'https://nijagame.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Business Website - SISTINCON',
      description: 'Business page and blog.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/sistincon-page.jpg',
      codeLink: '#',
      demoLink: 'https://sistincon.com',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Birthday Invitation App',
      description: 'Web app to invite your friends to your birthday, with countdown, location map, and RSVP confirmation.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/app-briday.jpg',
      codeLink: '#',
      demoLink: 'https://it-s-my-bday.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    }
  ],

  [Languages.PT]: [
    {
      title: 'Laundry ERP Platform',
      description: 'Plataforma completa de gestão eletrônica com painel administrativo, processamento de registros e gestão de inventário.',
      techStack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'SCSS'],
      image: '/assets/projects/laundry-sistem.jpg',
      codeLink: '#',
      demoLink: 'https://scan-albus.web.app',
      isLargeCard: true,
      credentials: { username: 'mmalpica85@gmail.com', password: 'MANU_1234$.mr' },
      isPrivate: false
    },
    {
      title: 'E-school Platform',
      description: 'Plataforma completa de administração estudantil eletrônica com painel administrativo, processamento de pagamentos e gestão de alunos.',
      techStack: ['Javascript', 'CSS', 'HTML', 'PostgreSQL', 'Firebase'],
      image: '/assets/projects/school.jpg',
      codeLink: '#',
      demoLink: 'https://escuela-javascript.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Moviliario Web App',
      description: 'Aplicativo para gestão de clientes, empréstimos, inventário, usuários e empresas.',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
      image: '/assets/projects/moviliario.jpg',
      codeLink: '#',
      demoLink: 'https://moviliario-360.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Jogo de Ninja',
      description: 'Jogo para melhorar a destreza com o mouse, complexo e divertido - compatível apenas com computadores.',
      techStack: ['Vue.js', 'canvas'],
      image: '/assets/projects/nija-game.jpg',
      codeLink: '#',
      demoLink: 'https://nijagame.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Site empresarial - SISTINCON',
      description: 'Página e blog empresarial.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/sistincon-page.jpg',
      codeLink: '#',
      demoLink: 'https://sistincon.com',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'App de convite de aniversário',
      description: 'Aplicativo web para convidar seus amigos para o seu aniversário, com contagem regressiva, mapa de localização e confirmação de presença.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/app-briday.jpg',
      codeLink: '#',
      demoLink: 'https://it-s-my-bday.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    }
  ],

  [Languages.DE]: [
    {
      title: 'Laundry ERP Platform',
      description: 'Komplette elektronische Managementplattform mit Admin-Panel, Datensatzverarbeitung und Inventarverwaltung.',
      techStack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'SCSS'],
      image: '/assets/projects/laundry-sistem.jpg',
      codeLink: '#',
      demoLink: 'https://scan-albus.web.app',
      isLargeCard: true,
      credentials: { username: 'mmalpica85@gmail.com', password: 'MANU_1234$.mr' },
      isPrivate: false
    },
    {
      title: 'E-school Platform',
      description: 'Umfassende elektronische Studentenverwaltungsplattform mit Admin-Panel, Zahlungsabwicklung und Schülerverwaltung.',
      techStack: ['Javascript', 'CSS', 'HTML', 'PostgreSQL', 'Firebase'],
      image: '/assets/projects/school.jpg',
      codeLink: '#',
      demoLink: 'https://escuela-javascript.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Moviliario Web App',
      description: 'Anwendung zur Verwaltung von Kunden, Darlehen, Inventar, Benutzern und Unternehmen.',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
      image: '/assets/projects/moviliario.jpg',
      codeLink: '#',
      demoLink: 'https://moviliario-360.web.app',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Ninja-Spiel',
      description: 'Spiel zur Verbesserung der Mausfertigkeit, komplex und unterhaltsam - nur mit Computern kompatibel.',
      techStack: ['Vue.js', 'canvas'],
      image: '/assets/projects/nija-game.jpg',
      codeLink: '#',
      demoLink: 'https://nijagame.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Unternehmensseite - SISTINCON',
      description: 'Unternehmensseite und Blog.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/sistincon-page.jpg',
      codeLink: '#',
      demoLink: 'https://sistincon.com',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    },
    {
      title: 'Geburtstagseinladungs-App',
      description: 'Web-App, um deine Freunde zu deinem Geburtstag einzuladen, mit Countdown, Standortkarte und Teilnahmebestätigung.',
      techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      image: '/assets/projects/app-briday.jpg',
      codeLink: '#',
      demoLink: 'https://it-s-my-bday.web.app/',
      isLargeCard: true,
      credentials: { username: 'admin', password: 'admin123' },
      isPrivate: false
    }
  ]
};

export const CONFIG_ABOUT_ME = {
  [Languages.ES]: {
    sobreMiTitulo: 'Sobre Mí',
    sobreMiContenido: 'Soy un desarrollador full stack apasionado por crear soluciones digitales innovadoras. Con experiencia sólida desde el 2018, especializado en tecnologías modernas y metodologías ágiles.',
    miHistoriaTitulo: 'Mi Historia',
    miHistoriaContenido: [
      'Comencé mi carrera en el desarrollo desde el 2015, trabajando inicialmente con tecnologías tradicionales como C++, Java y C# antes de especializarme en el ecosistema de Kotlin, Angular, React y React Native.',
      'Me apasiona resolver problemas complejos y crear experiencias de usuario excepcionales. Siempre estoy aprendiendo nuevas tecnologías y mejores prácticas para mantenerme actualizado en este campo en constante evolución.',
      'Cuando no estoy programando, disfruto contribuir a proyectos de código abierto, escribir artículos técnicos y mentorizar a desarrolladores junior.',
    ],
  },
  [Languages.EN]: {
    sobreMiTitulo: 'About Me',
    sobreMiContenido: 'I am a full stack developer passionate about creating innovative digital solutions. With solid experience since 2018, specializing in modern technologies and agile methodologies.' ,
    miHistoriaTitulo: 'My Story',
    miHistoriaContenido: [
      'I started my development career in 2015, initially working with traditional technologies like C++, Java, and C# before specializing in the Kotlin, Angular, React, and React Native ecosystem.',
      'I am passionate about solving complex problems and creating exceptional user experiences. I am always learning new technologies and best practices to stay up to date in this constantly evolving field.',
      'When I am not coding, I enjoy contributing to open-source projects, writing technical articles, and mentoring junior developers.',
    ],
  },
  [Languages.PT]: {
    sobreMiTitulo: 'Sobre Mim',
    sobreMiContenido:  'Sou um desenvolvedor full stack apaixonado por criar soluções digitais inovadoras. Com sólida experiência desde 2018, especializado em tecnologias modernas e metodologias ágeis.' ,
    miHistoriaTitulo: 'Minha História',
    miHistoriaContenido: [
      'Comecei minha carreira em desenvolvimento em 2015, trabalhando inicialmente com tecnologias tradicionais como C++, Java e C# antes de me especializar no ecossistema de Kotlin, Angular, React e React Native.',
      'Sou apaixonado por resolver problemas complexos e criar experiências de usuário excepcionais. Estou sempre aprendendo novas tecnologias e melhores práticas para me manter atualizado neste campo em constante evolução.',
      'Quando não estou programando, gosto de contribuir para projetos de código aberto, escrever artigos técnicos e orientar desenvolvedores juniores.',
    ],
  },
  [Languages.DE]: {
    sobreMiTitulo: 'Über mich',
    sobreMiContenido:  'Ich bin ein Full-Stack-Entwickler, der leidenschaftlich gerne innovative digitale Lösungen entwickelt. Mit solider Erfahrung seit 2018, spezialisiert auf moderne Technologien und agile Methoden.',
    miHistoriaTitulo: 'Meine Geschichte',
    miHistoriaContenido: [
      'Ich begann meine Entwicklungskarriere im Jahr 2015, zunächst mit traditionellen Technologien wie C++, Java und C#, bevor ich mich auf das Ökosystem von Kotlin, Angular, React und React Native spezialisierte.',
      'Ich brenne dafür, komplexe Probleme zu lösen und außergewöhnliche Benutzererlebnisse zu schaffen. Ich lerne ständig neue Technologien und Best Practices, um in diesem sich ständig weiterentwickelnden Bereich auf dem Laufenden zu bleiben.',
      'Wenn ich nicht programmiere, trage ich gerne zu Open-Source-Projekten bei, schreibe technische Artikel und betreue Junior-Entwickler.',
    ],
  },
};

export interface ProjectConfigI {
  title: string;
  description: string;
  buttons: string[]; 
}

export interface ProjectConfig {
  [Languages.ES]: ProjectConfigI[];
  [Languages.EN]: ProjectConfigI[];
  [Languages.PT]: ProjectConfigI[];
  [Languages.DE]: ProjectConfigI[];
}

export const CONFIG_PROJECTS: ProjectConfig = {
  [Languages.ES]: [
    {
      title: 'Proyectos Destacados',
      description: 'Una selección de mis trabajos más recientes que demuestran mis habilidades en desarrollo full stack y diseño de experiencias de usuario.',
      buttons: ['Código privado', 'Código abierto', 'Ver demostración'],
    },
  ],
  [Languages.EN]: [
    {
      title: 'Featured Projects',
      description: 'A selection of my most recent work that showcases my skills in full-stack development and user experience design.',
      buttons: ['Private Code', 'Open Source', 'View Demo'],
    },
  ],
  [Languages.PT]: [
    {
      title: 'Projetos em Destaque',
      description: 'Uma seleção dos meus trabalhos mais recentes que demonstram minhas habilidades em desenvolvimento full stack e design de experiência do usuário.',
      buttons: ['Código Privado', 'Código Aberto', 'Ver Demonstração'],
    },
  ],
  [Languages.DE]: [
    {
      title: 'Ausgewählte Projekte',
      description: 'Eine Auswahl meiner jüngsten Arbeiten, die meine Fähigkeiten in der Full-Stack-Entwicklung und im User Experience Design demonstrieren.',
      buttons: ['Privater Code', 'Open Source', 'Demo ansehen'],
    },
  ],
};

// Enums para las categorías, para evitar errores de escritura.
export enum SkillCategory {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Mobile = 'Mobile',
  Tools = 'Herramientas',
}

// Nueva interfaz para cada item de habilidad
export interface SkillItem {
  name: string;
  level: number;
}

// Nueva interfaz para las habilidades, usando la interfaz anterior
export interface Skills {
  [SkillCategory.Frontend]: SkillItem[];
  [SkillCategory.Backend]: SkillItem[];
  [SkillCategory.Mobile]: SkillItem[];
  [SkillCategory.Tools]: SkillItem[];
}

// Las variables tipadas con la nueva estructura
export const TECH_STACK: Skills = {
  [SkillCategory.Frontend]: [
    { name: 'React', level: 90 },
    { name: 'Next.js', level: 85 },
    { name: 'TypeScript', level: 95 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'Vue.js', level: 70 },
  ],
  [SkillCategory.Backend]: [
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'MongoDB', level: 70 },
    { name: 'Express', level: 80 },
  ],
  [SkillCategory.Mobile]: [
    { name: 'React Native', level: 85 },
    { name: 'Flutter', level: 60 },
    { name: 'iOS', level: 50 },
    { name: 'Android', level: 50 },
  ],
  [SkillCategory.Tools]: [
    { name: 'Git', level: 95 },
    { name: 'Docker', level: 80 },
    { name: 'AWS', level: 65 },
    { name: 'Vercel', level: 90 },
    { name: 'Figma', level: 75 },
  ],
};

// constants/profile.constants.ts
export const PROFILE_CONSTANTS = {
  // Información básica del perfil
  BASIC_INFO: {
    NAME: {
      [Languages.ES]: 'Franki Briones',
      [Languages.EN]: 'Franki Briones',
      [Languages.PT]: 'Franki Briones',
      [Languages.DE]: 'Franki Briones',
    } as MultiLangText,

    TITLE: {
      [Languages.ES]:
        'Desarrollador Full-stack | Desarrollador Angular | Desarrollador WEB',
      [Languages.EN]:
        'Full-stack Developer | Angular Developer | WEB Developer',
      [Languages.PT]:
        'Desenvolvedor Full-stack | Desenvolvedor Angular | Desenvolvedor WEB',
      [Languages.DE]:
        'Full-stack Entwickler | Angular Entwickler | WEB Entwickler',
    } as MultiLangText,

    LOCATION: {
      [Languages.ES]: 'Trujillo, Departamento de la Libertad, Perú',
      [Languages.EN]: 'Trujillo, La Libertad Department, Peru',
      [Languages.PT]: 'Trujillo, Departamento de La Libertad, Peru',
      [Languages.DE]: 'Trujillo, Departement La Libertad, Peru',
    } as MultiLangText,
  },

  // Sección "Acerca de"
  // Configuración de la sección "Sobre Mí"
  ABOUT: {
    CREATOR_TITLE: {
      [Languages.ES]: 'Creador de Soluciones Computacionales',
      [Languages.EN]: 'Creator of Computational Solutions',
      [Languages.PT]: 'Criador de Soluções Computacionais',
      [Languages.DE]: 'Entwickler von Computerlösungen',
    } as MultiLangText,

    CREATOR_DESCRIPTION: {
      [Languages.ES]:
        'Mi enfoque en la resolución innovadora de problemas ha llevado a logros significativos en el desarrollo de software, abarcando desde aplicaciones móviles hasta sistemas empresariales a gran escala.',
      [Languages.EN]:
        'My focus on innovative problem-solving has led to significant achievements in software development, spanning from mobile applications to large-scale enterprise systems.',
      [Languages.PT]:
        'Meu foco na resolução inovadora de problemas levou a conquistas significativas no desenvolvimento de software, abrangendo desde aplicações móveis até sistemas empresariais de grande escala.',
      [Languages.DE]:
        'Mein Fokus auf innovative Problemlösung hat zu bedeutenden Erfolgen in der Softwareentwicklung geführt, von mobilen Anwendungen bis hin zu groß angelegten Unternehmenssystemen.',
    } as MultiLangText,

    COMMITMENT_TITLE: {
      [Languages.ES]: 'Compromiso Continuo con el Éxito',
      [Languages.EN]: 'Ongoing Commitment to Success',
      [Languages.PT]: 'Compromisso Contínuo com o Sucesso',
      [Languages.DE]: 'Kontinuierliches Engagement für den Erfolg',
    } as MultiLangText,

    COMMITMENT_DESCRIPTION: {
      [Languages.ES]:
        'Mi carrera y logros reflejan una pasión por la tecnología. Estoy comprometido con la mejora continua y la superación de obstáculos. Creo firmemente en el poder de la tecnología para transformar las empresas, y estoy emocionado de contribuir a esa transformación.',
      [Languages.EN]:
        'My career and accomplishments reflect a passion for technology. I am committed to continuous improvement and overcoming obstacles. I firmly believe in the power of technology to transform businesses, and I am excited to contribute to that transformation.',
      [Languages.PT]:
        'Minha carreira e conquistas refletem uma paixão pela tecnologia. Estou comprometido com a melhoria contínua e superação de obstáculos. Acredito firmemente no poder da tecnologia para transformar empresas, e estou empolgado em contribuir para essa transformação.',
      [Languages.DE]:
        'Meine Karriere und Erfolge spiegeln eine Leidenschaft für Technologie wider. Ich bin der kontinuierlichen Verbesserung und Überwindung von Hindernissen verpflichtet. Ich glaube fest an die Macht der Technologie, Unternehmen zu transformieren, und ich bin begeistert, zu dieser Transformation beizutragen.',
    } as MultiLangText,
  },

  // Experiencia laboral
  EXPERIENCE: {
    SECTION_TITLE: {
      [Languages.ES]: 'Experiencia',
      [Languages.EN]: 'Experience',
      [Languages.PT]: 'Experiência',
      [Languages.DE]: 'Erfahrung',
    } as MultiLangText,

    // NTT DATA
    NTT_DATA: {
      COMPANY: {
        [Languages.ES]: 'NTT DATA Europe & Latam',
        [Languages.EN]: 'NTT DATA Europe & Latam',
        [Languages.PT]: 'NTT DATA Europe & Latam',
        [Languages.DE]: 'NTT DATA Europe & Latam',
      } as MultiLangText,

      POSITION: {
        [Languages.ES]: 'Especialista Técnico Senior',
        [Languages.EN]: 'Senior Technical Specialist',
        [Languages.PT]: 'Especialista Técnico Sênior',
        [Languages.DE]: 'Senior Technischer Spezialist',
      } as MultiLangText,

      DESCRIPTION: {
        [Languages.ES]:
          'Desarrollador y analista Frontend Angular, para cliente BCP',
        [Languages.EN]: 'Angular Frontend Developer and Analyst for BCP client',
        [Languages.PT]:
          'Desenvolvedor e analista Frontend Angular para cliente BCP',
        [Languages.DE]:
          'Angular Frontend-Entwickler und Analyst für BCP-Kunden',
      } as MultiLangText,

      DURATION: {
        [Languages.ES]: 'feb. 2024 - actualidad · 1 año 7 meses',
        [Languages.EN]: 'Feb 2024 - Present · 1 year 7 months',
        [Languages.PT]: 'fev. 2024 - presente · 1 ano 7 meses',
        [Languages.DE]: 'Feb. 2024 - Gegenwart · 1 Jahr 7 Monate',
      } as MultiLangText,
    },

    // SISTINCON
    SISTINCON: {
      COMPANY: {
        [Languages.ES]: 'SISTINCON',
        [Languages.EN]: 'SISTINCON',
        [Languages.PT]: 'SISTINCON',
        [Languages.DE]: 'SISTINCON',
      } as MultiLangText,

      POSITION: {
        [Languages.ES]: 'Desarrollador Full-stack',
        [Languages.EN]: 'Full-stack Developer',
        [Languages.PT]: 'Desenvolvedor Full-stack',
        [Languages.DE]: 'Full-stack Entwickler',
      } as MultiLangText,

      DURATION: {
        [Languages.ES]: 'ago. 2022 - feb. 2024 · 1 año 7 meses',
        [Languages.EN]: 'Aug 2022 - Feb 2024 · 1 year 7 months',
        [Languages.PT]: 'ago. 2022 - fev. 2024 · 1 ano 7 meses',
        [Languages.DE]: 'Aug. 2022 - Feb. 2024 · 1 Jahr 7 Monate',
      } as MultiLangText,

      DESCRIPTION: {
        [Languages.ES]:
          'Líder en el Desarrollo de un Sistema de Rutas para un Cliente Significativo en Perú',
        [Languages.EN]:
          'Leader in the Development of a Route System for a Significant Client in Peru',
        [Languages.PT]:
          'Líder no Desenvolvimento de um Sistema de Rotas para um Cliente Significativo no Peru',
        [Languages.DE]:
          'Leiter bei der Entwicklung eines Routensystems für einen bedeutenden Kunden in Peru',
      } as MultiLangText,
    },

    // TEC SOLUTIONS
    TEC_SOLUTIONS: {
      COMPANY: {
        [Languages.ES]: 'Tec Solutions',
        [Languages.EN]: 'Tec Solutions',
        [Languages.PT]: 'Tec Solutions',
        [Languages.DE]: 'Tec Solutions',
      } as MultiLangText,

      POSITION: {
        [Languages.ES]: 'Desarrollador de Software Senior',
        [Languages.EN]: 'Senior Software Developer',
        [Languages.PT]: 'Desenvolvedor de Software Sênior',
        [Languages.DE]: 'Senior Software-Entwickler',
      } as MultiLangText,

      DURATION: {
        [Languages.ES]: 'ene. 2021 - jun. 2022 · 1 año 6 meses',
        [Languages.EN]: 'Jan 2021 - Jun 2022 · 1 year 6 months',
        [Languages.PT]: 'jan. 2021 - jun. 2022 · 1 ano 6 meses',
        [Languages.DE]: 'Jan. 2021 - Jun. 2022 · 1 Jahr 6 Monate',
      } as MultiLangText,
    },
  },

  // Educación
  EDUCATION: {
    SECTION_TITLE: {
      [Languages.ES]: 'Educación',
      [Languages.EN]: 'Education',
      [Languages.PT]: 'Educação',
      [Languages.DE]: 'Bildung',
    } as MultiLangText,

    AUSTRAL: {
      INSTITUTION: {
        [Languages.ES]: 'Universidad Austral, Argentina',
        [Languages.EN]: 'Austral University, Argentina',
        [Languages.PT]: 'Universidade Austral, Argentina',
        [Languages.DE]: 'Austral Universität, Argentinien',
      } as MultiLangText,

      DEGREE: {
        [Languages.ES]: 'Desarrollador Full Stack, Ingeniería de software',
        [Languages.EN]: 'Full Stack Developer, Software Engineering',
        [Languages.PT]: 'Desenvolvedor Full Stack, Engenharia de software',
        [Languages.DE]: 'Full Stack Entwickler, Software Engineering',
      } as MultiLangText,

      DURATION: {
        [Languages.ES]: 'mar. 2019 - may. 2021',
        [Languages.EN]: 'Mar 2019 - May 2021',
        [Languages.PT]: 'mar. 2019 - mai. 2021',
        [Languages.DE]: 'Mär. 2019 - Mai 2021',
      } as MultiLangText,
    },

    CAJAMARCA: {
      INSTITUTION: {
        [Languages.ES]: 'Universidad Nacional de Cajamarca',
        [Languages.EN]: 'National University of Cajamarca',
        [Languages.PT]: 'Universidade Nacional de Cajamarca',
        [Languages.DE]: 'Nationale Universität von Cajamarca',
      } as MultiLangText,

      DEGREE: {
        [Languages.ES]: 'Licenciatura, Ingeniería de sistemas',
        [Languages.EN]: "Bachelor's degree, Systems Engineering",
        [Languages.PT]: 'Bacharelado, Engenharia de sistemas',
        [Languages.DE]: 'Bachelor-Abschluss, Systemtechnik',
      } as MultiLangText,

      DURATION: {
        [Languages.ES]: 'mar. 2014 - dic. 2019',
        [Languages.EN]: 'Mar 2014 - Dec 2019',
        [Languages.PT]: 'mar. 2014 - dez. 2019',
        [Languages.DE]: 'Mär. 2014 - Dez. 2019',
      } as MultiLangText,
    },
  },

  // Habilidades técnicas
  SKILLS: {
    SECTION_TITLE: {
      [Languages.ES]: 'Conocimientos y aptitudes',
      [Languages.EN]: 'Skills and Knowledge',
      [Languages.PT]: 'Conhecimentos e habilidades',
      [Languages.DE]: 'Kenntnisse und Fähigkeiten',
    } as MultiLangText,

    FRONTEND: {
      TITLE: {
        [Languages.ES]: 'Desarrollo Frontend',
        [Languages.EN]: 'Frontend Development',
        [Languages.PT]: 'Desenvolvimento Frontend',
        [Languages.DE]: 'Frontend-Entwicklung',
      } as MultiLangText,

      TECHNOLOGIES: [
        'Angular',
        'TypeScript',
        'JavaScript',
        'HTML5',
        'CSS3',
        'RxJS',
        'Angular Material',
      ],
    },

    BACKEND: {
      TITLE: {
        [Languages.ES]: 'Desarrollo Backend',
        [Languages.EN]: 'Backend Development',
        [Languages.PT]: 'Desenvolvimento Backend',
        [Languages.DE]: 'Backend-Entwicklung',
      } as MultiLangText,

      TECHNOLOGIES: [
        'Node.js',
        'Java',
        'Spring Boot',
        'Express',
        'MongoDB',
        'SQL',
      ],
    },

    CLOUD: {
      TITLE: {
        [Languages.ES]: 'Tecnologías en la Nube',
        [Languages.EN]: 'Cloud Technologies',
        [Languages.PT]: 'Tecnologias em Nuvem',
        [Languages.DE]: 'Cloud-Technologien',
      } as MultiLangText,

      TECHNOLOGIES: ['AWS', 'Azure', 'Firebase'],
    },

    TOOLS: {
      TITLE: {
        [Languages.ES]: 'Herramientas y Metodologías',
        [Languages.EN]: 'Tools and Methodologies',
        [Languages.PT]: 'Ferramentas e Metodologias',
        [Languages.DE]: 'Tools und Methodologien',
      } as MultiLangText,

      TECHNOLOGIES: ['Git', 'Webpack', 'Kafka', 'DevSecOps', 'CI/CD'],
    },
  },

  // Navegación y UI
  UI: {
    CONTACT: {
      [Languages.ES]: 'Contacto',
      [Languages.EN]: 'Contact',
      [Languages.PT]: 'Contato',
      [Languages.DE]: 'Kontakt',
    } as MultiLangText,

    VIEW_MORE: {
      [Languages.ES]: 'Ver más',
      [Languages.EN]: 'View more',
      [Languages.PT]: 'Ver mais',
      [Languages.DE]: 'Mehr anzeigen',
    } as MultiLangText,

    DOWNLOAD_CV: {
      [Languages.ES]: 'Descargar CV',
      [Languages.EN]: 'Download CV',
      [Languages.PT]: 'Baixar CV',
      [Languages.DE]: 'CV herunterladen',
    } as MultiLangText,

    BACK_TO_TOP: {
      [Languages.ES]: 'Volver arriba',
      [Languages.EN]: 'Back to top',
      [Languages.PT]: 'Voltar ao topo',
      [Languages.DE]: 'Zurück nach oben',
    } as MultiLangText,

    LANGUAGE_SELECTOR: {
      [Languages.ES]: 'Seleccionar idioma',
      [Languages.EN]: 'Select language',
      [Languages.PT]: 'Selecionar idioma',
      [Languages.DE]: 'Sprache auswählen',
    } as MultiLangText,
  },

  // Certificaciones
  CERTIFICATIONS: {
    SECTION_TITLE: {
      [Languages.ES]: 'Licencias y certificaciones',
      [Languages.EN]: 'Licenses and certifications',
      [Languages.PT]: 'Licenças e certificações',
      [Languages.DE]: 'Lizenzen und Zertifizierungen',
    } as MultiLangText,

    VIEW_CREDENTIAL: {
      [Languages.ES]: 'Mostrar credencial',
      [Languages.EN]: 'Show credential',
      [Languages.PT]: 'Mostrar credencial',
      [Languages.DE]: 'Nachweis anzeigen',
    } as MultiLangText,
  },
};
