// AddandUpdateModal.tsx (Takomillashtirilgan va aniq ishlaydigan versiya)
// Ushbu faylda:
// - Yangi eksponat qo'shganda, birinchi item create qilinadi, keyin location create qilinadi (agar mavjud bo'lmasa).
// - Building ID formdan olinadi va locationga building_id sifatida jo'natiladi.
// - Update holatida faqat item yangilanadi, location emas (chunki location alohida modalda boshqariladi).
// - Existing locationni tekshirish qo'shildi.
// - Error handling va loading steytlar yaxshilandi.

import { useEffect, useState } from "react";
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
  useLocations,
  useUpdateCategory,
} from "../../../hooks/useCategoryandBuildings";
import type { ItemObject } from "../../../hooks/useCategoryandBuildings";
import { FileOutlined } from "@ant-design/icons";

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
  console.log("data sub", selectedSubcategoryId);

  // --- API HOOKLAR ---
  const { mutate: createItem, isPending: isCreating } = useCreateItemObject();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItemObject();
  const { mutate: createLocation } = useCreateLocation();
  const { mutate: updateCategory } = useUpdateCategory();
  const { data: locations = [] } = useLocations(); // Barcha locationlarni olib, existingni tekshirish uchun

  const { data: asosiyCategories = [], isLoading: isLoadingAsosiy } =
    useCategoriesAsosiy();
  const { data: subCategories = [], isLoading: isLoadingSub } = useCategories();
  console.log(subCategories);

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

  // --- SELECT OPTIONS ---
  const categoryOptions = asosiyCategories.map((cat) => ({
    value: cat.id,
    label: `${cat.categoryNumber} - ${cat.name}`,
  }));

  const subcategoryOptions = subCategories
    .filter((sub) => sub.category_id === selectedCategoryId)
    .flatMap((sub) =>
      sub.status.map((status) => ({
        value: status.key,
        label: status.key,
        subId: sub.id, // 👈 ID sub dan olinadi
      }))
    );

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

  // FORM DATA INIT
  useEffect(() => {
    if (!visible) return;

    if (initialData) {
      setSelectedCategoryId(initialData.category_id);

      // Find the subcategory key based on the sub_category_id
      let subCategoryKey = null;
      if (initialData.sub_category_id) {
        const subCategory = subCategories.find(
          (sub) => sub.id === initialData.sub_category_id
        );
        if (subCategory) {
          // For editing, we need to find the key that corresponds to this subcategory
          // Since we don't have the original key, we'll just set it to null for now
          // The user will need to reselect the subcategory
          subCategoryKey = null;
        }
      }

      form.setFieldsValue({
        name: initialData.name,
        material: initialData.material,
        category_id: initialData.category_id,
        sub_category_id: subCategoryKey, // Clear the display value when editing
        subId: initialData.sub_category_id, // Set the hidden field for actual subcategory ID
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
    console.log(value);
  };
  const handleSubCategoryChange = (value: any, option: any) => {
    setSelectedSubcategoryId(value);
    // Set the subId in the form when a subcategory is selected
    if (option && option.subId) {
      form.setFieldsValue({ subId: option.subId });
    }
  };

  // Building change (only for create)
  const handleBuildingChange = (value: number) => {
    setSelectedBuildingId(value);
    form.setFieldValue("bino", value);
  };

  // SUBMIT FUNCTION
  const handleSubmit = (values: any) => {
    console.log("Form values:", values);

    const itemPayload: Partial<ItemObject> = {
      category_id: values.category_id,
      sub_category_id: values.subId ? Number(values.subId) : undefined,
      subCategory: String(selectedSubcategoryId) || "",
      name: values.name,
      material: values.material,
      period: Number(values.period),
      price: values.price,
      status: values.status,
      fondType: values.fondType,
      description: values.description,
    };
    if (isEditing && initialData?.id) {
      updateItem(
        { id: initialData.id, payload: itemPayload },
        {
          onSuccess: () => {
            // Update category description if provided and it's different
            if (values.description && initialData.category_id) {
              updateCategory(
                {
                  id: initialData.category_id,
                  payload: { description: values.description },
                },
                {
                  onSuccess: () => {
                    console.log("Category description updated successfully");
                  },
                  onError: (error: any) => {
                    console.error(
                      "Failed to update category description:",
                      error
                    );
                  },
                }
              );
            }
            message.success("Eksponat yangilandi!");
            onClose();
          },
          onError: (error: any) => {
            message.error(
              error.response?.data?.message || "Eksponat yangilashda xatolik"
            );
          },
        }
      );
    } else {
      // Create item
      createItem(itemPayload as Omit<ItemObject, "id">, {
        onSuccess: (newItem) => {
          // Check if location already exists for this category
          const existingLocation = locations.find(
            (loc) => loc.category_id === newItem.category_id
          );
          if (existingLocation) {
            message.info(
              "Kategoriya uchun joylashuv allaqachon mavjud. Yangi yaratilmadi."
            );
            onClose();
            return;
          }

          // Create location only if not exists
          const locationPayload = {
            category_id: newItem.category_id,
            building_id: values.bino, // Building ID formdan olinadi va jo'natiladi
            floor: values.qavat,
            room: values.xona,
            showcase: values.vitrina,
            polka: values.polka,
          };
          createLocation(locationPayload, {
            onSuccess: () => {
              message.success("Joylashuv saqlandi!");
              onClose();
              console.log("data loc:", locationPayload);
            },
            onError: (error: any) => {
              message.error(
                error.response?.data?.message || "Joylashuv qo'shishda xatolik"
              );
            },
          });

          // Update category description if provided
          if (values.description) {
            updateCategory(
              {
                id: newItem.category_id,
                payload: { description: values.description },
              },
              {
                onSuccess: () => {
                  console.log("Category description updated successfully");
                },
                onError: (error: any) => {
                  console.error(
                    "Failed to update category description:",
                    error
                  );
                },
              }
            );
          }

          message.success("Eksponat qo‘shildi!");
        },
        onError: (error: any) => {
          message.error(
            error.response?.data?.message || "Eksponat qo'shishda xatolik"
          );
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
                    placeholder="Tanlang"
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Qism kategoriya" name="subcategory_id">
                  <Select
                    placeholder="Tanlang"
                    options={subcategoryOptions}
                    onChange={handleSubCategoryChange}
                  />
                </Form.Item>
                {/* Hidden field to store the actual subcategory ID */}
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
                  <Select options={statusOptions} placeholder="Tanlang" />
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
                  <Select options={fondOptions} placeholder="Tanlang" />
                </Form.Item>
              </Col>
            </Row>

            {!isEditing && (
              <div className="border-t pt-4 mt-4 mb-4">
                <h4 className="font-bold mb-3">Joylashuv ma’lumotlari</h4>

                <div className="grid grid-cols-5 gap-2">
                  <Form.Item
                    label="Bino"
                    name="bino"
                    rules={[{ required: true, message: "Binoni tanlang" }]}
                  >
                    <Select
                      options={buildingOptions}
                      onChange={handleBuildingChange}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Qavat"
                    name="qavat"
                    rules={[{ required: true, message: "Qavatni tanlang" }]}
                  >
                    <Select options={floorOptions} />
                  </Form.Item>

                  <Form.Item
                    label="Xona"
                    name="xona"
                    rules={[{ required: true, message: "Xonani tanlang" }]}
                  >
                    <Select options={roomOptions} />
                  </Form.Item>

                  <Form.Item
                    label="Vitrina"
                    name="vitrina"
                    rules={[{ required: true, message: "Vitrinani tanlang" }]}
                  >
                    <Select options={showcaseOptions} />
                  </Form.Item>

                  <Form.Item
                    label="Polka"
                    name="polka"
                    rules={[{ required: true, message: "Polkani tanlang" }]}
                  >
                    <Select options={polkaOptions} />
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
