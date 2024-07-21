export interface Deal {
    id: string;
    properties: {
      dealname: string;
      amount: string;
      closedate: string;
      dealstage: string;
    };
  }
  
  export interface RFQ {
    dealId: string;
    dealName: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    salesperson: string;
    accountNumber: string;
    manager: string;
    rfqDate: string;
    quoteDate: string;
    customParts: CustomPart[];
  }
  
  export interface CustomPart {
    quantity: number;
    customerPartNumber: string;
    abbottPartNumber: string;
    partDescription: string;
    pricePerThousand: number;
    estimatedAnnualUsage: number;
    specialRequirements: string;
    previousPurchaseOrderDate: string;
    supplier: string;
    costQuantityTargetPrice: number;
    isNewPart: boolean;
  }
  
  export interface AssociatedContact {
    name: string;
    phone: string;
    email: string;
  }