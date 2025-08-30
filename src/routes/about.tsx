import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome to AI Mock Interview! Our platform helps you prepare for interviews with realistic mock sessions powered by AI. Whether you are a job seeker or a recruiter, our tools are designed to make interview preparation efficient and effective.
      </p>
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-2">Our Location</h2>
        <div className="flex justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31435.270284431343!2d76.3898246!3d9.9830515!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0874de563bc58b%3A0xde7ecbfa110cfbda!2sMuthoot%20Institute%20of%20Technology%20%26%20Science!5e0!3m2!1sen!2sin!4v1756537343047!5m2!1sen!2sin"
            width="400"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Muthoot Institute of Technology & Science Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
