import { RingProgress, Text } from "@mantine/core";
import userStore from "../store/userStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabaseClient } from "../config/supabaseConfig";

const Home = () => {
  const { id: userId } = userStore();
  const navigate = useNavigate();
  const {
    services,
    experience,
    educations,
    skills,
    projects,
    faqs,
    testimonials,
    userDetails,
    userSocials,
    userSettings,
  } = userStore();

  const [percentage, setPercentage] = useState(0);
  const cards = [
    {
      title: "Experience",
      quantity: experience.length,
      link: "/experience",
      text: "Add your past roles to show your journey.",
    },
    {
      title: "Education",
      quantity: educations.length,
      link: "/education",
      text: "Highlight your academic achievements.",
    },
    {
      title: "Skills",
      quantity: skills.length,
      link: "/skills",
      text: "List your skills to stand out.",
    },
    {
      title: "Projects",
      quantity: projects.length,
      link: "/projects",
      text: "Share your best work.",
    },
    {
      title: "FAQs",
      quantity: faqs.length,
      link: "/faqs",
      text: "Answer common questions to help others know you better.",
    },
    {
      title: "Testimonials",
      quantity: testimonials.length,
      link: "/testimonials",
      text: "Let others vouch for you.",
    },
    {
      title: "Services",
      quantity: services.length,
      link: "/services",
      text: "Showcase what you offer.",
    },
    {
      title: "Social Media",
      quantity: userSocials.length,
      link: "/social-media",
      text: "Connect your profiles for more visibility.",
    },
  ];

  const checkNewUser=async ()=>{
    if(userId)
    {
      const {data,error}=await supabaseClient
      .from("user_setting")
      .select()
      .eq('user_id',userId);
      if(data?.length==0)
      {
        navigate('/set-slug');
      }
    }
    
  }
  useEffect(() => {

    checkNewUser();

    let total = 0;
    cards.forEach((card) => {
      if (card.quantity > 0) {
        total = total + 10;
      }
    });
    if (userDetails) {
      total = total + 10;
    }
    if (userSettings) {
      total = total + 10;
    }
    setPercentage(total);
  }, [
    userDetails,
    userSettings,
    userSocials,
    services,
    experience,
    educations,
    skills,
    projects,
    testimonials,
    faqs,
  ]);

  return (
    <div className="grid grid-cols-5  gap-8">
      <div className="col-span-5 md:col-span-1 flex flex-col justify-center items-center">
        <h2 className="text-center text-2xl font-bold">Profile Progress</h2>
        <div className="flex justify-center items-center">
          <RingProgress
            size={200}
            sections={[{ value: percentage, color: "blue" }]}
            label={
              <Text c="blue" fw={700} ta="center" size="xl">
                {percentage}%
              </Text>
            }
          />
        </div>
        {percentage < 100 && (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-center text-2xl font-bold">Todos</h2>
            <p>
              <Link
                to={"/user-details"}
                className={
                  "font-semibold " +
                  (!userDetails ? "text-red-600" : "text-green-600")
                }
              >
                Complete your basic info to make a strong first impression.
              </Link>
            </p>

            {cards.map((card, index) => (
              <p key={index}>
                <Link
                  to={card.link}
                  className={
                    "font-semibold " +
                    (card.quantity !== 0 ? "text-green-600" : "text-red-600")
                  }
                >
                  {card.text}
                </Link>
              </p>
            ))}
            <p>
              <Link
                to={"/profile"}
                className={
                  "font-semibold " +
                  (!userSettings ? "text-red-600" : "text-green-600")
                }
              >
                Personalize your profile settings.
              </Link>
            </p>
          </div>
        )}
      </div>
      <div className="col-span-5 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <Link
          to={"/user-details"}
          className={
            "flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg  " +
            (!userDetails
              ? "bg-red-300 hover:bg-red-400"
              : "bg-green-300 hover:bg-green-400")
          }
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-center">
              {"User Details"}
            </div>
            <div className=" font-bold text-center mt-4">
              {"Complete your basic info to make a strong first impression."}
            </div>
          </div>
        </Link>
        {cards.map((card, index) => (
          <Link
            to={card.link}
            key={index}
            className={
              "flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg  " +
              (card.quantity === 0
                ? "bg-red-300 hover:bg-red-400"
                : "bg-green-300 hover:bg-green-400")
            }
          >
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-center">
                {card.quantity}
              </div>
              <div className="text-2xl font-bold text-center mt-4">
                {card.title}
              </div>
              <div className=" font-bold text-center mt-4">{card.text}</div>
            </div>
          </Link>
        ))}
        <Link
          to={"/profile"}
          className={
            "flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg  " +
            (!userSettings
              ? "bg-red-300 hover:bg-red-400"
              : "bg-green-300 hover:bg-green-400")
          }
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-center">
              {"User Settings"}
            </div>
            <div className=" font-bold text-center mt-4">
              {"Personalize your profile settings."}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
