import { Input, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import { Modal } from "../../ui/modal/index";
import { AxiosError } from "axios";
import { EnvironmentOutlined, FileOutlined } from "@ant-design/icons";
import {
  useUpdateLocation,
  useCreateLocation,
  useLocationByItem,
  useCreateHistory,
  useUpdateItemObject,
  ItemObject,
  Building,
  useAllBuildings,
  useBuildingId,
  useUpdateCategory,
  HistoryRequest,
} from "../../../hooks/useCategoryandBuildings";

interface LocationFormValues {
  fromBino?: number;
  fromQavat?: number;
  fromXona?: number;
  fromVitrina?: number;
  fromPolka?: number;
  toBino: number;
  toQavat: number;
  toXona: number;
  toVitrina: number;
  toPolka: number;
  reason: string;
  responsible: string;
  notes?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  itemData?: ItemObject;
}

export default function LocationModal({ visible, onClose, itemData }: Props) {
  const [form] = Form.useForm();
  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation();
  const { mutate: createLocation, isPending: isCreating } = useCreateLocation();
  const { mutate: createHistory } = useCreateHistory();
  const { mutate: updateItemObject } = useUpdateItemObject();
  const { mutate: updateCategory } = useUpdateCategory();
  const { data: allBuildings = [] } = useAllBuildings();
  const { data: currentLocation } = useLocationByItem(itemData?.id);

  const [selectedToBuildingId, setSelectedToBuildingId] = useState<
    number | null
  >(null);

  const { data: selectedToBuilding } = useBuildingId(selectedToBuildingId);

  const buildingOptions = allBuildings.map((b: Building) => ({
    value: b.id,
    label: b.name,
  }));

  const getBuildingName = (buildingId: number | null | undefined) => {
    if (!buildingId) {
      return "Noma'lum bino";
    }
    const building = allBuildings.find((b) => b.id === buildingId);
    return building ? building.name : `Bino ${buildingId}`;
  };

  const toFloorOptions = Array.from(
    { length: selectedToBuilding?.floors || 5 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const toRoomOptions = Array.from(
    { length: selectedToBuilding?.rooms || 20 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const toShowcaseOptions = Array.from(
    { length: selectedToBuilding?.showcase || 10 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const toPolkaOptions = Array.from(
    { length: selectedToBuilding?.polkas || 10 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const reasonOptions = [
    { value: "Yangi eksponat qo'shildi", label: "Yangi eksponat qo'shildi" },
    { value: "Ekspozitsiya o'zgarishi", label: "Ekspozitsiya o'zgarishi" },
    { value: "Remont ishlari", label: "Remont ishlari" },
    { value: "Xavfsizlik sababli", label: "Xavfsizlik sababli" },
    { value: "Sayyor ko'rgazma", label: "Sayyor ko'rgazma" },
    { value: "Saqlovga joylash", label: "Saqlovga joylash" },
    { value: "Boshqa", label: "Boshqa" },
  ];

  useEffect(() => {
    if (visible && itemData && currentLocation) {
      setSelectedToBuildingId(currentLocation.building_id);
    } else if (visible && itemData && !currentLocation) {
      form.setFieldsValue({
        fromBino: undefined,
        fromQavat: undefined,
        fromXona: undefined,
        fromVitrina: undefined,
        fromPolka: undefined,
        reason: undefined,
        responsible: "",
        notes: "",
      });
      setSelectedToBuildingId(null);
    }
  }, [visible, form, itemData, currentLocation]);

  useEffect(() => {
    if (visible && itemData && currentLocation) {
      form.setFieldsValue({
        fromBino: currentLocation.building_id,
        fromQavat: currentLocation.floor,
        fromXona: currentLocation.room,
        fromVitrina: currentLocation.showcase,
        fromPolka: currentLocation.polka,
        toBino: currentLocation.building_id,
        toQavat: currentLocation.floor,
        toXona: currentLocation.room,
        toVitrina: currentLocation.showcase,
        toPolka: currentLocation.polka,
        reason: undefined,
        responsible: currentLocation.infoName || "",
        notes: currentLocation.description || "",
      });
    }
  }, [visible, form, itemData, currentLocation]);

  const handleSubmit = (values: LocationFormValues) => {
    if (!itemData?.id) {
      message.error("Eksponat tanlanmagan!");
      return;
    }

    const payload = {
      infoName: values.responsible,
      description: values.notes,
      reasonForTransfer: values.reason,
      floor: values.toQavat,
      room: values.toXona,
      showcase: values.toVitrina,
      polka: values.toPolka,
      building_id: values.toBino,
      category_id: itemData.category_id,
      itemObject_id: itemData.id,
    };

    if (currentLocation?.id) {
      updateLocation(
        { id: currentLocation.id, payload },
        {
          onSuccess: () => {
            if (itemData?.id) {
              updateItemObject(
                { id: itemData.id, payload: { statusCategory: "Kuchirildi" } },
                {
                  onSuccess: () => {
                    createHistory(
                      {
                        name: `Item ${itemData.id} moved`,
                        data: {
                          key: itemData.id.toString(),
                          itemName: itemData.name,
                          info: {
                            reason: values.reason,
                            description: values.notes || "",
                            date: new Date().toISOString(),
                            fromLocation: currentLocation
                              ? {
                                  buildingId: currentLocation.building_id,
                                  buildingName: getBuildingName(
                                    currentLocation.building_id
                                  ),
                                  floor: currentLocation.floor,
                                  room: currentLocation.room,
                                  showcase: currentLocation.showcase,
                                  shelf: currentLocation.polka,
                                }
                              : null,
                            toLocation: {
                              buildingId: values.toBino,
                              buildingName: getBuildingName(values.toBino),
                              floor: values.toQavat,
                              room: values.toXona,
                              showcase: values.toVitrina,
                              shelf: values.toPolka,
                            },
                            responsiblePerson: values.responsible,
                          },
                        },
                      },
                      {
                        onSuccess: () => {
                          message.success(
                            "Eksponat muvaffaqiyatli ko'chirildi va tarix yozildi!"
                          );
                          form.resetFields();
                          onClose();
                        },
                        onError: (error: unknown) => {
                          const axiosError = error as AxiosError;
                          message.error(
                            "Tarix yozishda xatolik: " +
                              (axiosError.response?.data?.message ||
                                "Noma'lum xatolik")
                          );
                          form.resetFields();
                          onClose();
                        },
                      }
                    );
                  },
                  onError: (error: unknown) => {
                    console.error("Error updating item statusCategory:", error);
                    createHistory(
                      {
                        name: `Item ${itemData.id} moved`,
                        data: {
                          key: itemData.id.toString(),
                          itemName: itemData.name,
                          info: {
                            reason: values.reason,
                            description: values.notes || "",
                            date: new Date().toISOString(),
                            fromLocation: currentLocation
                              ? {
                                  buildingId: currentLocation.building_id,
                                  buildingName: getBuildingName(
                                    currentLocation.building_id
                                  ),
                                  floor: currentLocation.floor,
                                  room: currentLocation.room,
                                  showcase: currentLocation.showcase,
                                  shelf: currentLocation.polka,
                                }
                              : null,
                            toLocation: {
                              buildingId: values.toBino,
                              buildingName: getBuildingName(values.toBino),
                              floor: values.toQavat,
                              room: values.toXona,
                              showcase: values.toVitrina,
                              shelf: values.toPolka,
                            },
                            responsiblePerson: values.responsible,
                          },
                        },
                      },
                      {
                        onSuccess: () => {
                          message.success(
                            "Eksponat muvaffaqiyatli ko'chirildi va tarix yozildi!"
                          );
                          form.resetFields();
                          onClose();
                        },
                        onError: (error: unknown) => {
                          const axiosError = error as AxiosError;
                          message.error(
                            "Tarix yozishda xatolik: " +
                              (axiosError.response?.data?.message ||
                                "Noma'lum xatolik")
                          );
                          form.resetFields();
                          onClose();
                        },
                      }
                    );
                  },
                }
              );
            } else {
              createHistory(
                {
                  name: `Item ${itemData.id} moved`,
                  data: {
                    key: itemData.id.toString(),
                    itemName: itemData.name,
                    info: {
                      reason: values.reason,
                      description: values.notes || "",
                      date: new Date().toISOString(),
                      fromLocation: currentLocation
                        ? {
                            buildingId: currentLocation.building_id,
                            buildingName: getBuildingName(
                              currentLocation.building_id
                            ),
                            floor: currentLocation.floor,
                            room: currentLocation.room,
                            showcase: currentLocation.showcase,
                            shelf: currentLocation.polka,
                          }
                        : null,
                      toLocation: {
                        buildingId: values.toBino,
                        buildingName: getBuildingName(values.toBino),
                        floor: values.toQavat,
                        room: values.toXona,
                        showcase: values.toVitrina,
                        shelf: values.toPolka,
                      },
                      responsiblePerson: values.responsible,
                    },
                  },
                },
                {
                  onSuccess: () => {
                    message.success(
                      "Eksponat muvaffaqiyatli ko'chirildi va tarix yozildi!"
                    );
                    form.resetFields();
                    onClose();
                  },
                  onError: (error: unknown) => {
                    const axiosError = error as AxiosError;
                    message.error(
                      "Tarix yozishda xatolik: " +
                        (axiosError.response?.data?.message ||
                          "Noma'lum xatolik")
                    );
                    form.resetFields();
                    onClose();
                  },
                }
              );
            }
          },
          onError: (error: unknown) => {
            const axiosError = error as AxiosError;
            message.error(
              axiosError.response?.data?.message || "Xatolik yuz berdi"
            );
          },
        }
      );
    } else {
      createLocation(payload, {
        onSuccess: (newLocation) => {
          if (itemData?.id) {
            updateItemObject(
              { id: itemData.id, payload: { statusCategory: "Kuchirildi" } },
              {
                onSuccess: () => {
                  createHistory(
                    {
                      name: `Item ${itemData.id} location created`,
                      data: {
                        key: itemData.id.toString(),
                        itemName: itemData.name,
                        info: {
                          reason: values.reason || "Yangi joylashuv yaratildi",
                          description: values.notes || "",
                          date: new Date().toISOString(),
                          fromLocation: null,
                          toLocation: {
                            buildingId: values.toBino,
                            buildingName: getBuildingName(values.toBino),
                            floor: values.toQavat,
                            room: values.toXona,
                            showcase: values.toVitrina,
                            shelf: values.toPolka,
                          },
                          responsiblePerson: values.responsible,
                        },
                      },
                    },
                    {
                      onSuccess: () => {
                        message.success(
                          "Joylashuv muvaffaqiyatli saqlandi va tarix yozildi!"
                        );
                        form.resetFields();
                        onClose();
                      },
                      onError: (error: unknown) => {
                        const axiosError = error as AxiosError;
                        message.error(
                          "Tarix yozishda xatolik: " +
                            (axiosError.response?.data?.message ||
                              "Noma'lum xatolik")
                        );
                        form.resetFields();
                        onClose();
                      },
                    }
                  );
                },
                onError: (error: unknown) => {
                  console.error("Error updating item statusCategory:", error);
                  createHistory(
                    {
                      name: `Item ${itemData.id} location created`,
                      data: {
                        key: itemData.id.toString(),
                        itemName: itemData.name,
                        info: {
                          reason: values.reason || "Yangi joylashuv yaratildi",
                          description: values.notes || "",
                          date: new Date().toISOString(),
                          fromLocation: null,
                          toLocation: {
                            buildingId: values.toBino,
                            buildingName: getBuildingName(values.toBino),
                            floor: values.toQavat,
                            room: values.toXona,
                            showcase: values.toVitrina,
                            shelf: values.toPolka,
                          },
                          responsiblePerson: values.responsible,
                        },
                      },
                    },
                    {
                      onSuccess: () => {
                        message.success(
                          "Joylashuv muvaffaqiyatli saqlandi va tarix yozildi!"
                        );
                        form.resetFields();
                        onClose();
                      },
                      onError: (error: unknown) => {
                        const axiosError = error as AxiosError;
                        message.error(
                          "Tarix yozishda xatolik: " +
                            (axiosError.response?.data?.message ||
                              "Noma'lum xatolik")
                        );
                        form.resetFields();
                        onClose();
                      },
                    }
                  );
                },
              }
            );
          } else {
            createHistory(
              {
                name: `Item ${itemData.id} location created`,
                data: {
                  key: itemData.id.toString(),
                  itemName: itemData.name,
                  info: {
                    reason: values.reason || "Yangi joylashuv yaratildi",
                    description: values.notes || "",
                    date: new Date().toISOString(),
                    fromLocation: null,
                    toLocation: {
                      buildingId: values.toBino,
                      buildingName: getBuildingName(values.toBino),
                      floor: values.toQavat,
                      room: values.toXona,
                      showcase: values.toVitrina,
                      shelf: values.toPolka,
                    },
                    responsiblePerson: values.responsible,
                  },
                },
              },
              {
                onSuccess: () => {
                  message.success(
                    "Joylashuv muvaffaqiyatli saqlandi va tarix yozildi!"
                  );
                  form.resetFields();
                  onClose();
                },
                onError: (error: unknown) => {
                  const axiosError = error as AxiosError;
                  message.error(
                    "Tarix yozishda xatolik: " +
                      (axiosError.response?.data?.message || "Noma'lum xatolik")
                  );
                  form.resetFields();
                  onClose();
                },
              }
            );
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError;
          message.error(
            axiosError.response?.data?.message || "Joylashuv yaratishda xatolik"
          );
        },
      });
    }
  };

  const handleBuildingChange = (value: number) => {
    setSelectedToBuildingId(value);
    form.setFieldValue("toBino", value);
  };

  return (
    <Modal
      title={
        currentLocation ? "Eksponatni ko'chirish" : "Joylashuvni belgilash"
      }
      isOpen={visible}
      onClose={onClose}
      className="max-w-[1000px] max-h-[90vh] p-6 overflow-auto"
    >
      <div className="bg-[#EFF6FF] p-3 mb-4 rounded mt-4">
        <div className="text-[13px] font-bold">{itemData?.name}</div>
        <div className="text-[12px] text-[#9333EA] mt-1">
          KK-{itemData?.id} / {itemData?.name}
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#fee] p-4 rounded border border-red-200 dark:border-red-500">
            <div className="flex items-center mb-3 text-red-600 font-bold">
              <EnvironmentOutlined className="mr-2" />
              QAYERDAN (Hozirgi)
            </div>
            {currentLocation ? (
              <>
                <div className="flex flex-col gap-4 text-sm">
                  <p>
                    Bino:{" "}
                    <span className="font-bold">
                      {currentLocation?.building?.name}
                    </span>
                  </p>
                  <p>
                    Qavat:{" "}
                    <span className="font-bold">
                      {currentLocation?.floor}-qavat
                    </span>
                  </p>
                  <p>
                    Xona:{" "}
                    <span className="font-bold">
                      Xona-{currentLocation?.room}
                    </span>
                  </p>
                  <p>
                    Vitrina:{" "}
                    <span className="font-bold">
                      Vitrina-{currentLocation?.showcase}
                    </span>
                  </p>
                  <p>
                    Polka:{" "}
                    <span className="font-bold">
                      Polka-{currentLocation?.polka}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Eksponat hali joylashtirilmagan</p>
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded border border-green-200 dark:border-green-500">
            <div className="flex items-center mb-3 text-green-600 font-bold">
              → QAYERGA (Yangi)
            </div>
            <Form.Item
              label="Bino"
              name="toBino"
              rules={[{ required: true, message: "Bino tanlang" }]}
            >
              <Select
                placeholder="Bino tanlang"
                options={buildingOptions}
                onChange={handleBuildingChange}
              />
            </Form.Item>
            <Form.Item
              label="Qavat"
              name="toQavat"
              rules={[{ required: true, message: "Qavat tanlang" }]}
            >
              <Select placeholder="Qavat tanlang" options={toFloorOptions} />
            </Form.Item>
            <Form.Item
              label="Xona"
              name="toXona"
              rules={[{ required: true, message: "Xona tanlang" }]}
            >
              <Select placeholder="Xona tanlang" options={toRoomOptions} />
            </Form.Item>
            <Form.Item
              label="Vitrina"
              name="toVitrina"
              rules={[{ required: true, message: "Vitrina tanlang" }]}
            >
              <Select
                placeholder="Vitrina tanlang"
                options={toShowcaseOptions}
              />
            </Form.Item>
            <Form.Item
              label="Polka"
              name="toPolka"
              rules={[{ required: true, message: "Polka tanlang" }]}
            >
              <Select placeholder="Polka tanlang" options={toPolkaOptions} />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label={"Ko'chirish sababi *"}
          name="reason"
          rules={[{ required: true, message: "Sababni tanlang" }]}
        >
          <Select placeholder="Tanlang" options={reasonOptions} />
        </Form.Item>

        <Form.Item
          label="Mas'ul shaxs *"
          name="responsible"
          rules={[{ required: true, message: "Mas'ul shaxsni kiriting" }]}
        >
          <Input placeholder="F.I.O va lavozim" />
        </Form.Item>

        <Form.Item label="Qo'shimcha izohlar" name="notes">
          <Input.TextArea placeholder="Qo'shimcha ma'lumotlar..." rows={3} />
        </Form.Item>

        <div className="flex gap-3 mt-4">
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
            className="bg-green-600"
          >
            <FileOutlined />{" "}
            {currentLocation
              ? "Ko'chirishni tasdiqlash"
              : "Joylashuvni saqlash"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
