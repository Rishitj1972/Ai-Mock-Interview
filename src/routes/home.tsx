
const HomePage = () => {
  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-blue-50 to-white relative overflow-hidden">
      {/* Decorative gradient overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{zIndex:0}}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{zIndex:0}}></div>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-8 py-12 relative z-10 gap-12">
        {/* Left: Hero Section */}
        <div className="flex flex-col items-start max-w-xl w-full">
          <img src="/assets/svg/logo2.png" alt="Logo" className="h-20 w-70 mb-4 drop-shadow-lg animate-fade-in self-center" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-6 text-left drop-shadow animate-fade-in">AI Mock Interview</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 text-left max-w-xl animate-fade-in">
            Prepare for your next interview with <span className="text-indigo-600 font-semibold">AI-powered mock sessions</span>, instant feedback, and personalized guidance.<br />Boost your confidence and land your dream job!
          </p>
          <a href="/generate" className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold text-xl hover:scale-105 hover:bg-indigo-700 transition-transform duration-200 animate-fade-in self-center">Get Started</a>
          {/* Images below hero section for better balance on mobile */}
          <div className="flex md:hidden flex-col gap-8 items-center justify-center w-full mt-10">
            <img src="/assets/img/hero.jpg" alt="Hero" className="object-cover w-80 h-56 scale-105 hover:scale-110 transition-transform duration-300 rounded-2xl shadow-lg" />
            <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Practice Like a Pro</h2>
            <p className="text-base text-gray-600 text-center mb-6">Experience realistic interview scenarios with our AI-driven platform, designed to simulate real-world challenges and help you excel.</p>
            <img src="/assets/img/office.jpg" alt="Office" className="object-cover w-80 h-56 scale-105 hover:scale-110 transition-transform duration-300 rounded-2xl shadow-lg" />
            <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Your Success, Our Mission</h2>
            <p className="text-base text-gray-600 text-center">Join a community of ambitious professionals and get personalized feedback to boost your confidence and land your dream job.</p>
          </div>
        </div>

        {/* Right: Images Section for desktop */}
        <div className="hidden md:flex flex-col gap-8 items-center justify-center max-w-lg w-full">
          <img src="/assets/img/hero.jpg" alt="Hero" className="object-cover w-80 h-56 scale-105 hover:scale-110 transition-transform duration-300 rounded-2xl shadow-lg" />
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Practice Like a Pro</h2>
          <p className="text-base text-gray-600 text-center mb-6">Experience realistic interview scenarios with our AI-driven platform, designed to simulate real-world challenges and help you excel.</p>
          <img src="/assets/img/office.jpg" alt="Office" className="object-cover w-80 h-56 scale-105 hover:scale-110 transition-transform duration-300 rounded-2xl shadow-lg" />
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Your Success, Our Mission</h2>
          <p className="text-base text-gray-600 text-center">Join a community of ambitious professionals and get personalized feedback to boost your confidence and land your dream job.</p>
        </div>
      </main>
    </div>
  );
}

export default HomePage