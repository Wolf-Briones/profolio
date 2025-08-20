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
    callme: [ '¿Estás seguro de que quieres llamar?', 'Confirmar Llamada' ],
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
    callme: [ 'Are you sure you want to call?', 'Confirm Call', 'Cancelar', 'Llamar' ],
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
    callme: [ 'Tem certeza de que quer Llamar?', 'Confirmar Chamada', 'Cancel', 'Call', 
      'Cancelar', 'Llamar' ],
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
    callme: [ 'Sind Sie sicher, dass Sie anrufen möchten?', 'Sind Sie sicher, dass Sie anrufen möchten?', 
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
