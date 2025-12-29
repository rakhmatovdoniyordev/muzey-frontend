import { AxiosError } from "axios";
import { Form, Input, InputNumber, Button, message } from "antd";
import { Modal } from "../../ui/modal/index";
import { useCreateBuilding } from "../../../hooks/useCategoryandBuildings";

interface BuildingFormValues {
  name: string;
  floors: number;
  rooms: number;
  showcase: number;
  polkas: number;
  category_id: number;
}

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

  const handleSubmit = (values: BuildingFormValues) => {
    const payload = {
      name: values.name,
      floors: values.floors,
      rooms: values.rooms,
      showcase: values.showcase,
      polkas: values.polkas,
      category_id: values.category_id,
    };

    createBuilding(payload, {
      onSuccess: () => {
        message.success("Bino muvaffaqiyatli qo'shildi!");
        form.resetFields();
        onClose();
        onCreated?.();
      },
      onError: (error: Error) => {
        let errorMessage = "Xatolik yuz berdi";

        if (error instanceof AxiosError) {
          errorMessage =
            error.response?.data?.message || error.message || errorMessage;
        } else {
          errorMessage = error.message || errorMessage;
        }

        message.error(errorMessage);
      },
    });
  };

  return (
    <>
      <style>{`
      .dark .ant-input-number-input::placeholder {
        color: #bcbcbc !important;
      }
      .dark .ant-input::placeholder {
        color: #bcbcbc !important;
      }
      .dark .ant-input-number-input {
        color: #ffffff !important;
      }
      .dark .ant-input {
        color: #ffffff !important;
      }
    `}</style>
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
            style={{ width: "100%" }}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Masalan: 3"
              style={{
                width: "100%",
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#101828"
                  : "#ffffff",
                borderColor: document.documentElement.classList.contains("dark")
                  ? "#344054"
                  : "#d1d5db",
                color: document.documentElement.classList.contains("dark")
                  ? "#ffffff"
                  : "#1f2937",
              }}
            />
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
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Masalan: 20"
              style={{
                width: "100%",
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#101828"
                  : "#ffffff",
                borderColor: document.documentElement.classList.contains("dark")
                  ? "#344054"
                  : "#d1d5db",
                color: document.documentElement.classList.contains("dark")
                  ? "#ffffff"
                  : "#1f2937",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Vitrinalar soni"
            name="showcase"
            rules={[
              {
                required: true,
                message: "Iltimos, vitrinalar sonini kiriting!",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Masalan: 20"
              style={{
                width: "100%",
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#101828"
                  : "#ffffff",
                borderColor: document.documentElement.classList.contains("dark")
                  ? "#344054"
                  : "#d1d5db",
                color: document.documentElement.classList.contains("dark")
                  ? "#ffffff"
                  : "#1f2937",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Polkalar soni"
            name="polkas"
            rules={[
              { required: true, message: "Iltimos, polkalar sonini kiriting!" },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Masalan: 14"
              style={{
                width: "100%",
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#101828"
                  : "#ffffff",
                borderColor: document.documentElement.classList.contains("dark")
                  ? "#344054"
                  : "#d1d5db",
                color: document.documentElement.classList.contains("dark")
                  ? "#ffffff"
                  : "#1f2937",
              }}
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Saqlash
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
