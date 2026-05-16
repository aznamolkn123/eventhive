const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");

const MONGO_URI = "mongodb+srv://aznawaditwaiba:user@cluster0.zwgn8ip.mongodb.net/?appName=Cluster0";

const events = [
  {
    title: "Summer Music Festival 2025",
    description: "A spectacular outdoor music festival featuring top artists from around the world. Experience three days of amazing performances, food vendors, and unforgettable moments.",
    category: "music",
    date: new Date("2025-07-15T14:00:00"),
    location: "Central Park, New York City",
    capacity: 5000,
    price: 75.00,
    bannerImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
  },
  {
    title: "Tech Innovation Summit 2026",
    description: "Join industry leaders and innovators for the premier technology conference. Network, learn about emerging technologies, and discover the future of tech.",
    category: "tech",
    date: new Date("2026-03-20T09:00:00"),
    location: "Convention Center, San Francisco",
    capacity: 1000,
    price: 299.99,
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
  },
  {
    title: "Community Yoga in the Park",
    description: "A free community yoga session open to all skill levels. Bring your mat and join us for a relaxing morning of yoga and mindfulness.",
    category: "sports",
    date: new Date("2024-05-10T08:00:00"),
    location: "Riverside Park, Seattle",
    capacity: 50,
    price: 0,
    bannerImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
  },
  {
    title: "International Food Festival",
    description: "Taste dishes from over 30 countries at this annual culinary celebration. Live cooking demonstrations, food stalls, and family activities.",
    category: "food",
    date: new Date("2025-09-05T11:00:00"),
    location: "Downtown Plaza, Chicago",
    capacity: 3000,
    price: 15.00,
    bannerImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
  },
  {
    title: "Modern Art Exhibition Opening",
    description: "Be among the first to experience the groundbreaking works of contemporary artists. Exclusive opening night with artist meet-and-greet.",
    category: "arts",
    date: new Date("2024-11-15T18:00:00"),
    location: "Metropolitan Art Gallery, Los Angeles",
    capacity: 200,
    price: 45.00,
    bannerImage: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800",
  },
  {
    title: "Startup Pitch Night",
    description: "Watch emerging startups pitch their innovative ideas to top investors. Networking opportunities and refreshments provided.",
    category: "tech",
    date: new Date("2026-01-25T19:00:00"),
    location: "Innovation Hub, Austin",
    capacity: 150,
    price: 0,
    bannerImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    let organiser = await User.findOne({ role: "organiser" });
    if (!organiser) {
      organiser = await User.create({
        name: "Test Organiser",
        email: "organiser@test.com",
        password: "hashedpassword123",
        role: "organiser",
      });
      console.log("Created test organiser user");
    }

    const eventsWithOrganiser = events.map(event => ({
      ...event,
      organiser: organiser._id,
    }));

    await Event.deleteMany({ organiser: organiser._id });
    console.log("Cleared existing events");

    await Event.insertMany(eventsWithOrganiser);
    console.log("Created 6 events successfully");

    const allEvents = await Event.find({ organiser: organiser._id });
    console.log("\nCreated events:");
    allEvents.forEach((e, i) => {
      console.log(`${i + 1}. ${e.title} - ${e.category} - ${e.price === 0 ? 'FREE' : '$' + e.price} - ${e.date.toISOString().split('T')[0]}`);
    });

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();