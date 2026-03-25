import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { CustomersService } from '../services/customer.service';
import { StoreService } from '../../store-management/services/store.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../shared/services/error.service';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  source: any = new LocalDataSource();
  settings = {};
  search_text: string = '';
  loadingList = false;
  perPage = 10;
  currentPage = 1;
  totalCount;
  stores: Array<any> = [];
  selectedStore: String = '';
  searchValue: string = '';
  params = this.loadParams();

  // Dummy campaign assignments for prototype
  private campaignAssignments: { [customerId: number]: string } = {
    1: 'Summer Sale 2026',
    78: 'Summer Sale 2026',
    79: 'New Customer Welcome',
    80: 'Summer Sale 2026',
    81: 'New Customer Welcome',
    82: 'Summer Sale 2026',
    83: 'New Customer Welcome',
    84: 'Summer Sale 2026',
    85: 'New Customer Welcome',
    86: 'Win-back Inactive Users',
    87: 'Summer Sale 2026',
    88: 'Win-back Inactive Users',
    89: 'New Customer Welcome',
    90: 'Win-back Inactive Users',
    91: 'Summer Sale 2026',
    92: 'Wholesale Tier Pricing',
    93: 'New Customer Welcome',
    94: 'Wholesale Tier Pricing',
    95: 'Win-back Inactive Users',
    96: 'Wholesale Tier Pricing',
    97: 'Summer Sale 2026',
    98: 'New Customer Welcome',
    99: 'Holiday Pre-Sale',
    100: 'Holiday Pre-Sale',
    101: 'Holiday Pre-Sale',
  };
  constructor(
    private customersService: CustomersService,
    public router: Router,
    private toastr: ToastrService,
    private storageService: StorageService,
    private storeService: StoreService,
    private translate: TranslateService,
    private errorService: ErrorService
  ) {
    this.getStoreList()
    this.selectedStore = this.storageService.getMerchant();

    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getCustomers();
    });
  }
  ngOnInit() {
    this.getCustomers();
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
      });
  }
  loadParams() {

    return {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }
  getCustomers() {
    this.params.page = this.currentPage;

    this.loadingList = true;
    this.customersService.getCustomers(this.params)
      .subscribe(customer => {
        this.loadingList = false;
        const enriched = customer.customers.map(c => ({
          ...c,
          campaign: this.campaignAssignments[c.id] || '—'
        }));
        this.source.load(enriched);
        this.totalCount = customer.totalPages;
      }, error => {
        this.errorService.error('ERROR.SYSTEM_ERROR', error);
      });
    this.setSettings();
  }
  setSettings() {
    this.settings = {

      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        custom: [
          {
            name: 'edit',
            title: '<i class="nb-edit"></i>'
          },
          {
            name: 'delete',
            title: '<i class="nb-trash"></i>'
          }
        ]
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
          filter: false
        },
        storeCode: {
          title: this.translate.instant('STORE.MERCHANT_STORE'),
          type: 'string'
        },
        firstName: {
          title: this.translate.instant('ORDER_FORM.FIRST_NAME'),
          type: 'string',
          filter: false
        },
        lastName: {
          title: this.translate.instant('ORDER_FORM.LAST_NAME'),
          type: 'string',
        },
        emailAddress: {
          title: this.translate.instant('USER_FORM.EMAIL_ADDRESS'),
          type: 'string'
        },
        campaign: {
          title: 'Campaign',
          type: 'html',
          filter: false,
          valuePrepareFunction: (value) => {
            if (!value || value === '—') return '<span style="color:#c5cee0">—</span>';
            const colors = {
              'Summer Sale 2026': '#00d68f',
              'New Customer Welcome': '#3366ff',
              'Win-back Inactive Users': '#ffaa00',
              'Wholesale Tier Pricing': '#ff3d71',
              'Holiday Pre-Sale': '#8f5ee8'
            };
            const color = colors[value] || '#8f9bb3';
            return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;background:${color}20;color:${color}">${value}</span>`;
          }
        }
      },
    };
  }

  changePage(event) {
    switch (event.action) {
      case 'onPage': {
        this.currentPage = event.data;
        break;
      }
      case 'onPrev': {
        this.currentPage--;
        break;
      }
      case 'onNext': {
        this.currentPage++;
        break;
      }
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
      case 'onLast': {
        this.currentPage = event.data;
        break;
      }
    }
    this.getCustomers()
  }
  onSearch(query: string = '') {

    if (query.length == 0) {
      this.searchValue = null;
      return;
    }

    this.params["name"] = query;
    this.getCustomers();
    this.searchValue = query;

  }
  resetSearch() {
    this.searchValue = null;
    this.params = this.loadParams();
    this.getCustomers();
  }
  addCustomer() {
    localStorage.setItem('customerid', '');
    this.router.navigate(['/pages/customer/add']);
  }
  onSelectStore(e) {
    this.params["store"] = e.value;
    this.getCustomers();
  }

  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;
      case 'delete':
        this.onDelete(event);
        break;

    }
  }

  onEdit(event) {
    localStorage.setItem('customerid', event.data.id);
    this.router.navigate(['/pages/customer/add']);
  }



  onDelete(event) {
    console.log('DELETE');
    localStorage.setItem('customerid', null);
    //TODO dialog
    
    this.customersService.deleteCustomer(event.data.id,localStorage.getItem('merchant'))
    .subscribe(data => {
      this.loadingList = false;
    }, error => {
      this.errorService.error('ERROR.SYSTEM_ERROR', error);
    });
    this.errorService.success('COMMON.SUCCESS_REMOVE');
    this.router.navigate(['/pages/customer/list']);
  }
}
