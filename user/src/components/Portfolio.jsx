import React, { useState } from "react";
import ProjectDetailsModal from "./ProjectDetailsModal";
import userStore from "../store.js";

const Portfolio = () => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const { projects } = userStore();

  const mapSupabaseResponseToProjectData = (supabaseResponse) => {
    return (supabaseResponse || []).map((item) => {
      const images = item.images || []; // Ensure images is always an array
      return {
        title: item.title,
        type: item.video_id
          ? "video"
          : images.length > 0
          ? "image"
          : "document",
        document: {
          projectInfo: item.description,
          client: item.client_name,
          technologies: (item.technology || []).join(", "), // Default to empty array
          industry: item.industry,
          date: item.created_at,
          url: {
            name: item.url,
            link: item.url,
          },
          sliderImages: images,
        },
        video: item.video_id
          ? {
              vimeo: item.url.includes("vimeo"),
              id: item.video_id,
            }
          : null,
        thumbImage: images.length > 0 ? images[0] : null,
      };
    });
  };

  const projectsData = mapSupabaseResponseToProjectData(projects);
  if (projects.length === 0) {
    return <></>;
  }
  return (
    <>
      <section id="portfolio" className="section bg-light">
        <div className="container">
          {/* Heading */}
          <p className="text-center mb-2 wow fadeInUp">
            <span className="bg-primary text-dark px-2">Portfolio</span>
          </p>
          <h2 className="text-10 fw-600 text-center mb-5 wow fadeInUp">
            Some of my most recent projects
          </h2>
          {/* Heading end */}
          <div className="portfolio wow fadeInUp">
            <div className="row g-4">
              {projectsData.length > 0 &&
                projectsData.map((project, index) => (
                  <div className="col-sm-6 col-lg-4" key={index}>
                    <div className="portfolio-box">
                      <div
                        className="portfolio-img"
                        onClick={() => {
                          setSelectedProjectDetails(project);
                          setIsOpen(true);
                        }}
                      >
                        {project.thumbImage ? (
                          <img
                            onLoad={() => {
                              setImagesLoaded(imagesLoaded + 1);
                            }}
                            className="img-fluid d-block portfolio-image"
                            src={project.thumbImage}
                            alt={project.title}
                          />
                        ) : (
                          <div className="default-thumbnail-container">
                            <p className="default-thumbnail-text">
                              View Project Details
                            </p>
                          </div>
                        )}
                        <div className="portfolio-overlay">
                          <button className="popup-ajax stretched-link border-0 p-0">
                            {" "}
                          </button>
                          <div className="portfolio-overlay-details">
                            <h5 className="text-white text-5">
                              {project.title}
                            </h5>
                            <span className="text-light">Category</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      {/* Modal */}
      {isOpen && (
        <ProjectDetailsModal
          projectDetails={selectedProjectDetails}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
};

export default Portfolio;
