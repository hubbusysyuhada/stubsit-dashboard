import { BaseEndpointType } from "@/types/global";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import MethodBadge from "./method";
import { PiBracketsCurlyDuotone as APIIcon } from "react-icons/pi";

export default function Menu(payload: BaseEndpointType) {
  const router = useRouter();
  const params = useParams()
  const { endpoint, call } = params

  const isEndpointActive = useMemo(() => {
    if (call) return false
    return endpoint === payload.slug;
  }, [endpoint, call, payload.slug]);

  const activedCallNav = useMemo(() => {
    if (!call || endpoint !== payload.slug) return null
    return payload.calls.find(c => c.slug === call)?.slug;
  }, [endpoint, call, payload.slug, payload.calls]);

  const renderUrl = (callUrl: string) => {
    return `${window.location.host}/api/${payload.slug}/${callUrl}`
  }

  const renderSubMenu = () => {
    if (endpoint !== payload.slug) return <></>;
    return payload.calls.map((call, index) =>
      <div className={`flex ml-9 mt-2 cursor-pointer px-3 py-2 rounded-lg nav ${activedCallNav === call.slug ? 'active' : ''}`} key={`${payload.slug}-${index}`} onClick={() => router.push(`/${payload.slug}/${call.slug}`)}>
        <MethodBadge type={call.method} />
        <p className="ml-3 text-xs truncate">{renderUrl(call.slug)}</p>
      </div>
    )
  }

  return <div className="nav-dropdown">
    <div className="head">
      <div className={`flex items-center mt-3 cursor-pointer px-3 py-2 rounded-lg nav ${isEndpointActive ? 'active' : ''}`} onClick={() => router.push(`/${payload.slug}`)}>
        <APIIcon className="text-sm" />
        <p className="ml-2 text-sm truncate">{payload.name}</p>
      </div>
    </div>
    <div className={`content ${isEndpointActive || activedCallNav ? 'open' : ''}`}>
      {renderSubMenu()}
    </div>
  </div>
}