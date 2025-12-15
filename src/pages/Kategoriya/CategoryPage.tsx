// DOCUMENT filename="CategoryPage.tsx"
import { Form, message } from "antd";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import CategoryTable from "../../components/tables/CategoryTable/CategoryTable";
import { useCreateCategory } from "../../hooks/useCategoryandBuildings";

const CategoryPage = () => {
  const [form] = Form.useForm();
  const { mutate: createCategory } = useCreateCategory();

  const handleSubmit = (values: any) => {
    createCategory(
      {
        name: values.categoryName,
        categoryNumber: values.categoryNumber,
        statusType: "Yaroqli",
        description: "",
        infoName: "",
        authorName: "",
        moved: 0,
        status: "Yangi",
      },
      {
        onSuccess: () => {
          message.success("Kategoriya muvaffaqiyatli yaratildi!");
          form.resetFields();
        },
        onError: (error: any) => {
          message.error(error.response?.data?.message || "Xatolik yuz berdi");
        },
      }
    );
  };

  return (
    <section>
      <div className="w-full border rounded-xl bg-white dark:bg-gray-dark dark:border-gray-700 shadow-sm">
        <div className="w-full p-4">
          <Form form={form} className="grid grid-cols-3 gap-3 items-center" onFinish={handleSubmit}>
            <Form.Item className="flex w-full h-full flex-col justify-center" style={{ marginBottom: 0 }}  name="categoryNumber" rules={[{ required: true, message: "Rimni kiriting" }]}>
              <Input
                type="text"
                placeholder="Rim (I, II...)"
                className="w-full min-h-full"
              />
            </Form.Item>
            <Form.Item className="flex w-full h-full flex-col justify-center" style={{ marginBottom: 0 }}  name="categoryName" rules={[{ required: true, message: "Nomini kiriting" }]}>
              <Input
                type="text"
                placeholder="Kategoriya nomi"
                className="w-full min-h-full"
              />
            </Form.Item>
            <Button  className="h-[45px]">
              <PlusIcon />
              Yangi kategoriya qo'shish
            </Button>
          </Form>
        </div>
      </div>
      <div className="mt-4">
        <CategoryTable />
      </div>
    </section>
  );
};

export default CategoryPage;