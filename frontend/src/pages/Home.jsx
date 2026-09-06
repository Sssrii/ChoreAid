// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Home as HomeIcon, Search, ClipboardCheck, UserCheck, CheckCircle2 } from 'lucide-react';
// import { getServiceIcon } from '../utils/serviceIcons';
// import api from '../api/axios';
// import './Home.css';
// import heroImage from '../assets/hero-image.png';

// function Home() {
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get('/services').then((res) => setCategories(res.data.data));
//   }, []);

//   return (
//     <div>
//       <nav className="landing-nav">
//         <div className="landing-logo">
//           <div className="auth-logo-icon"><HomeIcon size={20} /></div>
//           <span>ChoreAid</span>
//         </div>
//         <div className="landing-nav-links">
//           <a href="#home">Home</a>
//           <a href="#services">Services</a>
//           <a href="#how-it-works">How It Works</a>
//           <a href="#about">About</a>
//         </div>
//         <div className="row" style={{ gap: 'var(--space-3)' }}>
//           <Link to="/login" className="landing-nav-login">Login</Link>
//           <Link to="/signup" className="btn-primary" style={{ width: 'auto', padding: '10px 20px', display: 'inline-block' }}>
//             Sign Up
//           </Link>
//         </div>
//       </nav>

// <section className="hero" id="home">
//   <div className="hero-top">
//     <h1>Your Home.<br />Our Helping Hands.</h1>
//     <div className="hero-top-right">
//       <p style={{ fontSize: '1rem', marginBottom: 'var(--space-4)' }}>
//         Find trusted, verified professionals for every home service  - booked in minutes, tracked in real time.
//       </p>
//       <div className="row" style={{ gap: 'var(--space-3)' }}>
//         <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => navigate('/signup')}>
//           Find Services
//         </button>
//         <a href="#how-it-works" className="btn-outline">
//           How It Works
//         </a>
//       </div>
//     </div>
//   </div>

//   <div className="hero-banner-wrap">
//     <img src={heroImage} alt="Home service professional at work" className="hero-banner-image" />
//     <div className="hero-overlay-card">
//       <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0 }}>
//         Verified professionals, matched to your home, in minutes.
//       </p>
//     </div>
//   </div>

//   <div className="hero-pills">
//     <span className="hero-pill">Verified Providers</span>
//     <span className="hero-pill">Live Status Tracking</span>
//     <span className="hero-pill">Simple, Secure Booking</span>
//   </div>
// </section>

//       <section className="page-container" id="services">
//         <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Popular Services</h2>
//         <p style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
//           Trusted professionals across every home service category
//         </p>
//         <div className="grid grid-3">
//           {categories.map((cat) => {
//             const { icon: Icon, bg, color } = getServiceIcon(cat.name);
//             return (
//               <div key={cat._id} className="service-tile" onClick={() => navigate('/signup')}>
//                 <div
//                   style={{
//                     width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: bg, color,
//                     display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3)',
//                   }}
//                 >
//                   <Icon size={22} />
//                 </div>
//                 <strong>{cat.name}</strong>
//               </div>
//             );
//           })}
//         </div>
//       </section>

//       <section className="page-container" id="how-it-works" style={{ background: 'var(--color-bg)' }}>
//         <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>How It Works</h2>
//         <div className="grid grid-3">
//           <div style={{ textAlign: 'center' }}>
//             <div className="how-icon"><ClipboardCheck size={26} /></div>
//             <h3 style={{ marginBottom: 'var(--space-2)' }}>1. Choose a Service</h3>
//             <p>Pick the home service you need from our categories.</p>
//           </div>
//           <div style={{ textAlign: 'center' }}>
//             <div className="how-icon"><UserCheck size={26} /></div>
//             <h3 style={{ marginBottom: 'var(--space-2)' }}>2. Get Matched</h3>
//             <p>We connect you with a nearby, verified professional.</p>
//           </div>
//           <div style={{ textAlign: 'center' }}>
//             <div className="how-icon"><CheckCircle2 size={26} /></div>
//             <h3 style={{ marginBottom: 'var(--space-2)' }}>3. Get the Job Done</h3>
//             <p>Track progress live and pay securely once it's complete.</p>
//           </div>
//         </div>
//       </section>

//       <footer style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }} id="about">
//         © 2026 ChoreAid  - Home services, made simple.
//       </footer>
//     </div>
//   );
// }

// export default Home;














import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  ClipboardCheck,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { getServiceIcon } from '../utils/serviceIcons';
import api from '../api/axios';
import './Home.css';
import heroImage from '../assets/hero-image.png';

