// DOCUMENT filename="QismCategory.tsx"
import { Form, Select, message } from "antd";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import QismCategoryTable from "../../components/tables/CategoryTable/QismCategoryTable";
import { useCreateSubCategory, useCategoriesAsosiy } from "../../hooks/useCategoryandBuildings";

const QismCategory = () => {
  const [form] = Form.useForm();
  const { data: categories = [] } = useCategoriesAsosiy();
  const { mutate: createSubCategory } = useCreateSubCategory();


  const handleSubmit = (values: any) => {
    createSubCategory(
      {
        category_id: values.category_id,
        status: [{ key: values.subcategoryName }],
      },
      {
        onSuccess: () => {
          message.success("Qism kategoriya muvaffaqiyatli yaratildi!");
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
          <Form form={form} className="grid grid-cols-3 gap-4 items-center" onFinish={handleSubmit}>
            <Form.Item className="flex w-full h-full flex-col justify-center" style={{ marginBottom: 0 }} name="category_id"  rules={[{ required: true, message: "Asosiy kategoriyani tanlang" }]}>
              <Select
                showSearch={{
                  optionFilterProp: 'label',
                  filterSort: (optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase()),
                }}
                className="w-full h-[45px]"
                placeholder="Search to Select"
                options={categories.map(cat => ({ value: cat.id, label: `${cat.categoryNumber} - ${cat.name}` }))}
              />
            </Form.Item>
            <Form.Item className="flex w-full h-full flex-col justify-center" style={{ marginBottom: 0 }} name="subcategoryName" rules={[{ required: true, message: "Qism kategoriyani kiriting" }]}>
              <Input
                type="text"
                placeholder="Qism Kategoriya"
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
        <QismCategoryTable />
      </div>
    </section>
  );
};

export default QismCategory;