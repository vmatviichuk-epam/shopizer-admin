import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignsComponent } from './campaigns.component';
import { CampaignListComponent } from './campaign/list.component';
import { CampaignViewComponent } from './campaign/view.component';
import { CampaignCreateComponent } from './campaign/create.component';

const routes: Routes = [{
  path: '',
  component: CampaignsComponent,
  children: [
    {
      path: 'list',
      component: CampaignListComponent,
    },
    {
      path: 'create',
      component: CampaignCreateComponent,
    },
    {
      path: 'edit/:id',
      component: CampaignCreateComponent,
    },
    {
      path: 'view/:id',
      component: CampaignViewComponent,
    },
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignsRoutingModule { }

export const routedComponents = [
  CampaignsComponent,
  CampaignListComponent,
  CampaignViewComponent,
  CampaignCreateComponent
];
