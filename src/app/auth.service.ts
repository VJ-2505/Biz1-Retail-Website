import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'
// import { Http, Response, Headers, RequestOptions } from "@angular/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url1 = 'https://localhost:44315/api/'
  base_url = 'http://biz1retail.azurewebsites.net/api/'
  server_ip = 'http://localhost'
  dburl = 'http://localhost:8081/'
  base_url_ak = 'https://fbakountz.azurewebsites.net/api/'
  constructor(private http: HttpClient) {
    // this.sver_ip = localStorage.getItem('serverip');
  }

  toFormData(formValue) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      // console.log(key, value)
      formData.append(key, value);
    }
    return formData;
  }

  registration(payload) {
    return this.http.post(this.base_url1 + 'Login/Register', payload)
  }

  login(payload) {
    return this.http.post(this.base_url1 + 'Login/LoginCheck', payload)
  }

  addCustomers(payload) {
    return this.http.post(this.base_url1 + 'Customer/addData', payload)
  }

  getusers(storeid, companyid) {
    return this.http.get(
      this.base_url1 + `Login/getstoreusers?storeId=${storeid}&companyId=${companyid}`,
    )
  }
  getstoredata(companyid, storeid, pricetype) {
    return this.http.get(
      this.base_url1 +
      `Login/getStoreData?CompanyId=${companyid}&storeid=${storeid}&pricetype=${pricetype}`,
    )
  }
  getstoredatadb(storedata) {
    return this.http.post(this.server_ip + ':8081/setstoredata', storedata)
  }
  getKotgroups() {
    return this.http.get(this.base_url1 + 'Product/getKotGroup')
  }
  getvariantgroups_l(CompanyId) {
    return this.http.get(this.base_url1 + 'Product/getvariantgroups?CompanyId=1')
  }
  addVariants_l(variant) {
    return this.http.post(this.base_url1 + 'Product/addvariant', variant)
  }
  addVariantGroups_l(variantgroup) {
    return this.http.post(this.base_url1 + 'Product/addvariantgroup', variantgroup)
  }
  updateVariantGroups_l(optiongroup) {
    return this.http.post(this.base_url1 + 'Product/updatevariantgroup', optiongroup)
  }
  updateVariant_l(option) {
    return this.http.post(this.base_url1 + 'Product/updatevariant', option)
  }
  getBarcodeProduct(CompanyId, storeId) {
    return this.http.get(
      this.base_url1 + 'Product/getbarcodeproduct?CompanyId=' + CompanyId + '&storeId=' + storeId,
    )
  }
  getStockProduct(CompanyId, StoreId) {
    return this.http.get(this.base_url1 + 'Product/getStockProduct?CompanyId=' + CompanyId + '&StoreId=' + StoreId)
  }
  getstockEntry(stockBatches) {
    return this.http.post(this.base_url1 + 'Product/stockEntry', stockBatches)
  }
  getMasterProduct(companyid) {
    return this.http.get(this.base_url1 + 'Product/getmasterproducts?CompanyId=' + companyid)
  }
  getproductbyid(id) {
    return this.http.get(this.base_url1 + 'Product/getproductbyid?ProductId=' + id)
  }
  addproduct_l(product) {
    return this.http.post(this.base_url1 + 'Product/addProduct?userid=20', product)
  }
  updateproduct_l(product) {
    return this.http.post(this.base_url1 + 'Product/updateProduct?userid=20', product)
  }

  addcategories(category) {
    return this.http.post(this.base_url1 + 'Category/addcategory', category)
  }
  updatecategory(category) {
    return this.http.post(this.base_url1 + 'Category/updatecategory', category)
  }
  getcategorybyid(id) {
    return this.http.get(this.base_url1 + 'Category/getcategorybyid?CategoryId=' + id)
  }
  getorderitembyid(id) {
    return this.http.get(this.base_url1 + 'Internal/orderitemsbyid?OrderId=' + id)
  }
  getcategoryvariants(id) {
    return this.http.get(this.base_url1 + 'Product/getcategoryvariants?categoryid=' + id)
  }
  getvendors(compid) {
    return this.http.get(this.base_url1 + 'Vendor/getVendorList?CompanyId=' + compid)
  }
  addvendors(vendor) {
    return this.http.post(this.base_url1 + 'Vendor/addvendors', vendor)
  }
  updatevendors(vendor) {
    return this.http.post(this.base_url1 + 'Vendor/updatevendors', vendor)
  }
  getVendorListbyid(id) {
    return this.http.get(this.base_url1 + 'Vendor/getVendorListbyid?vendorid=' + id)
  }

  ///////////////////////////////////////////////NEDB////////////////////////////////////////////////////////

  getTax(CompanyId) {
    return this.http.get(this.base_url1 + 'Product/getTaxgroup?CompanyId=1')
    // return this.http.get(this.server_ip + ':8081/gettaxgroup')
  }
  getProductType() {
    return this.http.get(this.base_url1 + 'Product/getProductType')
    // return this.http.get(this.server_ip + ':8081/getproducttype')
  }

  getUnits() {
    return this.http.get(this.base_url1 + 'Product/getUnits')

  }

  addProduct(product) {
    return this.http.post(this.server_ip + ':8081/addmasterproduct?userid=13', product)
  }

  addVariants(variant) {
    // return this.http.post(this.base_url1 + 'Product/addvariant',variant)
    return this.http.post(this.server_ip + ':8081/addmasteroption', variant)
  }
  addVariantGroups(variantgroup) {
    return this.http.post(this.server_ip + ':8081/addmasteroptiongroup', variantgroup)
  }
  updateVariant(option) {
    return this.http.post(this.server_ip + ':8081/updatemasteroption', option)
  }
  updateVariantGroups(optiongroup) {
    return this.http.post(this.server_ip + ':8081/updatemasteroptiongroup', optiongroup)
  }
  updateProduct(product) {
    return this.http.post(this.server_ip + ':8081/updatemasterproduct', product)
  }
  updatemasteroption(option) {
    return this.http.post(this.server_ip + ':8081/updatemasteroption', option)
  }
  updateoptiongroupdb() {
    return this.http.get(this.server_ip + ':8081/updatevariantgroup')
  }
  updateoptiondb() {
    return this.http.get(this.server_ip + ':8081/updatevariant')
  }
  updateproductdb() {
    return this.http.get(this.server_ip + ':8081/updatemasterproduct')
  }
  syncdata() {
    return this.http.get(this.server_ip + ':8081/syncdata')
  }
  getstores(compid) {
    return this.http.get(this.base_url1 + 'Internal/getStoreList?CompanyId=' + compid)
  }
  PaymentTypesList(compid) {
    return this.http.get(this.base_url1 + 'CreditTrx/getPaymentTypesList?CompanyId=' + compid)
  }
  getstoredata1(compid) {
    return this.http.get(this.base_url1 + 'Internal/getStoreData?CompanyId=' + compid)
  }

  getCreditdata(ord) {
    return this.http.post(this.base_url1 + 'CreditTrx/GetCreditTrx', ord)
  }
  getTransdata(ord) {
    return this.http.post(this.base_url1 + 'CreditTrx/EditCreditTrx', ord)
  }
  getvendorbill(id, storeId, companyId, vendorId, billtype) {
    return this.http.get(
      this.base_url1 +
      'PurchaseTrx/PayBillFor?id=' +
      id +
      '&storeId=' +
      storeId +
      '&companyId=' +
      companyId +
      '&vendorId=' +
      vendorId +
      '&billType=' +
      billtype,
    )
  }
  getRecreditData(Id, ContactId) {
    return this.http.get(
      this.base_url1 + 'CreditTrx/RepayCreditFor?compId=' + Id + '&id=' + ContactId,
    )
  }
  EditBillPay(id, billtype, companyId) {
    return this.http.get(
      this.base_url1 +
      'PurchaseTrx/EditBillPay?id=' +
      id +
      '&billType=' +
      billtype +
      '&compId=' +
      companyId,
    )
  }
  // getorder(companyId, searchId,numRecords) {
  //   return this.http.get(this.base_url1 + 'Internal/getOrderList?CompanyId=' + companyId + '&searchId=' + searchId +'&numRecords=' + numRecords)
  // }
  // getorder(companyId, searchId,numRecords) {
  //   return this.http.get(
  //     this.base_url1 + 'Internal/getOrderList?CompanyId=' + companyId + '&searchId=' + searchId +'&numRecords=' + numRecords
  //   )
  // }
  getorderPrd(compid, ordId) {
    return this.http.get(
      this.base_url1 + 'Internal/GetOrderedItems?CompanyId=' + compid + '&orderId=' + ordId,
    )
  }
  savestock(order) {
    return this.http.post(this.base_url1 + 'Internal/saveIntOrd', order)
  }
  editInternalord(id) {
    return this.http.get(this.base_url1 + 'Internal/EditInternalOrd?id=' + id)
  }
  dispatch(ord) {
    return this.http.post(this.base_url1 + 'Internal/OrdDispatch', ord)
  }
  getStockContainer(CompanyId, storeId) {
    return this.http.get(
      this.base_url1 + 'Internal/getStockContainer?CompanyId=' + CompanyId + '&storeId=' + storeId,
    )
  }
  Update(ord) {
    return this.http.post(this.base_url1 + 'Internal/OrdUpdate', ord)
  }
  deleteOrdItem(CompanyId, Id) {
    return this.http.get(
      this.base_url1 + 'Internal/Delete?CompanyId=' + CompanyId + '&ItemId=' + Id,
    )
  }
  deletedata(Id) {
    return this.http.post(this.base_url1 + 'Internal/Delete', Id)
  }

  deleteItem(Id) {
    return this.http.post(this.base_url1 + 'Internal/DeleteOrder', Id)
  }
  billdetail(Id, CompanyId) {
    return this.http.get(
      this.base_url1 + 'PurchaseTrx/BillPayDetails?id=' + Id + '&compId=' + CompanyId,
    )
  }
  deleteCredit(data) {
    return this.http.post(this.base_url1 + 'CreditTrx/DeleteCreditTrx', data)
  }
  billpayfor(data) {
    return this.http.post(this.base_url1 + 'PurchaseTrx/BillPayFor', data)
  }
  dispatchItem(data) {
    return this.http.post(this.base_url1 + 'Internal/GetOrderItems', data)
  }
  getDispatchList(data) {
    return this.http.post(this.base_url1 + 'Internal/ReceiveDispatch', data)
  }
  receive(data) {
    return this.http.post(this.base_url1 + 'Internal/Receive', data)
  }
  Ordrecve(data) {
    return this.http.post(this.base_url1 + 'Internal/OrdReceive', data)
  }

  getReceivePrd(data) {
    return this.http.post(this.base_url1 + 'Internal/EditReceive', data)
  }
  UpdateReceive(ord) {
    return this.http.post(this.base_url1 + 'Internal/UpdateReceive', ord)
  }
  UpdateReceiveOrd(ord) {
    return this.http.post(this.base_url1 + 'Internal/UpdateReceiveOrd', ord)
  }


  Creditpay(paycred) {
    return this.http.post(this.base_url1 + 'CreditTrx/PayCredit', paycred)
  }

  purchasepay(paycred) {
    return this.http.post(this.base_url1 + 'PurchaseTrx/Updatebill', paycred)
  }
  billpay(paycred) {
    return this.http.post(this.base_url1 + 'PurchaseTrx/Submit', paycred)
  }
  UpdCredit(paycred) {
    return this.http.post(this.base_url1 + 'CreditTrx/UpdateCredit', paycred)
  }
  DeleteCreditpay(data) {
    return this.http.post(this.base_url1 + 'CreditTrx/DeleteOrder', data)
  }
  Deletebillpay(id, companyId) {
    return this.http.get(
      this.base_url1 + 'PurchaseTrx/DeleteBillPay?id=' + id + '&companyId=' + companyId,
    )
  }
  getCreditrepaydata(ord) {
    return this.http.post(this.base_url1 + 'CreditTrx/GetCreditRepayTrx', ord)
  }
  getpurchmaint(data) {
    return this.http.post(this.base_url1 + 'Purchase/GetPurchaseTrx', data)
  }
  getbillpay(data) {
    return this.http.post(this.base_url1 + 'PurchaseTrx/GetBillPay', data)
  }
  getbillpayvendor(data) {
    return this.http.post(this.base_url1 + 'PurchaseTrx/GetPendingBills', data)
  }
  getmaintbill(CompanyId) {
    return this.http.get(this.base_url1 + 'MaintBillTypes/GetMaintBillTypes?companyId=' + CompanyId)
  }
  getasset(CompanyId) {
    return this.http.get(this.base_url1 + 'Liability/GetLiability?companyId=' + CompanyId)
  }
  getassettype(CompanyId) {
    return this.http.get(this.base_url1 + 'LiabilityTypes/GetLiabilityTypes?companyId=' + CompanyId)
  }
  savemaintbill(maintBillType) {
    return this.http.post(this.base_url1 + 'MaintBillTypes/AddMaintBillType', maintBillType)
  }
  editmaintbill(Id) {
    return this.http.get(this.base_url1 + 'MaintBillTypes/GetMaintBillTypeById?id=' + Id)
  }
  updmaintbill(data) {
    return this.http.post(this.base_url1 + 'MaintBillTypes/UpdateMaintBillType', data)
  }
  DeActivatebill(Id) {
    return this.http.get(this.base_url1 + 'MaintBillTypes/Deactivate?id=' + Id)
  }
  saveassettype(assettype) {
    return this.http.post(this.base_url1 + 'LiabilityTypes/AddLiabilityTypes', assettype)
  }
  editassettype(Id) {
    return this.http.get(this.base_url1 + 'LiabilityTypes/GetLiabTypeById?id=' + Id)
  }
  updassettype(data) {
    return this.http.post(this.base_url1 + 'LiabilityTypes/UpdateLiabilityType', data)
  }
  DeActivateassettype(Id) {
    return this.http.get(this.base_url1 + 'LiabilityTypes/Deactivate?id=' + Id)
  }
  saveasset(assettype) {
    return this.http.post(this.base_url1 + 'Liability/AddLiability', assettype)
  }
  editasset(Id) {
    return this.http.get(this.base_url1 + 'Liability/GetLiabilityById?id=' + Id)
  }
  updasset(data) {
    return this.http.post(this.base_url1 + 'Liability/UpdateLiability', data)
  }
  DeActivateasset(Id) {
    return this.http.get(this.base_url1 + 'Liability/Deactivate?id=' + Id)
  }
  getlocation(CompanyId) {
    return this.http.get(this.base_url1 + 'Store/GetLocation?companyId=' + CompanyId)
  }
  DeActivatestore(Id) {
    return this.http.get(this.base_url1 + 'Store/Deactivate?id=' + Id)
  }
  savelocate(assettype) {
    return this.http.post(this.base_url1 + 'Store/AddLocation', assettype)
  }
  editlocate(Id) {
    return this.http.get(this.base_url1 + 'Store/GetStoreById?id=' + Id)
  }
  updlocate(data) {
    return this.http.post(this.base_url1 + 'Store/UpdateStore', data)
  }
  getcontactdata(CompanyId) {
    return this.http.get(this.base_url1 + 'Internal/getStoreData?CompanyId=' + CompanyId)
  }
  getaccount(CompanyId) {
    return this.http.get(this.base_url1 + 'BankAccount/GetBankacct?companyId=' + CompanyId)
  }
  DeActivateaccount(Id) {
    return this.http.get(this.base_url1 + 'BankAccount/Deactivate?id=' + Id)
  }
  saveaccount(account) {
    return this.http.post(this.base_url1 + 'BankAccount/AddBankaccount', account)
  }
  editaccount(Id) {
    return this.http.get(this.base_url1 + 'BankAccount/GetAccountById?id=' + Id)
  }
  updaccount(data) {
    return this.http.post(this.base_url1 + 'BankAccount/UpdateBankAccount', data)
  }
  getbankaccount(data) {
    return this.http.post(this.base_url1 + 'BankAccount/GetBankaccount', data)
  }
  getorderdb(typeid) {
    return this.http.get(this.server_ip + ':8081/getorders?typeid=' + typeid)
  }

  savepurchase(order) {
    return this.http.post(this.base_url1 + 'Purchase/Purchase', order)
  }
  updatepurchaseorder(order) {
    return this.http.post(this.server_ip + ':8081/updatepurchaseorder', order)
  }
  getaccountType(Id) {
    return this.http.get(this.base_url1 + 'BankAccount/GetacctType?companyId=' + Id)
  }
  getrepaydata(CompanyId, Id) {
    return this.http.get(this.base_url1 + 'CreditTrx/Credits?compId=' + CompanyId + '&id=' + Id)
  }
  getbillnpays(Id, vendorId) {
    return this.http.get(
      this.base_url1 + 'PurchaseTrx/GetBillsPayVendor?storeId=' + Id + '&vendorId=' + vendorId,
    )
  }
  Submitpay(data) {
    return this.http.post(this.base_url1 + 'CreditTrx/Submit', data)
  }
  prdactive(Id, active) {
    return this.http.get(this.base_url1 + 'Product/UpdateAct?Id=' + Id + '&active=' + active)
  }

  getProduct(companyId) {
    return this.http.get(this.base_url1 + 'Product/GetById?companyId=' + companyId)
  }

  saveorderdb(order) {
    return this.http.post(this.server_ip + ':8081/saveorderdb', { order: order })
  }

  batchproductdb(batchentry) {
    return this.http.post(this.server_ip + ':8081/batchproduct', batchentry)
  }
  getbatchEntry(batches, userid) {
    return this.http.post(this.base_url1 + 'Product/batchEntry?userid=' + userid, batches)
  }

  getvariant_l(CompanyId) {
    return this.http.get(this.base_url1 + 'Product/getvariants?CompanyId=' + CompanyId)
  }

  getTax_l(CompanyId) {
    return this.http.get(this.base_url1 + 'Product/getTaxgroup?CompanyId=' + CompanyId)
  }
  addtaxgroup(taxgroup) {
    return this.http.post(this.base_url1 + 'Product/addtaxgroup', taxgroup)
  }
  updatetaxgroup(taxgroup) {
    return this.http.post(this.base_url1 + 'Product/updatetaxgroup', taxgroup)
  }


  updatepreference(preferences) {
    return this.http.post(this.base_url1 + 'Preference/updatepricetype', preferences)
  }
  getvendororders(
    companyid,
    storeid,
    vendorid,
    orderid,
    billid,
    productid,
    orderstatus,
    receivestatus,
    numofrecods,
    cancelstatus,
  ) {
    return this.http.get(
      this.base_url1 +
      `Purchase/getVendorOrders?companyid=${companyid}&storeid=${storeid}&vendorid=${vendorid}&orderid=${orderid}&billid=${billid}&productid=${productid}&orderstatus=${orderstatus}&receivestatus=${receivestatus}&numofrecods=${numofrecods}&cancelstatus=${cancelstatus}`,
    )
  }

  getvendororderproduct(orderId) {
    return this.http.get(this.base_url1 + `Purchase/getVendorOrderProduct?orderId=${orderId}`)
  }

  updatePurchase(order) {
    return this.http.post(this.base_url1 + 'Purchase/updatePurchase', order)
  }

  updatereceivedItem(orderid, userid, order) {
    return this.http.post(
      this.base_url1 + `Purchase/updatereceiveItem?orderid=${orderid}&userid=${userid}`,
      order.Items,
    )
  }
  directreceivedpurchase(orderid, userid, order) {
    return this.http.post(
      this.base_url1 + `Purchase/directReceiveItem?orderid=${orderid}&userid=${userid}`,
      order,
    )
  }
  getreceivedorders(companyid, storeid) {
    return this.http.get(
      this.base_url1 + `Purchase/getReceivedOrders?companyid=${companyid}&storeid=${storeid}`,
    )
  }
  getvendorreceivedorders(orderId) {
    return this.http.get(this.base_url1 + `Purchase/getVendorReceivedOrder?orderId=${orderId}`)
  }
  updatereceivedPurchase(orderid, userid, order) {
    return this.http.post(
      this.base_url1 + `Purchase/UpdateReceiveOrder?orderid=${orderid}&userid=${userid}`,
      order,
    )
  }

  getOrders() {
    return this.http.get(this.base_url1 + 'Product/getorders')
    // return this.http.get(this.server_ip + ':8081/getunit')
  }

  updatevendorsdb(vendors) {
    return this.http.post(this.server_ip + ':8081/updatevendors', vendors)
  }

  // getpurchaseorders() {
  //   return this.http.get(this.server_ip + ':8081/getpurchaseorders')
  // }

  getcustomerbyphone(phoneNo) {
    return this.http.get(this.server_ip + ':8081/getcustomerbyphone?phone=' + phoneNo)
  }

  getvendorsdb() {
    return this.http.get(this.server_ip + ':8081/getvendors')
  }
  getbarcodeproductdb() {
    return this.http.get(this.server_ip + ':8081/getbarcodeproduct')
  }
  addbarcodeproductdb(data) {
    return this.http.post(this.server_ip + ':8081/addbarcodeproduct', data)
  }

  updatetaxgroupdb(taxgroup) {
    return this.http.post(this.server_ip + ':8081/updatetaxgroup', taxgroup)
  }
  updatecategoriesdb(category) {
    return this.http.post(this.server_ip + ':8081/updatecategories', category)
  }

  getpreferencedb() {
    return this.http.get(this.server_ip + ':8081/getpreference')
  }
  updatepreferencedb(preferences) {
    return this.http.post(this.server_ip + ':8081/updatepreference', preferences)
  }
  saveStockbatch(stockBatches) {
    console.log(stockBatches)
    return this.http.post(this.server_ip + ':8081/saveStockBatch', stockBatches)
  }

  getdbdata(dbnames) {
    return this.http.post(this.dburl + 'getdbdata', dbnames)
  }
  getloginfo() {
    return this.http.get(this.server_ip + ':8081/getloginfo')
  }

  print(body) {
    return this.http.post('http://localhost:8081/print', body)
  }
  Addcustomers() {
    return this.http.get(this.base_url1 + 'Customer/AddCustomer')
  }
  updateCustomer(payload) {
    return this.http.put(this.base_url1 + 'Customer/updateData', payload)
  }



  unlock(pin) {
    return this.http.get(this.dburl + 'unlock?pin=', pin)
  }


  ///////////////////////////////////////// Customer data ///////////////////////////////////////
  GetCustomer(CompanyId, StoreId) {
    return this.http.get(this.base_url1 + 'Customer/GetIndex?CompanyId=' + CompanyId + '&StoreId=' + StoreId)
  }
  UpdateCustomer(data) {
    return this.http.get(this.base_url1 + 'Customer/Update', data)
  }
  Deletecustomer(Id) {
    return this.http.get(this.base_url1 + 'Customer/Delete?Id=' + Id)
  }

  getDashboard(storeId, companyId, fromDate, toDate, toDay) {
    return this.http.get(this.base_url1 + `Login/DashBoard?storeId=${storeId}&companyId=${companyId}&fromDate=${fromDate}&toDate=${toDate}&toDay=${toDay}`)
  }
  ///////////////////////////////////////// Receipts data ///////////////////////////////////////
  // GetReceipts(Storeid, fromdate, todate, invoice) {
  //   return this.http.get(
  //     this.base_url1 +
  //     'Receipt/Gettestdata?Storeid=' +
  //     Storeid +
  //     '&fromdate=' +
  //     fromdate +
  //     '&todate=' +
  //     todate +
  //     '&InvoiceNo=' +
  //     invoice,
  //   )
  // }


  gettransaction(OrderId) {
    return this.http.get(this.base_url1 + 'Receipt/getByOrderId?OrderId=' + OrderId)
  }

  ///////////////////////////////////////Sync Service data///////////////////////////////
  getorders() {
    return this.http.get(this.dburl + 'getorders')
  }
  saveorder(payload) {
    return this.http.post(this.base_url1 + 'Sale/SaveOrder_Test', payload)
  }
  deleteorderfromnedb(orderid, stockBatches) {
    return this.http.post(this.server_ip + ':8081/deleteorder?_id=' + orderid, stockBatches)
  }



  ///////////////////////////////////////// Sale data///////////////////////////////////////



  getcustomers() {
    return this.http.get(this.dburl + 'getcustomers')
  }
  updateCustomerdb(customerdetails) {
    return this.http.post(this.server_ip + ':8081/updatecustomer', customerdetails)
  }
  addCustomerdb(customerdetails) {
    return this.http.post(this.server_ip + ':8081/addcustomer', customerdetails)
  }
  // updateorderkey(orderkey) {
  //   return this.http.post(this.server_ip + ':8081/setorderkey', orderkey)
  // }





  ///////////////////////////////////////// Setting data///////////////////////////////////////
  joinserver(ip) {
    return this.http.get(`http://${ip}:8081/join`)
  }
  getclientlist(ip) {
    return this.http.get(`http://${ip}:8081/getclients`)
  }
  checkifserver(ip) {
    return this.http.get(`http://${ip}:8081/checkifserver`).pipe(
      catchError(err => {
        console.log('error caught in service')
        console.error(err)
        //Handle the error here

        return throwError(err) //Rethrow it back to component
      }),
    )
  }
  updateprintersettings(setting) {
    return this.http.post(this.dburl + 'updateprintersettings', setting)
  }

  catactive(companyid) {
    return this.http.get(this.base_url1 + "Category/Index?companyid=" + companyid);
  }
  GetTaxGrp(CompanyId) {
    return this.http.get(this.base_url1 + 'TaxGroup/GetTaxGrp?CompanyId=' + CompanyId)
  }

  // Master
  // 28-01-2022

  Categoryupdate(Id, active, CompanyId) {
    return this.http.get(
      this.base_url1 +
      'Category/UpdatecategoryAct?Id=' +
      Id +
      '&active=' +
      active +
      '&CompanyId=' +
      CompanyId,
    )
  }
  // Master
  // 06-01-2022
  AddTaxGrp(taxgroup) {
    return this.http.post(this.base_url1 + 'TaxGroup/AddTaxGrp', taxgroup)
  }
  UpdateTaxGrp(taxgroup) {
    return this.http.post(this.base_url1 + 'TaxGroup/UpdateTaxGrp', taxgroup)
  }

  // SERIAL PORT
  getPortList() {
    return this.http.get(this.dburl + 'portList')
  }

  configurePortList(port) {
    return this.http.get(this.dburl + 'configurePort?port=' + port)
  }

  getWeight() {
    return this.http.get(this.dburl + 'getWeight')
  }

  getplan() {
    return this.http.get(this.base_url1 + 'Sale/Testplan')
  }

  Testplandetail() {
    return this.http.get(this.base_url1 + 'Sale/Testplandetails')
  }

  sendmail(dblist) {
    return this.http.post(this.dburl + 'sendemail', dblist)
  }

  getaccess(CompanyId, storeid, planid) {
    return this.http.get(this.base_url1 + 'Sale/GetAccess?companyid=' + CompanyId + '&storeid=' + storeid + '&planid=' + planid)
  }
  // 24-03-2022
  getendangeredproducts() {
    return this.http.get(this.dburl + 'getendangeredproducts')
  }

  getneededproduct(product) {
    return this.http.post(this.base_url1 + 'Product/addneededproduct', product
    )
  }
  GetNeededProd(companyid) {
    return this.http.get(this.base_url1 + 'Product/GetNeededProd?companyid=' + companyid)
  }
  // 25-03-2022
  deleteproduct(Id) {
    return this.http.post(this.base_url1 + 'Product/Deleteprod', Id)
  }

  savepurchaselist(payload) {
    return this.http.post(this.base_url1 + 'PurchaseList/SaveReceivePurchaseList', payload)
  }

  purchaselist(storeId) {
    return this.http.get(this.base_url1 + 'PurchaseList/purchaselist?Storeid=' + storeId)
  }

  getidpurchase(orderno) {
    return this.http.get(this.base_url1 + 'PurchaseList/getbyid?orderNo=' + orderno)
  }


  daywise(fromdate, todate, storeId, companyId, sourceid) {
    return this.http.get(
      this.base_url1 +
      'Daywise/GetDaywiseRpt?storeId=' + storeId + '&fromdate=' + fromdate + '&todate=' + todate + '&companyId=' + companyId + '&sourceid=' + sourceid)
  }
  orderwise(fromdate, todate, Storeid, Companyid) {
    return this.http.get(
      this.base_url1 +
      'Daywise/Ordwise?Storeid=' + Storeid + '&fromdate=' + fromdate + '&todate=' + todate + '&Companyid=' + Companyid)
  }

  GetTrans(fromdate, todate, Storeid, Companyid) {
    return this.http.get(
      this.base_url1 +
      'Daywise/GetTransRpt?Storeid=' + Storeid + '&fromdate=' + fromdate + '&todate=' + todate + '&Companyid=' + Companyid)
  }
  GetTransType(fromdate, todate, Storeid, Companyid, ptypeid, sourceid) {
    return this.http.get(
      this.base_url1 +
      'Daywise/GetTransSaleType?Storeid=' + Storeid + '&fromdate=' + fromdate + '&todate=' + todate + '&Companyid=' + Companyid + '&ptypeid=' + ptypeid + '&sourceid=' + sourceid)
  }

  GetMonthRpt(fromdate, todate, Storeid, Companyid) {
    return this.http.get(
      this.base_url1 +
      'Daywise/GetMonthWise?Storeid=' + Storeid + '&fromdate=' + fromdate + '&todate=' + todate + '&Companyid=' + Companyid)
  }

  GetProdRpt(fromdate, todate, Storeid, Companyid) {
    return this.http.get(
      this.base_url +
      'Daywise/GetProductWise?Storeid=' + Storeid + '&fromdate=' + fromdate + '&todate=' + todate + '&Companyid=' + Companyid)
  }

  getcompanydata(companyId) {
    return this.http.get(this.base_url1 + 'Customer/Index?companyId=' + companyId)
  }

  saveCompany(formdata) {
    let body = this.toFormData(formdata);
    return this.http.post(this.base_url1 + `Customer/SaveData`, body)
  }

  getstore(CompanyId) {
    return this.http.get(this.base_url1 + 'Store/Get?CompanyId=' + CompanyId)
  }

  // addstore(companyid) {
  //   return this.http.post(this.base_url1 + `Store/AddStore?companyid=` + companyid)
  // }
  addstore(payload) {
    return this.http.post(this.base_url1 + 'Store/AddStore', payload)
  }

  updatestore(body) {

    return this.http.post(this.base_url1 + `Store/UpdateData`, body)
  }

  getstorebyid(id) {
    return this.http.get(this.base_url1 + 'Store/getstorebyid?id=' + id)
  }
  role(companyId) {
    return this.http.get(this.base_url1 + 'Users/GetRole?companyId=' + companyId)
  }
  getuser(companyId) {
    return this.http.get(this.base_url1 + 'Users/GetUsers?companyId=' + companyId)
  }

  saveUser(playload) {
    return this.http.post(this.base_url1 + 'Users/Add', playload)
  }

  outletActive(id, active) {
    return this.http.get(this.base_url1 + 'Store/UpdateAct?id=' + id + "&active=" + active)
  }

  DeleteUser(Id) {
    return this.http.get(this.base_url1 + "Users/Deleteuser?Id=" + Id);
  }

  getwastage(companyId) {
    return this.http.get(this.base_url1 + 'Daywise/wastage?companyId=' + companyId)
  }

  Getadditional(CompanyId) {
    return this.http.get(this.base_url1 + 'TaxGroup/GetAddtional?CompanyId=' + CompanyId)
  }

  Addadditional(additional) {
    return this.http.post(this.base_url1 + 'TaxGroup/Addadditional', additional)
  }
  updateadditionaldb(additional) {
    return this.http.post(this.server_ip + ':8081/updateadditional', additional)
  }

  Updateadditional(additional) {
    return this.http.post(this.base_url1 + 'TaxGroup/Updateadditional', additional)
  }

  getOption(CompanyId) {
    return this.http.get(this.base_url1 + 'OptionGroup/Get?CompanyId=' + CompanyId)
  }


  saveoption(data) {
    return this.http.post(this.base_url1 + 'OptionGroup/CreateOption', data)
  }

  Updateoption(data) {
    return this.http.post(this.base_url1 + 'OptionGroup/Update', data)
  }

  optionsactive(Id, active) {
    return this.http.get(this.base_url1 + 'OptionGroup/UpdateAct?Id=' + Id + '&active=' + active)
  }

  EditOption(Id) {
    return this.http.get(this.base_url1 + "OptionGroup/GetById?Id=" + Id);
  }

  // getstockbatch(companyid) {
  //   return this.http.get(this.base_url1 + "Product/getstockbatch?companyid=" + companyid);
  // }
  getstockbatch(fromdate, todate, Storeid, Companyid) {
    return this.http.get(
      this.base_url1 +
      'Product/getstockbatch?Storeid=' + Storeid + '&fromdate=' + fromdate + '&todate=' + todate + '&Companyid=' + Companyid)
  }

  Updatestockbatch(data) {
    return this.http.post(this.base_url1 + 'Product/Updatestockbatch', data)
  }

  updatestockbatchdb(data) {
    return this.http.post(this.dburl + 'updatestock', data)
  }

  getswastages(companyid) {
    return this.http.get(this.base_url1 + "Wastage/Getwastages?companyid=" + companyid);
  }

  getstockbat(companyid) {
    return this.http.get(this.base_url1 + "Product/stockbatchget?companyid=" + companyid);
  }
  Addwastages(wastages) {
    return this.http.post(this.base_url1 + 'Wastage/Addwastages', wastages)
  }

  updatewastagedb(data) {
    return this.http.post(this.dburl + 'updatewastages', data)
  }

  Addunits(units) {
    return this.http.post(this.base_url1 + 'Product/Addunits', units)
  }

  updateunits(data) {
    return this.http.post(this.dburl + 'updatewastages', data)
  }

  refund(data) {
    return this.http.post(this.base_url1 + 'Receipt/Pay', data)
  }




  savetransaction(transaction) {
    return this.http.post(this.base_url1 + `Receipt/saveTransaction`, transaction)
  }


  getOrderIdinternal(OrdId) {
    return this.http.get(this.base_url1 + "Internal/internalordbyid?orderid=" + OrdId);
  }
  getorderlist(storeId) {
    return this.http.get(this.base_url1 + 'Internal/getOrderList?storeId=' + storeId + '&numRecords=50')
  }

  getorder(ordId) {
    return this.http.post(this.base_url1 + 'Internal/getOrderList', ordId)
  }

  getOrdDisp(storeId, companyId) {
    return this.http.get(this.base_url1 + 'Internal/getDispatchList?storeId=' + storeId + '&companyId=' + companyId)
  }
  getdispatchedorder(storeId, companyId) {
    return this.http.get(this.base_url1 + 'Internal/GetDispatchedorder?storeId=' + storeId + '&companyId=' + companyId)
  }


  getstoreIdInternal(companyId, Id) {
    return this.http.get(this.base_url1 + 'Internal/GetstorebyId?CompanyId=' + companyId + '&Id=' + Id)
  }



  GetDispatchList(companyId, storeId) {
    return this.http.get(this.base_url1 + 'Internal/GetDispatchList?companyId=' + companyId + '&StoreId=' + storeId + '&numRecords=25')
  }

  GetDispatch(companyId, storeId) {
    return this.http.get(this.base_url1 + 'Internal/GetDispatch?companyId=' + companyId + '&StoreId=' + storeId + '&numRecords=25')
  }

  getreceivebyid(OrdId) {
    return this.http.get(this.base_url1 + "Internal/receivebyid?orderid=" + OrdId);
  }

  getStoreProducts(storeid) {
    return this.http.get(this.base_url1 + "Internal/getStoreProducts?storeid=" + storeid);
  }

  // VJ-01-10-2022-------FB New

  //SyncFb---SaveOrder

  getordersfb() {
    return this.http.get(this.dburl + 'getordersfb')
  }
  saveorderfb(payload) {
    return this.http.post(this.base_url1 + 'Sale/saveorder_3', payload)
  }
  ordertransaction(transactionlist) {
    return this.http.post(this.base_url1 + `Receipt/ordertransaction`, transactionlist)
  }
  deleteorderfromdbfb(orderid, InvoiceNo) {
    return this.http.get(this.dburl + 'deleteorderfb?_id=' + orderid + '&invoiceno=' + InvoiceNo)
  }
  updateorder(payload) {
    return this.http.post(this.base_url1 + 'Sale/updateorder_2', payload)
  }
  logtransactions(transactions) {
    return this.http.post(this.dburl + `logtransactions`, transactions)
  }
  logordersaveresponse(response_log_data) {
    return this.http.post(this.dburl + 'logorderevent', response_log_data)
  }
  updatepreorders(order) {
    return this.http.post(this.dburl + 'updatepreorder', order)
  }
  transactionsinvoice(invoiceno) {
    return this.http.get(this.dburl + 'transactionsbyinvoice?InvoiceNo=' + invoiceno)
  }
  getpreorders() {
    return this.http.get(this.dburl + 'getpreorders')
  }
  updateordertonedb(order) {
    return this.http.post(this.dburl + 'updateorder', order)
  }

  // -------Orderservice - Dinein-------

  saveordertonedb(order) {
    return this.http.post(this.dburl + 'saveorder', order)
  }

  removeOldLogs() {
    return this.http.get(this.dburl + 'remove_old_logs')
  }

  savepreorders(order) {
    return this.http.post(this.dburl + 'savepreorder', order)
  }
  deletesplittable(splittablekey) {
    return this.http.get(this.dburl + 'deletesplittable?splittablekey=' + splittablekey)
  }
  splitTable(body) {
    return this.http.post(this.dburl + 'splitTable', body)
  }
  savetblorder(order) {
    return this.http.post(this.dburl + 'savetblorder', order)
  }
  swapTableOrders(fromkey, tokey) {
    return this.http.get(this.dburl + 'swaptableorders?fromtablekey=' + fromkey + '&totablekey=' + tokey,)
  }
  deletetblorder(diningtablekey) {
    return this.http.get(this.dburl + 'deletetblorder?diningtablekey=' + diningtablekey)
  }
  gettblorderby_id(orderid) {
    return this.http.get(this.dburl + 'gettblorderby_id?_id=' + orderid)
  }

  // -----store setting------
  getSave(CompanyId) {
    return this.http.get(this.base_url1 + "Stores/Get?CompanyId=" + CompanyId);
  }
  addProd(formdata) {
    let body = this.toFormData(formdata);
    return this.http.post(this.base_url + "Addon/Create", body);
  }
  getStrePrd(data, id) {
    return this.http.get(this.base_url + "Stores/GetData?prodId=" + data + "&storeId=" + id);
  }
  // -----Sell-FB----
  getvariantgroups(CompanyId) {
    return this.http.get(this.server_ip + ':8081/masteroptiongroup?CompanyId=' + CompanyId)
  }
  getvariants(CompanyId) {
    // return this.http.get(this.base_url1 + 'Product/getvariants?CompanyId=1')
    return this.http.get(this.server_ip + ':8081/masteroption?CompanyId=' + CompanyId)
  }
  getstoreuporders(storeid) {
    return this.http.get(this.base_url1 + 'UrbanPiper/getstoreuporders?storeid=' + storeid)
  }
  getpreorderby_id(orderid) {
    return this.http.get(this.dburl + 'getpreorderby_id?_id=' + orderid)
  }
  savetransactiontonedb(transaction) {
    return this.http.post(this.dburl + 'addtransaction', transaction)
  }
  updateorderkey(orderkey) {
    return this.http.post(this.dburl + 'setorderkey', orderkey)
  }
  saveorderfbdb(order) {
    return this.http.post(this.dburl + 'saveorderfb', order)
  }
  getproducts() {
    return this.http.get(this.dburl + 'products')
  }
  getcategories(companyid, type) {
    return this.http.get(
      this.base_url1 + `Category/getcategories?CompanyId=${companyid}&type=${type}`,
    )
  }
  getCustomerByPhone(Phone) {
    return this.http.get(this.base_url1 + 'Customer/GetCustomerByPhone?Phone=' + Phone)
  }
  logorderevent(logdata) {
    return this.http.post(this.dburl + 'logorderevent', logdata)
  }
  getOrderById(orderid) {
    return this.http.get(this.base_url1 + `Sale/getOrderById?orderid=` + orderid)
  }
  getstorepaymentType(storeid) {
    return this.http.get(this.base_url1 + 'PaymentType/getstorepaymenttype?StoreId=' + storeid)
  }
  storeselect(body) {
    return this.http.post(this.dburl + 'storeselect', body)
  }
  getUnfinishedOrders(storeid) {
    return this.http.get(this.base_url1 + `Sale/getUnfinishedOrders?storeid=` + storeid)
  }
  getPendOrderSales() {
    return this.http.get(this.dburl + `getPendOrderSales`)
  }

  imageupload(file) {
    var foemdata = this.toFormData(file);
    return;
  }
  // --------DineIn-------

  UpdateTable(formdata) {
    let body = this.toFormData(formdata);
    return this.http.post(this.base_url1 + "Sale/Update", body);
  }
  addtable(formdata) {
    let body = this.toFormData(formdata);
    return this.http.post(this.base_url1 + "Sale/CreateArea", body);
  }

  deleteArea(Id) {
    return this.http.get(this.base_url1 + "Sale/Delete?Id=" + Id);
  }
  getdining(CompanyId) {
    return this.http.get(this.base_url1 + "Sale/Get?CompanyId=" + CompanyId)
  }
  EditTable(Id) {
    return this.http.get(this.base_url1 + "Sale/GetById?Id=" + Id);
  }

  //---------- Product-FB----------

  getProducts(id, compId) {
    return this.http.get(this.base_url1 + 'Product/GetByIdfb?id=' + id + '&compId=' + compId)
  }

  saveProduct(formdata, image, Id, CompanyId) {
    let body = this.toFormData(formdata);
    body.append('image', image);
    if (Id > 0) {
      return this.http.post(this.base_url1 + "Product/UpdateFB?CompanyId=" + CompanyId, body);
    }
    else {
      return this.http.post(this.base_url1 + "Product/AddProductFB?CompanyId=" + CompanyId, body);
    }
  }

  // ---------Product-FB---------

  Updatepricebook(formdata) {
    let body = this.toFormData(formdata)
    return this.http.post(this.base_url1 + 'Product/Update', body)
  }
  GetPrice(storeid) {
    return this.http.get(this.base_url1 + `Product/GetPrice?storeid=` + storeid)
  }

  Updateoptionbook(formdata) {
    let body = this.toFormData(formdata)
    return this.http.post(this.base_url1 + 'Product/UpdateOption', body)
  }

  savepredefinedqtys(prodid, qtys) {
    return this.http.post(this.base_url1 + `Product/UpdatePredefQtys?productid=${prodid}`, qtys);
  }

  // Receipt

  getorderlogs(storeid, companyid) {
    return this.http.get(
      this.base_url + `POSOrder/getorderlogs?storeid=${storeid}&companyid=${companyid}`,
    )
  }
  transact(formdata) {
    let body = this.toFormData(formdata)
    return this.http.post(this.base_url1 + 'Receipt/Pay', body)
  }

  edittransaction(body) {
    return this.http.post(this.base_url1 + 'TransactionRpt/EditTransaction', body)
  }

  GetReceipts(companyid, storeid, fromdate, todate, startid, endid, invoice) {
    return this.http.get(
      this.base_url1 +
      'Receipt/Get?companyid=' +
      companyid +
      '&storeid=' +
      storeid +
      '&fromdate=' +
      fromdate +
      '&todate=' +
      todate +
      '&startid=' +
      startid +
      '&endid=' +
      endid +
      '&invoice=' +
      invoice,
    )
  }

  // getInvoices(companyid, storeid, fromdate, todate, startid, endid, invoice) {
  //   return this.http.get(
  //     this.base_url +
  //       'Receipt/Invoices' +
  //       '?companyid=' +
  //       companyid +
  //       '&storeid=' +
  //       storeid +
  //       '&fromdate=' +
  //       fromdate +
  //       '&todate=' +
  //       todate +
  //       '&startid=' +
  //       startid +
  //       '&endid=' +
  //       endid +
  //       '&invoice=' +
  //       invoice,
  //   )
  // }

  cancelorder(orderid, payload) {
    return this.http.post(this.base_url1 + 'POSOrder/cancellorder?orderid=${orderid}', payload)
  }


  getintprod(CompanyId, StoreId, testid) {
    return this.http.get(this.base_url1 + 'Internal/GetInternalproduct?CompanyId=' + CompanyId + '&StoreId=' + StoreId + '&testid=' + testid)
  }
  deletepreorders(orderid) {
    return this.http.get(this.dburl + 'deletepreorder?_id=' + orderid)
  }

  getkotgroup(CompanyId) {
    return this.http.get(this.base_url1 + 'KotGroup/GetKot?CompanyId=' + CompanyId)
  }

  AddKotGroup(kotgrp) {
    return this.http.post(this.base_url1 + 'KotGroup/addKotGroup', kotgrp)
  }

  UpdatekotGrp(kotgrp) {
    return this.http.post(this.base_url1 + 'KotGroup/UpdateKotGroup', kotgrp)
  }

  getkotgrpbyId(id) {
    return this.http.get(this.base_url1 + 'KotGroup/getkotgroupbyid?id=' + id)
  }
  DeleteKotgrp(id) {
    return this.http.get(this.base_url1 + 'KotGroup/Delete?id=' + id)
  }


  // getvendors(compid) {
  //   return this.http.get(this.base_url1 + 'Vendor/getVendorList?CompanyId=' + compid)
  // }
  // addvendors(vendor) {
  //   return this.http.post(this.base_url1 + 'Vendor/addvendors', vendor)
  // }
  // updatevendors(vendor) {
  //   return this.http.post(this.base_url1 + 'Vendor/updatevendors', vendor)
  // }
  // getVendorListbyid(id) {
  //   return this.http.get(this.base_url1 + 'Vendor/getVendorListbyid?vendorid=' + id)
  // }

  fetchDenominationEntries(storeid, date, companyid, entrytypeid) {
    return this.http.get(this.base_url1 + `Denomination/getDenomEntry?storeid=${storeid}&date=${date}&companyid=${companyid}&entrytypeid=${entrytypeid}`)
  }



  getstorecashsales(storeid, companyid, date) {
    return this.http.get(this.base_url1 + `Denomination/getStoreCashSales?storeid=${storeid}&companyid=${companyid}&date=${date}`,
    )
  }

  pettyCashTransfer(storeid, companyid, amount, to, reason) {
    return this.http.get(this.base_url1 + `Denomination/pettyCashTransfer?storeid=${storeid}&companyid=${companyid}&amount=${amount}&to=${to}&reason=${reason}`,
    )
  }

  denomEntryReport(companyid, from, to, margin) {
    return this.http.get(this.base_url1 + `Denomination/denomReport_?companyid=${companyid}&from=${from}&to= ${to}&margin=${margin}`,
    )
  }

  getDenominationTypes() {
    return this.http.get(this.base_url1 + `Denomination/GetDenominationTypes`)
  }

  
  addDenomEntry(denomentry) {
    return this.http.post(this.base_url1 + `Denomination/addDenomEntry`, denomentry)
  }
  dayclosing(companyid, storeid, date, time) {
    return this.http.get(this.base_url_ak + `DayClosing/TransDetails?posCompId=${companyid}&posStoreId=${storeid}&dateStr=${date}&time=${time}`,
    )
  }

}

