import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function SocialSidebar() {
return ( <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50 text-gray-600 text-xl">


  <FaInstagram className="cursor-pointer hover:text-green-600" />
  <FaTwitter className="cursor-pointer hover:text-green-600" />
  <FaLinkedin className="cursor-pointer hover:text-green-600" />

</div>

);
}
