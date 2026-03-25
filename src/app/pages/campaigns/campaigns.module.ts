import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { CampaignsRoutingModule, routedComponents } from './campaigns-routing.module';
import { CampaignFilterPipe } from './campaign-filter.pipe';

@NgModule({
  declarations: [
    ...routedComponents,
    CampaignFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbSpinnerModule,
    CampaignsRoutingModule
  ]
})
export class CampaignsModule { }
