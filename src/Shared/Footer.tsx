import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 text-sm font-light">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* WATCH ANYWHERE, ANYTIME */}
        <div>
          <h2 className="text-lg font-bold mb-2">WATCH ANYWHERE, ANYTIME</h2>
          <p className="mb-6">
            Connect to USTVnow, simply sign up and log in to stream on your computer, phone, tablet, and smart TV. Record your favorite shows and watch them later on any of your devices.
          </p>
          <div>
            <h3 className="text-base font-bold mb-2">PAYMENT METHODS</h3>
            <div className="flex space-x-2">
              {/* Payment SVGs */}
              <img src="https://d2ivesio5kogrp.cloudfront.net/static/images/credit_cards_logos_orig.png" className=''/>
            </div>
          </div>
        </div>

        {/* HELP FOR THE USER */}
        <div>
          <h2 className="text-lg font-bold mb-2">HELP FOR THE USER</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Help</li>
            <li>FAQ</li>
            <li>Ways to watch</li>
            <li>Watch Free Channels</li>
          </ul>
        </div>

        {/* SOCIAL SHARE & CONNECT WITH US */}
        <div>
          <h2 className="text-lg font-bold mb-2">SOCIAL SHARE</h2>
          <button className="bg-black text-white px-4 py-1 rounded-full mb-6">✗ Post</button>
          <h3 className="text-base font-bold mb-2 mt-4">CONNECT WITH US</h3>
          <div className="flex space-x-3 mt-2">
            {/* Social SVGs */}
            <a href="#" className="hover:opacity-80">
                <img src='https://d2ivesio5kogrp.cloudfront.net/static/images/facebook.png' /></a>
            <a href="#" className="hover:opacity-80">
                <img src='https://d2ivesio5kogrp.cloudfront.net/static/images/twitter.svg'/>
                </a>
            <a href="#" className="hover:opacity-80">
                <img src='https://d2ivesio5kogrp.cloudfront.net/static/images/linkedin_1.png'/>
            </a>
            <a href="#" className="hover:opacity-80"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#ff0000"/><polygon points="13,11 22,16 13,21" fill="#fff"/></svg></a>
          </div>
        </div>

        {/* OPERATOR SERVICES */}
        <div>
          <h2 className="text-lg font-bold mb-2">OPERATOR SERVICES</h2>
          <p className="mb-6">Cable operator services</p>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="bg-gray-900 text-gray-300 text-xs flex flex-col md:flex-row justify-between items-center px-6 py-3">
        <div>
          2025 USTVnow Leader on TV Overseas | <a href="#" className="underline hover:text-white">Privacy Policy</a>
        </div>
        <div className="mt-2 md:mt-0">
          ©2020 DutchPhone Holdings, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
