import { Form, Input, InputNumber, Button, message } from "antd";
import { Modal } from "../../ui/modal/index";
import { useCreateBuilding } from "../../../hooks/useCategoryandBuildings";
import type { Building } from "../../../hooks/useCategoryandBuildings";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddBuildingModal({
  visible,
  onClose,
  onCreated,
}: Props) {
  const [form] = Form.useForm();
  const { mutate: createBuilding, isPending } = useCreateBuilding();

  const handleSubmit = (values: any) => {
    // Create payload without category_id since it's not needed for building creation
    const payload = {
      name: values.name,
      floors: values.floors,
      rooms: values.rooms,
      showcase: values.showcase,
      polkas: values.polkas,
    } as Omit<Building, "id" | "category_id">;

    createBuilding(payload as any, {
      onSuccess: () => {
        message.success("Bino muvaffaqiyatli qo'shildi!");
        form.resetFields();
        onClose();
        onCreated?.();
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "Xatolik yuz berdi");
      },
    });
  };

  return (
    <Modal
      title="Yangi bino qo'shish"
      isOpen={visible}
      onClose={onClose}
      className="max-w-md max-h-[90vh] p-6 overflow-auto"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Bino nomi"
          name="name"
          rules={[
            { required: true, message: "Iltimos, bino nomini kiriting!" },
          ]}
        >
          <Input placeholder="Masalan: Arxiv" />
        </Form.Item>

        <Form.Item
          label="Qavatlar soni"
          name="floors"
          rules={[
            { required: true, message: "Iltimos, qavatlar sonini kiriting!" },
          ]}
        >
          <InputNumber min={1} className="w-full" placeholder="Masalan: 15" />
        </Form.Item>

        <Form.Item
          label="Xonalarning umumiy soni"
          name="rooms"
          rules={[
            {
              required: true,
              message: "Iltimos, xonalarning sonini kiriting!",
            },
          ]}
        >
          <InputNumber min={1} className="w-full" placeholder="Masalan: 20" />
        </Form.Item>

        <Form.Item
          label="Vitrinalar soni"
          name="showcase"
          rules={[
            { required: true, message: "Iltimos, vitrinalar sonini kiriting!" },
          ]}
        >
          <InputNumber min={1} className="w-full" placeholder="Masalan: 20" />
        </Form.Item>

        <Form.Item
          label="Polkalar soni"
          name="polkas"
          rules={[
            { required: true, message: "Iltimos, polkalar sonini kiriting!" },
          ]}
        >
          <InputNumber min={1} className="w-full" placeholder="Masalan: 14" />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Saqlash
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
