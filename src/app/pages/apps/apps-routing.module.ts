import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Apps
import { AppsMessagingComponent } from 'src/app/pages/apps/messaging/messaging.component'
import { AppsCalendarComponent } from 'src/app/pages/apps/calendar/calendar.component'
import { AppsProfileComponent } from 'src/app/pages/apps/profile/profile.component'
import { AppsGalleryComponent } from 'src/app/pages/apps/gallery/gallery.component'
import { AppsMailComponent } from 'src/app/pages/apps/mail/mail.component'
import { GithubExploreComponent } from 'src/app/pages/apps/github-explore/github-explore.component'
import { GithubDiscussComponent } from 'src/app/pages/apps/github-discuss/github-discuss.component'
import { JiraDashboardComponent } from 'src/app/pages/apps/jira-dashboard/jira-dashboard.component'
import { JiraAgileBoardComponent } from 'src/app/pages/apps/jira-agile-board/jira-agile-board.component'
import { TodoistListComponent } from 'src/app/pages/apps/todoist-list/todoist-list.component'
import { DigitaloceanDropletsComponent } from 'src/app/pages/apps/digitalocean-droplets/digitalocean-droplets.component'
import { DigitaloceanCreateComponent } from 'src/app/pages/apps/digitalocean-create/digitalocean-create.component'
import { GoogleAnalyticsComponent } from 'src/app/pages/apps/google-analytics/google-analytics.component'
import { HelpdeskDashboardComponent } from 'src/app/pages/apps/helpdesk-dashboard/helpdesk-dashboard.component'
import { WordpressPostComponent } from 'src/app/pages/apps/wordpress-post/wordpress-post.component'
import { WordpressPostsComponent } from 'src/app/pages/apps/wordpress-posts/wordpress-posts.component'
import { WordpressAddComponent } from 'src/app/pages/apps/wordpress-add/wordpress-add.component'
import { SaleComponent } from 'src/app/pages/apps/sale/sale.component'
import { SettingComponent } from 'src/app/pages/apps/setting/setting.component'
import { ReceiptComponent } from 'src/app/pages/apps/receipt/receipt.component'
import { CustomerComponent } from 'src/app/pages/apps/customer/customer.component'
import { AddproductComponent } from './addproduct/addproduct.component'
import { StockEntryComponent } from './stock-entry/stock-entry.component'
import { BatchEntryComponent } from './batch-entry/batch-entry.component'
import { ProductOptionsComponent } from './product-options/product-options.component'
import { InternalTransferComponent } from './internal-transfer/internal-transfer.component'
import { ProductsComponent } from './products/products.component'
import { CategoryComponent } from './category/category.component'
import { AddcategoryComponent } from './addcategory/addcategory.component'
import { PurchaseEntryComponent } from './purchase-entry/purchase-entry.component'
import { VendorsComponent } from './vendors/vendors.component'
import { DispatchComponent } from './dispatch/dispatch.component'
import { DispatchItemsComponent } from './dispatch-items/dispatch-items.component'
import { TaxgroupComponent } from './taxgroup/taxgroup.component'
import { EditInternalOrderComponent } from './edit-internal-order/edit-internal-order.component'
import { ReceiveOrdComponent } from './receive-ord/receive-ord.component'
import { EditreceiveComponent } from './editreceive/editreceive.component'
import { CreditComponent } from './credit/credit.component'
import { EditcreditComponent } from './editcredit/editcredit.component'
import { CreditrepayComponent } from './creditrepay/creditrepay.component'
import { PurchasemaintComponent } from './purchasemaint/purchasemaint.component'
import { PurchasebillComponent } from './purchasebill/purchasebill.component'
import { BillpaybyvendorComponent } from './billpaybyvendor/billpaybyvendor.component'
import { AssetsComponent } from './assets/assets.component'
import { AssettypesComponent } from './assettypes/assettypes.component'
import { MaintbilltypesComponent } from './maintbilltypes/maintbilltypes.component'
import { EditcreditrepayComponent } from './editcreditrepay/editcreditrepay.component'
import { CreditdetailsComponent } from './creditdetails/creditdetails.component'
import { EditcreditdetailsComponent } from './editcreditdetails/editcreditdetails.component'
import { LocationComponent } from './location/location.component'
import { BankaccountsComponent } from './bankaccounts/bankaccounts.component'
import { BankaccountdetailComponent } from './bankaccountdetail/bankaccountdetail.component'
import { BillbyvendorComponent } from './billbyvendor/billbyvendor.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { StockComponent } from './stock/stock.component'
// Report
import { DaywiseSaleComponent } from './daywise-sale/daywise-sale.component'
import { OrderwiseSalesComponent } from './orderwise-sales/orderwise-sales.component'
import { ProductwiseSalesComponent } from './productwise-sales/productwise-sales.component'
import { PaymenttypesComponent } from './paymenttypes/paymenttypes.component'
import { MonthwiseSalesComponent } from './monthwise-sales/monthwise-sales.component'
import { WastageReportComponent } from './wastage-report/wastage-report.component'
import { ProductionsComponent } from './productions/productions.component'
import { PurchasewiseReportComponent } from './purchasewise-report/purchasewise-report.component'
import { WastageProductComponent } from './wastage-product/wastage-product.component'
import { CompanyComponent } from './company/company.component'
import { OutletComponent } from './outlet/outlet.component'
import { UserComponent } from './user/user.component'
import { AddWastagesComponent } from './add-wastages/add-wastages.component'
import { AdditionalChargeComponent } from './additional-charge/additional-charge.component'
import { OptiongroupComponent } from './optiongroup/optiongroup.component'
import { SellComponent } from './sell/sell.component'
import { ProductfbComponent } from './productfb/productfb.component'
import { DineinComponent } from './dinein/dinein.component'
import { PricebookComponent } from './pricebook/pricebook.component'
import { KotGroupComponent } from './kot-group/kot-group.component'
import { DenominationEntriesComponent } from './denomination-entries/denomination-entries.component'





