import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP globally
gsap.registerPlugin(ScrollTrigger);

// Export standard configuration references
export { gsap, ScrollTrigger };
export default gsap;
