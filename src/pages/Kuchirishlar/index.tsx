import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {  useMemo, useState } from "react";
import { Table, Button, Space, message, Input, Popconfirm, Tag } from "antd";
import {
  useCategoriesAsosiy,
  useDeleteCategory,
  useLocations,
  useAllBuildings,
} from "../../hooks/useCategoryandBuildings";
import {  DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Category } from "../../hooks/useCategoryandBuildings";

export default function Kuchirishlar() {
  const { data: categories = [], isLoading } = useCategoriesAsosiy();
  const { data: locations = [] } = useLocations();
  const { data: buildings = [] } = useAllBuildings();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [searchText, setSearchText] = useState("");

  // Filter categories by status - only show "Kuchirildi"
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.status === "Kuchirildi");
  }, [categories]);

  const filteredAndSearchedCategories = useMemo(() => {
    return filteredCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchText.toLowerCase()) ||
        category.categoryNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [filteredCategories, searchText]);

  const handleDelete = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => {
        message.success("Kategoriya muvaffaqiyatli o'chirildi!");
      },
      onError: () => {
        message.error("O'chirishda xatolik!");
      },
    });
  };

  const columns: ColumnsType<Category> = [
    {
      title: "Rim",
      dataIndex: "categoryNumber",
      key: "categoryNumber",
      width: 80,
      render: (categoryNumber: string) => (
        <span style={{ color: "#7c3aed", fontWeight: 500 }}>
          {categoryNumber}
        </span>
      ),
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Joylashuv",
      key: "location",
      render: (_: any, record: Category) => {
        const location = locations.find((loc) => loc.category_id === record.id);
        if (!location) return <span className="text-gray-400">-</span>;

        const building = buildings.find((b) => b.id === location.building_id);
        const buildingName = building
          ? building.name
          : `Bino ${location.building_id}`;

        return (
          <span className="text-sm">
            {buildingName}, {location.floor}-qavat, {location.room}-xona
          </span>
        );
      },
    },
    {
      title: "Holat",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag
          color={status === "Kuchirildi" ? "purple" : "blue"}
          className="px-3 py-1 text-[12px]"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Ko'chirilgan sanasi",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date: string) => (
        <span className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString("uz-UZ")}
        </span>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 120,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Popconfirm
            title="O'chirishni tasdiqlang"
            description="Haqiqatan ham o'chirmoqchisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button
              type="text"
              size="small"
              style={{ padding: 0, color: "#ff4d4f" }}
              title="O'chirish"
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageMeta
        title="Muzey | Ko'chirishlar"
        description="Muzey Ko'chirishlar Page"
      />
      <PageBreadcrumb pageTitle="Ko'chirishlar" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-dark px-5 py-7">
        <div className="w-full">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-xl">
              Ko'chirilgan Kategoriyalar:
            </h3>

            <Input
              placeholder="Qidirish..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-[40px] w-80 dark-input"
              prefix={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill="currentColor"
                  />
                </svg>
              }
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredAndSearchedCategories.map((category) => ({
              ...category,
              key: category.id,
            }))}
            rowKey="id"
            loading={isLoading}
            size="middle"
            style={{ borderRadius: "8px", overflow: "hidden" }}
            className="border dark:border-gray-800 shadow"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
