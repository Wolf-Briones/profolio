import { Routes } from '@angular/router';
import { PorfolioComponent } from './views/porfolio/porfolio.component';
import { SobreMiComponent } from './shared/components/sobre-mi/sobre-mi.component';
import { ProyectosComponent } from './shared/components/proyectos/proyectos.component';
import { ExperienciaComponent } from './shared/components/experiencia/experiencia.component';
import { ContactComponent } from './shared/components/contacto/contacto.component';

// Importar componentes del portafolio

// Layout principal del portafolio

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'intro',
        component: PorfolioComponent,
        /* data: { 
            title: 'Franki Briones - Full Stack Developer',
            description: 'Desarrollador Full Stack especializado en Angular, Node.js y tecnologías modernas'
        } */
    },
    {
        path: 'about',
        component: SobreMiComponent,
    },
    {
        path: 'projects',
        component: ProyectosComponent,
    },
    {
        path: 'experience',
        component: ExperienciaComponent,
    },
    {
        path: 'contact',
        component: ContactComponent,
    },
    
    // Rutas del portafolio con layout compartido
    /* {
        path: '',
        component: PortfolioLayoutComponent,
        children: [
            {
                path: 'about',
                component: AboutComponent,
                data: { 
                    title: 'Acerca de Mí - Franki Briones',
                    section: 'about'
                }
            },
            {
                path: 'experience',
                component: ExperienceComponent,
                data: { 
                    title: 'Experiencia Profesional - Franki Briones',
                    section: 'experience'
                }
            },
            {
                path: 'projects',
                component: ProjectsComponent,
                data: { 
                    title: 'Proyectos - Franki Briones',
                    section: 'projects'
                }
            },
            {
                path: 'skills',
                component: SkillsComponent,
                data: { 
                    title: 'Habilidades Técnicas - Franki Briones',
                    section: 'skills'
                }
            },
            {
                path: 'education',
                component: EducationComponent,
                data: { 
                    title: 'Educación - Franki Briones',
                    section: 'education'
                }
            },
            {
                path: 'extracurricular',
                component: ExtracurricularComponent,
                data: { 
                    title: 'Actividades Extracurriculares - Franki Briones',
                    section: 'extracurricular'
                }
            },
            {
                path: 'contact',
                component: ContactComponent,
                data: { 
                    title: 'Contacto - Franki Briones',
                    section: 'contact'
                }
            }
        ]
    }, */
    // Rutas adicionales para casos específicos
    /* {
        path: 'cv',
        redirectTo: '/about',
        pathMatch: 'full'
    },
    {
        path: 'resume',
        redirectTo: '/about',
        pathMatch: 'full'
    },
    {
        path: 'portfolio',
        redirectTo: '/projects',
        pathMatch: 'full'
    },
    {
        path: 'hire-me',
        redirectTo: '/contact',
        pathMatch: 'full'
    }, */
    // Ruta comodín - redirige a home en lugar de about
    {
        path: '**',
        redirectTo: '/intro'
    }
];

// Rutas adicionales para lazy loading (opcional)
/* export const portfolioLazyRoutes: Routes = [
    {
        path: 'projects',
        loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule)
    },
    {
        path: 'skills',
        loadChildren: () => import('./modules/skills/skills.module').then(m => m.SkillsModule)
    }
]; */