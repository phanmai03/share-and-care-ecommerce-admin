import { blockUser, unblockUser } from "@/app/api/user";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface BlockUserProps {
  id: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const BlockUser: React.FC<BlockUserProps> = ({ id, status, onStatusChange }) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    setEnabled(status === "blocked");
  }, [status]);

  const handleSwitch = async () => {
    if (userId && accessToken && typeof id === "string") {
      setLoading(true);

      try {
        let newStatus = status;
        if (enabled) {
          await unblockUser(id, userId, accessToken);
          newStatus = "active";
          toast.success("User unblocked successfully!");
        } else {
          await blockUser(id, userId, accessToken);
          newStatus = "blocked";
          toast.success("User blocked successfully!");
        }
        setEnabled(!enabled);
        onStatusChange(newStatus); // Call the onStatusChange prop to update the status in UserList
      } catch{
        toast.error("Failed to toggle user status.");
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
        className={`group inline-flex h-6 w-11 items-center rounded-full ${enabled ? "bg-red-600" : "bg-gray-200"} transition`}
      >
        <span className={`size-4 translate-x-1 rounded-full bg-white transition ${enabled ? "group-data-[checked]:translate-x-6" : ""}`} />
      </Switch>
      {loading && <p className="text-gray-500 text-sm">Updating user status...</p>}
    </div>
  );
};

export default BlockUser;
