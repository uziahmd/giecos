
import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Contact form submitted:', formData);
    toast({
      title: "Thanks for your message!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-homeglow-primary mb-8 text-center">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-md shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-homeglow-primary text-white py-3 px-6 rounded-md font-semibold hover:bg-homeglow-accent transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-md shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-homeglow-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">hello@homeglow.com</p>
                    <p className="text-gray-600">support@homeglow.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-homeglow-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-homeglow-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">
                      123 Home Street<br />
                      Appliance City, AC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-homeglow-primary text-white rounded-md shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Need immediate help?</h3>
              <p className="mb-4">
                Our customer support team is available 24/7 to assist you with any questions 
                or concerns.
              </p>
              <button className="bg-white text-homeglow-primary px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                Chat with us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
