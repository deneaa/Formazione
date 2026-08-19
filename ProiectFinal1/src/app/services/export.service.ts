import { Injectable } from '@angular/core';
import { Product } from '../models';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
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
}
