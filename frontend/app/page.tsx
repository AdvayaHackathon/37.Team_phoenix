'use client';

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: 'Invest in Tourism',
      description: 'Buy shares in popular tourist destinations and earn returns from their success.',
      icon: '/globe.svg',
    },
    {
      title: 'Track Performance',
      description: 'Monitor your investment portfolio and track destination performance in real-time.',
      icon: '/window.svg',
    },
    {
      title: 'Diversify Holdings',
      description: 'Spread your investments across different types of tourism destinations worldwide.',
      icon: '/file.svg',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Invest in the Future of Tourism
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-100">
              Own shares in the world's most beautiful destinations. Start your journey in tourism investment today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link



                href="/destinations"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse Destinations
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose Tourism Stock?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover a new way to invest in the tourism industry while supporting sustainable development.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      className="h-6 w-6 text-white"
                      width={24}
                      height={24}
                    />
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Your Investment Journey Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of investors who are already profiting from the growing tourism industry.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get Started
              </Link>
              <Link href="/market" className="text-sm font-semibold leading-6 text-white">
                View Market <span aria-hidden="true">→</span>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
