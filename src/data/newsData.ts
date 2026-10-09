import { Article, EPaperEdition, Advertisement, BloggerImportItem, MagazineConfig } from '../types';
import {
  SAMPLE_EPAPER_PDF_BASE64,
  SAMPLE_BUSINESS_PDF_BASE64,
  SAMPLE_POLICY_BRIEF_PDF_BASE64
} from './samplePdfs';

export {
  SAMPLE_EPAPER_PDF_BASE64,
  SAMPLE_BUSINESS_PDF_BASE64,
  SAMPLE_POLICY_BRIEF_PDF_BASE64
};

export const DEFAULT_MAGAZINE_CONFIG: MagazineConfig = {
  publicationName: 'The Hind Canadian Times',
  tagline: 'An Independent Voice for the Global Diaspora',
  motto: 'Truth · Heritage · Community Progress',
  establishedYear: 2024,
  editionLocation: 'Toronto · Vancouver · Ottawa · U.K. · Chandigarh',
  theme: 'broadsheet',
  fontMode: 'editorial_serif',
  showBreakingTicker: true,
  showLeaderboardAd: true,
  showSidebarAd: true,
  showInFeedAd: true,
  ePaperEnabled: true,
  videoDeskEnabled: true,
  bloggerTransferEnabled: true,
  contactEmail: 'thehindcanadiantimes@gmail.com',
  editorialPhone: '',
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Ottawa & New Delhi Advance Bilateral Trade Dialogues: $10B Agricultural and Tech Corridor Targeted',
    hindiTitle: 'ओटावा और नई दिल्ली के बीच द्विपक्षीय व्यापार वार्ता में नई प्रगति: $10 अरब के समझौते का लक्ष्य',
    subtitle: 'High-level ministerial consultations in Ottawa pave the pathway for enhanced pulse crop protocols, renewable clean energy, and artificial intelligence talent exchange.',
    category: 'Canada',
    author: 'Harpreet Singh Dhillon',
    authorRole: 'Senior Parliamentary Correspondent, Ottawa',
    location: 'Ottawa, ON',
    publishedAt: 'October 07, 2026 · 09:30 AM EST',
    readTime: '4 min read',
    summary: 'Federal ministers from Canada and representatives from India’s Ministry of Commerce have concluded round four of bilateral partnership negotiations, signaling major breakthroughs for Canadian agri-exporters and Indian tech talent.',
    content: `OTTAWA — In a pivotal diplomatic breakthrough on Parliament Hill, federal officials and visiting delegates from New Delhi have concluded a four-day intensive bilateral symposium, charting a clear roadmap towards a Comprehensive Economic Partnership Agreement by early 2027.

The central pillar of the talks focuses on agricultural continuity, specifically long-term import tariffs for Canadian yellow peas, lentils, and potash, providing certainty to Saskatchewan and Alberta farming families who supply over 40% of India’s pulse imports.

Simultaneously, the Canadian Ministry of Innovation, Science and Economic Development signed a memorandum of cooperation with India’s Department of Telecommunications, creating a fast-track corridor for doctoral researchers in quantum computing and renewable grid integration.

"Our commercial bonds are not merely transactions between capitals; they are anchored in the living ties of nearly two million Indo-Canadians whose enterprise fuels both our economies," stated the Minister for International Trade during an address to community business leaders.

The negotiations also addressed reciprocal visa processing speedups for business delegations, corporate intra-company transfers, and student post-graduation career opportunities.`,
    imageUrl: '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
    imageCaption: 'Parliament Hill during the bilateral ministerial delegation meetings with community stakeholders in Ottawa.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Watch: Parliamentary Press Conference on Canada-India Economic Corridor',
    pdfUrl: SAMPLE_POLICY_BRIEF_PDF_BASE64,
    pdfTitle: 'Official Joint Communiqué & Trade Corridor Policy Brief (PDF · 2.4 MB)',
    isLeadStory: true,
    isBreaking: true,
    isTrending: true,
    views: 14820,
    likes: 842,
    commentsCount: 39,
    source: 'Editorial Staff',
  },
  {
    id: 'art-2',
    title: 'Indo-Canadian Entrepreneurship Boom: Toronto-Waterloo Tech Corridor Attracts Record Venture Capital',
    hindiTitle: 'टोरंटो-वाटरलू टेक कॉरिडोर में भारतीय मूल के उद्यमियों का ऐतिहासिक निवेश',
    subtitle: 'From AI healthcare diagnostics to cross-border remittances, diaspora founders secure over $380M in Series A and B tranches this fiscal quarter.',
    category: 'Business',
    author: 'Pooja K. Sharma',
    authorRole: 'Financial & Markets Editor, Toronto',
    location: 'Toronto, ON',
    publishedAt: 'October 06, 2026 · 02:15 PM EST',
    readTime: '5 min read',
    summary: 'A new study released by the Indo-Canada Chamber of Commerce indicates that first and second-generation entrepreneurs from the diaspora now command over 18% of early-stage software startups in Ontario.',
    content: `TORONTO — The skyline of downtown Toronto and the research clusters surrounding the University of Waterloo are witnessing an unprecedented wave of diaspora-led commercial innovation.

Over the past nine months, twenty-two venture-backed tech enterprises founded by Indo-Canadian technologists have closed funding rounds exceeding $380 million collectively. Key sectors driving the momentum include predictive clinical algorithms, agricultural robotics, and next-generation logistics platforms connecting North American ports with South Asian suppliers.

"Many of us began with small consultancies twenty years ago," reflected Vikram Malhotra, Managing Partner at MapleVentures. "Today, our teams are competing globally on foundational AI patents and sustainable battery chemistry."

The provincial government also announced matched funding grants for diaspora incubator programs designed to mentor newly arrived international graduate students into venture-ready founders.`,
    imageUrl: '/src/assets/images/indo_canadian_business_tech_1791385503706.jpg',
    imageCaption: 'Indo-Canadian tech founders and investors during the quarterly Innovation Roundtable in Toronto’s financial core.',
    pdfUrl: SAMPLE_POLICY_BRIEF_PDF_BASE64,
    pdfTitle: 'Venture Capital & Diaspora Startups Q3 Economic Whitepaper (PDF · 1.8 MB)',
    isTrending: true,
    views: 9410,
    likes: 512,
    commentsCount: 22,
    source: 'Editorial Staff',
  },
  {
    id: 'art-3',
    title: 'Immigration Ministry Clarifies Category-Based Express Entry Priorities for Healthcare & Trades',
    hindiTitle: 'इमिग्रेशन कनाडा: हेल्थकेयर और तकनीकी ट्रेड पेशेवरों के लिए नई एक्सप्रेस एंट्री घोषणा',
    subtitle: 'Targeted invitation rounds to prioritize internationally educated nurses, geriatric specialists, and civil engineering technicians.',
    category: 'Immigration',
    author: 'Rajinder M. Gill, Barrister & Solicitor',
    authorRole: 'Immigration Legal Columnist, Vancouver',
    location: 'Vancouver, BC',
    publishedAt: 'October 05, 2026 · 11:45 AM PST',
    readTime: '6 min read',
    summary: 'Immigration, Refugees and Citizenship Canada (IRCC) has updated Comprehensive Ranking System (CRS) modifiers and credential recognition programs, easing the bridging process for foreign healthcare workers.',
    content: `VANCOUVER — In a policy update awaited by tens of thousands of skilled applicants, the federal immigration department has announced its updated allocations for category-based Express Entry draws throughout the remainder of 2026.

Healthcare remains the single highest priority sector, accounting for approximately 28% of all targeted invitations. Specifically, internationally educated registered nurses (RNs), physicians holding recognized postgraduate credentials, and medical laboratory technologists will benefit from lowered cut-off score thresholds.

Crucially, the ministry has introduced a $45 million federal grant distributed to provincial licensing colleges in British Columbia, Ontario, and Alberta to accelerate prior learning assessments, reducing foreign credential verification timelines from fourteen months to under ninety days.

"For years, qualified doctors and nurses from India have been underemployed in survival jobs while Canadian hospitals face staffing bottlenecks," noted legal analyst Rajinder Gill. "This framework directly addresses that tragic disparity."`,
    pdfUrl: SAMPLE_POLICY_BRIEF_PDF_BASE64,
    pdfTitle: 'IRCC Gazette Notice: Express Entry Category Rules 2026-27 (Official PDF)',
    isTrending: true,
    views: 18450,
    likes: 1240,
    commentsCount: 78,
    source: 'Editorial Staff',
  },
  {
    id: 'art-4',
    title: 'Vancouver Heritage Conclave Celebrates 125 Years of Pioneer Indo-Canadian Resilience',
    hindiTitle: 'वैंकूवर हेरिटेज सम्मेलन: इंडो-कैनेडियन प्रवासियों के 125 वर्षों के इतिहास का भव्य उत्सव',
    subtitle: 'From historic logging mills of Vancouver Island to municipal legislatures, archival exhibition unearths letters, historic photos, and community oral histories.',
    category: 'Arts & Culture',
    author: 'Sunita Rao-Bains',
    authorRole: 'Arts & Heritage Curator',
    location: 'Vancouver, BC',
    publishedAt: 'October 04, 2026 · 04:30 PM PST',
    readTime: '4 min read',
    summary: 'A landmark cultural retrospective at the Vancouver Museum documents the struggles and triumphs of early settlers from Punjab and Gujarat arriving in British Columbia at the turn of the 20th century.',
    content: `VANCOUVER — Thousands of community elders, students, and municipal leaders gathered this weekend for the inaugural opening of "Roots in Cedar & Snow: 125 Years of Indo-Canadian Journey."

Curated over three years using declassified provincial archives and family heirlooms, the exhibition presents rare audio recordings of mill workers who persevered through discrimination in 1907 to establish North America's first permanent Sikh temples and community mutual-aid societies.

"Our grandfathers worked fourteen-hour shifts in freezing rain so that we could become doctors, cabinet ministers, poets, and judges," remarked keynote speaker Justice Amarjit Sandhu during the ribbon-cutting ceremony.

The festival also unveiled an interactive digital oral history vault where community members can record interviews with family matriarchs and patriarchs.`,
    imageUrl: '/src/assets/images/cultural_festival_diaspora_1791385525786.jpg',
    imageCaption: 'Community families and cultural performers during the Vancouver Heritage Jubilee celebrations.',
    views: 6300,
    likes: 410,
    commentsCount: 15,
    source: 'Editorial Staff',
  },
  {
    id: 'art-5',
    title: 'Editorial: Preserving Diaspora Languages in a Digital World: The Case for Hindi & Punjabi in Public Schools',
    hindiTitle: 'संपादकीय: डिजिटल युग में मातृभाषा का संरक्षण - कैनेडियन स्कूलों में हिंदी और पंजाबी की आवश्यकता',
    subtitle: 'Why multilingual education strengthens civic cohesion rather than fragmenting national identity.',
    category: 'Opinion & Editorial',
    author: 'Prof. Devendra Nath Verma',
    authorRole: 'Professor Emeritus of Comparative Literature',
    location: 'Calgary, AB',
    publishedAt: 'October 03, 2026 · 08:00 AM MST',
    readTime: '5 min read',
    summary: 'Language is not merely a communicative tool, but an entire emotional architecture that preserves generational ethics, poetry, and shared memory.',
    content: `CALGARY — When a child forgets the language of their grandparents, they do not merely lose vocabulary; they lose access to an entire archive of proverbs, songs of solace, and ancestral wisdom that English, for all its global utility, cannot quite translate.

Across school districts in the Greater Toronto Area and Surrey, over 300,000 children speak Hindi, Punjabi, Gujarati, Tamil, or Bengali at home. Yet, in our public elementary curricula, mother-tongue heritage electives remain relegated to Saturday morning community basements.

Research from cognitive neuroscience demonstrates that dual-language immersion fosters superior executive function, empathy, and mathematical problem-solving. It is time for provincial education ministries to formally integrate South Asian classical and modern languages into standard curriculum credit schemes.`,
    views: 5210,
    likes: 388,
    commentsCount: 44,
    source: 'Editorial Staff',
  },
  {
    id: 'art-6',
    title: 'Indo-Canadian Cricket & Kabaddi Super-League Final Sets Broadcast Records Across North America',
    hindiTitle: 'इंडो-कैनेडियन क्रिकेट और कबड्डी सुपर-लीग का ऐतिहासिक फाइनल: लाखों दर्शकों ने देखा',
    subtitle: 'Brampton Sports Complex hosts capacity crowd of 22,000 as Toronto Royals edge Surrey Strikers in super-over thriller.',
    category: 'Sports',
    author: 'Manavpreet Bawa',
    authorRole: 'Sports Correspondent, Brampton',
    location: 'Brampton, ON',
    publishedAt: 'October 02, 2026 · 06:15 PM EST',
    readTime: '3 min read',
    summary: 'The burgeoning popularity of domestic cricket and circle-style kabaddi in Canada has caught the attention of major national sports broadcasters, drawing lucrative sponsorship deals.',
    content: `BRAMPTON — Under floodlights and an electric festival atmosphere, the Toronto Royals captured the 2026 Maple Cup Championship in dramatic fashion on Sunday evening.

With eight runs required off the final two deliveries, twenty-two-year-old all-rounder Rohan Grover struck a towering six over mid-wicket before sprinting a double on the final ball, triggering wild celebrations among the 22,000 spectators in attendance.

The telecast was carried live on domestic cable and streamed to over 450,000 concurrent viewers across Canada, the United States, and the United Kingdom, marking a milestone in the mainstreaming of diaspora athletics in Canadian sporting culture.`,
    views: 7920,
    likes: 670,
    commentsCount: 31,
    source: 'Editorial Staff',
  },
];

