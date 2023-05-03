import { Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { KOTModule } from 'src/app/pages/apps/sell/sell.module'
import { Settings } from '../waiter/helper.module'
import * as moment from 'moment'
import { OrderModule } from 'src/app/pages/apps/sell/sell.module'
import { AuthService } from 'src/app/auth.service'
import { KOT, Receipt, Item } from './jsontunnel.module'

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  printersettings: any


  // printers = [
  //   {
  //     name: 'OneNote for Windows 10',
  //     displayName: 'OneNote for Windows 10',
  //     description: '',
  //     status: 0,
  //     isDefault: false,
  //     options: {
  //       'printer-location': '',
  //       'printer-make-and-model': 'Microsoft Software Printer Driver',
  //       system_driverinfo:
  //         'Microsoft Software Printer Driver;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
  //     },
  //   },
  //   {
  //     name: 'Microsoft XPS Document Writer',
  //     displayName: 'Microsoft XPS Document Writer',
  //     description: '',
  //     status: 0,
  //     isDefault: false,
  //     options: {
  //       'printer-location': '',
  //       'printer-make-and-model': 'Microsoft XPS Document Writer v4',
  //       system_driverinfo:
  //         'Microsoft XPS Document Writer v4;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
  //     },
  //   },
  //   {
  //     name: 'Microsoft Print to PDF',
  //     displayName: 'Microsoft Print to PDF',
  //     description: '',
  //     status: 0,
  //     isDefault: false,
  //     options: {
  //       'printer-location': '',
  //       'printer-make-and-model': 'Microsoft Print To PDF',
  //       system_driverinfo:
  //         'Microsoft Print To PDF;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
  //     },
  //   },
  //   {
  //     name: 'HP LaserJet Pro MFP M126nw',
  //     displayName: 'HP LaserJet Pro MFP M126nw',
  //     description: '',
  //     status: 0,
  //     isDefault: false,
  //     options: {
  //       'printer-location':
  //         'http://[fe80::5eea:1dff:fe36:c39f%25]:3911/eb694e80-27c0-5229-e4ec-d7137e9dff98',
  //       'printer-make-and-model': 'Microsoft IPP Class Driver',
  //       system_driverinfo:
  //         'Microsoft IPP Class Driver;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
  //     },
  //   },
  //   {
  //     name: 'Fax',
  //     displayName: 'Fax',
  //     description: '',
  //     status: 0,
  //     isDefault: false,
  //     options: {
  //       'printer-location': '',
  //       'printer-make-and-model': 'Microsoft Shared Fax Driver',
  //       system_driverinfo:
  //         'Microsoft Shared Fax Driver;10.0.19041.508 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.508',
  //     },
  //   },
  //   {
  //     name: 'EPSON TM-T82 ReceiptSA4',
  //     displayName: 'EPSON TM-T82 ReceiptSA4',
  //     description: '',
  //     status: 128,
  //     isDefault: true,
  //     options: {
  //       'printer-location': '',
  //       'printer-make-and-model': 'EPSON TM-T82 ReceiptSA4',
  //       system_driverinfo:
  //         'EPSON TM-T82 ReceiptSA4;0, 3, 0, 0 built by: WinDDK;EPSON Advanced Printer Driver;1, 0, 19, 0',
  //     },
  //   },
  // ]
  loginfo: any
  constructor(private electronService: ElectronService, private auth: AuthService) {
    this.getData()
  }

  // SENDING COMMANDS TO PRINTER
  sendCommands(commands, printers) {
    console.log(commands, printers)
    if (this.electronService.isElectronApp) {
      printers.forEach(printer => {
        this.electronService.remote.getGlobal('silentPrint')(commands, printer)
      })
    }
  }

  printBarcode(options, data) {
    if (this.electronService.isElectronApp)
      this.electronService.remote.getGlobal('barcodePrint')(options, data)
  }

  // RECEIPT
  posReceipt(receipt, printers, Type = 'POS') {
    const _receipt: Receipt = new Receipt(receipt, Type)
    const commands = this.getReceiptCommands(_receipt,  this.printersettings.charcount || 47, {
      size: '80mm',
    })
    console.log(commands, _receipt, receipt, printers)
    this.sendCommands(commands, printers)
  }

  upReceipt(receipt, printers, type = 'UP') {
    const _receipt = new Receipt(receipt, type)
    const commands = this.getReceiptCommands(_receipt, this.printersettings.charcount || 47, {
      size: '80mm',
    })
    console.log(commands, _receipt, receipt, printers)
    this.sendCommands(commands, printers)
  }

  fbReceipt(receipt, printers, type = 'FB') {
    const _receipt = new Receipt(receipt, type)
    const commands = this.getReceiptCommands(_receipt, this.printersettings.charcount || 47, {
      size: '80mm',
    })
    console.log(commands, _receipt, receipt, printers)
    this.sendCommands(commands, printers)
  }

  // KOT
  posKOT(kot, ordername, orderMessage, printers, Type = 'POS') {
    const _kot: KOT = new KOT(kot, Type, ordername, orderMessage)
    const commands = this.getKOTCommands(_kot, this.printersettings.charcount || 47, {
      size: '80mm',
    })
    console.log(commands, _kot, kot, printers)
    this.sendCommands(commands, printers)
  }

  upKOT(kot, printers, type = 'UP') {
    const _kot: KOT = new KOT(kot, type)
    const commands = this.getKOTCommands(_kot, this.printersettings.charcount || 47, {
      size: '80mm',
    })
    console.log(commands, _kot, kot, printers)
    this.sendCommands(commands, printers)
  }

  fbKOT(kot, printers, type = 'FB') {
    const _kot: KOT = new KOT(kot, type, 'FBCAKES.COM', kot.Note)
    const commands = this.getKOTCommands(_kot, this.printersettings.charcount || 47, {
      size: '80mm',
    })
    console.log(commands, _kot, kot, printers)
    this.sendCommands(commands, printers)
  }

  getReceiptCommands(receipt: Receipt, numberOfCharacters, receiptPrinter) {
    let printBillDate = moment(new Date(receipt.billdate)).format('LLL') //this.datepipe.transform(receipt.details.createdAt, 'MMM dd, y') + ' at ' + this.datepipe.transform(receipt.details.createdAt, 'hh:mm a');
    let highestItemPrice = this.getHighestItemPrice(receipt.items)
    let total = receipt.total.toFixed(2)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + this.loginfo.Company + '\n' + '\u000A' //Company Name
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      `${this.loginfo.store}, ${this.loginfo.address}, ${this.loginfo.city}, \n${this.loginfo.phoneNo}\nGSTIN:${this.loginfo.GSTno}` +
      '\u000A' // Store Address //Bill Header
    command += '\u001B' + 'a' + '\u0001' + 'Receipt: ' + receipt.invoiceno + '\u000A' //InvoiceNo
    command += '\u001B' + 'a' + '\u0001' + printBillDate + '\u000A' // OrderedDate // BillDate
    if (receipt.customer) {
      if (receipt.customer.name)
        command += '\u001B' + 'a' + '\u0001' + 'Customer: ' + receipt.customer.name + '\u000A' // Customer Name
      if (receipt.customer.phone)
        command +=
          '\u001B' + 'a' + '\u0001' + 'Customer Mobile: ' + receipt.customer.phone + '\u000A' // CUstomer Phone
      if (receipt.customer.address)
        command +=
          '\u001B' + 'a' + '\u0001' + 'Delivery Address: ' + receipt.customer.address + '\u000A' // CUstomer Phone
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('ITEM', 2) +
      this.paddingLeft('QTY', itemsSecondColumn - 4) +
      this.paddingLeft('PRICE', itemsThirdColumn - 3) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    for (let item of receipt.items) {
      let name = item.showname.toString() // ? item.displayName : item.name;
      if (name.length > cutIndex)
        //Larger item size
        command += this.getLargeItemCommand(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          0,
        )
      else   
        command +=
          '\u001B' +
          'a' +
          '\u0000' +
          this.paddingLeft(name, 2) +
          this.paddingLeft(item.quantity.toString(), itemsSecondColumn - name.length) +
          this.paddingLeft(
            item.amount.toFixed(2),
            itemsThirdColumn -
              item.quantity.toString().length +
              highestItemPrice.toFixed(2).length -
              item.amount.toFixed(2).length,
          ) +
          '\u000A' 
      if (item.note != '') {
        command += '\u001B' + 'a' + '\u0000' + this.paddingLeft('*Msg: ' + item.note, 2) + '\u000A' //Break Line
      }
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Subtotal', 2) +
      this.paddingLeft(
        receipt.subtotal.toFixed(2),
        paymentSectionColumn - 8 + (total.length - receipt.subtotal.toFixed(2).length),
      ) +
      '\u000A'
    if (receipt.discountruleid)
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    if (receipt.discount > 0 && !receipt.discountruleid)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Bulk Discount', 2) +
        this.paddingLeft(
          '-' + receipt.discount.toFixed(2),
          paymentSectionColumn - 14 + (total.length - receipt.discount.toFixed(2).length),
        ) +
        '\u000A'
    let tax1_total = receipt.cgst
    let tax2_total = receipt.sgst
    if (tax1_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('CGST', 2) +
        this.paddingLeft(
          tax1_total.toFixed(2),
          paymentSectionColumn - 'CGST'.length + (total.length - tax1_total.toFixed(2).length),
        ) +
        '\u000A'
    if (tax2_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('SGST', 2) +
        this.paddingLeft(
          tax2_total.toFixed(2),
          paymentSectionColumn - 'SGST'.length + (total.length - tax2_total.toFixed(2).length),
        ) +
        '\u000A'
    if (receipt.extra) {
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Extra', 2) +
        this.paddingLeft(
          receipt.extra.toFixed(2),
          paymentSectionColumn - 5 + (total.length - receipt.extra.toFixed(2).length),
        ) +
        '\u000A'
    }
    if (receipt.discountruleid) {
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Without Discount', 2) +
        this.paddingLeft((receipt.total + receipt.discount).toFixed(2), paymentSectionColumn - 16) +
        '\u000A'

      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Bulk Discount', 2) +
        this.paddingLeft(
          '-' + receipt.discount.toFixed(2),
          paymentSectionColumn - 14 + (total.length - receipt.discount.toFixed(2).length),
        ) +
        '\u000A'
    }
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Total', 2) +
      this.paddingLeft(receipt.total.toFixed(2), paymentSectionColumn - 5) +
      '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Paid', 2) +
      this.paddingLeft(receipt.paid.toFixed(2), paymentSectionColumn - 4) +
      '\u000A'

    let Balance = receipt.total - receipt.paid
    if (Balance > 0) {
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Balance', 2) +
        this.paddingLeft(Balance.toFixed(2), paymentSectionColumn - 7) +
        '\u000A'
    }

    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      'Thank You. Visit Again.' +
      '\u000A' +
      '\u001B' +
      'a' +
      '\u0000' +
      lineBreak.slice(0, numberOfCharacters) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0001' + 'Powered By Biz1Book.' + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }

  getKOTCommands(kot: KOT, numberOfCharacters, receiptPrinter) {
    let printBillDate = moment(new Date(kot.kotdate)).format('MMM D, YYYY hh:mm A')
    let InvoiceNo = kot.invoiceno
    // let highestItemQty = this.getHighestItemQty([...kot.addeditems, ...kot.removeditems])
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    if (InvoiceNo.split('/')[1])
      command += '\u001B' + 'a' + '\u0001' + `#${InvoiceNo.split('/')[1]}` + '\n' + '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      `ORDER TICKET #${InvoiceNo}${kot.kotno ? '#' + kot.kotno : ''}` +
      '\n' +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft(kot.ordername, 2) +
      this.paddingLeft(
        printBillDate,
        numberOfCharacters - this.paddingLeft(kot.ordername, 2).length - 2 - printBillDate.length,
      ) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    if (kot.addeditems.length > 0) {
      command += '\u001B' + 'a' + '\u0001' + `ADDED ITEMS` + '\n' + '\u000A'
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('ITEM', 2) +
        this.paddingLeft('QTY', numberOfCharacters - 11) + //numberOfCharacters - 11
        '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
      kot.addeditems.forEach(itm => {
        command += this.getItemCommand(itm, numberOfCharacters, '+')
        if (itm.note)
          command += '\u001B' + 'a' + '\u0000' + this.paddingLeft('*Msg: ' + itm.note, 2) + '\u000A'
      })
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }

    if (kot.removeditems.length > 0) {
      command += '\u001B' + 'a' + '\u0001' + `REMOVED ITEMS` + '\n' + '\u000A'
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('ITEM', 2) +
        this.paddingLeft('QTY', 36) +
        '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
      kot.removeditems.forEach(itm => {
        command += this.getItemCommand(itm, numberOfCharacters, '')
        if (itm.note)
          command +=
            '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.note, 2) + '\u000A'
      })
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }
    if (kot.ordermessage) {
      command +=
        '\u001B' + 'a' + '\u0000' + this.paddingLeft('Note: ' + kot.ordermessage, 2) + '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }
    command += '\u001B' + 'a' + '\u0001' + `Order Tickets By  Biz1Book.` + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }

  //////////////////////////////////////////////////OLD DO NOT DELETE//////////////////////////////////
  print(html, printers) {
    if (this.electronService.isElectronApp)
      this.electronService.remote.getGlobal('print')(1, printers, html)
  }

  silentPrintReceipt(receipt: OrderModule, printer) {
    let commands = this.getPOSReceiptCommands(receipt)
    console.log(commands)
    if (this.electronService.isElectronApp) this.silentPrint(commands, printer)
  }
  printOnlineOrder(receipt, printer) {
    receipt.order.items.forEach(item => {
      item.showName = item.title + item.options_to_add.map(x => ' /' + x.title).join('')
    })
    let commands = this.getOnlineReceiptCommands(receipt)
    console.log(commands)
    if (this.electronService.isElectronApp) this.silentPrint(commands, printer)
  }
  getPOSReceiptCommands(
    receipt: OrderModule,
    numberOfCharacters = 47,
    receiptPrinter = { size: '80mm' },
  ) {
    // console.log('numberOfCharacters: ', numberOfCharacters)
    let printBillDate = moment(new Date(receipt.OrderedDateTime)).format('LLL') //this.datepipe.transform(receipt.details.createdAt, 'MMM dd, y') + ' at ' + this.datepipe.transform(receipt.details.createdAt, 'hh:mm a');
    let highestItemPrice = this.getHighestItemPrice(receipt.Items)
    let total = receipt.BillAmount.toFixed(2)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + this.loginfo.Company + '\n' + '\u000A' //Company Name
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      `${this.loginfo.store}, ${this.loginfo.address}, ${this.loginfo.city}, \n${this.loginfo.phoneNo}\nGSTIN:${this.loginfo.GSTno}` +
      '\u000A' // Store Address //Bill Header
    command += '\u001B' + 'a' + '\u0001' + 'Receipt: ' + receipt.InvoiceNo + '\u000A' //InvoiceNo
    command += '\u001B' + 'a' + '\u0001' + printBillDate + '\u000A' // OrderedDate // BillDate
    if (receipt.CustomerDetails) {
      if (receipt.CustomerDetails.Name)
        command +=
          '\u001B' + 'a' + '\u0001' + 'Customer: ' + receipt.CustomerDetails.Name + '\u000A' // Customer Name
      if (receipt.CustomerDetails.PhoneNo)
        command +=
          '\u001B' +
          'a' +
          '\u0001' +
          'Customer Mobile: ' +
          receipt.CustomerDetails.PhoneNo +
          '\u000A' // CUstomer Phone
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('ITEM', 2) +
      this.paddingLeft('QTY', itemsSecondColumn - 4) +
      this.paddingLeft('PRICE', itemsThirdColumn - 3) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    for (let item of receipt.Items) {
      let name = item.showname.toString() // ? item.displayName : item.name;
      if (name.length > cutIndex)
        //Larger item size
        command += this.getLargeItemCommand(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          0,
        )
      else
        command +=
          '\u001B' +
          'a' +
          '\u0000' +
          this.paddingLeft(name, 2) +
          this.paddingLeft(item.Quantity.toString(), itemsSecondColumn - name.length) +
          this.paddingLeft(
            item.TotalAmount.toFixed(2),
            itemsThirdColumn -
              item.Quantity.toString().length +
              highestItemPrice.toFixed(2).length -
              item.TotalAmount.toFixed(2).length,
          ) +
          '\u000A'
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Subtotal', 2) +
      this.paddingLeft(
        receipt.subtotal.toFixed(2),
        paymentSectionColumn - 8 + (total.length - receipt.subtotal.toFixed(2).length),
      ) +
      '\u000A'
    if (receipt.OrderTotDisc + receipt.AllItemTotalDisc > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Bulk Discount', 2) +
        this.paddingLeft(
          '-' + (receipt.OrderTotDisc + receipt.AllItemTotalDisc).toFixed(2),
          paymentSectionColumn -
            14 +
            (total.length - (receipt.OrderTotDisc + receipt.AllItemTotalDisc).toFixed(2).length),
        ) +
        '\u000A'
    let tax1_total = receipt.Tax1
    let tax2_total = receipt.Tax2
    if (tax1_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('CGST', 2) +
        this.paddingLeft(
          tax1_total.toFixed(2),
          paymentSectionColumn - 'CGST'.length + (total.length - tax1_total.toFixed(2).length),
        ) +
        '\u000A'
    if (tax2_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('SGST', 2) +
        this.paddingLeft(
          tax2_total.toFixed(2),
          paymentSectionColumn - 'SGST'.length + (total.length - tax2_total.toFixed(2).length),
        ) +
        '\u000A'

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Total', 2) +
      this.paddingLeft(receipt.BillAmount.toFixed(2), paymentSectionColumn - 5) +
      '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Paid', 2) +
      this.paddingLeft(receipt.PaidAmount.toFixed(2), paymentSectionColumn - 4) +
      '\u000A'

    let Balance = receipt.BillAmount - receipt.PaidAmount
    if (Balance > 0) {
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Balance', 2) +
        this.paddingLeft(Balance.toFixed(2), paymentSectionColumn - 7) +
        '\u000A'
    }

    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      'Thank You. Visit Again.' +
      '\u000A' +
      '\u001B' +
      'a' +
      '\u0000' +
      lineBreak.slice(0, numberOfCharacters) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0001' + 'Powered By Biz1Book.' + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }
  getOnlineReceiptCommands(receipt, numberOfCharacters = 47, receiptPrinter = { size: '80mm' }) {
    // console.log('numberOfCharacters: ', numberOfCharacters)
    receipt.InvoiceNo =
      receipt.order.details.channel.charAt(0).toUpperCase() +
      receipt.order.details.ext_platforms[0].id
    let printBillDate = moment(new Date(receipt.order.details.created)).format('LLL') //this.datepipe.transform(receipt.details.createdAt, 'MMM dd, y') + ' at ' + this.datepipe.transform(receipt.details.createdAt, 'hh:mm a');
    let highestItemPrice = this.getHighestItemPriceO(receipt.order.items)
    let total = receipt.order.details.order_total.toFixed(2)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + this.loginfo.Company + '\n' + '\u000A' //Company Name
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      `${this.loginfo.store}, ${this.loginfo.address}, ${this.loginfo.city}, \n${this.loginfo.phoneNo}\nGSTIN:${this.loginfo.GSTno}` +
      '\u000A' // Store Address //Bill Header
    command += '\u001B' + 'a' + '\u0001' + 'Receipt: ' + receipt.InvoiceNo + '\u000A' //InvoiceNo
    command += '\u001B' + 'a' + '\u0001' + printBillDate + '\u000A' // OrderedDate // BillDate
    if (receipt.customer) {
      if (receipt.customer.name)
        command += '\u001B' + 'a' + '\u0001' + 'Customer: ' + receipt.customer.Name + '\u000A' // Customer Name
      if (receipt.customer.phone)
        command +=
          '\u001B' + 'a' + '\u0001' + 'Customer Mobile: ' + receipt.customer.phone + '\u000A' // CUstomer Phone
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('ITEM', 2) +
      this.paddingLeft('QTY', itemsSecondColumn - 4) +
      this.paddingLeft('PRICE', itemsThirdColumn - 3) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    for (let item of receipt.order.items) {
      let name = item.showName // ? item.displayName : item.name;
      if (name.length > cutIndex)
        //Larger item size
        command += this.getLargeItemCommandO(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          0,
        )
      else
        command +=
          '\u001B' +
          'a' +
          '\u0000' +
          this.paddingLeft(name, 2) +
          this.paddingLeft(item.quantity.toString(), itemsSecondColumn - name.length) +
          this.paddingLeft(
            item.total.toFixed(2),
            itemsThirdColumn -
              item.quantity.toString(2).length +
              highestItemPrice.toFixed(2).length -
              item.total.toFixed(2).length,
          ) +
          '\u000A'
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Subtotal', 2) +
      this.paddingLeft(
        receipt.order.details.order_subtotal.toFixed(2),
        paymentSectionColumn -
          8 +
          (total.length - receipt.order.details.order_subtotal.toFixed(2).length),
      ) +
      '\u000A'
    let bulkDicount = receipt.order.details.discount
    let charges = receipt.order.details.total_charges
    if (bulkDicount > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Bulk Discount', 2) +
        this.paddingLeft(
          '-' + bulkDicount.toFixed(2),
          paymentSectionColumn - 14 + (total.length - bulkDicount.toFixed(2).length),
        ) +
        '\u000A'
    if (charges > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Charges', 2) +
        this.paddingLeft(
          charges.toFixed(2),
          paymentSectionColumn - 7 + (total.length - charges.toFixed(2).length),
        ) +
        '\u000A'
    let tax1_total = receipt.order.details.total_taxes / 2
    let tax2_total = receipt.order.details.total_taxes / 2
    if (tax1_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('CGST', 2) +
        this.paddingLeft(
          tax1_total.toFixed(2),
          paymentSectionColumn - 'CGST'.length + (total.length - tax1_total.toFixed(2).length),
        ) +
        '\u000A'
    if (tax2_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('SGST', 2) +
        this.paddingLeft(
          tax2_total.toFixed(2),
          paymentSectionColumn - 'SGST'.length + (total.length - tax2_total.toFixed(2).length),
        ) +
        '\u000A'

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Total', 2) +
      this.paddingLeft(receipt.order.details.order_total.toFixed(2), paymentSectionColumn - 5) +
      '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Paid', 2) +
      this.paddingLeft(receipt.order.details.payable_amount.toFixed(2), paymentSectionColumn - 4) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      'Thank You. Visit Again.' +
      '\u000A' +
      '\u001B' +
      'a' +
      '\u0000' +
      lineBreak.slice(0, numberOfCharacters) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0001' + 'Powered By Biz1Book.' + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }

  getHighestItemPrice(items) {
    console.log(items)
    let highestPrice = 0
    for (let item of items) {
      if (item.amount > highestPrice) highestPrice = item.amount
      else continue
    }
    return highestPrice
  }
  getHighestItemPriceO(items) {
    let highestPrice = 0
    for (let item of items) {
      if (item.total > highestPrice) highestPrice = item.total
      else continue
    }
    return highestPrice
  }

  paddingLeft(padStr, padLength) {
    return String('                                                ' + padStr).slice(
      -(padStr.length + padLength),
    )
  }

  getLargeItemCommand(
    item,
    itemsSecondColumn,
    itemsThirdColumn,
    highestItemPrice,
    cutIndex,
    currentIndex,
  ) {
    let command
    let name = item.showname.toString() //displayName ? item.displayName : item.name;
    if (currentIndex === 0)
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(0, cutIndex), 2) +
        this.paddingLeft(item.quantity.toString(), itemsSecondColumn - cutIndex) +
        this.paddingLeft(
          item.amount.toFixed(2),
          itemsThirdColumn -
            item.quantity.toString().length +
            highestItemPrice.toFixed(2).length -
            item.amount.toFixed(2).length,
        ) +
        '\u000A'
    else
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(currentIndex, currentIndex + cutIndex), 2) +
        '\u000A'
    currentIndex += cutIndex
    if (name.length - currentIndex > 0)
      return (
        command +
        this.getLargeItemCommand(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          currentIndex,
        )
      )
    else return command
  }

  getLargeItemCommandO(
    item,
    itemsSecondColumn,
    itemsThirdColumn,
    highestItemPrice,
    cutIndex,
    currentIndex,
  ) {
    let command
    let name = item.showName //displayName ? item.displayName : item.name;
    if (currentIndex === 0)
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(0, cutIndex), 2) +
        this.paddingLeft(item.quantity.toString(), itemsSecondColumn - cutIndex) +
        this.paddingLeft(
          item.total.toFixed(2),
          itemsThirdColumn -
            item.quantity.toString().length +
            highestItemPrice.toFixed(2).length -
            item.total.toFixed(2).length,
        ) +
        '\u000A'
    else
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(currentIndex, currentIndex + cutIndex), 2) +
        '\u000A'
    currentIndex += cutIndex
    if (name.length - currentIndex > 0)
      return (
        command +
        this.getLargeItemCommandO(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          currentIndex,
        )
      )
    else return command
  }

  getData() {
    this.auth.getdbdata(['printersettings', 'loginfo']).subscribe(
      data => {
        console.log(data)
        this.printersettings = data['printersettings'][0] ? data['printersettings'][0] : {}
        this.loginfo = data['loginfo'][0]
        // console.log('FROM PRINT SERVICE')
        // console.log(this.printersettings, this.loginfo)
      },
      error => {
        console.log(error)
      },
    )
  }

  //////////////////////////KOT
  printOnlineKOt(kot, ordername, orderMessage, numberOfCharacters, receiptPrinter, printer) {
    kot.Items.forEach(itm => {
      itm.showName = itm.title + itm.options_to_add.map(x => ' /' + x.title).join('')
    })
    kot.added.forEach(itm => {
      itm.showName = itm.title + itm.options_to_add.map(x => ' /' + x.title).join('')
    })
    let commands = this.getKotOnlineCommands(
      kot,
      ordername,
      orderMessage,
      numberOfCharacters,
      receiptPrinter,
    )
    console.log(commands)
    if (this.electronService.isElectronApp) this.silentPrint(commands, printer)
  }

  printPOSKOt(kot, ordername, orderMessage, numberOfCharacters, receiptPrinter, printer) {
    let commands = this.getKotPOSCommands(
      kot,
      ordername,
      orderMessage,
      numberOfCharacters,
      receiptPrinter,
    )
    console.log(commands)
    if (this.electronService.isElectronApp) this.silentPrint(commands, printer)
  }

  getKotPOSCommands(kot, ordername, orderMessage, numberOfCharacters, receiptPrinter) {
    let printBillDate = moment(new Date(kot.CreatedDate)).format('MMM D, YYYY hh:mm A')
    let InvoiceNo = kot.invoiceno
    let highestItemQty = this.getHighestItemQty(kot.Items)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + `#${InvoiceNo.split('/')[1]}` + '\n' + '\u000A'
    command +=
      '\u001B' + 'a' + '\u0001' + `ORDER TICKET #${InvoiceNo}#${kot.KOTNo}` + '\n' + '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft(ordername, 2) +
      this.paddingLeft(
        printBillDate,
        numberOfCharacters - this.paddingLeft(ordername, 2).length - 2 - printBillDate.length,
      ) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    if (kot.added.length > 0) {
      command += '\u001B' + 'a' + '\u0001' + `ADDED ITEMS` + '\n' + '\u000A'
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('ITEM', 2) +
        this.paddingLeft('QTY', 36) +
        '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
      kot.added.forEach(itm => {
        command += this.getItemCommand(itm, numberOfCharacters, '+')
        if (itm.Note)
          command +=
            '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.Note, 2) + '\u000A'
      })
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }

    if (kot.removed.length > 0) {
      command += '\u001B' + 'a' + '\u0001' + `REMOVED ITEMS` + '\n' + '\u000A'
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('ITEM', 2) +
        this.paddingLeft('QTY', 36) +
        '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
      kot.removed.forEach(itm => {
        command += this.getItemCommand(itm, numberOfCharacters, '')
        if (itm.Note)
          command +=
            '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.Note, 2) + '\u000A'
      })
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }
    if (orderMessage) {
      command +=
        '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + orderMessage, 2) + '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }
    command += '\u001B' + 'a' + '\u0001' + `Order Tickets By  Biz1Book.` + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }
  getKotOnlineCommands(kot, ordername, orderMessage, numberOfCharacters, receiptPrinter) {
    let printBillDate = moment(new Date(kot.CreatedDate)).format('MMM D, YYYY hh:mm A')
    let InvoiceNo = kot.invoiceno
    let highestItemQty = this.getHighestItemQtyO(kot.Items)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + `ORDER TICKET #${InvoiceNo}` + '\n' + '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft(ordername, 2) +
      this.paddingLeft(
        printBillDate,
        numberOfCharacters - this.paddingLeft(ordername, 2).length - 2 - printBillDate.length,
      ) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command += '\u001B' + 'a' + '\u0001' + `ADDED ITEMS` + '\n' + '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('ITEM', 2) +
      this.paddingLeft('QTY', 36) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    kot.added.forEach(itm => {
      command += this.getItemCommandO(itm, numberOfCharacters, '+')
      if (itm.Note)
        command +=
          '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.Note, 2) + '\u000A'
    })
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    // command += '\u001B' + 'a' + '\u0001' + `REMOVED ITEMS` + '\n' + '\u000A';
    // command += '\u001B' + 'a' + '\u0000' + this.paddingLeft('ITEM', 2) + this.paddingLeft('QTY', 36) + '\u000A';
    // command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'; //Break Line
    // kot.added.forEach(itm => {
    //   command += this.getItemCommand(itm, numberOfCharacters, '-')
    // })
    // command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'; //Break Line
    if (orderMessage) {
      command +=
        '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + orderMessage, 2) + '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }
    command += '\u001B' + 'a' + '\u0001' + `Order Tickets By Biz1Book.` + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }

  getItemCommand(item: Item, numberOfCharacters, qty_prf) {
    let command = ''
    let name = item.showname.toString()
    let qty_text = qty_prf + (item.quantity + item.complementary).toFixed(2)
    let cutindex = numberOfCharacters - 4 - 8
    if (name.length > cutindex) {
      console.log('larger name')
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(0, cutindex), 2) +
        this.paddingLeft(
          qty_text,
          numberOfCharacters -
            qty_text.length -
            this.paddingLeft(name.slice(0, cutindex), 2).length -
            2,
        ) +
        '\u000A'
      command += this.getRemainingName(name.slice(cutindex, name.length), numberOfCharacters)
    } else {
      console.log('fit name')
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name, 2) +
        this.paddingLeft(
          qty_text,
          numberOfCharacters - 2 - qty_text.length - this.paddingLeft(name, 2).length,
        ) +
        '\u000A'
    }
    return command
  }

  getItemCommandO(item, numberOfCharacters, qty_prf) {
    let command = ''
    let name = item.showName
    let qty_text = qty_prf + item.quantity.toFixed(2)
    let cutindex = numberOfCharacters - 4 - 8
    if (name.length > cutindex) {
      console.log('larger name')
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(0, cutindex), 2) +
        this.paddingLeft(
          qty_text,
          numberOfCharacters -
            qty_text.length -
            this.paddingLeft(name.slice(0, cutindex), 2).length -
            2,
        ) +
        '\u000A'
      command += this.getRemainingName(name.slice(cutindex, name.length), numberOfCharacters)
    } else {
      console.log('fit name')
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name, 2) +
        this.paddingLeft(
          qty_text,
          numberOfCharacters - 2 - qty_text.length - this.paddingLeft(name, 2).length,
        ) +
        '\u000A'
    }
    return command
  }

  getRemainingName(name, numberOfCharacters) {
    let command = ''
    let cutindex = numberOfCharacters - 4 - 8
    if (name.length > cutindex) {
      command += '\u001B' + 'a' + '\u0000' + this.paddingLeft(name.slice(0, cutindex), 2) + '\u000A'
    } else {
      command += '\u001B' + 'a' + '\u0000' + this.paddingLeft(name, 2) + '\u000A'
    }
    return command
  }

  getHighestItemQty(items) {
    let highestQty = 0
    for (let item of items) {
      if (Math.abs(item.Quantity + item.ComplementryQty) > highestQty)
        highestQty = Math.abs(item.Quantity + item.ComplementryQty)
      else continue
    }
    return highestQty
  }

  getHighestItemQtyO(items) {
    let highestQty = 0
    for (let item of items) {
      if (Math.abs(item.quantity) > highestQty) highestQty = Math.abs(item.quantity)
      else continue
    }
    return highestQty
  }

  silentPrint(commands, printers) {
    printers.forEach(printer => {
      this.electronService.remote.getGlobal('silentPrint')(commands, printer)
    })
  }

  ////////////////////////////FBFUNCTIONS////////////////////////
  //FBFUNCTIONS
  printFBcakeOrder(receipt, printer) {
    let commands = this.getFBcakesReceiptCommands(JSON.parse(JSON.stringify(receipt)))
    console.log('FB CAkes commands 5552', commands)
    if (this.electronService.isElectronApp) this.silentPrint(commands, printer)
  }

  //FBFUNCTIONS
  getFBcakesReceiptCommands(receipt, numberOfCharacters = 47, receiptPrinter = { size: '80mm' }) {
    // receipt.InvoiceNo =receipt.order.details.channel.charAt(0).toUpperCase() +receipt.order.details.ext_platforms[0].id
    let printBillDate = moment(new Date(receipt.BillDateTime)).format('LLL') //this.datepipe.transform(receipt.details.createdAt, 'MMM dd, y') + ' at ' + this.datepipe.transform(receipt.details.createdAt, 'hh:mm a');
    let Deliverytime = moment(new Date(receipt.OrderedDateTime)).format('LLL')
    let highestItemPrice = this.getHighestItemPriceO(receipt.OrderItems)
    let total = receipt.BillAmount.toFixed(2)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let paymenttype = 'nil'
    let storeId = receipt.StoreId
    if (receipt.Transactions[0].PaymentTypeId == 4) {
      paymenttype = 'ONLINE'
    } else if (receipt.Transactions[0].PaymentTypeId == 1) {
      paymenttype = '  COD'
    }
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + this.loginfo.Company + '\n' + '\u000A' //Company Name
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      `${this.loginfo.store}, ${this.loginfo.address}, ${this.loginfo.city}, \n${this.loginfo.phoneNo}\nGSTIN:${this.loginfo.GSTno}` +
      '\u000A' // Store Address //Bill Header
    command += '\u001B' + 'a' + '\u0001' + 'Receipt: FB/' + storeId + '/' + receipt.Id + '\u000A' //InvoiceNo
    command += '\u001B' + 'a' + '\u0001' + printBillDate + '\u000A' // OrderedDate // BillDate

    if (receipt.CurrentAddresses[0].Name) {
      if (receipt.CurrentAddresses[0].Name)
        command +=
          '\u001B' +
          'a' +
          '\u0001' +
          'Customer Name: ' +
          receipt.CurrentAddresses[0].Name +
          '\u000A' // Customer Name
      if (receipt.CustomerDetail[0].PhoneNo)
        command +=
          '\u001B' +
          'a' +
          '\u0001' +
          'Customer Mobile: ' +
          receipt.CustomerDetail[0].PhoneNo +
          '\u000A' // CUstomer Phone
      if (receipt.CurrentAddresses[0].Address)
        command +=
          '\u001B' +
          'a' +
          '\u0001' +
          'Delivery Address: ' +
          receipt.CurrentAddresses[0].Address +
          '\u000A' // CUstomer Phone
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('ITEM', 2) +
      this.paddingLeft('QTY', itemsSecondColumn - 4) +
      this.paddingLeft('PRICE', itemsThirdColumn - 3) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    for (let item of receipt.OrderItems) {
      let options = ' '
      let msg = ' '
      if (item.Options) {
        item.Options.forEach(x => {
          options += x.Name + ' '
        })
      }

      if (item.Message) {
        msg = item.Message
      }

      let name = item.Name + '' + options + '' + msg // ? item.displayName : item.name;
      item.Name = item.Name + '' + options + '' + msg
      if (name.length > cutIndex)
        //Larger item size
        command += this.getLargeItemCommandFB(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          0,
        )
      else
        command +=
          '\u001B' +
          'a' +
          '\u0000' +
          this.paddingLeft(name, 2) + //Item NAME FBCAKES
          this.paddingLeft(item.Quantity.toString(), itemsSecondColumn - name.length) +
          this.paddingLeft(
            item.TotalAmount.toFixed(2),
            itemsThirdColumn -
              // item.Quantity.toString(2).length + highestItemPrice.toFixed(2).length - item.TotalAmount.length,
              item.Quantity.toString(2).length +
              highestItemPrice.toFixed(2).length -
              5,
          ) +
          '\u000A'
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Subtotal', 2) +
      this.paddingLeft(
        (receipt.BillAmount - (receipt.BillAmount * 5) / 100).toFixed(2),
        paymentSectionColumn -
          8 +
          (total.length - (receipt.BillAmount - (receipt.BillAmount * 5) / 100).toFixed(2).length),
      ) +
      '\u000A'

    let bulkDicount = receipt.BillAmount
    let charges = receipt.BillAmount
    // if (bulkDicount > 0)
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Tax Amount', 2) +
      this.paddingLeft(((receipt.BillAmount * 5) / 100).toFixed(2), paymentSectionColumn - 9) +
      '\u000A'
    // if (charges > 0)

    let tax1_total = 0
    let tax2_total = 0
    // if (tax1_total > 0)
    //   command +=
    //     '\u001B' +
    //     'a' +
    //     '\u0000' +
    //     this.paddingLeft('CGST', 2) +
    //     this.paddingLeft(
    //       tax1_total.toFixed(2),
    //       paymentSectionColumn - 'CGST'.length + (total.length - tax1_total.toFixed(2).length),
    //     ) +
    //     '\u000A'
    // if (tax2_total > 0)
    // command +=
    //   '\u001B' +
    //   'a' +
    //   '\u0000' +
    //   this.paddingLeft('Tax', 2) +
    //   this.paddingLeft(
    //     tax2_total.toFixed(2),
    //     paymentSectionColumn - 'SGST'.length + (receipt.BillAmount.length),
    //   ) +
    //   '\u000A'

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Total', 2) +
      this.paddingLeft(receipt.BillAmount.toFixed(2), paymentSectionColumn - 5) +
      '\u000A'

    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Payment Type', 2) +
      this.paddingLeft(paymenttype, paymentSectionColumn - 11) +
      '\u000A'

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Delivery Time', 2) +
      this.paddingLeft(Deliverytime, paymentSectionColumn - 32) +
      '\u000A'

    // command +=
    //   '\u001B' +
    //   'a' +
    //   '\u0000' +
    //   this.paddingLeft('Paid', 2) +
    //   this.paddingLeft(receipt.BillAmount, paymentSectionColumn - 4) +
    //   '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      'Thank You. Visit Again.' +
      '\u000A' +
      '\u001B' +
      'a' +
      '\u0000' +
      lineBreak.slice(0, numberOfCharacters) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0001' + 'Powered By Biz1Book.:)' + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }

  //FBFUNCTIONS
  getLargeItemCommandFB(
    item,
    itemsSecondColumn,
    itemsThirdColumn,
    highestItemPrice,
    cutIndex,
    currentIndex,
  ) {
    let command
    let options = ' '
    let msg = ' '
    if (item.Options) {
      item.Options.forEach(x => {
        options += x.Name + ' '
      })
    }

    if (item.Message) {
      msg = item.Message
    }

    console.log('my O bill', item.Name + '_' + options + '_' + msg)
    // let name = item.Name+ "" + options //+ "" + msg //displayName ? item.displayName : item.name;

    let name = item.Name

    if (currentIndex === 0)
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(0, cutIndex), 2) +
        this.paddingLeft(item.Quantity.toString(), itemsSecondColumn - cutIndex) +
        this.paddingLeft(
          item.TotalAmount.toFixed(2),
          itemsThirdColumn -
            item.Quantity.toString().length +
            highestItemPrice.toFixed(2).length -
            item.TotalAmount.toFixed(2).length,
        ) +
        '\u000A'
    else
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(currentIndex, currentIndex + cutIndex), 2) +
        '\u000A'
    currentIndex += cutIndex
    if (name.length - currentIndex > 0)
      return (
        command +
        this.getLargeItemCommandFB(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          currentIndex,
        )
      )
    else return command
  }

  //FBFUNCTIONS
  printFbcakeKOt(recipt, printer) {
    let kot, ordername, orderMessage, numberOfCharacters, receiptPrinter

    let commands = this.getKotFBcakesCommands(
      (kot = recipt),
      (ordername = 'FBCAKES.COM'),
      (orderMessage = 'nill'),
      numberOfCharacters,
      {},
    )
    console.log(commands)
    if (this.electronService.isElectronApp) this.silentPrint(commands, printer)
  }

  //FBFUNCTIONS
  getKotFBcakesCommands(kot, ordername, orderMessage, numberOfCharacters, receiptPrinter) {
    let printBillDate = moment(new Date(kot.BillDateTime)).format('MMM D, YYYY hh:mm A')
    let OrderedDateTime = moment(new Date(kot.OrderedDateTime)).format('MMM D, YYYY hh:mm A')
    let InvoiceNo = kot.Id
    let highestItemQty = this.getHighestItemQty(kot.OrderItems)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    //  let lineBreak = '--------------------------------------------------------------'

    let lineBreak = '------------------------------------------------'

    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    // command += '\u001B' + 'a' + '\u0001' + `#${InvoiceNo.split('/')[1]}` + '\n' + '\u000A'
    command += '\u001B' + 'a' + '\u0001' + `ORDER ID #${InvoiceNo}` + '\n' + '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft(ordername, 2) +
      this.paddingLeft(
        printBillDate,
        // numberOfCharacters - this.paddingLeft(ordername, 2).length - 2 - printBillDate.length,
        14,
      ) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    if (kot.OrderItems.length > 0) {
      command += '\u001B' + 'a' + '\u0001' + `ADDED ITEMS` + '\u000A'
      // command +=
      //   '\u001B' +
      //   'a' +
      //   '\u0000' +
      //   this.paddingLeft('ITEMS', 2) +
      //   // this.paddingLeft('QTY', 36) +
      //   this.paddingLeft('', 36) +
      //   '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

      kot.OrderItems.forEach(itm => {
        command += this.getItemCommandfbcake(itm, numberOfCharacters, '+')

        if (itm.Options) {
          var options = ' '

          itm.Options.forEach(x => {
            options += x.Name
            console.log('OPTIONS:', options)
          })
          command += '\u001B' + 'a' + '\u0000' + this.paddingLeft(options, 2) + '\u000A'
        }

        if (itm.Message)
          command +=
            '\u001B' +
            'a' +
            '\u0000' +
            this.paddingLeft(' Msg: ' + itm.Message, 2) +
            '\n' +
            '\u000A'
      })

      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Order Instructions ::: ' + 'Delivery time - ' + OrderedDateTime, 2) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    // if (kot.removed.length > 0) {
    //   command += '\u001B' + 'a' + '\u0001' + `REMOVED ITEMS` + '\n' + '\u000A'
    //   command +=
    //     '\u001B' +
    //     'a' +
    //     '\u0000' +
    //     this.paddingLeft('ITEM', 2) +
    //     this.paddingLeft('QTY', 36) +
    //     '\u000A'
    //   command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    //   kot.removed.forEach(itm => {
    //     command += this.getItemCommand(itm, numberOfCharacters, '')
    //     if (itm.Note)
    //       command +=
    //         '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.Note, 2) + '\u000A'
    //   })
    //   command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    // }

    // if (orderMessage) {
    //   command +=
    //     '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + orderMessage, 2) + '\u000A'
    //   command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    // }

    command += '\u001B' + 'a' + '\u0001' + `Order Tickets By Powered By Biz1Book. :)` + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }

  //FBFUNCTIONS
  getKotFBcakesCommands2(kot, ordername, orderMessage, numberOfCharacters, receiptPrinter) {
    let printBillDate = moment(new Date(kot.BillDateTime)).format('MMM D, YYYY hh:mm A')
    let InvoiceNo = kot.Id
    let highestItemQty = this.getHighestItemQty(kot.OrderItems)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + `#${InvoiceNo.split('/')[1]}` + '\n' + '\u000A'
    command += '\u001B' + 'a' + '\u0001' + `ORDER TICKET #${InvoiceNo}` + '\n' + '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft(ordername, 2) +
      this.paddingLeft(
        printBillDate,
        numberOfCharacters - this.paddingLeft(ordername, 2).length - 2 - printBillDate.length,
      ) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    if (kot.OrderItems.length > 0) {
      command += '\u001B' + 'a' + '\u0001' + `ADDED ITEMS` + '\n' + '\u000A'
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('ITEM', 2) +
        this.paddingLeft('QTY', 36) +
        '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

      kot.OrderItems.forEach(itm => {
        command += this.getItemCommand(itm, numberOfCharacters, '+')

        command +=
          '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.Note, 2) + '\u000A'

        // if (itm.Options)
        //   command +=
        //     '\u001B' + 'a' + '\u0000' + this.paddingLeft('Options: ' + itm.Options[0].Name, 2) + '\u000A'

        if (itm.Note)
          command +=
            '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.Note, 2) + '\u000A'
      })
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }

    // if (kot.removed.length > 0) {
    //   command += '\u001B' + 'a' + '\u0001' + `REMOVED ITEMS` + '\n' + '\u000A'
    //   command +=
    //     '\u001B' +
    //     'a' +
    //     '\u0000' +
    //     this.paddingLeft('ITEM', 2) +
    //     this.paddingLeft('QTY', 36) +
    //     '\u000A'
    //   command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    //   kot.removed.forEach(itm => {
    //     command += this.getItemCommand(itm, numberOfCharacters, '')
    //     if (itm.Note)
    //       command +=
    //         '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + itm.Note, 2) + '\u000A'
    //   })
    //   command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    // }
    if (orderMessage) {
      command +=
        '\u001B' + 'a' + '\u0000' + this.paddingLeft('Message: ' + orderMessage, 2) + '\u000A'
      command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    }
    command += '\u001B' + 'a' + '\u0001' + `Order Tickets By Biz1Book.com` + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }

  //FBFUNCTIONS
  getItemCommandfbcake(item, numberOfCharacters, qty_prf) {
    let command = ''
    let qty_text = ''
    if (item.CategoryId == 48) {
      qty_text = ' (' + item.Quantity + ' Qty)'
    } else {
      qty_text = ' (' + item.Quantity + ' Kg)'
    }
    // let qty_text = ' ('+item.Quantity + " Qty/Kg)"
    let name = '* ' + item.Name + qty_text

    let cutindex = numberOfCharacters - 4 - 8

    if (name.length > cutindex) {
      console.log('larger name')
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(0, cutindex), 2) +
        this.paddingLeft(
          qty_text,
          numberOfCharacters -
            qty_text.length -
            this.paddingLeft(name.slice(0, cutindex), 2).length -
            2,
        ) +
        '\u000A'
      command += this.getRemainingName(name.slice(cutindex, name.length), numberOfCharacters)
    } else {
      console.log('fit name')
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name, 2) +
        this.paddingLeft(
          '',
          // qty_text,
          // numberOfCharacters - 10 - qty_text.length - this.paddingLeft(name, 2).length,
          numberOfCharacters - 0,
        ) +
        '\u000A'
    }
    return command
  }
}
