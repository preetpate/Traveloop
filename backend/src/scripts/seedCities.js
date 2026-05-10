/**
 * Seed script: populates the cities collection with 20+ sample cities.
 * Run with: node src/scripts/seedCities.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const City = require('../models/City');

const cities = [
  {
    name: 'Paris',
    country: 'France',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'The City of Light — famous for romance, fashion, art, and the iconic Eiffel Tower.',
    tags: ['romantic', 'fashion', 'luxury', 'art', 'history'],
    activities: [
      { name: 'Visit the Eiffel Tower', category: 'Sightseeing', description: 'Iconic iron lattice tower on the Champ de Mars.', imageUrl: '' },
      { name: 'Louvre Museum', category: 'Culture', description: 'World\'s largest art museum and home of the Mona Lisa.', imageUrl: '' },
      { name: 'Seine River Cruise', category: 'Sightseeing', description: 'Scenic boat tour along the Seine.', imageUrl: '' },
    ],
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    description: 'A dazzling blend of ultramodern and traditional — from neon-lit skyscrapers to historic temples.',
    tags: ['anime', 'technology', 'food', 'culture', 'shopping'],
    activities: [
      { name: 'Shibuya Crossing', category: 'Sightseeing', description: 'The world\'s busiest pedestrian crossing.', imageUrl: '' },
      { name: 'Tsukiji Outer Market', category: 'Food & Drink', description: 'Fresh sushi and street food paradise.', imageUrl: '' },
      { name: 'Senso-ji Temple', category: 'Culture', description: 'Tokyo\'s oldest and most significant Buddhist temple.', imageUrl: '' },
    ],
  },
  {
    name: 'Dubai',
    country: 'UAE',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    description: 'A futuristic city of superlatives — tallest buildings, largest malls, and desert adventures.',
    tags: ['luxury', 'shopping', 'desert', 'modern', 'architecture'],
    activities: [
      { name: 'Burj Khalifa Observation Deck', category: 'Sightseeing', description: 'Views from the world\'s tallest building.', imageUrl: '' },
      { name: 'Desert Safari', category: 'Adventure', description: 'Dune bashing, camel rides, and Bedouin dinner.', imageUrl: '' },
      { name: 'Dubai Mall', category: 'Shopping', description: 'One of the world\'s largest shopping centres.', imageUrl: '' },
    ],
  },
  {
    name: 'New York',
    country: 'USA',
    coverImage: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2',
    description: 'The city that never sleeps — a global hub of finance, culture, and entertainment.',
    tags: ['business', 'nightlife', 'food', 'culture', 'shopping'],
    activities: [
      { name: 'Times Square', category: 'Sightseeing', description: 'The neon heart of Manhattan.', imageUrl: '' },
      { name: 'Central Park', category: 'Sightseeing', description: 'Iconic urban park perfect for walks and picnics.', imageUrl: '' },
      { name: 'Broadway Show', category: 'Culture', description: 'World-class theatre in the Theater District.', imageUrl: '' },
    ],
  },
  {
    name: 'London',
    country: 'United Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    description: 'A historic city with world-class museums, royal palaces, and a vibrant multicultural scene.',
    tags: ['history', 'royal', 'culture', 'museums', 'food'],
    activities: [
      { name: 'Tower of London', category: 'Culture', description: 'Historic castle and home of the Crown Jewels.', imageUrl: '' },
      { name: 'London Eye', category: 'Sightseeing', description: 'Giant Ferris wheel with panoramic city views.', imageUrl: '' },
      { name: 'British Museum', category: 'Culture', description: 'World history in one extraordinary place.', imageUrl: '' },
    ],
  },
  {
    name: 'Rome',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1525874684015-c929b0a5f1a5',
    description: 'The Eternal City — ancient ruins, Renaissance art, and world-famous cuisine.',
    tags: ['history', 'food', 'architecture', 'art', 'romantic'],
    activities: [
      { name: 'Colosseum', category: 'Sightseeing', description: 'Ancient amphitheatre and symbol of Imperial Rome.', imageUrl: '' },
      { name: 'Trevi Fountain', category: 'Sightseeing', description: 'Baroque masterpiece — toss a coin for good luck.', imageUrl: '' },
      { name: 'Vatican Museums', category: 'Culture', description: 'Home to the Sistine Chapel and St. Peter\'s Basilica.', imageUrl: '' },
    ],
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd',
    description: 'A clean, green, and futuristic island city-state with incredible food and architecture.',
    tags: ['modern', 'shopping', 'food', 'clean', 'architecture'],
    activities: [
      { name: 'Gardens by the Bay', category: 'Sightseeing', description: 'Futuristic nature park with Supertree Grove.', imageUrl: '' },
      { name: 'Hawker Centre Food Tour', category: 'Food & Drink', description: 'Sample Singapore\'s legendary street food.', imageUrl: '' },
      { name: 'Sentosa Island', category: 'Adventure', description: 'Beach resort island with Universal Studios.', imageUrl: '' },
    ],
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365',
    description: 'A vibrant city of street food, ornate temples, and legendary nightlife.',
    tags: ['food', 'budget', 'nightlife', 'temples', 'shopping'],
    activities: [
      { name: 'Grand Palace', category: 'Culture', description: 'Stunning complex of royal buildings and temples.', imageUrl: '' },
      { name: 'Floating Market', category: 'Sightseeing', description: 'Traditional market on the canals of Bangkok.', imageUrl: '' },
      { name: 'Khao San Road', category: 'Food & Drink', description: 'Backpacker hub with street food and nightlife.', imageUrl: '' },
    ],
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    description: 'Island of the Gods — lush rice terraces, volcanic mountains, and spiritual temples.',
    tags: ['beach', 'nature', 'honeymoon', 'spiritual', 'surfing'],
    activities: [
      { name: 'Ubud Monkey Forest', category: 'Sightseeing', description: 'Sacred forest sanctuary with hundreds of monkeys.', imageUrl: '' },
      { name: 'Tanah Lot Temple', category: 'Culture', description: 'Iconic sea temple perched on a rocky outcrop.', imageUrl: '' },
      { name: 'Seminyak Beach', category: 'Adventure', description: 'Surf, sunbathe, and enjoy beach clubs.', imageUrl: '' },
    ],
  },
  {
    name: 'Sydney',
    country: 'Australia',
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
    description: 'A harbour city with world-famous beaches, the Opera House, and a laid-back lifestyle.',
    tags: ['beach', 'nature', 'city', 'harbour', 'outdoor'],
    activities: [
      { name: 'Sydney Opera House', category: 'Culture', description: 'Iconic performing arts venue on the harbour.', imageUrl: '' },
      { name: 'Bondi Beach', category: 'Adventure', description: 'Australia\'s most famous beach for surfing and swimming.', imageUrl: '' },
      { name: 'Harbour Bridge Climb', category: 'Adventure', description: 'Climb the iconic bridge for panoramic views.', imageUrl: '' },
    ],
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    description: 'Gaudí\'s architectural masterpieces, golden beaches, and a world-class food scene.',
    tags: ['football', 'art', 'beach', 'architecture', 'food'],
    activities: [
      { name: 'Sagrada Família', category: 'Sightseeing', description: 'Gaudí\'s unfinished basilica — a UNESCO World Heritage Site.', imageUrl: '' },
      { name: 'Park Güell', category: 'Sightseeing', description: 'Colourful mosaic park with city views.', imageUrl: '' },
      { name: 'La Boqueria Market', category: 'Food & Drink', description: 'Vibrant market with fresh produce and tapas.', imageUrl: '' },
    ],
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200',
    description: 'Where East meets West — a city of mosques, bazaars, and Bosphorus sunsets.',
    tags: ['culture', 'history', 'food', 'bazaar', 'architecture'],
    activities: [
      { name: 'Hagia Sophia', category: 'Culture', description: 'Byzantine cathedral turned mosque — a world wonder.', imageUrl: '' },
      { name: 'Grand Bazaar', category: 'Shopping', description: 'One of the world\'s oldest and largest covered markets.', imageUrl: '' },
      { name: 'Bosphorus Cruise', category: 'Sightseeing', description: 'Scenic cruise between Europe and Asia.', imageUrl: '' },
    ],
  },
  {
    name: 'Goa',
    country: 'India',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
    description: 'India\'s beach paradise — golden sands, Portuguese heritage, and vibrant nightlife.',
    tags: ['beach', 'party', 'budget', 'heritage', 'seafood'],
    activities: [
      { name: 'Baga Beach', category: 'Adventure', description: 'Popular beach with water sports and beach shacks.', imageUrl: '' },
      { name: 'Fort Aguada', category: 'Sightseeing', description: '17th-century Portuguese fort with lighthouse.', imageUrl: '' },
      { name: 'Dudhsagar Waterfalls', category: 'Adventure', description: 'Spectacular four-tiered waterfall in the jungle.', imageUrl: '' },
    ],
  },
  {
    name: 'Manali',
    country: 'India',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23',
    description: 'A high-altitude Himalayan resort town known for snow, adventure sports, and scenic beauty.',
    tags: ['snow', 'mountains', 'adventure', 'trekking', 'honeymoon'],
    activities: [
      { name: 'Solang Valley', category: 'Adventure', description: 'Skiing, paragliding, and zorbing in the snow.', imageUrl: '' },
      { name: 'Rohtang Pass', category: 'Sightseeing', description: 'High mountain pass with breathtaking Himalayan views.', imageUrl: '' },
      { name: 'Hadimba Temple', category: 'Culture', description: 'Ancient cave temple surrounded by cedar forest.', imageUrl: '' },
    ],
  },
  {
    name: 'Mumbai',
    country: 'India',
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05b849399669',
    description: 'India\'s financial capital and the home of Bollywood — a city of dreams.',
    tags: ['business', 'bollywood', 'nightlife', 'food', 'culture'],
    activities: [
      { name: 'Gateway of India', category: 'Sightseeing', description: 'Iconic arch monument overlooking the Arabian Sea.', imageUrl: '' },
      { name: 'Marine Drive', category: 'Sightseeing', description: 'Scenic boulevard along the coastline — the Queen\'s Necklace.', imageUrl: '' },
      { name: 'Dharavi Slum Tour', category: 'Culture', description: 'Eye-opening tour of Asia\'s largest urban slum.', imageUrl: '' },
    ],
  },
  {
    name: 'Venice',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0',
    description: 'A floating city of canals, gondolas, and Renaissance art.',
    tags: ['romantic', 'water', 'history', 'art', 'architecture'],
    activities: [
      { name: 'Grand Canal Gondola Ride', category: 'Sightseeing', description: 'Classic gondola ride through Venice\'s main waterway.', imageUrl: '' },
      { name: 'St. Mark\'s Basilica', category: 'Culture', description: 'Opulent Byzantine cathedral in the heart of Venice.', imageUrl: '' },
      { name: 'Murano Glass Factory', category: 'Culture', description: 'Watch master glassblowers create Venetian glass art.', imageUrl: '' },
    ],
  },
  {
    name: 'Seoul',
    country: 'South Korea',
    coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c',
    description: 'A dynamic city where K-pop culture, cutting-edge technology, and ancient palaces coexist.',
    tags: ['kpop', 'technology', 'food', 'shopping', 'culture'],
    activities: [
      { name: 'N Seoul Tower', category: 'Sightseeing', description: 'Iconic tower with panoramic views of the city.', imageUrl: '' },
      { name: 'Gyeongbokgung Palace', category: 'Culture', description: 'Grand Joseon dynasty palace in the heart of Seoul.', imageUrl: '' },
      { name: 'Myeongdong Street Food', category: 'Food & Drink', description: 'Korea\'s most famous shopping and street food district.', imageUrl: '' },
    ],
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    coverImage: 'https://images.unsplash.com/photo-1576485290814-c8e8d5f2e7a5',
    description: 'A stunning city at the tip of Africa — mountains, beaches, and world-class wine.',
    tags: ['nature', 'mountains', 'beach', 'wine', 'adventure'],
    activities: [
      { name: 'Table Mountain', category: 'Adventure', description: 'Hike or cable car to the flat-topped mountain summit.', imageUrl: '' },
      { name: 'Cape Point', category: 'Sightseeing', description: 'Dramatic cliffs at the southwestern tip of Africa.', imageUrl: '' },
      { name: 'Robben Island', category: 'Culture', description: 'Historic island where Nelson Mandela was imprisoned.', imageUrl: '' },
    ],
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    coverImage: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017',
    description: 'A city of canals, bicycles, world-class museums, and liberal culture.',
    tags: ['museum', 'canals', 'culture', 'cycling', 'history'],
    activities: [
      { name: 'Van Gogh Museum', category: 'Culture', description: 'The world\'s largest collection of Van Gogh\'s works.', imageUrl: '' },
      { name: 'Anne Frank House', category: 'Culture', description: 'The hiding place of Anne Frank during WWII.', imageUrl: '' },
      { name: 'Canal Boat Tour', category: 'Sightseeing', description: 'Explore Amsterdam\'s iconic canal ring by boat.', imageUrl: '' },
    ],
  },
  {
    name: 'Zurich',
    country: 'Switzerland',
    coverImage: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95',
    description: 'Switzerland\'s largest city — a blend of luxury, alpine scenery, and financial prestige.',
    tags: ['luxury', 'nature', 'mountains', 'clean', 'chocolate'],
    activities: [
      { name: 'Lake Zurich Cruise', category: 'Sightseeing', description: 'Scenic boat trip on the crystal-clear lake.', imageUrl: '' },
      { name: 'Old Town (Altstadt)', category: 'Culture', description: 'Medieval old town with cobblestone streets and guildhalls.', imageUrl: '' },
      { name: 'Swiss National Museum', category: 'Culture', description: 'Switzerland\'s history and culture in a castle-like building.', imageUrl: '' },
    ],
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    description: 'Japan\'s ancient capital — a city of thousands of temples, geishas, and cherry blossoms.',
    tags: ['temples', 'culture', 'history', 'nature', 'traditional'],
    activities: [
      { name: 'Fushimi Inari Shrine', category: 'Culture', description: 'Thousands of vermilion torii gates winding up a mountain.', imageUrl: '' },
      { name: 'Arashiyama Bamboo Grove', category: 'Sightseeing', description: 'Towering bamboo forest on the outskirts of Kyoto.', imageUrl: '' },
      { name: 'Gion District', category: 'Culture', description: 'Historic geisha district with traditional machiya townhouses.', imageUrl: '' },
    ],
  },
];

const seedCities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await City.deleteMany({});
    console.log('🗑  Old cities deleted');

    await City.insertMany(cities);
    console.log(`🚀 ${cities.length} cities seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedCities();
