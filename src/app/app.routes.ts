import { Routes } from '@angular/router';
import { ProposalComponent } from './components/proposal.component';
import { CelebrationComponent } from './components/celebration.component';

export const routes: Routes = [
  { path: '', component: ProposalComponent },
  { path: 'celebration', component: CelebrationComponent },
  { path: '**', redirectTo: '' }
];
