// EksponatSeeModal.tsx (Takomillashtirilgan versiya)
// Ushbu faylda:
// - Building nomi buildings dan olinadi (ID emas, nomi ko'rsatiladi).
// - useAllBuildings ishlatib, building nomi topiladi.
// - Location string nomi bilan ko'rsatiladi (masalan: 'Asosiy, 1-qavat...').

"use client"

import { Button, Row, Col, Tag, Divider } from "antd"
import { Modal } from "../../ui/modal"
import type { ItemObject } from "../../../hooks/useCategoryandBuildings"
import { EditOutlined, EnvironmentOutlined } from "@ant-design/icons"
import { useLocations, useAllBuildings } from "../../../hooks/useCategoryandBuildings"; // Added useAllBuildings

interface Props {
  visible: boolean
  onClose: () => void
  data?: ItemObject
  onEdit?: () => void
  onDelete?: () => void
  onMove?: () => void
}

export default function ViewItemModal({ visible, onClose, data, onEdit, onMove }: Props) {
  const { data: locations = [] } = useLocations();
  const { data: buildings = [] } = useAllBuildings(); // Barcha buildinglarni olib, nomi uchun ishlatish
  if (!data) return null

  const statusColor: Record<string, string> = {
    Qoniqarli: "green",
    Qoniqarsiz: "orange",
    Yaroqsiz: "red",
    Faol: "blue",
  }

  // Fetch dynamic location based on category
  const currentLocation = locations.find((loc) => loc.category_id === data.category_id);

  // Building nomi topish
  const buildingName = buildings.find((b) => b.id === currentLocation?.building_id)?.name || 'Noma’lum';

  const locationString = currentLocation
    ? `${buildingName}, ${currentLocation.floor}-qavat, Xona-${currentLocation.room}, Vitrina-${currentLocation.showcase}, Polka-${currentLocation.polka}`
    : "Joylashuv topilmadi";

  return (
    <Modal
      title={data.name}
      isOpen={visible}
      onClose={onClose}
      isFullscreen={false}
      className="max-w-2xl p-6 max-h-[80vh] overflow-auto scroll-smooth"
    >
      {/* Two column layout */}
      <Row gutter={32} className="mb-6 mt-4">
        <Col span={12}>
          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">KP Raqam</div>
            <div className="text-[14px] font-semibold text-[#2563EC]">KP-{data.id}</div>
          </div>

          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">Kategoriya</div>
            {data.category && <div className="text-[14px] font-semibold dark:text-gray-400">{data.category?.name}</div>}
          </div>

          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">Material</div>
            <div className="text-sm font-semibold dark:text-gray-400">{data.material}</div>
          </div>

          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">Holat</div>
            <Tag color={statusColor[data.status] || "blue"} className="px-3 py-1 text-[12px]">
              {data.status}
            </Tag>
          </div>

          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">Qiymat</div>
            <div className="text-sm font-semibold dark:text-gray-400">{data.price} so'm</div>
          </div>
        </Col>

        <Col span={12}>
          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 mt-2 dark:text-gray-300">INV Raqam</div>
            <div className="text-sm font-semibold text-[#7c3aed]">INV-VI/01-001</div>
          </div>

          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">Qism kategoriya</div>
            <div className="text-sm font-semibold dark:text-gray-400">{data.fondType}</div>
          </div>

          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">Davr</div>
            <div className="text-sm font-semibold dark:text-gray-400">{data.period}</div>
          </div>

          <div className="mb-4">
            <div className="text-[12px] text-[#666] mb-1 dark:text-gray-300">Fond turi</div>
            <div className="text-sm font-semibold dark:text-gray-400">{data.fondType}</div>
          </div>
        </Col>
      </Row>

      <Divider />

      {/* Joylasuv - Location */}
      <div className="mb-6">
        <div className="text-[12px] text-[#666] mb-2 font-semibold dark:text-gray-300">Joylashuv</div>
        <div className="text-[13px text-[#000] dark:text-gray-400">{locationString}</div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <div className="text-[12px] text-[#666] mb-2 font-semibold dark:text-gray-300">Tavsif</div>
        <div className="text-[13px text-[#000] dark:text-gray-400">{data.description || 'Tavsif mavjud emas'}</div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-start pt-4">
        <Button type="primary" onClick={onEdit} style={{ padding: "6px 24px", backgroundColor: "#1890ff" }}>
          <EditOutlined /> Tahrirlash
        </Button>
        <Button
          onClick={onMove}
          style={{ padding: "6px 24px", backgroundColor: "#9c27b0", color: "white", border: "none" }}
        >
          <EnvironmentOutlined /> Ko'chirish
        </Button>
        <Button onClick={onClose} style={{ padding: "6px 24px" }}>
          Yopish
        </Button>
      </div>
    </Modal>
  )
}