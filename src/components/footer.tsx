

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-indigo-100 py-6 mt-auto shadow-inner">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <a href="/" className="text-indigo-600 hover:underline">Home</a>
        <a href="#about" className="text-indigo-600 hover:underline">About</a>
        <a href="#contact" className="text-indigo-600 hover:underline">Contact</a>
        <a href="/signin" className="text-indigo-600 hover:underline">Sign In</a>
      </div>
      <div className="text-center text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} AI Mock Interview. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer