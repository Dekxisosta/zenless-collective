import Hero from "../../sections/user/Hero.jsx";
import Perks from "../../sections/user/Perks.jsx"
import Featured from "../../sections/user/Featured.jsx"
import CategoryCarousel from "../../sections/user/CategoryCarousel"
import EventsCarousel from "../../sections/user/EventsCarousel"
import Testimonials from "../../sections/user/Testimonials"
import Divider from "../../components/user/Divider"
import Background from "../../components/user/Background"

export default function Home() {
  return (
    <>
      <Hero/>
      <Perks/>
      <EventsCarousel/>
      <CategoryCarousel />
      <Divider />
      <Featured/>
      <Divider />
      <Testimonials/>
      <Background />
    </>
  )
}
