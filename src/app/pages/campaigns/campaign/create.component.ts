import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-campaign-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CampaignCreateComponent implements OnInit {
  isEdit = false;
  campaignId: number = null;

  campaign = {
    name: '',
    description: '',
    type: 'DISCOUNT',
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    discountType: 'PERCENTAGE',
    discountValue: null,
    customerGroup: '',
    categories: [],
    enableAbTest: false,
    variantBType: 'FREE_SHIPPING'
  };

  // Dummy data for dropdowns
  customerGroups = [
    { id: 1, name: 'VIP Customers', count: 8 },
    { id: 2, name: 'New Registrations', count: 15 },
    { id: 3, name: 'Inactive 90+ Days', count: 5 },
    { id: 4, name: 'Wholesale', count: 3 },
    { id: 5, name: 'All Customers', count: 39 }
  ];

  availableCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Home & Garden' },
    { id: 4, name: 'Sports' },
    { id: 5, name: 'Toys' },
    { id: 6, name: 'Books' },
    { id: 7, name: 'Food & Beverages' }
  ];

  variantBOptions = [
    { value: 'FREE_SHIPPING', label: 'Free Shipping' },
    { value: 'DOUBLE_POINTS', label: 'Double Loyalty Points' },
    { value: 'GIFT_ITEM', label: 'Free Gift Item' },
    { value: 'LOWER_DISCOUNT', label: 'Lower Discount (half)' }
  ];

  selectedCategories: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.campaignId = +id;
      // Stub: load campaign data
      this.campaign = {
        name: 'Summer Sale 2026',
        description: 'Exclusive summer discounts for VIP customers on electronics and fashion categories',
        type: 'DISCOUNT',
        status: 'ACTIVE',
        startDate: '2026-06-01',
        endDate: '2026-08-31',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        customerGroup: '1',
        categories: [1, 2],
        enableAbTest: true,
        variantBType: 'FREE_SHIPPING'
      };
    }
  }

  toggleCategory(catId: number) {
    const idx = this.campaign.categories.indexOf(catId);
    if (idx > -1) {
      this.campaign.categories.splice(idx, 1);
    } else {
      this.campaign.categories.push(catId);
    }
  }

  isCategorySelected(catId: number): boolean {
    return this.campaign.categories.indexOf(catId) > -1;
  }

  saveCampaign() {
    alert('Save campaign (stub)\n\n' + JSON.stringify(this.campaign, null, 2));
    this.router.navigate(['/pages/campaigns/list']);
  }

  saveAsDraft() {
    this.campaign.status = 'DRAFT';
    this.saveCampaign();
  }

  cancel() {
    this.router.navigate(['/pages/campaigns/list']);
  }
}