export const INITIAL_EPAPER_EDITIONS: EPaperEdition[] = [
  {
    id: 'epaper-vol26-issue14',
    title: 'The Hind Canadian Times — Broadsheet Weekly Edition',
    volumeIssue: 'Vol. XXVI Issue 14 (Spring Broadsheet Edition)',
    date: 'Wednesday, October 07, 2026',
    coverImageUrl: '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
    pdfUrl: SAMPLE_EPAPER_PDF_BASE64,
    pdfDataUrl: SAMPLE_EPAPER_PDF_BASE64,
    pdfFileName: 'the-hind-canadian-times-vol26-issue14.pdf',
    totalPages: 4,
    fileSize: '12.4 MB (Full Print PDF)',
    downloadsCount: 1420,
    pages: [
      {
        pageNumber: 1,
        title: 'Page 1 — Front Page / National Broadsheet',
        headline: 'OTTAWA & NEW DELHI REACH $10B TRADE CORRIDOR PACT',
        summary: 'Lead Story: Historic bilateral agreements on pulses, AI research, and consular expansion. Immigration reform headlines and market summary.',
        previewImageUrl: '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
      },
      {
        pageNumber: 2,
        title: 'Page 2 — Canada Affairs & Immigration Dispatch',
        headline: 'IRCC UPDATES HEALTHCARE & STEM CATEGORY CRITERIA',
        summary: 'Full policy breakdown of CRS scores, foreign credential fast-tracking, provincial nominee quotas, and student work rights.',
        previewImageUrl: '/src/assets/images/cultural_festival_diaspora_1791385525786.jpg',
      },
      {
        pageNumber: 3,
        title: 'Page 3 — Business, Commerce & Real Estate Monitor',
        headline: 'DIASPORA TECH VENTURE ROUNDS SURPASS $380M IN Q3',
        summary: 'Interviews with Toronto and Waterloo startup pioneers, mortgage rates analysis, commercial real estate outlook in GTA & Metro Vancouver.',
        previewImageUrl: '/src/assets/images/indo_canadian_business_tech_1791385503706.jpg',
      },
      {
        pageNumber: 4,
        title: 'Page 4 — Community, Culture, Classifieds & Editorial',
        headline: 'VANCOUVER HERITAGE JUBILEE & DIASPORA WRITERS SALON',
        summary: 'Literary essays, community matrimony & legal notices, classifieds directory, weekend poetry corner, and sports tournament recaps.',
        previewImageUrl: '/src/assets/images/cultural_festival_diaspora_1791385525786.jpg',
      },
    ],
  },
  {
    id: 'epaper-vol26-issue13',
    title: 'The Hind Canadian Times — Special Autumn Business Edition',
    volumeIssue: 'Vol. XXVI Issue 13 (Financial Focus)',
    date: 'Wednesday, September 30, 2026',
    coverImageUrl: '/src/assets/images/indo_canadian_business_tech_1791385503706.jpg',
    pdfUrl: SAMPLE_BUSINESS_PDF_BASE64,
    pdfDataUrl: SAMPLE_BUSINESS_PDF_BASE64,
    pdfFileName: 'the-hind-canadian-times-vol26-issue13-business.pdf',
    totalPages: 4,
    fileSize: '11.8 MB (Print PDF)',
    downloadsCount: 1980,
    pages: [
      {
        pageNumber: 1,
        title: 'Page 1 — Financial Lead & Housing Markets',
        headline: 'BANK OF CANADA RATE CUT TRIGGERS HOUSING SURGE',
        summary: 'Mortgage trends across Peel and Surrey, commercial banking reports, and Indo-Canadian trade chamber analysis.',
      },
      {
        pageNumber: 2,
        title: 'Page 2 — Tech & Innovation Showcase',
        headline: 'CROSS-BORDER FINTECH CORRIDORS REDUCE REMITTANCE FEES',
        summary: 'How UPI and Interac integration tests in Canada are revolutionizing personal remittances.',
      },
      {
        pageNumber: 3,
        title: 'Page 3 — Community Health & Senior Care',
        headline: 'DIASPORA VOLUNTEERS OPEN MULTILINGUAL CLINICS',
        summary: 'Doctors in Calgary and Edmonton establish free geriatric screening and mental health helplines.',
      },
      {
        pageNumber: 4,
        title: 'Page 4 — Entertainment & Community Calendar',
        headline: 'DIWALI AT THE LEGISLATURE: OTTAWA & VICTORIA CELEBRATE',
        summary: 'Schedules of major cultural celebrations, theatrical performances, and musical concerts.',
      },
    ],
  },
];

