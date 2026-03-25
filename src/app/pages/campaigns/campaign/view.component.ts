import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-campaign-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class CampaignViewComponent implements OnInit {
  campaignId: number;

  campaign = {
    id: 1,
    name: 'Summer Sale 2026',
    status: 'ACTIVE',
    type: 'DISCOUNT',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    discount: 20,
    discountType: 'PERCENTAGE',
    description: 'Exclusive summer discounts for VIP customers on electronics and fashion categories',
    customerGroup: 'VIP Customers',
    categories: ['Electronics', 'Fashion'],
    conversionRate: 12.5,
    totalRevenue: 14250,
    totalOrders: 23,
    customers: [
      { id: 78, name: 'James Smith', email: 'james.smith@testshop.com', orders: 5, spent: 2340, variant: 'A' },
      { id: 79, name: 'Mary Johnson', email: 'mary.johnson@testshop.com', orders: 3, spent: 1560, variant: 'A' },
      { id: 80, name: 'Robert Williams', email: 'robert.williams@testshop.com', orders: 4, spent: 1890, variant: 'B' },
      { id: 82, name: 'Michael Jones', email: 'michael.jones@testshop.com', orders: 2, spent: 890, variant: 'A' },
      { id: 84, name: 'William Miller', email: 'william.miller@testshop.com', orders: 3, spent: 2100, variant: 'B' },
      { id: 87, name: 'Elizabeth Martinez', email: 'elizabeth.martinez@testshop.com', orders: 4, spent: 3200, variant: 'A' },
      { id: 91, name: 'Susan Wilson', email: 'susan.wilson@testshop.com', orders: 1, spent: 450, variant: 'B' },
      { id: 97, name: 'Karen Martin', email: 'karen.martin@testshop.com', orders: 1, spent: 1820, variant: 'A' },
    ],
    abVariants: {
      A: { label: 'Variant A: 20% discount', customers: 5, conversions: 4, revenue: 8810 },
      B: { label: 'Variant B: Free shipping', customers: 3, conversions: 2, revenue: 5440 }
    }
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.campaignId = +this.route.snapshot.paramMap.get('id');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'DRAFT': return 'badge-secondary';
      case 'PAUSED': return 'badge-warning';
      case 'SCHEDULED': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  editCampaign() {
    this.router.navigate(['/pages/campaigns/edit', this.campaignId]);
  }

  goBack() {
    this.router.navigate(['/pages/campaigns/list']);
  }

  pauseCampaign() {
    alert('Pause campaign (stub)');
  }

  removeCustomer(customer: any) {
    alert('Remove customer ' + customer.name + ' from campaign (stub)');
  }
}
