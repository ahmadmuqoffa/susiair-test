import { Injectable } from '@nestjs/common';
import { diffInDays } from '../common/date.util';
import { DataService } from '../data/data.service';

export type DocumentStatus = 'safe' | 'soon' | 'expired';

@Injectable()
export class DocumentsService {
  constructor(private readonly data: DataService) {}

  getDocuments() {
    const { thresholds, documents } = this.data.documents;

    return documents.map((doc) => {
      const daysRemaining = diffInDays(this.data.today, doc.expiryDate);
      let status: DocumentStatus = 'safe';
      if (daysRemaining <= 0) status = 'expired';
      else if (daysRemaining <= thresholds.warningDays) status = 'soon';

      return { ...doc, daysRemaining, status };
    });
  }
}