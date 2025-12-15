// LocationModal.tsx (Takomillashtirilgan versiya)
// Ushbu faylda:
// - Update locationda building_id values.toBino dan olinadi va jo'natiladi.
// - Building nomi emas, ID ishlatiladi (backendga jo'natishda).
// - From va To bo'limlari uchun alohida selectedBuildingId lar, options dinamik.
// - Current location category_id bo'yicha topiladi.
// - Debug log o'chirilgan, faqat zarur console.log qoldirilgan.

import { Input } from "antd";
import { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import { Modal } from "../../ui/modal/index";
import { EnvironmentOutlined, FileOutlined } from "@ant-design/icons";
import { useUpdateLocation, useLocations, ItemObject, useAllBuildings, useBuildingId } from "../../../hooks/useCategoryandBuildings";

interface Props {
  visible: boolean;
  onClose: () => void;
  itemData?: ItemObject;
}

export default function LocationModal({ visible, onClose, itemData }: Props) {
  const [form] = Form.useForm();
  const { mutate: updateLocation, isPending } = useUpdateLocation();
  const { data: allBuildings = [] } = useAllBuildings();
  const { data: locations = [] } = useLocations(); // Fetch all locations
  const [selectedToBuildingId, setSelectedToBuildingId] = useState<number | null>(null);
  const [selectedFromBuildingId, setSelectedFromBuildingId] = useState<number | null>(null);
  const { data: selectedToBuilding } = useBuildingId(selectedToBuildingId);
  const { data: selectedFromBuilding } = useBuildingId(selectedFromBuildingId);

  // Find current location for the item's category
  const currentLocation = locations.find((loc) => loc.category_id === itemData?.category_id);

  const buildingOptions = allBuildings.map((b: any) => ({
    value: b.id,
    label: b.name,
  }));

  const fromFloorOptions = Array.from({ length: selectedFromBuilding?.floors || 5 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const fromRoomOptions = Array.from({ length: selectedFromBuilding?.rooms || 20 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const fromShowcaseOptions = Array.from({ length: selectedFromBuilding?.showcase || 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const fromPolkaOptions = Array.from({ length: selectedFromBuilding?.polkas || 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const toFloorOptions = Array.from({ length: selectedToBuilding?.floors || 5 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const toRoomOptions = Array.from({ length: selectedToBuilding?.rooms || 20 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const toShowcaseOptions = Array.from({ length: selectedToBuilding?.showcase || 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const toPolkaOptions = Array.from({ length: selectedToBuilding?.polkas || 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  const reasonOptions = [
    { value: "Ekspozitsiya o'zgarishi", label: "Ekspozitsiya o'zgarishi" },
    { value: "Remont ishlari", label: "Remont ishlari" },
    { value: "Xavfsizlik sababli", label: "Xavfsizlik sababli" },
    { value: "Sayyor ko'rgazma", label: "Sayyor ko'rgazma" },
    { value: "Saqlovga joylash", label: "Saqlovga joylash" },
    { value: "Boshqa", label: "Boshqa" },
  ];

  useEffect(() => {
    if (visible && itemData && currentLocation) {
      setSelectedFromBuildingId(currentLocation.building_id);
      setSelectedToBuildingId(currentLocation.building_id);
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
    } else if (visible && itemData && !currentLocation) {
      message.error("Joylashuv topilmadi!");
      onClose();
    }
  }, [visible, form, itemData, currentLocation]);

  const handleSubmit = (values: any) => {
    if (!itemData?.id || !currentLocation?.id) {
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
      building_id: values.toBino, // Building ID jo'natiladi
      category_id: itemData.category_id,
    };

    updateLocation(
      { id: currentLocation.id, payload },
      {
        onSuccess: () => {
          message.success("Eksponat muvaffaqiyatli ko'chirildi!");
          form.resetFields();
          onClose();
        },
        onError: (error: any) => {
          message.error(error.response?.data?.message || "Xatolik yuz berdi");
        },
      }
    );
  };

  const handleBuildingChange = (value: number) => {
    setSelectedToBuildingId(value);
    form.setFieldValue("toBino", value);
  };

  return (
    <Modal
      title="Eksponatni ko'chirish"
      isOpen={visible}
      onClose={onClose}
      className="max-w-[1000px] max-h-[90vh] p-6 overflow-auto"
    >
      <div className="bg-[#EFF6FF] p-3 mb-4 rounded mt-4">
        <div className="text-[13px] font-bold">{itemData?.name}</div>
        <div className="text-[12px] text-[#9333EA] mt-1">
          KP-{itemData?.id} / {itemData?.name}
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#fee] p-4 rounded border border-red-200">
            <div className="flex items-center mb-3 text-red-600">
              <EnvironmentOutlined className="mr-2" />
              QAYERDAN (Hozirgi)
            </div>
            <Form.Item label="* Bino" name="fromBino">
              <Select disabled options={buildingOptions} />
            </Form.Item>
            <Form.Item label="* Qavat" name="fromQavat">
              <Select disabled options={fromFloorOptions} />
            </Form.Item>
            <Form.Item label="* Xona" name="fromXona">
              <Select disabled options={fromRoomOptions} />
            </Form.Item>
            <Form.Item label="* Vitrina" name="fromVitrina">
              <Select disabled options={fromShowcaseOptions} />
            </Form.Item>
            <Form.Item label="* Polka" name="fromPolka">
              <Select disabled options={fromPolkaOptions} />
            </Form.Item>
          </div>

          <div className="bg-green-50 p-4 rounded border border-green-200">
            <div className="flex items-center mb-3 text-green-600">
              → QAYERGA (Yangi)
            </div>
            <Form.Item label="* Bino" name="toBino" rules={[{ required: true, message: "Bino tanlang" }]}>
              <Select placeholder="Bino tanlang" options={buildingOptions} onChange={handleBuildingChange} />
            </Form.Item>
            <Form.Item label="* Qavat" name="toQavat" rules={[{ required: true, message: "Qavat tanlang" }]}>
              <Select placeholder="Qavat tanlang" options={toFloorOptions} />
            </Form.Item>
            <Form.Item label="* Xona" name="toXona" rules={[{ required: true, message: "Xona tanlang" }]}>
              <Select placeholder="Xona tanlang" options={toRoomOptions} />
            </Form.Item>
            <Form.Item label="* Vitrina" name="toVitrina" rules={[{ required: true, message: "Vitrina tanlang" }]}>
              <Select placeholder="Vitrina tanlang" options={toShowcaseOptions} />
            </Form.Item>
            <Form.Item label="* Polka" name="toPolka" rules={[{ required: true, message: "Polka tanlang" }]}>
              <Select placeholder="Polka tanlang" options={toPolkaOptions} />
            </Form.Item>
          </div>
        </div>

        <Form.Item label="Ko'chirish sababi *" name="reason" rules={[{ required: true, message: "Sababni tanlang" }]}>
          <Select placeholder="Tanlang" options={reasonOptions} />
        </Form.Item>

        <Form.Item label="Mas'ul shaxs *" name="responsible" rules={[{ required: true, message: "Mas'ul shaxsni kiriting" }]}>
          <Input placeholder="F.I.O va lavozim" />
        </Form.Item>

        <Form.Item label="Qo'shimcha izohlar" name="notes">
          <Input.TextArea placeholder="Qo'shimcha ma'lumotlar..." rows={3} />
        </Form.Item>

        <div className="flex gap-3 mt-4">
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" htmlType="submit" loading={isPending} className="bg-green-600">
            <FileOutlined /> Ko'chirishni tasdiqlash
          </Button>
        </div>
      </Form>
    </Modal>
  );
}