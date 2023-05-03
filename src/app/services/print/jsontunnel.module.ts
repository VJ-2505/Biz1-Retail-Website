import { SafeHtml } from '@angular/platform-browser'
import { OrderModule, KOTModule } from 'src/app/pages/apps/sell/sell.module'

export class Receipt {
  billdate: string
  deliverydate: string
  invoiceno: string
  subtotal: number
  cgst: number
  sgst: number
  igst: number
  discount: number
  total: number
  paid: number
  customer: Customer
  items: Array<Item>
  raw_order: OrderModule | any
  message: string
  extra: number
  discountruleid: number
  constructor(object, source: string) {
    this.raw_order = object
    this.items = []
    this.message = ''
    this.discountruleid = 0
    if (source == 'POS') this.posTunnel()
    else if (source == 'UP') this.upTunnel()
    else if (source == 'FB') this.fbTunnel()
  }

  posTunnel() {
    this.billdate = this.raw_order.OrderedDateTime
    this.invoiceno = this.raw_order.InvoiceNo
    this.subtotal = this.raw_order.subtotal
    this.cgst = this.raw_order.Tax1
    this.sgst = this.raw_order.Tax2
    this.igst = this.raw_order.Tax3
    this.discount = this.raw_order.OrderTotDisc + this.raw_order.AllItemTotalDisc
    this.total = this.raw_order.BillAmount
    this.paid = this.raw_order.PaidAmount
    this.extra = this.raw_order.extra

    this.customer = new Customer()
    this.customer.name = this.raw_order.CustomerDetails.Name
    this.customer.phone = this.raw_order.CustomerDetails.PhoneNo
    this.customer.email = this.raw_order.CustomerDetails.Email
    this.customer.address = null //this.raw_order.CustomerDetails.Address
    this.customer.city = this.raw_order.CustomerDetails.City

    this.raw_order.Items.forEach(item => {
      let _item = new Item()
      _item.showname = item.showname
      _item.amount = item.TotalAmount
      _item.quantity = item.Quantity
      _item.complementary = item.ComplementryQty
      _item.note = item.Note || item.Message
      this.items.push(_item)
    })
  }

  upTunnel() {
    this.billdate = this.raw_order.order.details.created
    this.invoiceno =
      this.raw_order.order.details.channel.charAt(0).toUpperCase() +
      this.raw_order.order.details.ext_platforms[0].id
    this.subtotal = this.raw_order.order.details.order_subtotal
    this.cgst = this.raw_order.order.details.total_taxes / 2
    this.sgst = this.raw_order.order.details.total_taxes / 2
    this.igst = 0
    this.discount = this.raw_order.order.details.discount
    this.total = this.raw_order.order.details.order_total
    this.paid = this.raw_order.order.details.order_total

    this.customer = new Customer()
    this.customer.name = this.raw_order.customer.name
    this.customer.phone = this.raw_order.customer.phone
    this.customer.email = this.raw_order.customer.email
    this.customer.address = null //this.raw_order.customer.address.line_1
    this.customer.city = this.raw_order.customer.address.city

    this.raw_order.order.items.forEach(item => {
      let _item = new Item()
      _item.showname = item.title
      _item.amount = item.total
      _item.quantity = item.quantity
      _item.complementary = 0
      _item.note = item.instructions
      this.items.push(_item)
    })
  }

