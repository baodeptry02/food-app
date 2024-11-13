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
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Wait until all images are fully loaded
    const imagePromises = Array.from(
      document.querySelectorAll(".gsap__item img")
    ).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    });

    Promise.all(imagePromises).then(() => {
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
        const gsapTrackWidth =
          document.querySelector(".gsap__track").offsetWidth;
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
    });
  }, [loading]);

  return (
    <section className="dark:bg-darkBg  transition-colors duration-500 ease-in-out wrapp w-screen h-[150vh] overflow-hidden relative pt-[120px] box-border">
      <main className="main">
        <section className="section-slider gsap_slider">
          <div className="content">
            <div className="section__slider gsap_h">
              <div className="gsap__bl">
                <div className="gsap__inner">
                  <div className="gsap__track relative">
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      products.map((product, index) => (
                        <div
                          className="gsap__item my-auto !h-[60%] xl:!h-[100%] relative rounded-lg"
                          key={index}
                        >
                          <img
                            className="rounded-lg w-full h-full object-cover"
                            src={product.imageDownloadUrl}
                            alt={product.itemName}
                          />
                          <div className="absolute h-[inherit] top-0 mt-12 z-10 left-[10%] text-white flex flex-col justify-around items-start gap-12 my-auto">
                            <div>
                              <h2 className="text-4xl">{product.itemName}</h2>
                              <p className="mt-6 text-2xl leading-normal">
                                Category: {product.category}
                              </p>
                              <p className=" text-2xl leading-normal">
                                Price: ${product.price}
                              </p>
                            </div>
                            <div>
                              <button className="text-test px-4 py-2 bg-transparent border-2 text-white font-roboto uppercase font-semibold text-base rounded-xl xl:mb-24">
                                Buy Now
                              </button>
                            </div>
                          </div>
                          <span className="gsap__item-img">
                            <img
                              src={product.imageDownloadUrl}
                              alt={product.itemName}
                            />
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="section-text">
          <div class="content">
            <p className="description-content">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos
              voluptatem fugit accusamus fuga vero quos, sint est laboriosam
              eveniet ea! Ducimus illum hic quas dolorem minima eius? Laboriosam
              iure deserunt totam sequi atque porro, dignissimos dolore sed
              laudantium. Ducimus modi corporis quaerat autem voluptates, quis,
              facere minima sequi reprehenderit itaque tempore illum
              perspiciatis delectus maiores! Aliquam placeat necessitatibus
              omnis voluptatem molestias repellat repudiandae quia ad quas, in
              accusantium, est enim esse quidem illo dolorem! Dolor, quam
              voluptatem! Facilis voluptatem tempore repellat accusamus quidem
              illo molestias odio, consequuntur rem mollitia dolores praesentium
              quisquam accusantium quo?
            </p>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Menu;
