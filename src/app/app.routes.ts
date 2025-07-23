import { Routes } from '@angular/router';

// Importar componentes del portafolio
import { AboutComponent } from './shared/components/about/about.component';
import { ExperienceComponent } from './shared/components/experience/experience.component';
import { ProjectsComponent } from './shared/components/projects/projects.component';
import { SkillsComponent } from './shared/components/skills/skills.component';
import { EducationComponent } from './shared/components/education/education.component';
import { ExtracurricularComponent } from './shared/components/extracurricular/extracurricular.component';
import { ContactComponent } from './shared/components/contact/contact.component';

// Layout principal del portafolio
import { PortfolioLayoutComponent } from './views/layouts/portfolio-layout/portfolio-layout.component';
import { PortafolioComponent } from './views/portafolio/portafolio.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: PortafolioComponent,
        data: { 
            title: 'Franki Briones - Full Stack Developer',
            description: 'Desarrollador Full Stack especializado en Angular, Node.js y tecnologías modernas'
        }
    },
    // Rutas del portafolio con layout compartido
    {
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
    },
    // Rutas adicionales para casos específicos
    {
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
    },
    // Ruta comodín - redirige a home en lugar de about
    {
        path: '**',
        redirectTo: '/home'
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