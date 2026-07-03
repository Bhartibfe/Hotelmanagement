import $ from "jquery";
import { useEffect } from "react";

export const useParticles = () => {
  useEffect(() => {
    if ($(".banner-area-three, .banner-area-five").length) {
      const colors = ["#FF4D4D", "#1AD6FF", "#FFCD4D", "#BB6BD9", "#1A66FF"];

      const numBalls = 30;
      const balls = [];

      for (let i = 0; i < numBalls; i++) {
        let ball = document.createElement("div");
        ball.classList.add("ball");
        ball.style.background =
          colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = `${Math.floor(Math.random() * 100)}%`;
        ball.style.top = `${Math.floor(Math.random() * 100)}%`;
        ball.style.transform = `scale(${Math.random()})`;
        ball.style.width = `${Math.random() * 10}px`;
        ball.style.height = ball.style.width;
        balls.push(ball);

        $(".banner-area-three, .banner-area-five").append(ball);
      }

      balls.forEach((el, i, ra) => {
        let to = {
          x: Math.random() * (i % 2 === 0 ? -10 : 11),
          y: Math.random() * 12,
        };

        let anim = el.animate(
          [
            { transform: "translate(0, 0)" },
            { transform: `translate(${to.x}rem, ${to.y}rem)` },
          ],
          {
            duration: (Math.random() + 1) * 2000,
            direction: "alternate",
            fill: "both",
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      });
    }
  }, []);
};

export const useParticlesTestimonialFive = () => {
  useEffect(() => {
    if ($(".testimonial-area-five").length) {
      const colors = ["#FF4D4D", "#1AD6FF", "#FFCD4D", "#BB6BD9", "#1A66FF"];

      const numBalls = 30;
      const balls = [];

      for (let i = 0; i < numBalls; i++) {
        let ball = document.createElement("div");
        ball.classList.add("ball");
        ball.style.background =
          colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = `${Math.floor(Math.random() * 100)}%`;
        ball.style.top = `${Math.floor(Math.random() * 100)}%`;
        ball.style.transform = `scale(${Math.random()})`;
        ball.style.width = `${Math.random() * 10}px`;
        ball.style.height = ball.style.width;
        balls.push(ball);

        $(".testimonial-area-five").append(ball);
      }

      balls.forEach((el, i, ra) => {
        let to = {
          x: Math.random() * (i % 2 === 0 ? -10 : 11),
          y: Math.random() * 12,
        };

        let anim = el.animate(
          [
            { transform: "translate(0, 0)" },
            { transform: `translate(${to.x}rem, ${to.y}rem)` },
          ],
          {
            duration: (Math.random() + 1) * 2000,
            direction: "alternate",
            fill: "both",
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      });
    }
  }, []);
};
