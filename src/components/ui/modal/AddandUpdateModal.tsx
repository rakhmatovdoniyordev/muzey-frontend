import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Form, Input, Select, Button, Row, Col, message, Spin } from "antd";
import { Modal } from "../../ui/modal/index";
import {
  useCreateItemObject,
  useUpdateItemObject,
  useCategories,
  useBuildings,
  useCategoriesAsosiy,
  useCreateLocation,
  useBuildingId,
} from "../../../hooks/useCategoryandBuildings";
import type { ItemObject } from "../../../hooks/useCategoryandBuildings";
import { FileOutlined } from "@ant-design/icons";

interface ItemFormValues {
  name: string;
  material: string;
  category_id: number;
  subcategory_id?: number;
  period: string;
  price: string;
  status: string;
  fondType: string;
  description?: string;
  bino: number;
  qavat: number;
  xona: number;
  vitrina: number;
  polka: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  initialData?: ItemObject;
}

export default function AddUpdateItemModal({
  visible,
  onClose,
  initialData,
}: Props) {
  const [form] = Form.useForm();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | null
  >(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );

  const { mutate: createItem, isPending: isCreating } = useCreateItemObject();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItemObject();
  const { mutate: createLocation } = useCreateLocation();

  const { data: asosiyCategories = [], isLoading: isLoadingAsosiy } =
    useCategoriesAsosiy();
  const { data: subCategories = [], isLoading: isLoadingSub } = useCategories();

  const { data: buildings = [], isLoading: isLoadingBuildings } =
    useBuildings();
  const { data: selectedBuilding, isLoading: isLoadingBuilding } =
    useBuildingId(selectedBuildingId);

  const isEditing = !!initialData?.id;
  const isLoading =
    isCreating ||
    isUpdating ||
    isLoadingAsosiy ||
    isLoadingSub ||
    isLoadingBuildings ||
    isLoadingBuilding;

  const categoryOptions = asosiyCategories.map((cat) => ({
    value: cat.id,
    label: `${cat.categoryNumber} - ${cat.name}`,
  }));

  const subcategoryOptions = subCategories
    .filter((sub) => sub.category_id === selectedCategoryId)
    .map((sub) => ({
      value: sub.id,
      label: `${sub.name} (${sub.status.map((s) => s.key).join(", ")})`,
    }));

  const buildingOptions = buildings.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const floorOptions = Array.from(
    { length: selectedBuilding?.floors || 20 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const roomOptions = Array.from(
    { length: selectedBuilding?.rooms || 15 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const showcaseOptions = Array.from(
    { length: selectedBuilding?.showcase || 20 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const polkaOptions = Array.from(
    { length: selectedBuilding?.polkas || 15 },
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  const statusOptions = [
    { value: "Qoniqarli", label: "Qoniqarli" },
    { value: "Qoniqarsiz", label: "Qoniqarsiz" },
  ];

  const fondOptions = [
    { value: "Asosiy", label: "Asosiy fond" },
    { value: "Yordamchi", label: "Yordamchi fond" },
    { value: "O'quv", label: "O'quv fond" },
  ];

  useEffect(() => {
    if (!visible) return;

    if (initialData) {
      setSelectedCategoryId(initialData.category_id);

      let subCategoryKey = null;
      if (initialData.sub_category_id) {
        const subCategory = subCategories.find(
          (sub) => sub.id === initialData.sub_category_id
        );
        if (subCategory) {
          subCategoryKey = null;
        }
      }

      form.setFieldsValue({
        name: initialData.name,
        material: initialData.material,
        category_id: initialData.category_id,
        subcategory_id: initialData.sub_category_id,
        period: initialData.period,
        price: initialData.price,
        status: initialData.status,
        fondType: initialData.fondType,
        description: initialData.description,
      });
    } else {
      form.resetFields();
      setSelectedCategoryId(null);
      setSelectedBuildingId(null);
    }
  }, [initialData, visible, form, subCategories]);

  const handleCategoryChange = (value: number) => {
    setSelectedCategoryId(value);
    form.setFieldValue("subcategory_id", undefined);
  };
  const handleSubCategoryChange = (value: number) => {
    setSelectedSubcategoryId(value);
  };

  const handleBuildingChange = (value: number) => {
    setSelectedBuildingId(value);
    form.setFieldValue("bino", value);
  };

  const handleSubmit = (values: ItemFormValues) => {
    const itemPayload: Partial<ItemObject> = {
      category_id: values.category_id,
      subCategory: values.subcategory_id
        ? subCategories.find((sub) => sub.id === values.subcategory_id)?.name ||
          "Noma'lum"
        : "Asosiy",
      name: values.name,
      material: values.material,
      period: Number(values.period),
      price: values.price,
      status: values.status,
      fondType: values.fondType,
      description: values.description,
    };

    if (values.subcategory_id) {
      itemPayload.sub_category_id = Number(values.subcategory_id);
    }
    if (isEditing && initialData?.id) {
      updateItem(
        { id: initialData.id, payload: itemPayload },
        {
          onSuccess: () => {
            message.success("Eksponat yangilandi!");
            onClose();
          },
          onError: (error: Error) => {
            let errorMessage = "Eksponat yangilashda xatolik";

            if (error instanceof AxiosError) {
              errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                errorMessage;
            } else {
              errorMessage = error.message || errorMessage;
            }

            message.error(errorMessage);
          },
        }
      );
    } else {
      createItem(itemPayload as Omit<ItemObject, "id">, {
        onSuccess: (newItem) => {
          const locationPayload = {
            itemObject_id: newItem.id,
            category_id: values.category_id,
            building_id: values.bino,
            floor: values.qavat,
            room: values.xona,
            showcase: values.vitrina,
            polka: values.polka,
          };

          createLocation(locationPayload, {
            onSuccess: () => {
              message.success("Joylashuv saqlandi!");
              message.success("Eksponat qo‘shildi!");
              onClose();
            },
            onError: (error: Error) => {
              let errorMessage = "Joylashuv qo'shishda xatolik";

              if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
              } else {
                errorMessage = error.message || errorMessage;
              }

              message.error(errorMessage);
              message.success("Eksponat qo‘shildi!");
              onClose();
            },
          });
        },
        onError: (error: Error) => {
          let errorMessage = "Eksponat qo'shishda xatolik";

          if (error instanceof AxiosError) {
            errorMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              error.message ||
              errorMessage;
          } else {
            errorMessage = error.message || errorMessage;
          }

          message.error(errorMessage);
        },
      });
    }
  };

  return (
    <Modal
      title={isEditing ? "Eksponatni yangilash" : "Yangi eksponat qo‘shish"}
      isOpen={visible}
      onClose={onClose}
      className="max-w-[900px] p-8 h-full overflow-auto max-h-[80vh]"
    >
      {isLoading ? (
        <Spin tip="Yuklanmoqda..." />
      ) : (
        <div className="overflow-y-auto mt-8">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Nomi"
                  name="name"
                  rules={[{ required: true, message: "Nomini kiriting" }]}
                >
                  <Input placeholder="Masalan: Buxoro dinari" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Material"
                  name="material"
                  rules={[{ required: true, message: "Materialni kiriting" }]}
                >
                  <Input placeholder="Masalan: Kumush" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Asosiy kategoriya"
                  name="category_id"
                  rules={[{ required: true, message: "Kategoriyani tanlang" }]}
                >
                  <Select
                    placeholder={
                      <span
                        style={{
                          color: document.documentElement.classList.contains(
                            "dark"
                          )
                            ? "#bcbcbc"
                            : "#6b7280",
                        }}
                      >
                        Tanlang
                      </span>
                    }
                    style={{
                      backgroundColor:
                        document.documentElement.classList.contains("dark")
                          ? "#101828"
                          : "#ffffff",
                      borderColor: document.documentElement.classList.contains(
                        "dark"
                      )
                        ? "#344054"
                        : "#d1d5db",
                      color: document.documentElement.classList.contains("dark")
                        ? "#ffffff"
                        : "#1f2937",
                    }}
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Qism kategoriya" name="subcategory_id">
                  <Select
                    placeholder={
                      <span
                        style={{
                          color: document.documentElement.classList.contains(
                            "dark"
                          )
                            ? "#bcbcbc"
                            : "#6b7280",
                        }}
                      >
                        Tanlang
                      </span>
                    }
                    style={{
                      backgroundColor:
                        document.documentElement.classList.contains("dark")
                          ? "#101828"
                          : "#ffffff",
                      borderColor: document.documentElement.classList.contains(
                        "dark"
                      )
                        ? "#344054"
                        : "#d1d5db",
                      color: document.documentElement.classList.contains("dark")
                        ? "#ffffff"
                        : "#1f2937",
                    }}
                    options={subcategoryOptions}
                    onChange={handleSubCategoryChange}
                  />
                </Form.Item>
                <Form.Item name="subId" noStyle>
                  <input type="hidden" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Davr / Sana"
                  name="period"
                  rules={[{ required: true, message: "Davrni kiriting" }]}
                >
                  <Input placeholder="Masalan: XIX asr" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Holat"
                  name="status"
                  rules={[{ required: true, message: "Holatni tanlang" }]}
                >
                  <Select
                    options={statusOptions}
                    placeholder={
                      <span
                        style={{
                          color: document.documentElement.classList.contains(
                            "dark"
                          )
                            ? "#bcbcbc"
                            : "#6b7280",
                        }}
                      >
                        Tanlang
                      </span>
                    }
                    style={{
                      backgroundColor:
                        document.documentElement.classList.contains("dark")
                          ? "#101828"
                          : "#ffffff",
                      borderColor: document.documentElement.classList.contains(
                        "dark"
                      )
                        ? "#344054"
                        : "#d1d5db",
                      color: document.documentElement.classList.contains("dark")
                        ? "#ffffff"
                        : "#1f2937",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Qiymat"
                  name="price"
                  rules={[{ required: true, message: "Qiymatni kiriting" }]}
                >
                  <Input placeholder="2500000" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Fond turi"
                  name="fondType"
                  rules={[{ required: true, message: "Fond turini tanlang" }]}
                >
                  <Select
                    options={fondOptions}
                    placeholder={
                      <span
                        style={{
                          color: document.documentElement.classList.contains(
                            "dark"
                          )
                            ? "#bcbcbc"
                            : "#6b7280",
                        }}
                      >
                        Tanlang
                      </span>
                    }
                    style={{
                      backgroundColor:
                        document.documentElement.classList.contains("dark")
                          ? "#101828"
                          : "#ffffff",
                      borderColor: document.documentElement.classList.contains(
                        "dark"
                      )
                        ? "#344054"
                        : "#d1d5db",
                      color: document.documentElement.classList.contains("dark")
                        ? "#ffffff"
                        : "#1f2937",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {!isEditing && (
              <div className="border-t pt-4 mt-4 mb-4">
                <h4 className="font-bold mb-3 dark:text-white/80">
                  Joylashuv ma’lumotlari
                </h4>

                <div className="grid grid-cols-5 gap-2">
                  <Form.Item
                    label="Bino"
                    name="bino"
                    rules={[{ required: true, message: "Binoni tanlang" }]}
                  >
                    <Select
                      placeholder={
                        <span
                          style={{
                            color: document.documentElement.classList.contains(
                              "dark"
                            )
                              ? "#bcbcbc"
                              : "#6b7280",
                          }}
                        >
                          Tanlang
                        </span>
                      }
                      style={{
                        backgroundColor:
                          document.documentElement.classList.contains("dark")
                            ? "#101828"
                            : "#ffffff",
                        borderColor:
                          document.documentElement.classList.contains("dark")
                            ? "#344054"
                            : "#d1d5db",
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#ffffff"
                          : "#1f2937",
                      }}
                      options={buildingOptions}
                      onChange={handleBuildingChange}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Qavat"
                    name="qavat"
                    rules={[{ required: true, message: "Qavatni tanlang" }]}
                  >
                    <Select
                      options={floorOptions}
                      placeholder={
                        <span
                          style={{
                            color: document.documentElement.classList.contains(
                              "dark"
                            )
                              ? "#bcbcbc"
                              : "#6b7280",
                          }}
                        >
                          Tanlang
                        </span>
                      }
                      style={{
                        backgroundColor:
                          document.documentElement.classList.contains("dark")
                            ? "#101828"
                            : "#ffffff",
                        borderColor:
                          document.documentElement.classList.contains("dark")
                            ? "#344054"
                            : "#d1d5db",
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#ffffff"
                          : "#1f2937",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Xona"
                    name="xona"
                    rules={[{ required: true, message: "Xonani tanlang" }]}
                  >
                    <Select
                      options={roomOptions}
                      placeholder={
                        <span
                          style={{
                            color: document.documentElement.classList.contains(
                              "dark"
                            )
                              ? "#bcbcbc"
                              : "#6b7280",
                          }}
                        >
                          Tanlang
                        </span>
                      }
                      style={{
                        backgroundColor:
                          document.documentElement.classList.contains("dark")
                            ? "#101828"
                            : "#ffffff",
                        borderColor:
                          document.documentElement.classList.contains("dark")
                            ? "#344054"
                            : "#d1d5db",
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#ffffff"
                          : "#1f2937",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Vitrina"
                    name="vitrina"
                    rules={[{ required: true, message: "Vitrinani tanlang" }]}
                  >
                    <Select
                      options={showcaseOptions}
                      placeholder={
                        <span
                          style={{
                            color: document.documentElement.classList.contains(
                              "dark"
                            )
                              ? "#bcbcbc"
                              : "#6b7280",
                          }}
                        >
                          Tanlang
                        </span>
                      }
                      style={{
                        backgroundColor:
                          document.documentElement.classList.contains("dark")
                            ? "#101828"
                            : "#ffffff",
                        borderColor:
                          document.documentElement.classList.contains("dark")
                            ? "#344054"
                            : "#d1d5db",
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#ffffff"
                          : "#1f2937",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Polka"
                    name="polka"
                    rules={[{ required: true, message: "Polkani tanlang" }]}
                  >
                    <Select
                      options={polkaOptions}
                      placeholder={
                        <span
                          style={{
                            color: document.documentElement.classList.contains(
                              "dark"
                            )
                              ? "#bcbcbc"
                              : "#6b7280",
                          }}
                        >
                          Tanlang
                        </span>
                      }
                      style={{
                        backgroundColor:
                          document.documentElement.classList.contains("dark")
                            ? "#101828"
                            : "#ffffff",
                        borderColor:
                          document.documentElement.classList.contains("dark")
                            ? "#344054"
                            : "#d1d5db",
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#ffffff"
                          : "#1f2937",
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            )}

            <Row gutter={32}>
              <Col span={24}>
                <Form.Item label="Tavsif" name="description">
                  <Input.TextArea rows={3} placeholder="Batafsil tavsif..." />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex gap-3 mt-4">
              <Button onClick={onClose}>Bekor qilish</Button>

              <Button type="primary" htmlType="submit" loading={isLoading}>
                <FileOutlined /> {isEditing ? "Yangilash" : "Saqlash"}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
}
