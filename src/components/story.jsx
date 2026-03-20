import "./Story.css";
import { useEffect, useState } from "react";

export default function Story() {

  const [active, setActive] = useState(0);

  const cards = [
    {
      icon: "🌼",
      title: "The Problem",
      text: "Temple flowers are dumped into rivers causing pollution."
    },
    {
      icon: "♻️",
      title: "The Solution",
      text: "FloraCycle connects temples with recycling vendors."
    },
    {
      icon: "🌍",
      title: "The Impact",
      text: "Flowers become incense, compost and eco products."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="story-section">

      <h2>Our Story</h2>

      <div className="story-slider">

        {cards.map((card, index) => (
          <div
            key={index}
            className={`story-card ${index === active ? "active" : ""}`}
          >
            <div className="icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </div>
        ))}

      </div>

      <div className="flower f1">🌸</div>
      <div className="flower f2">🌼</div>
      <div className="flower f3">🌺</div>
      <div className="flower f4">🌷</div>

    </section>
  );
}