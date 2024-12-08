import { publishProduct, unPublishProduct } from '@/app/api/product';
import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

interface PublishProductProps {
  id: Array<string> | string | undefined,
  status: string | undefined,
}

const PublishProduct: React.FC<PublishProductProps> = ({ id, status }) => {
  const [enabled, setEnabled] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  

  useEffect(() => {
    setEnabled(status === 'PUBLISHED');
  }, [status]);

  const handleSwitch = async () => {
    if (userId && accessToken && typeof id === 'string') {
      try {
        if (enabled) {
          await unPublishProduct(id, userId, accessToken);
          toast.success("Unpublished product successful!");
        } else {
          await publishProduct(id, userId, accessToken);
          toast.success("Published product successful!");
        }
        setEnabled(!enabled);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch {
        toast.error("Failed to toggle product status.");
      }
    }
  }

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      onClick={handleSwitch}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
    </Switch>
  )
}

export default PublishProduct;