  fbTunnel() {
    this.billdate = this.raw_order.OrderedDateTime
    this.invoiceno = this.raw_order.Id
    // this.subtotal = this.raw_order.BillAmount - (this.raw_order.BillAmount * 5) / 100
    this.subtotal = 0
    this.cgst = 0 //this.raw_order.Tax1
    this.sgst = 0 //this.raw_order.Tax2
    this.igst = 0 //this.raw_order.Tax3
    this.discount = this.raw_order.DiscAmount
    this.total = this.raw_order.BillAmount
    this.paid = this.raw_order.PaidAmount
    this.message = this.raw_order.Note || ''
    this.discountruleid = this.raw_order.DiscountRuleId

    this.customer = new Customer()
    this.customer.name = this.raw_order.CurrentAddresses[0].Name
    this.customer.phone = this.raw_order.CustomerDetail[0].PhoneNo
    this.customer.email = this.raw_order.CustomerDetail[0].Email
    this.customer.address = this.raw_order.CurrentAddresses[0].Address
    this.customer.city = this.raw_order.CurrentAddresses[0].City

    this.raw_order.OrderItems.forEach(item => {
      let _item = new Item()
      _item.showname =
        item.Name +
        (item.Options?.length > 0 ? ' /' + item.Options?.map(option => option.Name).join(' /') : '')
      _item.amount = item.TotalAmount
      _item.quantity = item.Quantity
      _item.complementary = item.ComplementryQty
      if (item.Message) _item.note = item.Message
      this.items.push(_item)
      this.subtotal += item.TotalAmount
      this.cgst = (this.subtotal * 5) / 200
      this.sgst = (this.subtotal * 5) / 200
      this.igst = 0
    })
  }
}
export class KOT {
  kotno: number = null
  invoiceno: string
  ordername: string
  kotdate: string
  addeditems: Array<Item>
  removeditems: Array<Item>
  ordermessage: string
  raw_kot: KOTModule | any

  constructor(object, type, ordername = '', orderMessage = '') {
    this.raw_kot = object
    this.ordername = this.raw_kot.ordername || ordername
    this.ordermessage = this.raw_kot.instructions || orderMessage
    this.addeditems = []
    this.removeditems = []
    if (type == 'POS') this.posTunnel()
    else if (type == 'UP') this.upTunnel()
    else if (type == 'FB') this.fbTunnel()
  }

  posTunnel() {
    this.invoiceno = this.raw_kot.invoiceno
    this.kotdate = this.raw_kot.CreatedDate
    this.kotno = this.raw_kot.KOTNo

    this.raw_kot.added.forEach(item => {
      let _item = new Item()
      _item.showname = item.showname
      _item.amount = item.TotalAmount
      _item.quantity = item.Quantity
      _item.complementary = item.ComplementryQty
      _item.note = item.Note || item.Message
      this.addeditems.push(_item)
    })
    this.raw_kot.removed.forEach(item => {
      let _item = new Item()
      _item.showname = item.showname
      _item.amount = item.TotalAmount
      _item.quantity = item.Quantity
      _item.complementary = item.ComplementryQty
      _item.note = item.Note || item.Message
      this.removeditems.push(_item)
    })
  }

  upTunnel() {
    this.invoiceno = this.raw_kot.invoiceno
    this.kotdate = this.raw_kot.CreatedDate
    // this.kotno = this.raw_kot.KOTNo

    this.raw_kot.added.forEach(item => {
      let _item = new Item()
      _item.showname = item.title
      _item.amount = item.total
      _item.quantity = item.quantity
      _item.complementary = 0
      _item.note = item.instructions
      this.addeditems.push(_item)
    })
  }

  fbTunnel() {
    this.invoiceno = this.raw_kot.Id.toString()
    this.kotdate = this.raw_kot.BillDateTime
    // this.kotno = this.raw_kot.KOTNo

    this.raw_kot.OrderItems.forEach(item => {
      let _item = new Item()
      _item.showname =
        item.Name +
        (item.Options?.length > 0 ? ' /' + item.Options?.map(option => option.Name).join(' /') : '')
      _item.amount = item.TotalAmount
      _item.quantity = item.Quantity
      _item.complementary = item.ComplementryQty
      console.log(_item.showname, item.Message, item.Message || '')
      if (item.Message) _item.note = item.Message
      this.addeditems.push(_item)
    })
  }
}
export class Item {
  showname: SafeHtml
  amount: number
  quantity: number
  complementary: number
  note: string
  extra: number
  constructor() {
    this.note = ''
  }
}

export class Customer {
  name: string
  phone: string
  email: string
  address: string
  city: string
  pin: string
  constructor() {
    this.name = ''
    this.phone = ''
    this.email = ''
    this.address = ''
    this.city = ''
    this.pin = ''
  }
}
