import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface AboutProps {
  showDiscordModal: boolean;
  setShowDiscordModal: (show: boolean) => void;
}

const About: React.FC<AboutProps> = ({ showDiscordModal, setShowDiscordModal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">About Me</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Contact and More of Me */}
        <div>
          {/* Contact Me */}
          <h3 className="text-xl font-semibold mb-4 dark:text-white text-center">Contact Me</h3>
          <div className="flex flex-wrap justify-center mb-8">
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/michiel-kamphuis/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-32 flex flex-col items-center mx-4 mb-4 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="flex justify-center items-center h-16">
                <svg className="w-12 h-12 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <span className="font-medium mt-2">LinkedIn</span>
            </a>
            {/* Email */}
            <a 
              href="mailto:michielodevelopment@gmail.com" 
              className="w-32 flex flex-col items-center mx-4 mb-4 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors group"
            >
              <div className="flex justify-center items-center h-16">
                <svg className="w-12 h-12 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium mt-2">Email</span>
            </a>
            {/* Discord */}
            <button 
              onClick={() => setShowDiscordModal(true)}
              className="w-32 flex flex-col items-center mx-4 mb-4 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors group"
            >
              <div className="flex justify-center items-center h-16">
                <svg className="w-12 h-12 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </div>
              <span className="font-medium mt-2">Discord</span>
            </button>
          </div>
          {/* More of me */}
          <h3 className="text-xl font-semibold mb-4 dark:text-white text-center">More of me</h3>
          <div className="flex flex-wrap justify-center">
            {/* Google Scholar */}
            <a 
              href="https://scholar.google.com/citations?user=IrqYqNQAAAAJ&hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-28 flex flex-col items-center mx-3 mb-3 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300 transition-colors group"
            >
              <div className="flex justify-center items-center h-12">
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                </svg>
              </div>
              <span className="text-sm mt-1 text-center">Google Scholar</span>
            </a>
            {/* Semantic Scholar */}
            <a 
              href="https://www.semanticscholar.org/author/Michiel-Kamphuis/2319602504" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-28 flex flex-col items-center mx-3 mb-3 text-gray-600 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-300 transition-colors group"
            >
              <div className="flex justify-center items-center h-12">
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1.5c-5.799 0-10.5 4.701-10.5 10.5s4.701 10.5 10.5 10.5 10.5-4.701 10.5-10.5-4.701-10.5-10.5-10.5zm0 19.5c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9z" />
                  <path d="M12 7.462l-4.778 8.28h9.556L12 7.462zm-1.158 7.038l1.158-2.001 1.158 2.001h-2.316z" />
                </svg>
              </div>
              <span className="text-sm mt-1 text-center">Semantic Scholar</span>
            </a>
            {/* DBLP */}
            <a 
              href="https://dblp.org/pid/386/7447.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-28 flex flex-col items-center mx-3 mb-3 text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-300 transition-colors group"
            >
              <div className="flex justify-center items-center h-12">
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3H21V21H3V3ZM5 5V19H19V5H5ZM7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" />
                </svg>
              </div>
              <span className="text-sm mt-1 text-center">DBLP</span>
            </a>
            {/* SpigotMC */}
            <a 
              href="https://www.spigotmc.org/resources/authors/michielo.831116/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-28 flex flex-col items-center mx-3 mb-3 text-gray-600 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-300 transition-colors group"
            >
              <div className="flex justify-center items-center h-12">
                <img 
                  src="/spigot.webp" 
                  alt="SpigotMC Logo" 
                  className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-sm mt-1 text-center">SpigotMC</span>
            </a>
            {/* Hugging Face */}
            <a 
              href="https://huggingface.co/michielo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-28 flex flex-col items-center mx-3 mb-3 text-gray-600 hover:text-yellow-400 dark:text-gray-400 dark:hover:text-yellow-300 transition-colors group"
            >
              <div className="flex justify-center items-center h-12">
                <img 
                  src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" 
                  alt="Hugging Face Logo" 
                  className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-sm mt-1 text-center">Hugging Face</span>
            </a>
            {/* GitHub */}
            <a 
              href="https://github.com/michielo1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-28 flex flex-col items-center mx-3 mb-3 text-gray-600 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-300 transition-colors group"
            >
              <div className="flex justify-center items-center h-12">
                <FontAwesomeIcon 
                  icon={faGithub} 
                  className="w-8 h-8 group-hover:scale-110 transition-transform" 
                />
              </div>
              <span className="text-sm mt-1 text-center">GitHub</span>
            </a>
          </div>
        </div>
        {/* Right: Introduction */}
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 w-full">
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">Hi, I'm Michiel!</h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              My name is Michiel, I'm currently 20 years old and an undergraduate student at the University of Amsterdam. Recently, I've been diving into AI research and applications, with a special focus on SLMs (small language models), making AI more accessible and efficient for everyone. I love building things that bridge the gap between research and real-world use, whether that's random plugins that implement cool features, Discord bots to make server administration easier, or new AI models. Curious about what I'm working on? Check out my GitHub or connect with me through any of the links!
            </p>
          </div>
        </div>
      </div>
      {/* Discord Modal */}
      {showDiscordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold dark:text-white">Connect on Discord</h3>
              <button 
                onClick={() => setShowDiscordModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4 text-center">
              <p className="dark:text-gray-300 mb-3">Find me on Discord with the username:</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-lg dark:text-white">michielo</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("michielo");
                    alert("Discord username copied to clipboard!");
                  }}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowDiscordModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About; 