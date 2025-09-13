import Link from "next/link";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function UpcomingEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const events = await res.json();
        const now = new Date();
        const upcoming = events
          .filter(event => event.isPublished && new Date(event.date) > now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(event => ({
            title: event.title,
            time: new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' - ' + // Assuming duration, adjust as needed
                  new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            location: event.location || 'TBD',
            imageSrc: event.imageUrl || '/QUIZ.jpg', // Fallback to default image
            link: `/register/event/${event.slug}`,
            description: event.description || 'Join us for an exciting event!',
            date: event.date,
          }));

        setUpcomingEvents(upcoming.length > 0 ? upcoming : [
          {
            title: "QuizHeist 2025",
            time: "04:00 PM - 06:00 AM",
            location: "CSE department, Seminar Hall",
            imageSrc: "/QUIZ.jpg",
            link: "../Register",
            description: "Register now for an immersive day of learning with Fun, and win minimum of 1000rs and wining cash will be more based on registrations.",
            date: "2025-02-17T19:00:00",
          }
        ]);
      } catch (error) {
        console.error('Error fetching events:', error);
        setUpcomingEvents([
          {
            title: "QuizHeist 2025",
            time: "04:00 PM - 06:00 AM",
            location: "CSE department, Seminar Hall",
            imageSrc: "/QUIZ.jpg",
            link: "../Register",
            description: "Register now for an immersive day of learning with Fun, and win minimum of 1000rs and wining cash will be more based on registrations.",
            date: "2025-02-17T19:00:00",
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (upcomingEvents.length === 0) return;

    const eventDate = new Date(upcomingEvents[0].date);
    const eventStartTime = eventDate.getTime();
    const eventEndTime = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).getTime(); // Assuming 2 hours duration

    const countdown = setInterval(() => {
      const now = new Date().getTime();

      if (now >= eventEndTime) {
        setTimeLeft("Event has passed.");
        clearInterval(countdown);
      } else if (now >= eventStartTime && now < eventEndTime) {
        setTimeLeft("Event has started.");
      } else {
        const distance = eventStartTime - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [upcomingEvents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-6 px-2 md:py-10 md:px-4">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Upcoming Events
        </h1>
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-6 px-2 md:py-10 md:px-4">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Upcoming Events
        </h1>
        <p className="text-gray-600">No upcoming events at the moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-6 px-2 md:py-10 md:px-4">
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center">
        Upcoming Events
      </h1>

      {/* Show the next upcoming event prominently */}
      <div className="w-full max-w-6xl relative overflow-hidden rounded-lg shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 mb-8">
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out transform hover:scale-105"
            style={{
              backgroundImage: `url(${upcomingEvents[0].imageSrc})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            aria-label="Event background image"
          ></div>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4 md:p-6">
          <h3 className="text-xl md:text-3xl font-extrabold text-white mb-2 md:mb-4 tracking-wide">
            {upcomingEvents[0].title}
          </h3>

          <p className="text-white text-sm md:text-base mb-2 leading-relaxed">
            {upcomingEvents[0].description}
          </p>

          <p className="text-white text-sm mb-1 flex items-center">
            <FaCalendarAlt
              className="mr-2 md:mr-3 text-lg md:text-xl"
              aria-label="Calendar icon"
            />
            <span className="font-semibold">Date: </span> {new Date(upcomingEvents[0].date).toLocaleDateString()}
          </p>
          <p className="text-white text-sm mb-1 flex items-center">
            <FaClock
              className="mr-2 md:mr-3 text-lg md:text-xl"
              aria-label="Clock icon"
            />
            <span className="font-semibold">Time: </span>{" "}
            {upcomingEvents[0].time}
          </p>
          <p className="text-white text-sm mb-2 flex items-center">
            <FaMapMarkerAlt
              className="mr-2 md:mr-3 text-lg md:text-xl"
              aria-label="Location icon"
            />
            <span className="font-semibold">Location: </span>{" "}
            {upcomingEvents[0].location}
          </p>

          <div className="text-white text-sm mb-4">
            <span className="font-bold">Time Left: </span>
            {timeLeft}
          </div>

          {timeLeft === "Event has passed." ? (
            <button
              className="px-4 py-2 md:px-6 md:py-3 bg-red-600 text-white text-sm md:text-lg font-semibold rounded-lg cursor-not-allowed"
              disabled
            >
              Registration Closed
            </button>
          ) : (
            <Link
              href={upcomingEvents[0].link}
              className="inline-block  px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white text-sm md:text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Register Now
            </Link>
          )}
        </div>
      </div>

      {/* List other upcoming events if any */}
      {upcomingEvents.length > 1 && (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.slice(1).map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <img src={event.imageSrc} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <p className="text-sm"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <Link href={event.link} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                Register
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}