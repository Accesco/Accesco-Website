'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function DeliveryHeading() {
  const [deliveryVisible, setDeliveryVisible] = useState(false);
  const deliveryRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setDeliveryVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );
    if (deliveryRef.current) observer.observe(deliveryRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={deliveryRef}
      className={`deliveryHeadingFrame ${deliveryVisible ? 'is-visible' : ''}`}
    >
      <div className="floatingHeroItems">
        <Image src="/images/burger.png" className="popItem popBurger" alt="Burger" width={100} height={100} sizes="100px" />
        <Image src="/images/pizza.png" className="popItem popPizza" alt="Pizza" width={100} height={100} sizes="100px" />
        <Image src="/images/Grocery.png" className="popItem popGrocery" alt="Grocery Basket" width={100} height={100} sizes="100px" />
        <Image src="/images/hoodie.png" className="popItem popHoodie" alt="Hoodie" width={100} height={100} sizes="100px" />
        <Image src="/images/salad.png" className="popItem popSalad" alt="Salad" width={100} height={100} sizes="100px" />
        <Image src="/images/Jeans.png" className="popItem popJeans" alt="Jeans" width={100} height={100} sizes="100px" />
      </div>

      <h2 className="deliveryHeadingTitle">
        India solved delivery in 10 minutes.<br />
        <span className="deliveryHeadingSubtitle">
          Nobody solved the household in 10 years.
        </span>
      </h2>

      <p className="deliveryHeadingDesc">
        Groceries, food and fashion at your doorstep in minutes — sourced straight from producers, built to circulate, and engineered so the value of everything you buy keeps working for your household — Intelligent Hyperlocal delivery app that fits your life.
      </p>
    </div>
  );
}