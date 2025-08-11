import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full h-48 bg-white border-t border-gray-200 flex items-center justify-center">
      <div className="text-14 font-medium text-footer leading-20">
        © 2025{' '}
        <a
          href="https://www.joveo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-footer hover:text-primary-main transition-colors duration-200 cursor-pointer underline-offset-2 hover:underline"
        >
          Joveo.com
        </a>
        {' | '}
        <a
          href="https://www.joveo.com/terms-of-use/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-footer hover:text-primary-main transition-colors duration-200 cursor-pointer underline-offset-2 hover:underline"
        >
          Terms of Service
        </a>
        {' | '}
        <a
          href="https://www.joveo.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-footer hover:text-primary-main transition-colors duration-200 cursor-pointer underline-offset-2 hover:underline"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer; 