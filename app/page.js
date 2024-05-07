import { ConnectButton } from "@rainbow-me/rainbowkit";
import SectionOne from "./components/landingPage/SectionOne";
import "../app/components/landingPage/landingpage.css";
import SectionTwo from "./components/landingPage/SectionTwo";

export default function Home() {
  return (
    <>
      <SectionOne />
      <SectionTwo />
    </>
  );
}
