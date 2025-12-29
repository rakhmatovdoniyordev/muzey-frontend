import { Form, Select, message } from "antd";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import QismCategoryTable from "../../components/tables/CategoryTable/QismCategoryTable";
import {
  useCreateSubCategory,
  useCategoriesAsosiy,
} from "../../hooks/useCategoryandBuildings";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";

const QismCategory = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
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
      <PageMeta title="Muzey | Qism Kategoriya" description="Qism Kategoriya sahifi" />
      <div className="w-full border rounded-xl bg-white dark:bg-gray-dark dark:border-gray-700 shadow-sm">
        <div className="w-full p-4">
          <Form
            form={form}
            className="grid grid-cols-3 gap-4 items-center"
            onFinish={handleSubmit}
          >
            <div className="dark-form-container">
              <Form.Item
                className="flex w-full h-full flex-col justify-center"
                style={{ marginBottom: 0 }}
                name="category_id"
                rules={[
                  { required: true, message: "Asosiy kategoriyani tanlang" },
                ]}
              >
                <Select
                  showSearch={{
                    optionFilterProp: "label",
                    filterSort: (optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase()),
                  }}
                  className="w-full h-[45px]"
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
                      Kategoriya
                    </span>
                  }
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: `${cat.categoryNumber} - ${cat.name}`,
                  }))}
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
                  dropdownStyle={{
                    backgroundColor:
                      document.documentElement.classList.contains("dark")
                        ? "#1a2231"
                        : "#ffffff",
                    color: document.documentElement.classList.contains("dark")
                      ? "#ffffff"
                      : "#1f2937",
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              className="flex w-full h-full flex-col justify-center"
              style={{ marginBottom: 0 }}
              name="subcategoryName"
              rules={[
                { required: true, message: "Qism kategoriyani kiriting" },
              ]}
            >
              <Input
                type="text"
                placeholder="Qism Kategoriya"
                className="w-full min-h-full"
              />
            </Form.Item>
            <Button className="h-[45px]">
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
