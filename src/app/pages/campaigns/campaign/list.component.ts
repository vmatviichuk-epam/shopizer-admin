import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-campaign-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CampaignListComponent implements OnInit {
  loadingList = false;

  campaigns = [
    {
      id: 1,
      name: 'Summer Sale 2026',
      status: 'ACTIVE',
      type: 'DISCOUNT',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      customerGroup: 'VIP Customers',
      customersCount: 8,
      discount: '20%',
      categories: ['Electronics', 'Fashion'],
      conversionRate: 12.5,
      description: 'Exclusive summer discounts for VIP customers on electronics and fashion categories'
    },
    {
      id: 2,
      name: 'New Customer Welcome',
      status: 'ACTIVE',
      type: 'AB_TEST',
      startDate: '2026-03-01',
      endDate: '2026-12-31',
      customerGroup: 'New Registrations',
      customersCount: 15,
      discount: '15%',
      categories: ['All Categories'],
      conversionRate: 8.3,
      description: 'A/B test: 15% welcome discount vs free shipping for new registrations'
    },
    {
      id: 3,
      name: 'Win-back Inactive Users',
      status: 'DRAFT',
      type: 'AB_TEST',
      startDate: '2026-04-01',
      endDate: '2026-06-30',
      customerGroup: 'Inactive 90+ Days',
      customersCount: 5,
      discount: '25%',
      categories: ['Home & Garden', 'Sports'],
      conversionRate: null,
      description: 'Target customers inactive for 90+ days with aggressive discounts on popular categories'
    },
    {
      id: 4,
      name: 'Wholesale Tier Pricing',
      status: 'PAUSED',
      type: 'DISCOUNT',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      customerGroup: 'Wholesale',
      customersCount: 3,
      discount: '30%',
      categories: ['Electronics'],
      conversionRate: 45.2,
      description: 'Permanent wholesale pricing tier for bulk buyers on electronics'
    },
    {
      id: 5,
      name: 'Holiday Pre-Sale',
      status: 'SCHEDULED',
      type: 'DISCOUNT',
      startDate: '2026-11-15',
      endDate: '2026-12-25',
      customerGroup: 'VIP Customers',
      customersCount: 8,
      discount: '10%',
      categories: ['Fashion', 'Home & Garden', 'Toys'],
      conversionRate: null,
      description: 'Early access holiday discounts for VIP segment'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'DRAFT': return 'badge-secondary';
      case 'PAUSED': return 'badge-warning';
      case 'SCHEDULED': return 'badge-info';
      case 'ENDED': return 'badge-dark';
      default: return 'badge-secondary';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'DISCOUNT': return 'Discount';
      case 'AB_TEST': return 'A/B Test';
      default: return type;
    }
  }

  createCampaign() {
    this.router.navigate(['/pages/campaigns/create']);
  }

  editCampaign(id: number) {
    this.router.navigate(['/pages/campaigns/edit', id]);
  }

  viewCampaign(id: number) {
    this.router.navigate(['/pages/campaigns/view', id]);
  }

  duplicateCampaign(campaign: any) {
    alert('Duplicate campaign: ' + campaign.name + ' (stub)');
  }

  deleteCampaign(campaign: any) {
    alert('Delete campaign: ' + campaign.name + ' (stub)');
  }
}
