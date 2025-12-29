import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useMemo, useState } from "react";
import { Table, Button, Space, message, Input, Popconfirm } from "antd";
import {
  useItemObjects,
  useDeleteItemObject,
  useCategoriesAsosiy,
  useHistory,
} from "../../hooks/useCategoryandBuildings";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ItemObject, History } from "../../hooks/useCategoryandBuildings";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table as DocxTable,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  TableLayoutType,
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";

export default function Kuchirishlar() {
  const { data: items = [], isLoading } = useItemObjects();
  const { data: categories = [] } = useCategoriesAsosiy();
  const { data: histories = [], isLoading: historiesLoading } = useHistory();
  const { mutate: deleteItem } = useDeleteItemObject();

  const categoriesMap = useMemo(() => {
    const map: Record<number, any> = {};
    categories.forEach((category) => {
      map[category.id] = category;
    });
    return map;
  }, [categories]);

  const historiesMap = useMemo(() => {
    const map: Record<number, History> = {};
    histories.forEach((history) => {
      const itemId = parseInt(history.data.key);
      if (
        !map[itemId] ||
        new Date(history.data.info?.date) >
          new Date(map[itemId].data.info?.date)
      ) {
        map[itemId] = history;
      }
    });
    return map;
  }, [histories]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return item.statusCategory === "Kuchirildi";
    });
  }, [items]);

  const [searchText, setSearchText] = useState("");

  const filteredAndSearchedItems = useMemo(() => {
    return filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toString().includes(searchText)
    );
  }, [filteredItems, searchText]);

  const handleDelete = (id: number) => {
    deleteItem(id, {
      onSuccess: () => {
        message.success("Eksponat muvaffaqiyatli o'chirildi!");
      },
      onError: () => {
        message.error("O'chirishda xatolik!");
      },
    });
  };

  const downloadDocument = async () => {
    if (filteredAndSearchedItems.length === 0) {
      message.warning("Yuklab olish uchun hech qanday ma'lumot yo'q!");
      return;
    }

    const itemsCount = filteredAndSearchedItems.length;

    //Agar barcha bir xil bo'lsa, umumiy ko'rsat; aks holda "turli binolarga"
    const firstHistory = historiesMap[filteredAndSearchedItems[0].id];
    const firstFrom =
      firstHistory?.data.info?.fromLocation?.buildingName || "Noma'lum";
    const firstFromQavat =
      firstHistory?.data.info?.fromLocation?.floor || "Noma'lum";
    const firstFromRoom =
      firstHistory?.data.info?.fromLocation?.room || "Noma'lum";
    const firstFromShowcase =
      firstHistory?.data.info?.fromLocation?.showcase || "Noma'lum";
    const firstFromShelf =
      firstHistory?.data.info?.fromLocation?.shelf || "Noma'lum";
    const firstTo =
      firstHistory?.data.info?.toLocation?.buildingName || "Noma'lum";
    const firstToQavat =
      firstHistory?.data.info?.toLocation?.floor || "Noma'lum";
    const firstToRoom = firstHistory?.data.info?.toLocation?.room || "Noma'lum";
    const firstToShowcase =
      firstHistory?.data.info?.toLocation?.showcase || "Noma'lum";
    const firstToShelf =
      firstHistory?.data.info?.toLocation?.shelf || "Noma'lum";

    let transferInfo = `${firstFrom}-Бино, ${firstFromQavat}-қават, ${firstFromRoom}-хона, ${firstFromShowcase}-витрина, ${firstFromShelf}-полка дан ${firstTo}-Бино, ${firstToQavat}-қават, ${firstToRoom}-хона, ${firstToShowcase}-витрина, ${firstToShelf}-полка`;
    // Tekshirish: hammasi bir xil emasligini
    const allSame = filteredAndSearchedItems.every((item) => {
      const hist = historiesMap[item.id];
      return (
        hist?.data.info?.fromLocation?.buildingName === firstFrom &&
        hist?.data.info?.fromLocation?.floor === firstFromQavat &&
        hist?.data.info?.fromLocation?.room === firstFromRoom &&
        hist?.data.info?.fromLocation?.showcase === firstFromShowcase &&
        hist?.data.info?.fromLocation?.shelf === firstFromShelf &&
        hist?.data.info?.toLocation?.buildingName === firstTo &&
        hist?.data.info?.toLocation?.floor === firstToQavat &&
        hist?.data.info?.toLocation?.room === firstToRoom &&
        hist?.data.info?.toLocation?.showcase === firstToShowcase &&
        hist?.data.info?.toLocation?.shelf === firstToShelf
      );
    });
    if (!allSame) {
      transferInfo = "turli binolarga";
    }

    const docNumber = Math.floor(Math.random() * 1000) + 1;
    const months = [
      "Январ",
      "Феврал",
      "Март",
      "Апрел",
      "Май",
      "Июн",
      "Июл",
      "Август",
      "Сентябр",
      "Октябр",
      "Ноябр",
      "Декабр",
    ];
    const date = new Date();
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              size: 28,
            },
          },
        },
      },
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "5 – илова.", bold: true, size: 28 }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 340 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "“ТАСДИҚЛАЙМАН”", bold: true, size: 28 }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 240 },
            }),
            new DocxTable({
              layout: TableLayoutType.FIXED,
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              columnWidths: [4535, 4535],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [],
                      verticalAlign: VerticalAlign.TOP,
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Ўзбекистон Республикаси Вазирлар Маҳкамаси ҳузуридаги Ўзбекистондаги Ислом цивилизацияси маркази Директорининг илмий тадқиқот ишлари бўйича ўринбосари, комиссия раиси",
                              size: 28,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 120 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "____________ (Ф.И.Ш)",
                              size: 28,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
                          spacing: { after: 120 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "(имзо)", size: 28 })],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 120 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "«____» __________ 20 ___ йил.",
                              size: 28,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
                          spacing: { after: 120 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({ text: "(М. Ў.)", size: 28 }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 480 },
                        }),
                      ],
                      verticalAlign: VerticalAlign.TOP,
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "МУЗЕЙ ФОНДИНИНГ ИЧКИ ФАОЛИЯТИНИ ЮРИТИШ ",
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ` ДАЛОЛАТНОМАСИ № ${docNumber}`,
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `«${day}» ${month} ${year} й.`,
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Мазкур далолатнома музей Бош муҳофизи томонидан ${itemsCount} та ашё${
                    itemsCount > 1 ? "лар" : ""
                  }ни:`,
                  size: 28,
                }),
              ],
              spacing: { after: 120 },
            }),
            ...filteredAndSearchedItems.map((item) => {
              const history = historiesMap[item.id];
              if (!history || !history.data.info) return new Paragraph({});

              const fromLocation = history.data.info.fromLocation;
              const toLocation = history.data.info.toLocation;

              let locationText = "";
              if (fromLocation && toLocation) {
                locationText = `${item.name}: ${fromLocation.buildingName}-Бино ${fromLocation.floor}-қават, ${fromLocation.room}-хона, ${fromLocation.showcase}-витрина, ${fromLocation.shelf}-полка дан ${toLocation.buildingName} - ${toLocation.floor}-қават, ${toLocation.room}-хона, ${toLocation.showcase}-витрина, ${toLocation.shelf}-полка га`;
              } else if (toLocation) {
                locationText = `${item.name}: ... dan ${toLocation.buildingName}-Бино ${toLocation.floor}-қават, ${toLocation.room}-хона, ${toLocation.showcase}-витрина, ${toLocation.shelf}-полка га`;
              } else {
                locationText = `${item.name}: joylashuvi noma'lum`;
              }

              return new Paragraph({
                children: [
                  new TextRun({
                    text: locationText,
                    size: 28,
                  }),
                ],
                spacing: { after: 120 },
              });
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "ўтказилиши тўғрисида тузилди. Мазкур ашёлар қуйидагилар:",
                  size: 28,
                }),
              ],
              spacing: { after: 240 },
            }),

            new DocxTable({
              width: { size: 100, type: WidthType.PERCENTAGE },
              columnWidths: [800, 800, 2500, 1500, 2000, 1000, 1000],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                insideVertical: { style: BorderStyle.SINGLE, size: 1 },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "№", size: 24 })],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "КК ёки ИК", size: 24 }),
                            new TextRun({ text: "№", break: 1, size: 24 }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Буюмнинг номи ва қисқача тавсифи",
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Материал ва техникаси",
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Давр/Сана",
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Сақланиш ҳолати", size: 24 }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "Нархи", size: 24 })],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                  ],
                }),
                // Ma'lumot qatorlari
                ...filteredAndSearchedItems.map((item, index) => {
                  return new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${index + 1}`,
                                size: 24, // 12pt
                              }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `KK-${item.id}`,
                                size: 24,
                              }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: item.name,
                                size: 24,
                              }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: item.material || "N/A",
                                size: 24,
                              }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${item.period || "N/A"} yil`,
                                size: 24,
                              }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Yaxshi",
                                size: 24,
                              }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${item.price || "N/A"} so'm`,
                                size: 24,
                              }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      }),
                    ],
                  });
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 480 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Асос:_________________________________________",
                  size: 28,
                }),
              ],
              spacing: { after: 240 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Топширди:____________________________________",
                  size: 28,
                }),
              ],
              spacing: { after: 240 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Иштирок этдилар: ______________________________",
                  size: 28,
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Hujjatni generatsiya qilish va yuklash olish
    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `kochirishlar_dalolatnomasi.docx`);
      message.success("Hujjat muvaffaqiyatli yuklab olindi!");
    } catch (error) {
      console.error("Hujjat generatsiyasida xato:", error);
      message.error("Hujjatni yaratishda xatolik!");
    }
  };

  const columns: ColumnsType<ItemObject> = [
    {
      title: "KK",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id: number) => `KK-${id}`,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Kategoriya",
      key: "category",
      render: (_: any, record: ItemObject) => {
        const category = categoriesMap[record.category_id];
        if (!category) return <span className="text-gray-400">-</span>;

        return (
          <span className="text-sm">
            {category.categoryNumber} - {category.name}
          </span>
        );
      },
    },
    {
      title: "Eski Joylashuv",
      key: "oldLocation",
      render: (_: any, record: ItemObject) => {
        const history = historiesMap[record.id];

        if (!history || !history.data.info?.fromLocation) {
          return <span className="text-gray-400">Yangi eksponat</span>;
        }

        const fromLocation = history.data.info.fromLocation;

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
      key: "newLocation",
      render: (_: any, record: ItemObject) => {
        const history = historiesMap[record.id];

        if (!history || !history.data.info?.toLocation) {
          return <span className="text-gray-400">Noma'lum</span>;
        }

        const toLocation = history.data.info.toLocation;

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
      title: "Ko'chirilgan sanasi",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date: string) => (
        <span className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString("uz-UZ")},{" "}
          {new Date(date).toLocaleTimeString("uz-UZ")}
        </span>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 120,
      render: (_: any, record: ItemObject) => (
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
      <section>
        <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-dark p-4 mb-4 shadow">
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="Qidirish..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-[40px] w-full dark-input"
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
            <Button
              type="primary"
              style={{ height: 40 }}
              onClick={downloadDocument}
            >
              <span>
                <DownloadOutlined />
              </span>
              Hujjatni yuklash
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAndSearchedItems.map((item) => ({
            ...item,
            key: item.id,
          }))}
          rowKey="id"
          loading={isLoading || historiesLoading}
          size="middle"
          style={{ borderRadius: "8px", overflow: "hidden" }}
          className="border dark:border-gray-800 shadow"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </section>
    </div>
  );
}
