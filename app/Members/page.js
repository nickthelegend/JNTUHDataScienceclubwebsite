"use client"; // Add this line to make the component a Client Component

import Image from "next/image";
import { FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa"; // Import the icons
import jeevin from "@/public/members/jeevin.jpg";
import likitha from "@/public/members/likitha.jpg";
import sindu from "@/public/members/sindu.jpg";
import Praneetha from "@/public/members/praneetha.jpg";
import Vaishnavi from "@/public/members/vaishnavi.jpg";
import nitish from "@/public/members/nitish.jpg";
import chandrahas from "@/public/members/chandrahas.jpg";
import Vybhavi from "@/public/members/vybhavi.jpg";
import Mastan from "@/public/members/mastan.jpg";
import Paran from "@/public/members/paran.jpg";


const cardData = [
  {
    name: "Vybhavi reddy",
    title: "Head",
    year: "3rd year CSE",
    picture: Vybhavi,
    links: {
      linkedin: " https://in.linkedin.com/in/vybhavi-reddy-9134bb28a",
      github: "https://github.com/Vybhavireddy",
      gmail: "Vybhavireddy30@gmail.com",
    },
  },

    {
    name: "Sri Sindhu Gangula",
    title: "Head",
    year: "3rd year CSE (AI & ML)",
    picture: sindu,
    links: {
      linkedin: "https://www.linkedin.com/in/sri-sindhu-gangula-a01b9a282/",
      github: "https://github.com/SriSindhuGangula",
      gmail: "#",
    },
  },

  {
    name: "Thipireddy Likitha Reddy",
    title: "Technical Co-ordinator",
    year: "3rd year CSE (AI & ML)",
    picture: likitha,
    links: {
      linkedin: "https://www.linkedin.com/in/likitha-reddy784/",
      github: "https://github.com/likithakrishnareddy784",
      gmail: "thipireddylikithareddy@gmail.com",
    },
  },

  {
    name: "Praneetha Routhu",
    title: "Content creator",
    year: "3rd year CSE (AI & ML)",
    picture: Praneetha,
    links: {
      linkedin: "https://www.linkedin.com/in/praneetha-routhu/",
      github: "https://github.com/Praneetha0906",
      gmail: "praneetharouthu@gmail.com",
    },
  },
  {
    name: "Sarva Vaishnavi",
    title: "Content Creator",
    year: "3rd year CSE (AI & ML)",
    picture: Vaishnavi,
    links: {
      linkedin: "https://www.linkedin.com/in/vaishnavi-sarva-834a40178/",
      github: "https://github.com/Vaishnavi-04s",
      gmail: "sarvavaishnavi4@gmail.com",
    },
  },
  {
    name: "Dasa Nitish",
    title: "Technical Co-ordinator",
    year: "3rd year CSE (AI & ML)",
    picture: nitish,
    links: {
      linkedin: "https://www.linkedin.com/in/dasa-nitish-7915a523b/",
      github: "https://github.com/Dasa-Nitish-2004",
      gmail: "dasanitish2004@gmail.com",
    },
  },
  {
    name: "DESHABATINI CHANDRAHAAS",
    title: "Event Coordinator",
    year: "3rd year CSE (AI & ML)",
    picture: chandrahas,
    links: { linkedin: "#", github: "#", gmail: "#" },
  },
  {
    name: "Mastaan Shaik",
    title: "Technical Co-ordinator",
    year: "3rd year CSE",
    picture: Mastan,
    links: {
      linkedin: "https://linkedin.com/in/sk-mastaan",
      github: "https://github.com/mastaan66",
      gmail: "mastaanshaik37@gmail.com",
    },
  },
  {
    name: "Jakkula paran",
    title: "Creative Designer",
    year: "3rd year CSE (AI & ML)",
    picture: Paran,
    links: {
      linkedin: "https://www.linkedin.com/in/jakkula-paran-79a7b027a/",
      github: "https://github.com/paranjakkula",
      gmail: "paranjakkaula96@gmail.com",
    },
  },
  {
    name: "Jeevin Chelleka",
    title: "Developer",
    year: "3rd year CSE (AI & ML)",
    picture: jeevin,
    links: {
      linkedin: "https://www.linkedin.com/in/jeevin-chelleka",
      github: "https://github.com/Jeevinchelleka/",
      gmail: "jeevinchelleka@gmail.com",
    },
  },
];

export default function Page() {
  function gmailPopup(email) {
    // Create a mailto link
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink; // Open the mail client
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#000428] to-[#004683] flex flex-col items-center py-12">
        <div className="mt-32"></div>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {cardData.map((person, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg w-full relative group overflow-hidden"
            >
              <Image
                src={person.picture}
                alt={person.name}
                width={500} // Maintain the original width
                height={500} // Maintain the original height
                className="rounded-t-lg w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110 max-h-[600px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-center p-4 transform transition-transform duration-500 ease-in-out group-hover:translate-y-[-50%]">
                <h4 className="text-white text-lg font-semibold mb-2">
                  {person.name}
                </h4>
                <h5 className="text-white text-sm font-light mb-2">
                  {person.title}
                </h5>
                <h5 className="text-white text-sm font-light mb-2">
                  {person.year}
                </h5>
                <ul className="flex justify-center space-x-4 mb-2">
                  {person.links.linkedin !== "#" && (
                    <li>
                      <a
                        href={person.links.linkedin}
                        className="text-white hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLinkedin size={20} />
                      </a>
                    </li>
                  )}
                  {person.links.github !== "#" && (
                    <li>
                      <a
                        href={person.links.github}
                        className="text-white hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub size={20} />
                      </a>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => gmailPopup(person.links.gmail)}
                      className="text-white hover:text-gray-300"
                    >
                      <FaEnvelope size={20} />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