export const INITIAL_ADS: Advertisement[] = [
  {
    id: 'ad-leaderboard-1',
    slot: 'leaderboard',
    format: 'jpg',
    mediaUrl: '',
    advertiser: 'Maple Leaf Cross-Border Wealth Advisory',
    headline: 'Preserving Generational Prosperity Across Canada & India',
    subtext: 'Specialized estate planning, NRI investments, and tax optimization by certified chartered fiduciaries in Toronto & Vancouver.',
    ctaText: 'Schedule Complimentary Consultation',
    targetUrl: '#advertise',
    isActive: true,
  },
  {
    id: 'ad-sidebar-1',
    slot: 'sidebar_mpu',
    format: 'gif',
    mediaUrl: '',
    advertiser: 'Namaste Global Travel & Non-Stop Flights',
    headline: 'Direct Air Canada & Air India Flights to Delhi & Mumbai',
    subtext: 'Book early for winter holidays. 2 Complimentary 23kg check-in bags + flexible cancellation options.',
    ctaText: 'Check Fares & Book Online',
    targetUrl: '#advertise',
    isActive: true,
  },
  {
    id: 'ad-infeed-1',
    slot: 'in_feed',
    format: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    advertiser: 'Royal Grand Banquet & Convention Pavilions',
    headline: 'Luxury Weddings & Corporate Galas in Brampton & Surrey',
    subtext: 'Now accepting bookings for 2026-27 gala seasons. Capacity up to 1,200 guests with award-winning culinary catering.',
    ctaText: 'Take Virtual Hall Tour',
    targetUrl: '#advertise',
    isActive: true,
  },
  {
    id: 'ad-footer-1',
    slot: 'super_footer',
    format: 'jpg',
    mediaUrl: '',
    advertiser: 'Indo-Canada Chamber of Commerce (ICCC)',
    headline: 'Join Canada’s Premier Bilateral Business Network',
    subtext: 'Over 4,000 corporate members, bi-weekly B2B networking dinners, and direct trade missions to New Delhi, Mumbai, and Bengaluru.',
    ctaText: 'Apply for Corporate Membership',
    targetUrl: '#advertise',
    isActive: true,
  },
];

