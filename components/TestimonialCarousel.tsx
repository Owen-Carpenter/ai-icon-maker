import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  avatar: string;
  avatarBg: string;
}

const topRowTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: "Wow, this is absolutely incredible – huge props to the @ai_icon_maker team for bringing these amazing AI superpowers to more designers and developers!",
    name: "@designerdave",
    title: "Co-founder & CEO @designstudio",
    avatar: "D",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '2',
    quote: "Finally an AI tool that I will ACTUALLY include as part of my workflow. I love how seamless it is from start to finish.",
    name: "@sarahcreates",
    title: "Designer & Creative developer",
    avatar: "S",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '3',
    quote: "This is pure magic. ✨ → Icons in seconds → Perfect styles in minutes → Full icon sets with AI → @ai_icon_maker saving the day for designers!",
    name: "@mikepixel",
    title: "Designer & Content Creator",
    avatar: "M",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '4',
    quote: "The AI understands exactly what I need! Creating icon sets has never been this fast and consistent. Absolutely game-changing for my design process.",
    name: "@jenna_ui",
    title: "UI/UX Designer @techstartup",
    avatar: "J",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '5',
    quote: "As a freelancer, this tool has literally 10x'd my productivity. I can deliver icon sets to clients in hours instead of days. Mind-blowing quality!",
    name: "@ryan_freelance",
    title: "Freelance Designer",
    avatar: "R",
    avatarBg: "bg-[#ff7e5f]"
  }
];

const bottomRowTestimonials: Testimonial[] = [
  {
    id: '6',
    quote: "Very excited for @ai_icon_maker's new AI-powered icon generator. I love the messaging and positioning 'to empower you, not replace you'. Strategic language to get even skeptical designers to jump in.",
    name: "@alexbrand",
    title: "Designer",
    avatar: "A",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '7',
    quote: "Yooooooooo, this is 🔥 @ai_icon_maker has been one of my favorite tools I've seen evolve in the design space. They're carving out a tremendous groove that designers and developers can vibe in.",
    name: "@kyle_dev",
    title: "Designer & Developer",
    avatar: "K",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '8',
    quote: "This is the most exciting AI design product I've seen – great work AI Icon Maker team!!! Looks especially powerful for serious designers looking to build icons at scale.",
    name: "@lisadesigns",
    title: "Senior Product Designer",
    avatar: "L",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '9',
    quote: "I've tried every icon tool out there, and this is hands down the best. The AI suggestions are spot-on and save me hours of iteration time.",
    name: "@emma_designs",
    title: "Product Designer @startup",
    avatar: "E",
    avatarBg: "bg-[#ff7e5f]"
  },
  {
    id: '10',
    quote: "Our entire design team switched to AI Icon Maker last month. The consistency across projects is incredible, and clients love the quality!",
    name: "@tomcreative",
    title: "Creative Director @agency",
    avatar: "T",
    avatarBg: "bg-[#ff7e5f]"
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
        </div>
      </div>
    </div>
  );
} 