import { Purchase } from './../models/user.model';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private productService = inject(ProductService);
  exportProductsToPdf(products: Product[]): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Product List', 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [['Name', 'Category', 'Price', 'Rating', 'Added on']],
      body: products.map((p) => [
        p.name,
        p.category,
        `$${p.price.toFixed(2)}`,
        p.averageRating ? p.averageRating.toFixed(1) : '-',
        new Date(p.createdAt).toLocaleDateString(),
      ]),
    });

    doc.save('products.pdf');
  }

  exportPurchasesToPdf(purchases: Purchase[]): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Purchases List', 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [['ID', 'Products', 'Total', 'Date']],
      body: purchases.map((purchase) => [
        purchase.id,
        purchase.items
          .map((item) => `${this.productService.getNameById(item.productId)} x${item.quantity}`)
          .join(', '),
        `$${purchase.total.toFixed(2)}`,
        new Date(purchase.date).toLocaleDateString(),
      ]),
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [59, 130, 246],
      },
    });

    doc.save('purchases.pdf');
  }

  exportPurchaseToPdf(purchase: Purchase): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Purchase #${purchase.id}`, 14, 15);

    doc.setFontSize(10);
    doc.text(`Date: ${new Date(purchase.date).toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['Product', 'Price', 'Quantity', 'Subtotal']],
      body: purchase.items.map((item) => {
        const price = this.productService.getPriceById(item.productId);
        return [
          this.productService.getNameById(item.productId),
          `$${price.toFixed(2)}`,
          item.quantity,
          `$${(price * item.quantity).toFixed(2)}`,
        ];
      }),
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [59, 130, 246],
      },
    });

    doc.text(`Total: $${purchase.total.toFixed(2)}`, 14, (doc as any).lastAutoTable.finalY + 10);

    doc.save(`purchase-${purchase.id}.pdf`);
  }
}
