import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";



export default function TeamSection() {
  

  const teamMembers = [
    {
      name: 'kunjesh undhad',
      role: 'Front-end Developer',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffVXFgYxENiH-VLaMIoiIgkDilyO2hA9VIw&s', 
      linkedin: 'https://www.linkedin.com/in/kunjeshundhad/#',
      x:'https://x.com/kunjpatel360'

    },
    {
      name: 'kunjesh undhad',
      role: 'Front-end Developer',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffVXFgYxENiH-VLaMIoiIgkDilyO2hA9VIw&s', 
      linkedin: 'https://www.linkedin.com/in/kunjeshundhad/#',
      x:'https://x.com/kunjpatel360'

    },
    {
      name: 'kunjesh undhad',
      role: 'Front-end Developer',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffVXFgYxENiH-VLaMIoiIgkDilyO2hA9VIw&s', 
      linkedin: 'https://www.linkedin.com/in/kunjeshundhad/#',
      x:'https://x.com/kunjpatel360'

    },
    {
      name: 'kunjesh undhad',
      role: 'Front-end Developer',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffVXFgYxENiH-VLaMIoiIgkDilyO2hA9VIw&s', 
      linkedin: 'https://www.linkedin.com/in/kunjeshundhad/#',
      x:'https://x.com/kunjpatel360'

    },
  
    
  ];

  return (
    <div className="team-sectio">
      <h1 className="title">Our Team</h1>

   <div className="team">

      {teamMembers.map((member, index) => (
        <div className="card" key={index}>
          <img src={member.img} alt={member.name} />
          <div className="card-info">
            <h3>{member.name}</h3>
            
            <div className="social">
              <a href={member.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedin  color="gray"/>

              </a>
              <a href={member.x} target="_blank" rel="noreferrer">
              <FaXTwitter   color="gray" />

              </a>
             
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
    
  );
}