"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";
import { createPortal } from "react-dom";

const BUY_ME_A_COFFEE_URL = "https://www.buymeacoffee.com/ymffuture";

/* ----------------------------------
   Skeleton Loader
---------------------------------- */

const MenuCardSkeleton = () => {
  return (
    <div
      className="
        relative
        bg-white/80 dark:bg-zinc-900/80
        border border-gray-200 dark:border-zinc-700
        rounded-3xl overflow-hidden
        shadow-lg
        animate-pulse
      "
    >
      <div className="h-56 sm:h-64 bg-gray-200 dark:bg-zinc-800" />

      <div className="p-6 space-y-4">
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-zinc-700 rounded" />

        <div className="flex justify-between pt-4">
          <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-700 rounded-full" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-zinc-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------
   Reusable Modal (PORTAL + A11Y)
---------------------------------- */

const Modal = ({ title, children, onClose }) => {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white dark:bg-zinc-900
          border border-gray-200 dark:border-zinc-700
          rounded-3xl shadow-2xl
          max-w-md w-full p-6
        "
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h2>

        {children}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl
              bg-gray-100 dark:bg-zinc-800
              text-gray-700 dark:text-gray-300
              hover:bg-red-500 hover:text-white
              transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ----------------------------------
   Main Menu Card
---------------------------------- */

const MenuCard = ({
  name,
  price,
  tag,
  image,
  description,
  loading = false,
}) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  // Safe window.open (works with SSR)
  const openPayment = () => {
    if (typeof window === "undefined") return;

    const newTab = window.open(
      BUY_ME_A_COFFEE_URL,
      "_blank",
      "noopener,noreferrer"
    );

    if (!newTab) {
      alert("Pop-up blocked. Please allow pop-ups.");
    }
  };

  if (loading) return <MenuCardSkeleton />;

  return (
    <>
      {/* CARD */}
      <div
        className="
          group relative
          dark:bg-zinc-900/80
          backdrop-blur-xl
          border border-gray-200/60 dark:border-zinc-700
          rounded-3xl overflow-hidden
          shadow-lg shadow-black/5
          hover:shadow-cyan-500/20
          transition-all duration-300
        "
      >
        {/* Image */}
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="
              w-full h-56 sm:h-64 object-cover
              transition-transform duration-500
              group-hover:scale-110
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {tag && (
            <span
              className="
                absolute top-4 left-4
                bg-gradient-to-r from-cyan-500 to-blue-500
                text-white px-4 py-1.5
                rounded-full text-xs font-semibold
                shadow-lg
              "
            >
              {tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <h3
            className="
              text-xl font-extrabold
              text-gray-900 dark:text-gray-100
              group-hover:text-cyan-500
              transition
            "
          >
            {name}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Starting from
          </p>

          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            {price}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setInfoOpen(true)}
              className="
                text-cyan-600 dark:text-cyan-400
                text-2xl
                hover:scale-125
                transition-transform
              "
              aria-label="More information"
            >
              <IoInformationCircleOutline />
            </button>

            <button
              onClick={() => setPayOpen(true)}
              className="
                px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-cyan-500 to-blue-500
                text-white font-semibold
                shadow-lg shadow-cyan-500/30
                hover:scale-105 hover:shadow-cyan-500/50
                transition
              "
            >
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* INFO MODAL */}
      {infoOpen && (
        <Modal title={`About ${name}`} onClose={() => setInfoOpen(false)}>
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover rounded-2xl mb-4"
          />
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {description ||
              "Detailed information about this product will appear here."}
          </p>
        </Modal>
      )}

      {/* PAYMENT MODAL */}
      {payOpen && (
        <Modal
          title={`Purchase: ${name?.slice(0, 12) ?? "Item"}...`}
          onClose={() => setPayOpen(false)}
        >
          <div className="text-center space-y-4">
            <FaWallet className="mx-auto text-4xl text-cyan-500" />

            <p className="text-gray-700 dark:text-gray-300">
              You're purchasing <strong>{name}</strong> for{" "}
              <strong>{price}</strong>.
            </p>

            <button
              onClick={openPayment}
              className="
                w-full py-3 rounded-xl
                bg-gradient-to-r from-cyan-500 to-blue-500
                text-white font-semibold
                shadow-lg shadow-cyan-500/30
                hover:shadow-cyan-500/50
                transition
              "
            >
              Continue Payment
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default React.memo(MenuCard);
