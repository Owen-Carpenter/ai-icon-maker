import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  avatar?: string;
  avatarBg?: string;
  avatarImage?: string;
  companyLogo?: string;
  isCompany?: boolean;
}

const topRowTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: "Just typed 'shopping cart icon' and got 3 perfect variations in seconds. The PNG downloads are crystal clear and the transparent backgrounds work perfectly in my app!",
    name: "David Chen",
    title: "Mobile App Developer",
    avatarImage: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: '2',
    quote: "The improvement feature is insane! I generated an icon, asked it to 'make it blue', and it kept the same design but changed just the color. Exactly what I needed.",
    name: "TechFlow Studios",
    title: "Design Agency",
    isCompany: true,
    companyLogo: "/logos/logoipsum-280.svg"
  },
  {
    id: '3',
    quote: "GPT Image 1 quality is no joke. Generated a logo icon for my startup in 3 different styles, picked one, refined it twice, and now it's our official brand icon!",
    name: "Mike Rodriguez",
    title: "Startup Founder",
    avatarImage: "https://i.pravatar.cc/150?img=33"
  },
  {
    id: '4',
    quote: "The library feature saves me so much time. I generate icons for client projects, save them, and can access them later. No more hunting through folders!",
    name: "Jenna Williams",
    title: "Freelance Designer",
    avatarImage: "https://i.pravatar.cc/150?img=45"
  },
  {
    id: '5',
    quote: "I love how I can iterate on icons just by chatting. 'Make it rounder', 'add more detail', 'make it minimalist' - it understands everything and the results are professional.",
    name: "Ryan Parker",
    title: "Product Designer",
    avatarImage: "https://i.pravatar.cc/150?img=15"
  }
];

const bottomRowTestimonials: Testimonial[] = [
  {
    id: '6',
    quote: "Needed icons for 12 different app features. Described each one, got multiple options, saved my favorites to the library. Entire icon set done in under an hour. 🤯",
    name: "Alex Martinez",
    title: "App Developer",
    avatarImage: "https://i.pravatar.cc/150?img=68"
  },
  {
    id: '7',
    quote: "The style options are perfect. I can generate the same icon in modern, flat, 3D, and minimalist styles instantly. Client presentations have never looked better!",
    name: "Pixel Labs",
    title: "Creative Studio",
    isCompany: true,
    companyLogo: "/logos/logoipsum-339.svg"
  },
  {
    id: '8',
    quote: "Best part? The AI reasoning before generation. It explains its design choices, then creates exactly what I envisioned. It's like having a designer that reads your mind.",
    name: "Lisa Thompson",
    title: "Senior Product Designer",
    avatarImage: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: '9',
    quote: "PNG exports with transparent backgrounds saved me countless hours. No more manual background removal or dealing with file conversions. Just download and use!",
    name: "Velocity Design Co.",
    title: "Design Consultancy",
    isCompany: true,
    companyLogo: "/logos/logoipsum-405.svg"
  },
  {
    id: '10',
    quote: "I can create, iterate, and refine icons all through natural conversation. It's the most intuitive design tool I've ever used. My team is obsessed with it.",
    name: "Tom Anderson",
    title: "Creative Director",
    avatarImage: "https://i.pravatar.cc/150?img=59"
  }
];

export default function TestimonialCarousel() {
  return (
    <div className="space-y-8 overflow-hidden">
      {/* Top Row - Moving Right to Left */}
      <div className="relative">
        <div className="flex animate-scroll-rtl hover:animate-pause">
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0">
            {topRowTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
          
          {/* Duplicate for seamless loop */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {topRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate`} {...testimonial} />
            ))}
          </div>
          
          {/* Additional duplicate for better mobile experience */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {topRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate2`} {...testimonial} />
            ))}
          </div>
          
          {/* Fourth duplicate for ultra-smooth mobile experience */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {topRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate3`} {...testimonial} />
            ))}
          </div>
          
          {/* Fifth duplicate for mobile 400% distance */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {topRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate4`} {...testimonial} />
            ))}
          </div>
          
          {/* Sixth duplicate for mobile 400% distance */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {topRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate5`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Moving Left to Right */}
      <div className="relative">
        <div className="flex animate-scroll-ltr hover:animate-pause">
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0">
            {bottomRowTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
          
          {/* Duplicate for seamless loop */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {bottomRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate`} {...testimonial} />
            ))}
          </div>
          
          {/* Additional duplicate for better mobile experience */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {bottomRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate2`} {...testimonial} />
            ))}
          </div>
          
          {/* Fourth duplicate for ultra-smooth mobile experience */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {bottomRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate3`} {...testimonial} />
            ))}
          </div>
          
          {/* Fifth duplicate for mobile 400% distance */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {bottomRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate4`} {...testimonial} />
            ))}
          </div>
          
          {/* Sixth duplicate for mobile 400% distance */}
          <div className="flex space-x-2 sm:space-x-3 lg:space-x-6 shrink-0 ml-2 sm:ml-3 lg:ml-6">
            {bottomRowTestimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate5`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 