
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-homeglow-primary mb-8 text-center">
          About HomeGlow
        </h1>

        <div className="prose prose-gray max-w-none">
          <div className="bg-white rounded-md shadow-md p-8 mb-8">
            <h2 className="text-2xl font-playfair font-bold text-homeglow-primary mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2020, HomeGlow began as a simple idea: to bring premium home appliances 
              to every household. We believe that quality appliances shouldn't be a luxury, but 
              an accessible way to enhance your daily life.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our team of experts carefully curates each product in our collection, ensuring that 
              every item meets our high standards for quality, functionality, and design. From 
              state-of-the-art coffee makers to innovative air purifiers, we're here to help you 
              create the home of your dreams.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At HomeGlow, we're more than just a retailer – we're your partners in creating a 
              home that truly glows with warmth, comfort, and modern convenience.
            </p>
          </div>

          <div className="bg-white rounded-md shadow-md p-8 mb-8">
            <h2 className="text-2xl font-playfair font-bold text-homeglow-primary mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To provide exceptional home appliances that enhance the quality of life for our 
              customers, while offering outstanding service and support at every step of their 
              journey with us.
            </p>
          </div>

          <div className="bg-white rounded-md shadow-md p-8">
            <h2 className="text-2xl font-playfair font-bold text-homeglow-primary mb-4">
              Privacy Policy
            </h2>
            <div className="text-gray-600 space-y-4">
              <h3 className="font-semibold text-gray-800">Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an 
                account, make a purchase, or contact us for support.
              </p>
              
              <h3 className="font-semibold text-gray-800">How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>
              
              <h3 className="font-semibold text-gray-800">Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third 
                parties without your consent, except as described in this policy.
              </p>
              
              <h3 className="font-semibold text-gray-800">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@homeglow.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
