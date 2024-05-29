import '@fortawesome/fontawesome-free/css/all.min.css';


const Dashboard = () => {
    return (
        <div className="min-h-screen bg-theme1">
            <div className="p-4 space-y-8 max-w-5xl mx-auto">
                {/* User Info Section */}
                <div className="bg-theme2 p-6 rounded-2xl shadow">
                    <div className="flex items-center space-x-4">
                        <img src="https://via.placeholder.com/100" alt="User" className="rounded-full w-24 h-24" />
                        <div className="text-theme3">
                            <div className='flex flex-row-reverse'>
                                <button className="bg-theme3 text-theme1 px-2 py-1 rounded flex items-center space-x-1">
                                    <i className="fas fa-edit"></i>
                                    <span>Edit Details</span>
                                </button>
                            </div>
                            <div className="flex justify-between">
                                <h2 className="text-5xl font-bold ">Username</h2>
                                <p className="py-*">City, Country</p>
                            </div>
                            <hr className=" border-theme3 border-b-2 my-5" /> 
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <ul className="mt-2">
                                <li><strong>Contact:</strong> user@example.com</li>
                                <li><strong>Phone:</strong> +91 1234567890</li>
                                <li><strong>LinkedIn:</strong> linkedin.com/in/username</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-theme2 p-6 rounded-2xl shadow text-theme3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Skills</h2>
                        <button className="bg-theme3 text-theme1 px-2 py-1 rounded flex items-center space-x-1">
                            <i className="fas fa-edit"></i>
                            <span>Edit Skills</span>
                        </button>
                    </div>
                    <hr className=" border-theme3 border-b-2 my-5" /> 
                    <ul className="list-disc pl-5 space-y-1">
                        <li>JavaScript</li>
                        <li>React</li>
                        <li>Tailwind CSS</li>
                    </ul>
                    <div className="py-2 text-blue-700 flex items-center cursor-pointer hover:text-blue-900">
                        <i className="fas fa-chevron-down ml-2"></i>
                        <div className='px-2'>More Skills</div>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="bg-theme2 p-6 rounded-2xl shadow text-theme3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Projects</h2>
                        <button className="bg-theme3 text-theme1 px-2 py-1 rounded flex items-center space-x-1">
                            <i className="fas fa-edit"></i>
                            <span>Edit Project</span>
                        </button>
                    </div>
                    <hr className=" border-theme3 border-b-2 my-5" /> 
                    <div className="flex space-x-4 ">
                        <div className="w-1/3">
                            <img src="https://via.placeholder.com/150" alt="Project 1" className="rounded mb-2" />
                            <h3 className="font-semibold">Project 1</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="w-1/3">
                            <img src="https://via.placeholder.com/150" alt="Project 2" className="rounded mb-2" />
                            <h3 className="font-semibold">Project 2</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="w-1/3">
                            <img src="https://via.placeholder.com/150" alt="Project 3" className="rounded mb-2" />
                            <h3 className="font-semibold">Project 3</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <div className="py-2 text-blue-700 flex items-center cursor-pointer hover:text-blue-900">
                        <i className="fas fa-chevron-down ml-2"></i>
                        <div className='px-2'>More Projects</div>
                    </div>
                </div>

                {/* Experience Section */}
                <div className="bg-theme2 p-6 rounded-2xl shadow text-theme3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Experience</h2>
                        <button className="bg-theme3 text-theme1 px-2 py-1 rounded flex  items-center space-x-1">
                            <i className="fas fa-edit"></i>
                            <span>Edit Experiences</span>
                        </button>
                    </div>
                    <hr className=" border-theme3 border-b-2 my-5" /> 
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Frontend Developer</strong> at XYZ Company (2020 - Present)
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </li>
                        <li>
                            <strong>Software Engineer</strong> at ABC Inc. (2018 - 2020)
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </li>
                    </ul>
                    <div className="py-2 text-blue-700 flex items-center cursor-pointer hover:text-blue-900">
                        <i className="fas fa-chevron-down ml-2"></i>
                        <div className='px-2'>More Experiences</div>
                    </div>
                </div>

                {/* Education Section */}
                <div className="bg-theme2 p-6 rounded-2xl shadow text-theme3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Education</h2>
                        <button className="bg-theme3 text-theme1 px-2 py-1 rounded flex items-center space-x-1">
                            <i className="fas fa-edit"></i>
                            <span>Edit Education</span>
                        </button>
                    </div>
                    <hr className=" border-theme3 border-b-2 my-5" /> 
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>B.Sc. in Computer Science</strong> from University of Technology (2014 - 2018)
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </li>
                    </ul>
                    <div className="py-2 text-blue-700 flex items-center cursor-pointer hover:text-blue-900">
                        <i className="fas fa-chevron-down ml-2"></i>
                        <div className='px-2'>More Educations</div>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default Dashboard;
