import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useRef } from "react"
import EksponatTable from "../../components/tables/EksponatTable"

export default function FormElements() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div>
      <PageMeta title="Muzey | Eksponatlar" description="Muzey | Eksponatla" />
      <PageBreadcrumb pageTitle="Eksponatlar" />
      <div className="my-6">
        <EksponatTable />
      </div>
    </div>
  )
}