import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function Blank() {
  return (
    <div>
      <PageMeta title="Muzey | Blank Page" description="Muzey Blank Page" />
      <PageBreadcrumb pageTitle="Ko'chirishlar" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-dark px-5 py-7">
        <div className="w-full">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-xl">
            Ko'chirishlar Tarixi:
          </h3>
          <div>
            <div className="w-full p-6 bg-white dark:bg-gray-dark rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Buxoro dinari
              </h2>

              <p className="text-gray-700 dark:text-gray-400 text-sm mb-1">KP-1 / INV-VI/01-001</p>

              <p className="text-gray-700 dark:text-gray-400 text-sm mb-1">
                <span className="font-medium">Sabab:</span> Sayyor ko'rgazma
              </p>

              <p className="text-gray-700 dark:text-gray-400 text-sm mb-1">
                <span className="font-medium">Mas'ul:</span> Abbos
              </p>

              <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">2025-12-07 21:23:32</p>

              <div className="mt-4 border-t border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
