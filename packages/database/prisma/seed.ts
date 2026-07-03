import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.testimonial.deleteMany();
  await prisma.industryExpert.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.savedPost.deleteMany();
  await prisma.feedPost.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.hotelMember.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database...\n");

  const pw = await bcrypt.hash("admin123", 12);
  const mpw = await bcrypt.hash("member123", 12);

  // ─── ADMIN ───
  const admin = await prisma.user.create({
    data: { email: "admin@hospitalitynetwork.in", passwordHash: pw, role: "ADMIN", membershipStatus: "APPROVED", firstName: "Admin", lastName: "User", title: "Platform Administrator", organizationName: "Hospitality Network", city: "Mumbai", state: "Maharashtra", bio: "Platform administrator managing India's premier hospitality network.", approvedAt: new Date() },
  });
  console.log(`Admin: ${admin.email}`);

  // ─── APPROVED MEMBERS (20) ───
  const memberData = [
    { email: "rajesh@sharmahotels.com", firstName: "Rajesh", lastName: "Sharma", memberType: "HOTEL_OWNER" as const, title: "Managing Director", organizationName: "Sharma Hotels Group", city: "Mumbai", state: "Maharashtra", bio: "Leading a portfolio of 12 luxury and mid-scale hotels across Western India. 25 years in hospitality.", achievements: "Hospitality Leader of the Year 2024, FHRAI Award for Excellence", industryContributions: "Mentored 50+ young hoteliers, Speaker at 30+ industry events", businessOverview: "Sharma Hotels Group operates 12 properties across Mumbai, Pune, Goa, and Rajasthan with 1,800+ rooms." },
    { email: "sunita@heritagehaveli.com", firstName: "Sunita", lastName: "Reddy", memberType: "HOTEL_OWNER" as const, title: "Founder & CEO", organizationName: "Heritage Haveli Hotels", city: "Jaipur", state: "Rajasthan", bio: "Converting heritage havelis into boutique luxury stays. Passionate about preserving Rajasthani architecture.", achievements: "UNESCO Heritage Conservation Award 2023", businessOverview: "Heritage Haveli Hotels operates 6 boutique properties across Rajasthan." },
    { email: "meera@joshiresorts.com", firstName: "Meera", lastName: "Joshi", memberType: "HOTEL_OWNER" as const, title: "Director", organizationName: "Joshi Resort Chain", city: "Goa", state: "Goa", bio: "Managing beach resorts and eco-tourism properties in Goa and Karnataka.", businessOverview: "Joshi Resort Chain runs 4 premium beach resorts." },
    { email: "rohit@grandpalace.com", firstName: "Rohit", lastName: "Malhotra", memberType: "HOTEL_OWNER" as const, title: "Chairman", organizationName: "Grand Palace Hotels", city: "Delhi", state: "Delhi", bio: "Third-generation hotelier running luxury palace hotels in North India.", achievements: "Asia's Top 50 Hotels 2025 — Grand Palace Udaipur", businessOverview: "Grand Palace Hotels manages 8 luxury properties." },
    { email: "arun@techhotel.com", firstName: "Arun", lastName: "Kumar", memberType: "VENDOR" as const, title: "CEO", organizationName: "TechHotel Solutions", city: "Bengaluru", state: "Karnataka", bio: "Building AI-powered PMS and revenue management systems for Indian hotels.", businessOverview: "TechHotel Solutions serves 200+ hotel clients across India with cloud PMS." },
    { email: "deepa@nairdesign.com", firstName: "Deepa", lastName: "Nair", memberType: "VENDOR" as const, title: "Principal Architect", organizationName: "Nair Design Studio", city: "Kochi", state: "Kerala", bio: "Award-winning hospitality architecture and interior design firm.", achievements: "AD India Design Award 2024", businessOverview: "Nair Design Studio has completed 50+ hotel projects." },
    { email: "vikram@singhgroup.com", firstName: "Vikram", lastName: "Singh", memberType: "VENDOR" as const, title: "Director", organizationName: "Singh HVAC Systems", city: "Gurgaon", state: "Haryana", bio: "Providing energy-efficient HVAC solutions for hotels and resorts.", businessOverview: "Singh HVAC serves 150+ hotels across North India." },
    { email: "neha@procureplus.com", firstName: "Neha", lastName: "Gupta", memberType: "VENDOR" as const, title: "CEO", organizationName: "ProcurePlus India", city: "Mumbai", state: "Maharashtra", bio: "Hospitality procurement and supply chain management platform.", businessOverview: "ProcurePlus handles procurement for 300+ hotels." },
    { email: "saurabh@securehotels.com", firstName: "Saurabh", lastName: "Jain", memberType: "VENDOR" as const, title: "Founder", organizationName: "SecureHotels", city: "Pune", state: "Maharashtra", bio: "Hotel security systems, CCTV, and access control solutions.", businessOverview: "SecureHotels protects 100+ properties pan-India." },
    { email: "pooja@hotelintel.com", firstName: "Pooja", lastName: "Desai", memberType: "VENDOR" as const, title: "Managing Director", organizationName: "HotelIntel Marketing", city: "Mumbai", state: "Maharashtra", bio: "Digital marketing and OTA management agency for hotels.", businessOverview: "HotelIntel manages digital presence for 250+ hotel clients." },
    { email: "ankit@tajhotels.com", firstName: "Ankit", lastName: "Patel", memberType: "PROFESSIONAL" as const, title: "VP Operations", organizationName: "Taj Hotels", city: "Ahmedabad", state: "Gujarat", bio: "Operations leader at Taj Hotels overseeing 8 properties in Western India.", achievements: "Hotelier India 40 Under 40, 2024", businessOverview: "Responsible for operational excellence across Taj Hotels' western region." },
    { email: "arjun@itchotels.com", firstName: "Arjun", lastName: "Kapoor", memberType: "PROFESSIONAL" as const, title: "IT Head", organizationName: "ITC Hotels", city: "Kolkata", state: "West Bengal", bio: "Driving digital transformation at ITC Hotels — from contactless check-in to AI chatbots.", businessOverview: "Leading technology strategy for ITC Hotels' 100+ properties." },
    { email: "kavita@marriott.com", firstName: "Kavita", lastName: "Iyer", memberType: "PROFESSIONAL" as const, title: "Revenue Manager", organizationName: "Marriott International", city: "Chennai", state: "Tamil Nadu", bio: "Revenue optimization specialist at Marriott — data-driven pricing and yield management.", businessOverview: "Managing revenue for Marriott's South India portfolio." },
    { email: "ravi@oberoi.com", firstName: "Ravi", lastName: "Menon", memberType: "PROFESSIONAL" as const, title: "F&B Director", organizationName: "Oberoi Hotels", city: "Mumbai", state: "Maharashtra", bio: "Culinary operations leader with focus on farm-to-table and sustainable dining.", achievements: "World's Best F&B Program — Oberoi Mumbai, 2025" },
    { email: "priya@meridian.com", firstName: "Priya", lastName: "Mehta", memberType: "CONSULTANT" as const, title: "Partner", organizationName: "Meridian Consulting", city: "Delhi", state: "Delhi", bio: "Hospitality strategy consultant advising hotel groups on expansion and operations.", achievements: "Featured in Forbes India 30 Under 30", businessOverview: "Meridian Consulting has advised on 50+ hotel projects worth ₹2000 Cr." },
    { email: "sameer@hospitalityadvisors.com", firstName: "Sameer", lastName: "Rao", memberType: "CONSULTANT" as const, title: "Managing Partner", organizationName: "Hospitality Advisors India", city: "Bengaluru", state: "Karnataka", bio: "Hotel valuation, feasibility studies, and market analysis for hospitality investors.", businessOverview: "Completed 200+ feasibility studies across India." },
    { email: "nisha@hotelhub.com", firstName: "Nisha", lastName: "Verma", memberType: "PROFESSIONAL" as const, title: "HR Director", organizationName: "Lemon Tree Hotels", city: "Gurgaon", state: "Haryana", bio: "Building hospitality talent pipelines and employee engagement programs.", achievements: "Great Place to Work Certified — Lemon Tree Hotels" },
    { email: "amit@hotelinvest.com", firstName: "Amit", lastName: "Agarwal", memberType: "HOTEL_OWNER" as const, title: "CEO", organizationName: "Hotel Investment Corp", city: "Hyderabad", state: "Telangana", bio: "Hotel acquisition and asset management across South India.", businessOverview: "HIC manages a portfolio of 15 hotel assets worth ₹500 Cr." },
    { email: "divya@greenstay.com", firstName: "Divya", lastName: "Krishnan", memberType: "VENDOR" as const, title: "Founder", organizationName: "GreenStay Solutions", city: "Chennai", state: "Tamil Nadu", bio: "Sustainable hospitality consulting — energy audits, waste management, green certifications.", businessOverview: "GreenStay has helped 80+ hotels achieve green certifications." },
    { email: "karan@luxeinteriors.com", firstName: "Karan", lastName: "Bhatia", memberType: "VENDOR" as const, title: "Creative Director", organizationName: "Luxe Interiors", city: "Jaipur", state: "Rajasthan", bio: "Luxury hotel interior design with a focus on Indian heritage aesthetics.", achievements: "Elle Decor Award for Best Hospitality Project 2024", businessOverview: "Luxe Interiors has designed 30+ luxury hotel projects." },
  ];

  const createdMembers: any[] = [];
  for (const m of memberData) {
    const user = await prisma.user.create({
      data: { email: m.email, passwordHash: mpw, role: "MEMBER", membershipStatus: "APPROVED", profileStatus: "APPROVED", memberType: m.memberType, firstName: m.firstName, lastName: m.lastName, title: m.title, organizationName: m.organizationName, city: m.city, state: m.state, country: "India", bio: m.bio, achievements: m.achievements, industryContributions: m.industryContributions, businessOverview: m.businessOverview, approvedAt: new Date(Date.now() - Math.random() * 90 * 86400000), profileCompletedAt: new Date(Date.now() - Math.random() * 90 * 86400000) },
    });
    createdMembers.push(user);
  }
  console.log(`${createdMembers.length} approved members created`);

  // ─── PENDING MEMBERS (3) ───
  const pendingData = [
    { email: "pending1@test.com", firstName: "Aman", lastName: "Saxena", memberType: "HOTEL_OWNER" as const, title: "General Manager", organizationName: "Saxena Hospitality", city: "Lucknow", state: "Uttar Pradesh" },
    { email: "pending2@test.com", firstName: "Ritika", lastName: "Bhatt", memberType: "VENDOR" as const, title: "Founder", organizationName: "Bhatt IT Services", city: "Indore", state: "Madhya Pradesh" },
    { email: "pending3@test.com", firstName: "Gaurav", lastName: "Sinha", memberType: "PROFESSIONAL" as const, title: "Operations Manager", organizationName: "Radisson Hotels", city: "Chandigarh", state: "Punjab" },
  ];
  for (const p of pendingData) {
    await prisma.user.create({
      data: { email: p.email, passwordHash: mpw, role: "MEMBER", membershipStatus: "PENDING", memberType: p.memberType, firstName: p.firstName, lastName: p.lastName, title: p.title, organizationName: p.organizationName, city: p.city, state: p.state, country: "India" },
    });
  }
  console.log(`${pendingData.length} pending members created`);

  // ─── VENDOR PROFILES (8) ───
  const vendorUsers = createdMembers.filter((m) => m.memberType === "VENDOR");
  const vendorCategories: Array<"TECHNOLOGY" | "ARCHITECTURE" | "INTERIOR_DESIGN" | "HVAC" | "PROCUREMENT" | "SECURITY" | "MARKETING" | "CONSULTING"> = ["TECHNOLOGY", "ARCHITECTURE", "INTERIOR_DESIGN", "HVAC", "PROCUREMENT", "SECURITY", "MARKETING", "CONSULTING"];
  const vendorDetails = [
    { companyName: "TechHotel Solutions", category: "TECHNOLOGY" as const, description: "AI-powered PMS, revenue management, and guest experience platforms for Indian hotels.", services: ["Cloud PMS", "Revenue Management", "Guest App", "Channel Manager"], city: "Bengaluru", state: "Karnataka", employeeCount: "50-100", yearEstablished: 2018, isFeatured: true },
    { companyName: "Nair Design Studio", category: "ARCHITECTURE" as const, description: "Award-winning hospitality architecture firm specializing in boutique and heritage hotels.", services: ["Hotel Architecture", "Landscape Design", "Renovation Planning", "3D Visualization"], city: "Kochi", state: "Kerala", employeeCount: "20-50", yearEstablished: 2012, isFeatured: true },
    { companyName: "Singh HVAC Systems", category: "HVAC" as const, description: "Energy-efficient HVAC solutions, installation, and maintenance for hotels and resorts.", services: ["Central AC", "VRV Systems", "BMS Integration", "Energy Audits"], city: "Gurgaon", state: "Haryana", employeeCount: "100-200", yearEstablished: 2008, isFeatured: true },
    { companyName: "ProcurePlus India", category: "PROCUREMENT" as const, description: "End-to-end hospitality procurement platform — furniture, linen, amenities, kitchen equipment.", services: ["Furniture", "Linen & Uniforms", "Guest Amenities", "Kitchen Equipment"], city: "Mumbai", state: "Maharashtra", employeeCount: "50-100", yearEstablished: 2016, isFeatured: true },
    { companyName: "SecureHotels", category: "SECURITY" as const, description: "Comprehensive hotel security solutions — CCTV, access control, fire safety systems.", services: ["CCTV Systems", "Access Control", "Fire Safety", "Security Audits"], city: "Pune", state: "Maharashtra", employeeCount: "20-50", yearEstablished: 2015, isFeatured: false },
    { companyName: "HotelIntel Marketing", category: "MARKETING" as const, description: "Full-service digital marketing and OTA management agency for hospitality brands.", services: ["SEO & SEM", "OTA Management", "Social Media", "Brand Strategy"], city: "Mumbai", state: "Maharashtra", employeeCount: "20-50", yearEstablished: 2017, isFeatured: true },
    { companyName: "GreenStay Solutions", category: "CONSULTING" as const, description: "Sustainable hospitality consulting — energy audits, waste management, LEED certifications.", services: ["Energy Audits", "Waste Management", "LEED Certification", "Carbon Footprint"], city: "Chennai", state: "Tamil Nadu", employeeCount: "10-20", yearEstablished: 2019, isFeatured: false },
    { companyName: "Luxe Interiors", category: "INTERIOR_DESIGN" as const, description: "Luxury hotel interior design with a focus on Indian heritage aesthetics and modern comfort.", services: ["Interior Design", "FF&E Procurement", "Art Curation", "Lighting Design"], city: "Jaipur", state: "Rajasthan", employeeCount: "20-50", yearEstablished: 2014, isFeatured: true },
  ];

  for (let i = 0; i < vendorUsers.length && i < vendorDetails.length; i++) {
    const v = vendorDetails[i];
    await prisma.vendorProfile.create({
      data: { ...v, slug: v.companyName.toLowerCase().replace(/\s+/g, "-"), userId: vendorUsers[i].id, displayOrder: i + 1 },
    });
  }
  console.log(`${Math.min(vendorUsers.length, vendorDetails.length)} vendor profiles created`);

  // ─── INDUSTRY EXPERTS (10) ───
  const expertCandidates = createdMembers.filter((m) => ["PROFESSIONAL", "CONSULTANT", "HOTEL_OWNER"].includes(m.memberType));
  const expertData = [
    { expertise: ["Revenue Management", "Pricing Strategy", "Data Analytics"], bio: "Leading revenue optimization strategies across 100+ hotel properties in India.", isFeatured: true },
    { expertise: ["Hotel Operations", "Guest Experience", "Staff Training"], bio: "25+ years transforming hotel operations with a focus on service excellence.", isFeatured: true },
    { expertise: ["Digital Transformation", "Hotel Technology", "AI/ML"], bio: "Driving technology adoption in hospitality — from AI chatbots to smart rooms.", isFeatured: true },
    { expertise: ["F&B Management", "Culinary Operations", "Sustainability"], bio: "Pioneering sustainable dining programs and farm-to-table experiences.", isFeatured: true },
    { expertise: ["Hotel Strategy", "Market Analysis", "Feasibility Studies"], bio: "Advised on 200+ hotel projects worth over ₹5,000 Cr across India.", isFeatured: true },
    { expertise: ["Heritage Conservation", "Boutique Hotels", "Eco-Tourism"], bio: "Preserving India's architectural heritage through thoughtful hotel conversions.", isFeatured: true },
    { expertise: ["HR & Talent", "Employee Engagement", "Leadership Development"], bio: "Building hospitality talent pipelines and leadership development programs.", isFeatured: false },
    { expertise: ["Hotel Investment", "Asset Management", "Portfolio Strategy"], bio: "Managing hotel real estate portfolios with focus on value maximization.", isFeatured: false },
    { expertise: ["Sustainability", "Green Certification", "Energy Efficiency"], bio: "Helping hotels achieve LEED and GRIHA certifications for sustainable operations.", isFeatured: false },
    { expertise: ["Digital Marketing", "Brand Building", "OTA Strategy"], bio: "Scaling hotel brands through data-driven digital marketing strategies.", isFeatured: false },
  ];

  for (let i = 0; i < expertCandidates.length && i < expertData.length; i++) {
    await prisma.industryExpert.create({
      data: { ...expertData[i], userId: expertCandidates[i].id, displayOrder: i + 1 },
    });
  }
  console.log(`${Math.min(expertCandidates.length, expertData.length)} industry experts created`);

  // ─── HOTELS (5) ───
  const hotelOwners = createdMembers.filter((m) => m.memberType === "HOTEL_OWNER");
  const hotelData = [
    { name: "The Grand Sharma", slug: "the-grand-sharma", description: "A luxury 5-star hotel in the heart of Mumbai offering world-class hospitality.", city: "Mumbai", state: "Maharashtra", rooms: 220, starRating: 5, propertyType: "Luxury", isVerified: true },
    { name: "Heritage Haveli Jaipur", slug: "heritage-haveli-jaipur", description: "A 200-year-old haveli converted into a boutique heritage hotel with 24 keys.", city: "Jaipur", state: "Rajasthan", rooms: 24, starRating: 4, propertyType: "Heritage", isVerified: true },
    { name: "Joshi Beach Resort", slug: "joshi-beach-resort", description: "Premium beach resort with ocean views, infinity pool, and spa.", city: "Calangute", state: "Goa", rooms: 80, starRating: 4, propertyType: "Resort", isVerified: true },
    { name: "Grand Palace Udaipur", slug: "grand-palace-udaipur", description: "Lakeside palace hotel offering regal hospitality with heritage charm.", city: "Udaipur", state: "Rajasthan", rooms: 65, starRating: 5, propertyType: "Palace", isVerified: true },
    { name: "HIC Business Suites Hyderabad", slug: "hic-business-suites-hyd", description: "Modern business hotel catering to corporate travelers in IT corridor.", city: "Hyderabad", state: "Telangana", rooms: 150, starRating: 4, propertyType: "Business", isVerified: true },
  ];

  for (let i = 0; i < hotelOwners.length && i < hotelData.length; i++) {
    await prisma.hotel.create({
      data: { ...hotelData[i], ownerId: hotelOwners[i].id },
    });
  }
  console.log(`${Math.min(hotelOwners.length, hotelData.length)} hotels created`);

  // ─── EVENTS (6) ───
  const events = [
    { title: "India Hospitality Investment Summit 2026", slug: "india-hospitality-summit-2026", type: "SUMMIT" as const, description: "India's largest gathering of hospitality investors, hotel owners, and industry leaders discussing the future of Indian hospitality.", venue: "Taj Mahal Palace", city: "Mumbai", state: "Maharashtra", startDate: new Date("2026-07-15"), endDate: new Date("2026-07-16"), maxAttendees: 500, isFeatured: true, isPublished: true, displayOrder: 1 },
    { title: "Hospitality Technology & Innovation Forum", slug: "hospitality-tech-forum-2026", type: "CONFERENCE" as const, description: "Exploring the latest in hospitality technology — AI-powered revenue management, contactless check-in, smart room controls.", venue: "BIEC", city: "Bengaluru", state: "Karnataka", startDate: new Date("2026-08-22"), endDate: new Date("2026-08-23"), maxAttendees: 300, isFeatured: true, isPublished: true, displayOrder: 2 },
    { title: "Hotel Owners Networking Dinner", slug: "owners-networking-dinner-2026", type: "NETWORKING" as const, description: "An exclusive evening for hotel owners to connect, share experiences, and explore collaboration.", venue: "The Imperial", city: "New Delhi", state: "Delhi", startDate: new Date("2026-09-05"), endDate: new Date("2026-09-05"), maxAttendees: 100, isFeatured: true, isPublished: true, displayOrder: 3 },
    { title: "Sustainable Hospitality Workshop", slug: "sustainable-hospitality-2026", type: "CONFERENCE" as const, description: "Hands-on workshop on implementing sustainable practices — energy efficiency, waste reduction, green certifications.", venue: "Rambagh Palace", city: "Jaipur", state: "Rajasthan", startDate: new Date("2026-10-18"), endDate: new Date("2026-10-19"), maxAttendees: 150, isFeatured: true, isPublished: true, displayOrder: 4 },
    { title: "Hospitality Vendor Expo 2026", slug: "vendor-expo-2026", type: "SUMMIT" as const, description: "Meet 200+ hospitality vendors and service providers under one roof. Product demos, networking, and deals.", venue: "Chennai Trade Centre", city: "Chennai", state: "Tamil Nadu", startDate: new Date("2026-11-10"), endDate: new Date("2026-11-12"), maxAttendees: 1000, isFeatured: true, isPublished: true, displayOrder: 5 },
    { title: "Revenue Management Masterclass", slug: "revenue-masterclass-2026", type: "WEBINAR" as const, description: "Online masterclass on advanced revenue management techniques for Indian hotel operators.", venue: "Online", city: "Virtual", state: "Pan India", startDate: new Date("2026-12-01"), endDate: new Date("2026-12-01"), maxAttendees: 500, isFeatured: false, isPublished: true, displayOrder: 6 },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }
  console.log(`${events.length} events created`);

  // ─── TESTIMONIALS (10) ───
  const testimonials = [
    { content: "The Hospitality Network has transformed how we connect with vendors and industry peers. An invaluable platform for hotel owners looking to grow their business.", authorName: "Rajesh Sharma", authorTitle: "Managing Director", authorCompany: "Sharma Hotels Group", isFeatured: true, isPublished: true, displayOrder: 1 },
    { content: "As a technology vendor, this platform has given us direct access to hotel decision-makers. Our client base has grown 40% since joining the network.", authorName: "Arun Kumar", authorTitle: "CEO", authorCompany: "TechHotel Solutions", isFeatured: true, isPublished: true, displayOrder: 2 },
    { content: "The curated membership ensures you're connecting with serious hospitality professionals. Quality over quantity — exactly what our industry needs.", authorName: "Ankit Patel", authorTitle: "VP Operations", authorCompany: "Taj Hotels", isFeatured: true, isPublished: true, displayOrder: 3 },
    { content: "From sourcing HVAC contractors to finding technology partners, the vendor marketplace has saved us countless hours of research and due diligence.", authorName: "Sunita Reddy", authorTitle: "Founder & CEO", authorCompany: "Heritage Haveli Hotels", isFeatured: true, isPublished: true, displayOrder: 4 },
    { content: "The industry feed keeps me updated on real developments — not press releases, but genuine insights from practitioners who are on the ground.", authorName: "Priya Mehta", authorTitle: "Partner", authorCompany: "Meridian Consulting", isFeatured: true, isPublished: true, displayOrder: 5 },
    { content: "Finally, a platform that understands the unique challenges of Indian hospitality. The vendor discovery alone is worth the membership.", authorName: "Meera Joshi", authorTitle: "Director", authorCompany: "Joshi Resort Chain", isFeatured: true, isPublished: true, displayOrder: 6 },
    { content: "The events and networking opportunities have led to three new partnerships for our HVAC business this year alone. Highly recommend.", authorName: "Vikram Singh", authorTitle: "Director", authorCompany: "Singh HVAC Systems", isFeatured: true, isPublished: true, displayOrder: 7 },
    { content: "As a revenue manager, having access to industry insights and connecting with peers across hotel chains has been incredibly valuable for benchmarking.", authorName: "Kavita Iyer", authorTitle: "Revenue Manager", authorCompany: "Marriott International", isFeatured: true, isPublished: true, displayOrder: 8 },
    { content: "The network helped us find the right architecture firm for our heritage conversion project. The verified vendor profiles save so much time.", authorName: "Rohit Malhotra", authorTitle: "Chairman", authorCompany: "Grand Palace Hotels", isFeatured: true, isPublished: true, displayOrder: 9 },
    { content: "I've been part of many hospitality associations, but this network stands out with its focus on real business outcomes and verified connections.", authorName: "Sameer Rao", authorTitle: "Managing Partner", authorCompany: "Hospitality Advisors India", isFeatured: true, isPublished: true, displayOrder: 10 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`${testimonials.length} testimonials created`);

  // ─── FEED POSTS (12) ───
  const posts = [
    { authorIdx: 0, type: "HOTEL_UPDATE" as const, content: "Excited to announce the grand opening of our 120-room luxury property in Jaipur. Three years of careful planning and execution. Grateful to our entire team and partners who made this vision a reality. #NewOpening #LuxuryHotel" },
    { authorIdx: 4, type: "TECHNOLOGY_IMPLEMENTATION" as const, content: "Just launched our AI-powered revenue management system designed specifically for Indian hospitality. Early results show 23% average RevPAR improvement across our client portfolio of 85 hotels. Happy to offer a free audit to Network members." },
    { authorIdx: 10, type: "INDUSTRY_INSIGHT" as const, content: "The biggest operational challenge for Indian hotels in 2026 isn't technology adoption — it's finding and retaining skilled talent. We need to rethink our approach to hospitality education and career pathways. What's your take?" },
    { authorIdx: 1, type: "BUSINESS_ANNOUNCEMENT" as const, content: "Completed the restoration of a 200-year-old haveli in Jodhpur. Converting it into a 24-key heritage hotel. Preserving architecture while adding modern amenities is a delicate balance, but the result is stunning. Opening in August!" },
    { authorIdx: 5, type: "HOSPITALITY_INNOVATION" as const, content: "Just completed biophilic interior design for a 60-room wellness resort in Kerala. Living walls, natural materials, water features throughout. The integration of nature into every design element creates a truly transformative guest experience." },
    { authorIdx: 14, type: "INDUSTRY_INSIGHT" as const, content: "Tier-2 cities are the next frontier for Indian hospitality. Our analysis shows 35% higher RevPAR growth in cities like Indore, Kochi, and Coimbatore compared to saturated metro markets. The opportunity is massive." },
    { authorIdx: 13, type: "HOSPITALITY_INNOVATION" as const, content: "Pioneering a farm-to-table program at Oberoi Mumbai. We've partnered with 12 local farms within 100km radius. Guests can trace every ingredient to its source. Sustainability meets luxury dining." },
    { authorIdx: 11, type: "TECHNOLOGY_IMPLEMENTATION" as const, content: "Rolled out contactless check-in across all ITC Hotels properties. QR-based room access, digital concierge, and AI chatbot for guest requests. Guest satisfaction scores up 18% post-implementation." },
    { authorIdx: 3, type: "BUSINESS_ANNOUNCEMENT" as const, content: "Grand Palace Hotels is expanding to Goa and Kerala. Two new luxury properties opening in 2027. Looking for experienced operations partners and F&B consultants. DM if interested." },
    { authorIdx: 15, type: "INDUSTRY_INSIGHT" as const, content: "Completed 200th feasibility study this month. Key finding: mid-scale branded hotels in tier-2 cities now show better IRR than luxury properties in metros. The market is shifting fundamentally." },
    { authorIdx: 7, type: "BUSINESS_ANNOUNCEMENT" as const, content: "ProcurePlus launches bulk purchasing program for Network members. Pool your procurement with other hotels to get 15-25% better pricing on linens, amenities, and kitchen equipment. Minimum 3 properties to participate." },
    { authorIdx: 12, type: "EVENT_UPDATE" as const, content: "Looking forward to the India Hospitality Investment Summit in Mumbai next month. Will be on the panel discussing revenue management in post-pandemic India. Who else is attending? Let's connect!" },
  ];

  for (const p of posts) {
    await prisma.feedPost.create({
      data: { type: p.type, content: p.content, authorId: createdMembers[p.authorIdx].id, isPublic: true },
    });
  }
  console.log(`${posts.length} feed posts created`);

  // ─── MARK SOME USERS AS FEATURED ───
  for (let i = 0; i < Math.min(6, vendorUsers.length); i++) {
    await prisma.user.update({ where: { id: vendorUsers[i].id }, data: { isFeaturedVendor: true } });
  }
  for (let i = 0; i < Math.min(5, expertCandidates.length); i++) {
    await prisma.user.update({ where: { id: expertCandidates[i].id }, data: { isFeaturedExpert: true } });
  }
  console.log("Featured users marked");

  console.log("\n=== Seed completed successfully! ===\n");
  console.log("--- Login Credentials ---");
  console.log("Admin:   admin@hospitalitynetwork.in / admin123");
  console.log("Member:  rajesh@sharmahotels.com / member123");
  console.log("Pending: pending1@test.com / member123");
  console.log("\nAll members use password: member123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
