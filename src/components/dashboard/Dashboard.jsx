import { Helmet } from "react-helmet";

export default function Dashboard() {
  return (
    <>
      {/* SEO Meta */}
      <Helmet>
        <title>Dashboard | SwiftMeta</title>
        <meta
          name="description"
          content="Manage your projects, explore tools, and build modern websites using SwiftMeta’s powerful dashboard."
        />
        <link
          rel="canonical"
          href="https://swiftmeta.vercel.app/dashboard"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Main Content */}
      <main
        role="main"
        aria-label="SwiftMeta dashboard overview"
        className="w-full"
      >
        <section className="w-full py-20 text-center scale-95">
          {/* Gradient Apple-style headline */}
          <h1
            className="
              text-5xl md:text-6xl font-semibold tracking-tight
              bg-gradient-to-br from-gray-900 to-gray-600
              dark:from-white dark:to-gray-400
              bg-clip-text text-transparent
              drop-shadow-sm
              animate-fadeIn
            "
          >
            Elevate Your Digital Experience
          </h1>

          {/* Sub text */}
          <p
            className="
              mt-6 text-lg md:text-xl
              text-gray-600 dark:text-gray-400
              max-w-2xl mx-auto leading-relaxed
              animate-fadeIn delay-200
            "
          >
            Build modern websites, explore free tools, manage your projects, and
            unlock premium features — all in one beautifully crafted platform.
          </p>

          {/* Divider like Apple */}
          <div
            className="
              mt-10 w-40 mx-auto h-[8px]
              bg-gray-300 dark:bg-gray-700
              rounded-full
              animate-fadeIn delay-500
            "
            aria-hidden="true"
          />
        </section>
      </main>
    </>
  );
}
