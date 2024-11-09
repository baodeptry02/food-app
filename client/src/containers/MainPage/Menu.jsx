import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import _ from "lodash";
import { getAllProducts } from "../../api/productApi";

gsap.registerPlugin(ScrollTrigger);

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      fetchProducts();
    }, 5000);
  }, []);

  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    const initScrollTrigger = () => {
      const gsapBlWidth = document.querySelector(".gsap__bl").offsetWidth;
      const gsapTrackWidth = document.querySelector(".gsap__track").offsetWidth;
      const scrollSliderTransform = gsapTrackWidth - gsapBlWidth;

      gsap.to(".gsap__track", {
        scrollTrigger: {
          trigger: ".gsap_slider",
          start: "center center",
          end: () => `+=${gsapTrackWidth}`,
          pin: true,
          scrub: true,
        },
        x: `-=${scrollSliderTransform}px`,
      });
    };
    initScrollTrigger();

    const debouncedResize = _.debounce(() => {
      ScrollTrigger.refresh();
    }, 500);
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [loading]);

  return (
    <div className="wrapp">
      <main className="main">
        <section className="section-slider gsap_slider">
          <div className="content">
            <div className="section__slider gsap_h">
              <div className="gsap__bl">
                <div className="gsap__inner">
                  <div className="gsap__track">
                    {loading && <div>Loading...</div>}
                    {products.map((product, index) => (
                      <div className="gsap__item" key={index}>
                        <img
                          src={product.imageDownloadUrl}
                          alt={product.itemName}
                        />
                        <h2>{product.itemName}</h2>
                        <p>Category: {product.category}</p>
                        <p>Price: ${product.price}</p>
                        <button>Buy Now</button>
                        <span className="gsap__item-img">
                          <img
                            src={product.imageDownloadUrl}
                            alt={product.itemName}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-text">
          <div className="content">
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Menu;
