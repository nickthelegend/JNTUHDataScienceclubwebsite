import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import dsclublogo from "@/public/eventbgfinal.jpeg";
import pic1 from "@/public/MeetAndGreet2024/roadmap1.jpg";
import pic2 from "@/public/TechInsight/TechInsight2.jpg";
import pic3 from "@/public/ABCOfML/frontpic.jpg";
import pic4 from "@/public/CampusChatBot/20241026_125316.jpg";
import pic5 from "@/public/debate/IMG-20241113-WA0060.jpg";

import Image from "next/image";
import Link from "next/link";
import ParallaxBackground from "../_components/ParallelxBackground";

const staticGalleryData = [
  {
    src: pic1,
    alt: "Gallery Image 1",
    title: "Meet & Greet - Roadmap to Data Science Networking and Q&A Session",
    link: "/events/MeetAndGreet",
  },
  {
    src: pic2,
    alt: "Gallery Image 2",
    title: "TechInsight",
    link: "/events/TechInsight",
  },
  {
    src: pic3,
    alt: "Gallery Image 3",
    title: "ABC's of Machine Learning",
    link: "/events/ABCOfML", // If you don't have a link, use "#" or leave it empty
  },
  {
    src: pic4,
    alt: "Gallery Image 4",
    title: "Campus Chatbot Buildathon",
    link: "/events/ChatBotBuildathon", // If you don't have a link, use "#" or leave it empty
  },
  {
    src: pic5,
    alt: "Gallery Image 5",
    title: "Debate AI - Friend or Foe",
    link: "/events/DebateAIFriendorFoe", // If you don't have a link, use "#" or leave it empty
  },
  // Add more gallery items as needed
];

export default async function Page() {
  const publishedEvents = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: 'desc' }
  })

  const dbGalleryData = publishedEvents.map(event => ({
    src: event.imageUrl,
    alt: event.title,
    title: event.title,
    link: `/events/${event.slug}`,
  }))

  const galleryData = [...dbGalleryData, ...staticGalleryData]

  return (
    <>
      <ParallaxBackground />

      {/* Background Image */}
      <div className="parallax-container">
        <div className="parallax-background">
          <Image
            src={dsclublogo}
            alt="Event Background"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 z-[-1] h-[500px] w-full"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-100 p-10">
        <div className="max-w-7xl mx-auto">
          {/* Gallery Title */}
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">
            Our Events
          </h2>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryData.map((item, index) => (
              <Link key={index} href={item.link || "#"}>
                <div className="overflow-hidden bg-white rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                  <div className="h-60 relative">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                  </div>
                  {/* Description Below Image */}
                  <div className="p-4">
                    <p className="text-gray-600 text-center">{item.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