const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Home' }
  },
  {
    path: 'Kot',
    component: KotGroupComponent,
    data: { title: 'Kot App' }
  },
  {
    path: 'Denomination-Entries',
    component: DenominationEntriesComponent,
    data: { title: 'Kot App' }
  },
  {
    path: 'sell',
    component: SellComponent,
    data: { title: 'Sell App' },
  },
  {
    path: 'dinein',
    component: DineinComponent,
    data: { title: 'Dine In' },
  },
  {
    path: 'Pricebook',
    component: PricebookComponent,
    data: { title: 'Price App' },
  },
  {
    path: 'productfb',
    component: ProductfbComponent,
    data: { title: 'Productfb App' },
  },
  {
    path: 'sale',
    component: SaleComponent,
    data: { title: 'Sales App' },
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Product App' },
  },
  {
    path: 'category',
    component: CategoryComponent,
    data: { title: 'Category App' },
  },
  {
    path: 'setting',
    component: SettingComponent,
    data: { title: 'Setting App' },
  },
  {
    path: 'receipt',
    component: ReceiptComponent,
    data: { title: 'Receipt App' },
  },
  {
    path: 'customer',
    component: CustomerComponent,
    data: { title: 'Customer App' },
  },
  {
    path: 'user',
    component: UserComponent,
    data: { title: 'user App' },
  },
  {
    path: 'addproduct',
    component: AddproductComponent,
    data: { title: 'Addproduct App' },
  },
  {
    path: 'addcategory/:id',
    component: AddcategoryComponent,
    data: { title: 'Addcategory App' },
  },
  {
    path: 'batchentry',
    component: BatchEntryComponent,
    data: { title: 'BatchEntry App' },
  },
  {
    path: 'stockentry',
    component: StockEntryComponent,
    data: { title: 'StockEntry App' },
  },
  {
    path: 'internaltransfer',
    component: InternalTransferComponent,
    data: { title: 'InternalTransfer App' },
  },
  {
    path: 'productoptions',
    component: ProductOptionsComponent,
    data: { title: 'ProductOptions App' },
  },
  {
    path: 'purchaseentry',
    component: PurchaseEntryComponent,
    data: { title: 'PurchaseEntry App' },
  },
  {
    path: 'DispatchItem',
    component: DispatchItemsComponent,
    data: { title: 'DispatchItem App' },
  },
  {
    path: 'taxgroup',
    component: TaxgroupComponent,
    data: { title: 'TaxGroup App' },
  },
  {
    path: 'Additional-Charge',
    component: AdditionalChargeComponent,
    data: { title: 'Additional-Charge App' },
  },
  {
    path: 'Option-Group',
    component: OptiongroupComponent,
    data: { title: 'Option-Group App' },
  },
  {
    path: 'DispatchOrders',
    component: ReceiveOrdComponent,
    data: { title: 'DispatchOrders App' },
  },
  {
    path: 'editreceive/:id',
    component: EditreceiveComponent,
    data: { title: 'EditReceive App' },
  },
  {
    path: 'creditrepay',
    component: CreditrepayComponent,
    data: { title: 'CreditRepay App' },
  },

  {
    path: 'vendors',
    component: VendorsComponent,
    data: { title: 'Vendors App' },
  },
  {
    path: 'dispatch',
    component: DispatchComponent,
    data: { title: 'Dispatch App' },
  },
  { 
    path: 'editinternal/:id',
    component: EditInternalOrderComponent,
    data: { title: 'EditInternal App'},
  },
  {
    path: 'credit',
    component: CreditComponent,
    data: { title: 'credit App' },
  },
  {
    path: 'purchasemaint',
    component: PurchasemaintComponent,
    data: { title: 'Purchasemaintainence App' },
  },
  {
    path: 'purchasebill',
    component: PurchasebillComponent,
    data: { title: 'Purchasebill App' },
  },
  {
    path: 'location',
    component: LocationComponent,
    data: { title: 'Location App' },
  },
  {
    path: 'bankaccount',
    component: BankaccountsComponent,
    data: { title: 'Bankaccounts App' },
  },
  {
    path: 'bankaccountdetail/:id',
    component: BankaccountdetailComponent,
    data: { title: 'Bankaccountdetail App' },
  },
  {
    path: 'billbyvendor',
    component: BillbyvendorComponent,
    data: { title: 'Billbyvendor App' },
  },
  {
    path: 'Stock',
    component: StockComponent,
    data: { title: 'Stock App' },
  },
  {
    path: 'Daywisesale',
    component: DaywiseSaleComponent,
    data: { title: 'Daywisesale App' },
  },
  {
    path: 'OrderwiseSales',
    component: OrderwiseSalesComponent,
    data: { title: 'OrderwiseSales App' },
  },
  {
    path: 'ProductwiseSales',
    component: ProductwiseSalesComponent,
    data: { title: 'ProductwiseSales App' },
  },
  {
    path: 'Paymenttypes',
    component: PaymenttypesComponent,
    data: { title: 'Paymenttypes App' },
  },
  {
    path: 'MonthwiseSales',
    component: MonthwiseSalesComponent,
    data: { title: 'MonthwiseSales App' },
  },
  {
    path: 'WastageReport',
    component: WastageReportComponent,
    data: { title: 'WastageReport App' },
  },
  {
    path: 'AddWastages',
    component: AddWastagesComponent,
    data: { title: 'AddWastages App' },
  },
  {
    path: 'Productions',
    component: ProductionsComponent,
    data: { title: 'Productions App' },
  },
  {
    path: 'PurchasewiseReport',
    component: PurchasewiseReportComponent,
    data: { title: 'PurchasewiseReport App' },
  },
  {
    path: 'WastageProduct',
    component: WastageProductComponent,
    data: { title: 'WastageProduct App' },
  },
  {
    path: 'Company',
    component: CompanyComponent,
    data: { title: 'Company App' },
  },
  {
    path: 'Outlet',
    component: OutletComponent,
    data: { title: 'Outlet App' },
  },
  {
    path: 'WastageProduct',
    component: WastageProductComponent,
    data: { title: 'WastageProduct App' },
  },

  {
    path: 'billpaybyvendor',
    component: BillpaybyvendorComponent,
    data: { title: 'Billpaybyvendor App' },
  },
  {
    path: 'asset',
    component: AssetsComponent,
    data: { title: 'Assets App' },
  },
  {
    path: 'assettypes',
    component: AssettypesComponent,
    data: { title: 'Asset Types App' },
  },

  {
    path: 'maintainencebilltypes',
    component: MaintbilltypesComponent,
    data: { title: 'Maintainence BillTypes App' },
  },
  {
    path: 'editcreditrepay/:id',
    component: EditcreditrepayComponent,
    data: { title: 'EditCreditRepay App' },
  },
  {
    path: 'creditdetails/:id',
    component: CreditdetailsComponent,
    data: { title: 'CreditDetails App' },
  },
  {
    path: 'editcreditdetails/:id',
    component: EditcreditdetailsComponent,
    data: { title: 'EditCreditDetails App' },
  },


  {
    path: 'editcredit/:id',
    component: EditcreditComponent,
    data: { title: 'Editcredit App' },
  },

  {
    path: 'messaging',
    component: AppsMessagingComponent,
    data: { title: 'Messaging App' },
  },
  {
    path: 'calendar',
    component: AppsCalendarComponent,
    data: { title: 'Calendar App' },
  },
  {
    path: 'profile',
    component: AppsProfileComponent,
    data: { title: 'Profile App' },
  },
  {
    path: 'gallery',
    component: AppsGalleryComponent,
    data: { title: 'Gallery App' },
  },
  {
    path: 'mail',
    component: AppsMailComponent,
    data: { title: 'Mail App' },
  },
  {
    path: 'github-explore',
    component: GithubExploreComponent,
    data: { title: 'Github Explore' },
  },
  {
    path: 'github-discuss',
    component: GithubDiscussComponent,
    data: { title: 'Github Discuss' },
  },
  {
    path: 'jira-dashboard',
    component: JiraDashboardComponent,
    data: { title: 'Jira Dashboard' },
  },
  {
    path: 'jira-agile-board',
    component: JiraAgileBoardComponent,
    data: { title: 'Jira Agile Board' },
  },
  {
    path: 'todoist-list',
    component: TodoistListComponent,
    data: { title: 'Todoist List' },
  },
  {
    path: 'digitalocean-droplets',
    component: DigitaloceanDropletsComponent,
    data: { title: 'Digitalocean Droplets' },
  },
  {
    path: 'digitalocean-create',
    component: DigitaloceanCreateComponent,
    data: { title: 'Digitalocean Create' },
  },
  {
    path: 'google-analytics',
    component: GoogleAnalyticsComponent,
    data: { title: 'Google Analytics' },
  },
  {
    path: 'helpdesk-dashboard',
    component: HelpdeskDashboardComponent,
    data: { title: 'Helpdesk Dashboard' },
  },
  {
    path: 'wordpress-post',
    component: WordpressPostComponent,
    data: { title: 'Wordpress Post' },
  },
  {
    path: 'wordpress-posts',
    component: WordpressPostsComponent,
    data: { title: 'Wordpress Posts' },
  },
  {
    path: 'wordpress-add',
    component: WordpressAddComponent,
    data: { title: 'Wordpress Add' },
  },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class AppsRouterModule { }
