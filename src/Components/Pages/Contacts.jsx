import { useState } from "react";
import emailjs from "emailjs-com";
import { FaEnvelope, FaPhone, FaWhatsapp, FaUser, FaPaperPlane } from "react-icons/fa";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceID = "service_v5mcj52";
    const templateID = "template_883xjqt";
    const publicKey = "6w6mYJRXpgjanY1Li";

    emailjs
      .send(serviceID, templateID, formData, publicKey)
      .then((response) => {
        console.log("Email sent successfully:", response);
        setStatus("Your message has been sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        setStatus(`Something went wrong: ${error.text}`);
      });
  };

  return (
    <div className="w-11/12 md:w-9/12 mx-auto py-16">
      <h2 className="text-4xl  font-bold text-center  mb-8">
        Get in Touch
      </h2>

      <p className="text-lg sm:text-xl lg:text-2xl text-center  mb-10 w-8/12 mx-auto">
        Feel free to reach out for collaborations, discussions, or just to say hello!
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-8">
        {/* Contact Form Section */}
        <div className="p-6 sm:p-10 rounded-lg shadow-xl w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label htmlFor="name" className="block font-medium mb-2">
                Name
              </label>
              <FaUser className="absolute bottom-4 left-4 transform -translate-y-1/2 text-teal-600" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-14 pr-4 p-4 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-5 relative">
              <label htmlFor="email" className="block font-medium mb-2">
                Email
              </label>
              <FaEnvelope className="absolute bottom-4 left-4 transform -translate-y-1/2 text-teal-600" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-14 pr-4 p-4 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-5 relative">
              <label htmlFor="message" className="block  font-medium mb-2">
                Message
              </label>
              <FaPaperPlane className="absolute bottom-36 left-4 transform -translate-y-1/2 text-teal-600" />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full pl-14 pr-4 p-4 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                rows="6"
                placeholder="Your Message"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-md"
            >
              Send Message
            </button>
          </form>

          {/* Status message */}
          {status && <p className="mt-4 text-center">{status}</p>}
        </div>

        {/* Contact Info Section */}
        <div className="p-6 sm:p-10 rounded-lg shadow-xl w-full max-w-md">
          <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center ">
            Contact Info
          </h3>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-3xl text-teal-600" />
              <p className="text-lg">
                <a href="mailto:estateease@gmail.com" className="text-lg hover:text-teal-600">
                  estate.ease2k25@gmail.com
                </a>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaPhone className="text-3xl text-teal-600" />
              <p className="text-lg">
                <a href="tel:+8801301565464" className="text-lg hover:text-teal-600">
                  +8801301565464
                </a>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaWhatsapp className="text-3xl text-teal-600" />
              <p className="text-lg">
                <a href="https://wa.me/8801301565464" className="text-lg hover:text-teal-600">
                  Click to Chat
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;