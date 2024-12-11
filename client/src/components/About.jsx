import React from 'react';
import './About.css'; // Import your custom CSS file

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>Bunyaad</strong>, where we are committed to delivering exceptional services and building strong real estate communities.
        </p>
      </header>

      <section className="about-mission">
        <h2>Our Vission</h2>
        <p>
          To provide innovative solutions that streamline the procedure involved in real estate, while maintaining a commitment to your trust.
        </p>
      </section>

      <section className="about-story">
        <h2>Our Story</h2>
        <p>
          Founded in <strong>2024</strong>, our journey started with a passion for making a difference. O we have grown to become a trusted name in our industry, achieving milestones like <em>Award/Recognition</em> and expanding to serve a global audience.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-container">
          <div className="team-member">
            <img src="/images/team-member1.jpg" alt="John Doe" />
            <h3>tayaba</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src="/images/team-member2.jpg" alt="Jane Smith" />
            <h3>Areeb</h3>
            <p>Chief Operating Officer</p>
          </div>
          <div className="team-member">
            <img src="/images/team-member2.jpg" alt="Jane Smith" />
            <h3>Haris</h3>
            <p>Chief Operating Officer</p>
          </div>
          {/* Add more team members as needed */}
        </div>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <ul>
          <li>Market expertise</li>
          <li>Turst and transparency</li>
          <li>Sustainable growth</li>
          <li>Client centered approach</li>
        </ul>
      </section>

      <footer className="about-cta">
        <h2>Get in Touch</h2>
        <p>Ready to learn more? <a href="/contact">Contact us</a> today and let's start something great together.</p>
      </footer>
    </div>
  );
};

export default About;