function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then((res) => setCategories(res.data.data));
  }, []);

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="auth-logo-icon">
            <HomeIcon size={20} />
          </div>
          <span>ChoreAid</span>
        </div>

        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-nav-login">
            Login
          </Link>

          <Link to="/signup" className="nav-signup-btn">
            Sign Up
          </Link>
        </div>
      </nav>


      {/* HERO */}
      <section className="hero" id="home">

        {/* HERO CONTENT */}
        <div className="hero-content">

  {/* Heading */}
  <div className="hero-heading">
    <h1>
      Your Home.
      <br />
      <span>Our Helping Hands.</span>
    </h1>
  </div>

  {/* Image */}
  <div className="hero-image-wrapper">
    <img src={heroImage} alt="ChoreAid home services" />

    {/* Keep your existing overlay here if you have one */}
  </div>

  {/* Paragraph + Buttons */}
  <div className="hero-bottom">
    <p>
      Find trusted professionals for every home service booked in minutes and managed with ease.
    </p>

    <div className="hero-actions">
      <button
        className="hero-primary-btn"
        onClick={() => navigate("/signup")}
      >
        Find Services
      </button>

      <button
        className="hero-secondary-btn"
        onClick={() =>
          document.getElementById("how-it-works")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      >
        How It Works
      </button>
    </div>
  </div>

</div>


        {/* LARGE HERO IMAGE */}
        {/* <div className="hero-image-wrapper">
          <img
            src={heroImage}
            alt="ChoreAid home service professionals"
            className="hero-banner-image"
          />

          <div className="hero-image-overlay">
            <div className="overlay-dot"></div>
            <span>Trusted professionals for your home</span>
          </div>
        </div> */}


        {/* TRUST FEATURES */}
        <div className="hero-features">

          <div className="hero-feature">
            <div className="feature-icon">
              <UserCheck size={19} />
            </div>

            <div>
              <strong>Verified Providers</strong>
              <span>Trusted professionals</span>
            </div>
          </div>

          <div className="hero-feature">
            <div className="feature-icon">
              <ClipboardCheck size={19} />
            </div>

            <div>
              <strong>Live Status Tracking</strong>
              <span>Know what's happening</span>
            </div>
          </div>

          <div className="hero-feature">
            <div className="feature-icon">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <strong>Simple & Secure</strong>
              <span>Easy booking experience</span>
            </div>
          </div>

        </div>

      </section>


      {/* SERVICES */}
      <section className="page-container services-section" id="services">

        <div className="section-heading">
          <span className="section-label">OUR SERVICES</span>

          <h2>Everything your home needs.</h2>

          <p>
            Connect with reliable professionals for your everyday
            home-service needs.
          </p>
        </div>

        <div className="grid grid-3">
          {categories.map((cat) => {
            const { icon: Icon, bg, color } = getServiceIcon(cat.name);

            return (
              <div
                key={cat._id}
                className="service-tile"
                onClick={() => navigate('/signup')}
              >
                <div
                  className="service-icon"
                  style={{
                    background: bg,
                    color: color,
                  }}
                >
                  <Icon size={23} />
                </div>

                <strong>{cat.name}</strong>

                <span className="service-arrow">→</span>
              </div>
            );
          })}
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section
        className="how-section page-container"
        id="how-it-works"
      >

        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>

          <h2>Getting help is simple.</h2>

          <p>
            From finding a professional to getting the job done,
            ChoreAid keeps everything simple.
          </p>
        </div>

        <div className="how-grid">

          <div className="how-card">
            <div className="how-number">01</div>

            <div className="how-icon">
              <ClipboardCheck size={25} />
            </div>

            <h3>Choose a Service</h3>

            <p>
              Select the home service you need and tell us
              what needs to be done.
            </p>
          </div>


          <div className="how-card">
            <div className="how-number">02</div>

            <div className="how-icon">
              <UserCheck size={25} />
            </div>

            <h3>Get Matched</h3>

            <p>
              Connect with a nearby professional who is
              available to take your request.
            </p>
          </div>


          <div className="how-card">
            <div className="how-number">03</div>

            <div className="how-icon">
              <CheckCircle2 size={25} />
            </div>

            <h3>Get It Done</h3>

            <p>
              Track your request, get the work completed,
              and pay securely.
            </p>
          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="home-footer" id="about">
        <div className="footer-logo">
          <div className="auth-logo-icon">
            <HomeIcon size={18} />
          </div>

          <span>ChoreAid</span>
        </div>

        <p>
          Home services, made simple.
        </p>

        <span className="footer-copy">
          © 2026 ChoreAid. All rights reserved.
        </span>
      </footer>

    </div>
  );
}

export default Home;