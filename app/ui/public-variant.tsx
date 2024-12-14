import { publicAllVariant, unPublicAlllVariant } from "@/app/api/variant";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface VariantSwitchProps {
  id: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const VariantSwitch: React.FC<VariantSwitchProps> = ({ id, status, onStatusChange }) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    setEnabled(status === "published");
  }, [status]);

  const handleSwitch = async () => {
    if (userId && accessToken && typeof id === "string") {
      setLoading(true);

      try {
        let newStatus = status;
        if (enabled) {
          await unPublicAlllVariant(id, userId, accessToken);
          newStatus = "unpublished";
          toast.success("Variants unpublished successfully!");
        } else {
          await publicAllVariant(id, userId, accessToken);
          newStatus = "published";
          toast.success("Variants published successfully!");
        }
        setEnabled(!enabled);
        onStatusChange(newStatus); // Call the onStatusChange prop to update the status
      } catch {
        toast.error("Failed to toggle variant status.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        onClick={handleSwitch}
        disabled={loading}
        className={`group inline-flex h-6 w-11 items-center rounded-full ${enabled ? "bg-green-600" : "bg-gray-200"} transition`}
      >
        <span className={`size-4 translate-x-1 rounded-full bg-white transition ${enabled ? "group-data-[checked]:translate-x-6" : ""}`} />
      </Switch>
      {loading && <p className="text-gray-500 text-sm">Updating variant status...</p>}
    </div>
  );
};

export default VariantSwitch;