export const SAMPLE_BLOGGER_POSTS: BloggerImportItem[] = [
  {
    id: 'archive-1',
    title: 'Surrey Community Health Initiative Launches Free Saturday Senior Clinic',
    snippet: 'A team of volunteer doctors and nurses from Fraser Health have come together to offer bilingual medical consultations for grandparents in the Punjabi and Hindi speaking community.',
    author: 'Special Correspondent: Harinder Johal',
    publishedDate: 'October 04, 2026',
    originalUrl: 'https://thehindcanadiantimes.com/archives/2026/10/free-senior-clinic-surrey.html',
    category: 'Diaspora & Community',
    tags: ['Surrey', 'Healthcare', 'Seniors', 'Community Welfare'],
    contentHtml: `<p>A volunteer consortium of eleven physicians and healthcare professionals has launched a weekend walk-in health assessment center at the Strawberry Hill Community Hall in Surrey.</p>
<p>The program aims to eliminate linguistic barriers for senior citizens who struggle to communicate complex medical symptoms in English. Consultations will cover diabetes management, blood pressure monitoring, and mental health resources.</p>
<p>"Often our elderly parents hesitate to visit emergency rooms until an illness becomes critical because of language apprehension," said Dr. Gurpreet Gill, program director. "This clinic provides warmth, dignity, and immediate medical clarity in their mother tongue."</p>`,
  },
  {
    id: 'archive-2',
    title: 'Five Critical Tax Errors Indo-Canadian Tech Founders Make When Incorporating in Ontario',
    snippet: 'Certified Public Accountant Rajesh Tandon outlines the essential cross-border IP holding structures and SR&ED tax credits that young startup owners frequently overlook.',
    author: 'Contributing Analyst: Rajesh Tandon, CPA',
    publishedDate: 'October 02, 2026',
    originalUrl: 'https://thehindcanadiantimes.com/archives/2026/10/tech-founders-tax-mistakes.html',
    category: 'Business',
    tags: ['Taxes', 'Startups', 'CPA', 'Ontario Business'],
    contentHtml: `<p>When incorporating an early-stage software venture in Canada, diaspora founders often rush through corporate structuring without consulting cross-border tax specialists. Here are the five most frequent pitfalls:</p>
<ol>
<li><strong>Failing to File for SR&ED Early:</strong> Scientific Research and Experimental Development credits can return up to 35% of eligible R&D expenditures in refundable cash.</li>
<li><strong>Misallocating Intellectual Property:</strong> Holding IP in personal names rather than within the corporate umbrella creates severe capital gains liabilities.</li>
<li><strong>Ignoring Withholding Tax on South Asian Contractor Payments:</strong> CRA Section 105 withholding rules require strict compliance when paying offshore development teams.</li>
</ol>`,
  },
  {
    id: 'archive-3',
    title: 'Simon Fraser University Establishes South Asian Heritage & Diaspora Archive Chair',
    snippet: 'With a generous $3.5M endowment from local philanthropists, SFU Library will catalog over 100,000 rare historical documents, family photographs, and pioneer correspondence.',
    author: 'Cultural Desk: Anjali Merchant',
    publishedDate: 'September 28, 2026',
    originalUrl: 'https://thehindcanadiantimes.com/archives/2026/09/sfu-diaspora-archive-chair.html',
    category: 'Arts & Culture',
    tags: ['SFU', 'Heritage', 'History', 'Archives'],
    contentHtml: `<p>Simon Fraser University has formally announced the establishment of the permanent Chair in South Asian Diaspora Heritage at its Burnaby campus.</p>
<p>The archive will digitize pioneer settlement records from 1900 to 1980, creating an openly accessible academic portal for researchers, school teachers, and genealogists worldwide.</p>`,
  },
];
