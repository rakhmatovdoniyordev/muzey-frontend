import { useEffect, useMemo, useState } from "react";
import { Table, Input, Tag, DatePicker, Tooltip } from "antd";
import {
  useHistory,
  useItemObjects,
  useAllBuildings,
  useCategoriesAsosiy,
} from "../../hooks/useCategoryandBuildings";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { History } from "../../hooks/useCategoryandBuildings";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;

export default function HistoryPage() {
  const { data: histories = [], isLoading } = useHistory();
  const { data: items = [] } = useItemObjects();
  const { data: categories = [] } = useCategoriesAsosiy();
  const { data: buildings = [] } = useAllBuildings();

  const authState = useSelector((state: any) => state.auth);
  const currentUser = authState.user;
  const isSuperAdmin = currentUser?.role?.toLowerCase() === "superadmin";

  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const itemsMap = useMemo(() => {
    const map: Record<number, any> = {};
    items.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [items]);

  const categoriesMap = useMemo(() => {
    const map: Record<number, any> = {};
    categories.forEach((category) => {
      map[category.id] = category;
    });
    return map;
  }, [categories]);

  const buildingsMap = useMemo(() => {
    const map: Record<number, any> = {};
    buildings.forEach((building) => {
      map[building.id] = building;
    });
    return map;
  }, [buildings]);

  const filteredHistories = useMemo(() => {
    return histories.filter((history) => {
      const isVisibleToUser =
        isSuperAdmin ||
        (!isSuperAdmin &&
          history.data.info?.responsiblePerson?.toLowerCase() ===
            currentUser?.name?.toLowerCase());

      const matchesSearch =
        !searchText ||
        history.data.itemName
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        itemsMap[parseInt(history.data.key)]?.name
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        history.data.info?.reason
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        history.data.info?.description
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        history.data.info?.fromLocation?.buildingName
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        history.data.info?.toLocation?.buildingName
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        history.data.info?.responsiblePerson
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesDateRange =
        !dateRange ||
        (dateRange[0] &&
          dateRange[1] &&
          new Date(history.data.info?.date) >= dateRange[0] &&
          new Date(history.data.info?.date) <= dateRange[1]);

      return isVisibleToUser && matchesSearch && matchesDateRange;
    });
  }, [histories, itemsMap, searchText, dateRange, isSuperAdmin, currentUser]);

  const columns: ColumnsType<History> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 65,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Eksponat",
      key: "itemName",
      width: 100,
      render: (_, record) => {
        const itemName = record.data.itemName;
        const itemId = parseInt(record.data.key);
        const item = itemsMap[itemId];

        if (itemName) {
          return (
            <div>
              <div className="font-medium">{itemName}</div>
              <div className="text-xs text-gray-500">ID: {itemId}</div>
            </div>
          );
        } else if (item) {
          return (
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-gray-500">ID: {item.id}</div>
            </div>
          );
        } else {
          return <span className="text-gray-400">Noma'lum</span>;
        }
      },
    },
    {
      title: "Kategoriya",
      key: "category",
      render: (_, record) => {
        const item = itemsMap[parseInt(record.data.key)];
        if (!item) return <span className="text-gray-400">Noma'lum</span>;

        const category = categoriesMap[item.category_id];
        return category ? (
          <Tag color="blue">{category.name}</Tag>
        ) : (
          <span className="text-gray-400">Noma'lum</span>
        );
      },
    },
    {
      title: "Joriy Joylashuv",
      key: "fromLocation",
      width: 150,
      render: (_, record) => {
        const fromLocation = record.data.info?.fromLocation;
        if (!fromLocation) return <span className="text-gray-400">Yangi</span>;

        return (
          <div>
            <div className="font-medium">{fromLocation.buildingName}</div>
            <div className="text-xs text-gray-500">
              Qavat: {fromLocation.floor}, Xona: {fromLocation.room}
            </div>
            <div className="text-xs text-gray-500">
              Vitrina: {fromLocation.showcase}, Polka: {fromLocation.shelf}
            </div>
          </div>
        );
      },
    },
    {
      title: "Yangi Joylashuv",
      key: "toLocation",
      width: 150,
      render: (_, record) => {
        const toLocation = record.data.info?.toLocation;
        if (!toLocation) return <span className="text-gray-400">Noma'lum</span>;

        return (
          <div>
            <div className="font-medium">{toLocation.buildingName}</div>
            <div className="text-xs text-gray-500">
              Qavat: {toLocation.floor}, Xona: {toLocation.room}
            </div>
            <div className="text-xs text-gray-500">
              Vitrina: {toLocation.showcase}, Polka: {toLocation.shelf}
            </div>
          </div>
        );
      },
    },
    {
      title: "Mas'ul Shaxs",
      key: "responsiblePerson",
      render: (_, record) => {
        const person = record.data.info?.responsiblePerson;
        return person || <span className="text-gray-400">Noma'lum</span>;
      },
    },
    {
      title: "Sababi",
      dataIndex: "data.info.reason",
      key: "reason",
      width: 150,
      render: (_, record) => {
        const reason = record.data.info?.reason;
        if (!reason) {
          return <Tag color="blue">Noma'lum</Tag>;
        }

        const color =
          reason.includes("ko'chirish") || reason.includes("Ko'chirish")
            ? "green"
            : reason.includes("remont") || reason.includes("Remont")
            ? "orange"
            : "blue";
        return <Tag color={color}>{reason}</Tag>;
      },
    },
    {
      title: "Tavsif",
      dataIndex: "data.info.description",
      key: "description",
      ellipsis: true,
      render: (_, record) => {
        return (
          <Tooltip
            title={record.data.info?.description || "Noma'lum"}
            arrow={false}
          >
            <span className="block max-w-[120px] truncate">
              {record.data.info?.description || "..."}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Sana",
      dataIndex: "data.info.date",
      key: "date",
      sorter: (a, b) =>
        new Date(a.data.info?.date).getTime() -
        new Date(b.data.info?.date).getTime(),
      render: (_, record) => {
        const date = record.data.info?.date;
        return date ? (
          <span>
            {new Date(date).toLocaleDateString("uz-UZ")} <br />
            {new Date(date).toLocaleTimeString("uz-UZ")}
          </span>
        ) : (
          "Noma'lum"
        );
      },
    },
  ];

  return (
    <>
      <PageMeta
        title="Muzey | Tarix"
        description="Barcha eksponatlar bo'yicha faoliyat tarixi"
      />
      <PageBreadcrumb pageTitle="Faoliyat Tarixi" />
      <section>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] mb-4 shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-64 h-[40px] ant-input dark-input"
            />
            <RangePicker
              onChange={(dates) => setDateRange(dates as [any, any] | null)}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
        <Table
          dataSource={filteredHistories}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          scroll={{ x: 800 }}
          className="rounded-[8px] border dark:border-gray-800 shadow"
        />
      </section>
    </>
  );
}
