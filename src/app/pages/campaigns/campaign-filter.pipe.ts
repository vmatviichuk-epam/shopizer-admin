import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'campaignFilter' })
export class CampaignFilterPipe implements PipeTransform {
  transform(campaigns: any[], filterValue: string): any[] {
    if (!campaigns || !filterValue) return campaigns;
    // Filter by status or type
    return campaigns.filter(c => c.status === filterValue || c.type === filterValue);
  }
}
