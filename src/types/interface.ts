export interface Program {
    id: string | number; // Change the type here to allow both string and number
    group: string;
    content: string;
    start: Date;
    end: Date;
    type: "range";
    imageUrl?: string;
    description?: string;
  }

  export interface Channel {
    id: string;
    content: string;
    logo?: string;
  }