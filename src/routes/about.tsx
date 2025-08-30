
const AboutPage = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome to AI Mock Interview! Our platform helps you prepare for interviews with realistic mock sessions powered by AI. Whether you are a job seeker or a recruiter, our tools are designed to make interview preparation efficient and effective.
      </p>

    {/* Developers listing section */}
      <div className="my-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Developers</h2>
        <div className="flex flex-wrap justify-center gap-8">

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
              <img src="/assets/img/devs/akarsh.png" alt="Developer 1" className="object-cover w-full h-full" />
            </div>
            <span className="font-medium text-lg">Akarsh Kumar</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
              <img src="/assets/img/devs/akhil.jpeg" alt="Developer 2" className="object-cover w-full h-full" />
            </div>
            <span className="font-medium text-lg">Akhil Mohanan</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
              <img src="/assets/img/devs/eldho.png" alt="Developer 3" className="object-cover w-full h-full" />
            </div>
            <span className="font-medium text-lg">Eldho Mathew</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
              <img src="/assets/img/devs/rishi.png" alt="Developer 4" className="object-cover w-full h-full" />
            </div>
            <span className="font-medium text-lg">Rishi TJ</span>
          </div>
        </div>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
          {/* Map Section */}
          <div className="flex-shrink-0">
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
          {/* Vertical Separation - line  */}
          <div className="hidden md:block h-56 w-px bg-gray-300 mx-8"></div>
          {/* Address Section */}
          <div className="flex flex-col justify-center mt-6 md:mt-0">
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p className="text-gray-700">
              Department of computer Applications(MCA) <br/>  
              Muthoot Institute of Technology & Science<br/>
              Varikoli P.O, Puthencruz,<br/>
              Ernakulam, Kerala 682308<br/>
              India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
