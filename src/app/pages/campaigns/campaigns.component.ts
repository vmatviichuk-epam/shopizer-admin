import { Component } from '@angular/core';

@Component({
  selector: 'ngx-campaigns',
  template: `
    <div class="page-content">
      <div class="page-body">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class CampaignsComponent { }
