import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import { RightOutlined } from "@ant-design/icons";
import LocationModal from "../../components/ui/modal/LocationModal";
import { useState } from "react";
import {
  useDeleteItemObject,
  useItemObjects,
} from "../../hooks/useCategoryandBuildings";
import AddUpdateItemModal from "../../components/ui/modal/AddandUpdateModal";
import ViewItemModal from "../../components/ui/modal/EksponatSeeModal";
import { message } from "antd";

type ItemObject = {
  id: number;
  category_id: number;
  name: string;
  material: string;
  period: number;
  price: string;
  status: string;
  fondType: string;

};


export default function Home() {
  const { data: itemObjects = [], isLoading, error } = useItemObjects();

  const { mutate: deleteItem } = useDeleteItemObject();

  const [modalState, setModalState] = useState({
    addUpdate: false,
    view: false,
    location: false,
  });

  const [selectedItem, setSelectedItem] = useState<ItemObject | undefined>(undefined);


  const handleView = (item: ItemObject) => {
    setSelectedItem(item);
    setModalState({ ...modalState, view: true });
  };

  const handleDelete = (id: number) => {
    deleteItem(id, {
      onSuccess: () => {
        message.success("Eksponat muvaffaqiyatli o'chirildi!");
      },
      onError: () => {
        message.error("O'chirishda xatolik!");
      },
    });
  };

  return (
    <>
      <PageMeta title="Dashboard Muzey" description="Dashboard Muzey" />
      <h2 className="font-bold mb-4 text-2xl dark:text-gray-400">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
        </div>
      </div>

      <div className="w-full bg-white dark:bg-gray-dark mt-6 border dark:border-gray-800 rounded-lg p-6">
        <h2 className="font-bold mb-4 dark:text-gray-400">Eksponatlar</h2>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Eksponatlar yuklanmoqda...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 mb-4">
            <p className="text-red-600 dark:text-red-400">
              Xatolik: {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {itemObjects?.length > 0 ? (
            [...itemObjects].sort((a, b) => a.id - b.id).map((item: ItemObject) => (
              <div
                key={item.id}
                className="border-b dark:border-b-gray-600 flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded transition-colors"
              >
                <div className="flex flex-col justify-between flex-1">
                  <p className="font-medium dark:text-gray-400">{item.name}</p>
                  <p className="text-gray-600 dark:text-gray-500 text-sm">{`KP-${item.id}`}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleView(item)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <RightOutlined />
                  </button>

                  <AddUpdateItemModal
                    visible={modalState.addUpdate}
                    onClose={() =>
                      setModalState({ ...modalState, addUpdate: false })
                    }
                    initialData={selectedItem as ItemObject | any}
                  />

                  <ViewItemModal
                    visible={modalState.view}
                    onClose={() =>
                      setModalState({ ...modalState, view: false })
                    }
                    data={selectedItem as ItemObject | any}
                    onEdit={() => {
                      setModalState({
                        ...modalState,
                        view: false,
                        addUpdate: true,
                      });
                    }}
                    onDelete={() => {
                      handleDelete(selectedItem!.id);
                      setModalState({ ...modalState, view: false });
                    }}
                    onMove={() => {
                      setModalState({
                        ...modalState,
                        view: false,
                        location: true,
                      });
                    }}
                  />

                  <LocationModal
                    visible={modalState.location}
                    onClose={() =>
                      setModalState({ ...modalState, location: false })
                    }
                    itemData={selectedItem as ItemObject | any}
                  />
                </div>
              </div>
            ))
          ) : !isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Eksponatlar topilmadi
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
