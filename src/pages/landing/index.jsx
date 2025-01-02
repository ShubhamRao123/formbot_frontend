import React from "react";
import styles from "./landing.module.css";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734951325/SVG_1_hcpldz.png"
            alt=""
          />
          FormBot
        </div>
        <div className={styles.navButtons}>
          <button
            className={styles.navButton}
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
          <button
            className={styles.navButton1}
            onClick={() => navigate("/login")}
          >
            Create a FormBot
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.heroContainer}>
          <img
            className={styles.heroLeftImage}
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734947038/SVG_gsk00y.png"
            alt="Triangle"
          />
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>
              Build advanced chatbots visually
            </h1>
            <p className={styles.heroSubtitle}>
              Typebot gives you powerful blocks to create unique chat
              experiences. Embed them anywhere on your web/mobile apps and start
              collecting results like magic.
            </p>
            <button className={styles.ctaButton}>
              Create a FormBot for free
            </button>
          </div>
          <img
            className={styles.heroRightImage}
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734947033/Container_1_mkjnng.png"
            alt="Semi Circle"
          />
        </div>

        <div className={styles.imageSection}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734946968/Container_j31qvr.png"
            alt="Form builder interface"
            className={styles.heroImage}
          />
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo2}>
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734951325/SVG_1_hcpldz.png"
                alt=""
              />
              FormBot
            </div>
            <p>
              Made with ❤️ <span>by @cuvette</span>{" "}
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4>Product</h4>
            <p>
              <a href="#">
                Status{" "}
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734954573/SVG_mfr3p0.png"
                  alt=""
                />
              </a>
            </p>
            <p>
              <a href="#">
                Documentation{" "}
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734954573/SVG_mfr3p0.png"
                  alt=""
                />
              </a>
            </p>
            <p>
              <a href="#">
                Roadmap{" "}
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734954573/SVG_mfr3p0.png"
                  alt=""
                />
              </a>
            </p>
            <p>
              <a href="#">Pricing </a>
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4>Community</h4>
            <p>
              <a href="#">
                Discord{" "}
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734954573/SVG_mfr3p0.png"
                  alt=""
                />
              </a>
            </p>
            <p>
              <a href="#">
                GitHub repository{" "}
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734954573/SVG_mfr3p0.png"
                  alt=""
                />
              </a>
            </p>
            <p>
              <a href="#">
                Twitter{" "}
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734954573/SVG_mfr3p0.png"
                  alt=""
                />
              </a>
            </p>
            <p>
              <a href="#">
                LinkedIn{" "}
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734954573/SVG_mfr3p0.png"
                  alt=""
                />
              </a>
            </p>
            <p>
              <a href="#">OSS Friends</a>
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <p>
              <a href="#">About</a>
            </p>
            <p>
              <a href="#">Contact</a>
            </p>
            <p>
              <a href="#">Terms of Service</a>
            </p>
            <p>
              <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
