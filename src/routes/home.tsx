
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <img src="/assets/svg/logo.svg" alt="Logo" className="h-16 w-16 mb-4" />
        <h1 className="text-5xl font-extrabold text-indigo-800 mb-6 text-center">AI Mock Interview</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
          Prepare for your next interview with AI-powered mock sessions, instant feedback, and personalized guidance. Boost your confidence and land your dream job!
        </p>
        <a href="/generate" className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-lg font-semibold text-lg hover:bg-indigo-700 transition">Get Started</a>
      </main>

      <section className="py-8 bg-white/60 backdrop-blur-md rounded-xl mx-8 mb-8 flex flex-wrap items-center justify-center gap-8 shadow">
        <img src="/assets/img/logo/microsoft.png" alt="Microsoft" className="h-10" />
        <img src="/assets/img/logo/react.png" alt="React" className="h-10" />
        <img src="/assets/img/logo/tailwindcss.png" alt="Tailwind CSS" className="h-10" />
        <img src="/assets/img/logo/zoom.png" alt="Zoom" className="h-10" />
        <img src="/assets/img/logo/firebase.png" alt="Firebase" className="h-10" />
        <img src="/assets/img/logo/meet.png" alt="Google Meet" className="h-10" />
      </section>
    </div>
  );
}

export default HomePage