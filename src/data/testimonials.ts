export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  image?: string;
  featured?: boolean;
}

// TODO: Replace placeholder testimonials with verified client testimonials after approval.
export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Client testimonial coming soon. Real client experiences will be added here.",
    name: "Client Name Placeholder",
    role: "Client / Family",
    location: "Location Placeholder",
    featured: true
  },
  {
    id: "2",
    quote: "Client testimonial coming soon. Real client experiences will be added here.",
    name: "Client Name Placeholder",
    role: "Client / Family",
    location: "Location Placeholder",
    featured: true
  },
  {
    id: "3",
    quote: "Client testimonial coming soon. Real client experiences will be added here.",
    name: "Client Name Placeholder",
    role: "Client / Family",
    location: "Location Placeholder",
    featured: true
  }
];
