import { BaseEndpointType, GroupDetailType } from '@/types/global';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import MethodBadge from './method';
import { PiBracketsCurlyDuotone as APIIcon, PiFolderFill as FolderIcon } from 'react-icons/pi';
import { useRouter } from 'next/router';

export default function Menu(payload: GroupDetailType) {
  const router = useRouter();
  const params = useParams();
  const { endpoint, call, group } = params;

  const isGroupActive = useMemo(() => {
    if (endpoint || call) return false;
    return group === payload.slug;
  }, [endpoint, call, group, payload.slug]);

  const isGroupOpen = useMemo(() => {
    return group === payload.slug;
  }, [endpoint, call, group, payload.slug]);

  const renderUrl = (callUrl: string) => {
    return `${window.location.host}/api/${payload.slug}/${callUrl}`;
  };

  const renderCalls = (e: BaseEndpointType) => {
    return e.calls.map((c) => {
      const isCallActive = call === c.slug;
      return (
        <div
          className={`flex ml-9 mt-2 cursor-pointer px-3 py-2 rounded-lg nav ${isCallActive ? 'active' : ''}`}
          onClick={() => router.push(`/${payload.slug}/${e.slug}/${c.slug}`)}
          key={`${payload.slug}-${e.slug}-${c.slug}`}
        >
          <MethodBadge type={c.method} />
          <p className="ml-3 text-xs truncate">{renderUrl(c.slug)}</p>
        </div>
      );
    });
  };

  const renderEndpoints = () => {
    if (group !== payload.slug) return <></>;
    return payload.endpoints.map((e, index) => {
      const isEndpointOpen = isGroupOpen && endpoint === e.slug;
      const isEndpointActive = isEndpointOpen && !call;
      return (
        <div key={`${payload.slug}-${e.slug}`}>
          <div
            className={`flex ml-5 items-center mt-2 cursor-pointer px-3 py-2 rounded-lg nav ${isEndpointActive ? 'active' : ''}`}
            onClick={() => router.push(`/${payload.slug}/${e.slug}`)}
          >
            <APIIcon className="text-sm" />
            <p className="ml-2 text-sm truncate">{e.name}</p>
          </div>
          <div className={`content calls ${isEndpointOpen ? 'open' : ''}`}>{renderCalls(e)}</div>
        </div>
      );
    });
  };

  return (
    <div className="nav-dropdown">
      <div className="head">
        <div
          className={`flex items-center mt-3 cursor-pointer px-3 py-2 rounded-lg nav ${isGroupActive ? 'active' : ''}`}
          onClick={() => router.push(`/${payload.slug}`)}
        >
          <FolderIcon className="text-sm" />
          <p className="ml-2 text-sm truncate">{payload.name}</p>
        </div>
      </div>
      <div className={`content endpoints ${isGroupOpen ? 'open' : ''}`}>{renderEndpoints()}</div>
    </div>
  );
}
