import logo from "../../assets/images/logo.svg";

export default function Logo({ className = "" }) {
  return (
    <img
      src={logo}
      alt="Logo"
      className={`w-full h-full object-contain ${className}`}
    />
  );
}