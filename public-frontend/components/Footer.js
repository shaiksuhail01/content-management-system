const Footer = () => {
  return (
    <footer className="mt-24 bg-[#292929] text-white">
      <div className="mx-auto max-w-[1440px] px-8 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold">
              Renew
              <span className="text-red-500">
                ✓
              </span>
              Cred
            </h2>

            <div className="mt-5 space-y-2 text-sm text-gray-300">
              <p>
                Indiranagar, Bengaluru,
                Karnataka, INDIA
              </p>

              <p>
                yp@renewcred.com
              </p>

              <p>
                There is no time to save
                the planet
              </p>

              <p>
                CIN No.: XXXXXXXX
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm text-gray-300">
            <div className="space-y-3">
              <p>Buyer</p>
              <p>Supplier</p>
              <p>Climate & Us</p>
              <p>Science</p>
              <p>Standards</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div>
            <p className="text-lg italic">
              🔒 No spam. Just pure climate
              intelligence.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your Email Address Please!"
                className="flex-1 rounded-full bg-white px-5 py-3 text-gray-900 outline-none"
              />

              <button className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-500 pt-7">
          <div className="flex flex-col justify-between gap-5 text-xs text-gray-400 md:flex-row">
            <p>
              Copyright © 2025 Renewcred.
              All rights reserved.
            </p>

            <div className="flex flex-wrap gap-7">
              <span>Privacy Policy</span>
              <span>
                Terms & Conditions
              </span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;