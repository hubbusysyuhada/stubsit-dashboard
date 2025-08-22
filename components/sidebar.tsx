'use client'

import Logo from '@/components/logo'
import { CiSearch } from 'react-icons/ci'
import { FaRegCircleXmark as Cancel } from "react-icons/fa6";
import { PiBracketsCurlyDuotone as APIIcon, PiFolderFill as FolderIcon } from "react-icons/pi";
import { Input, Button, Skeleton, ButtonGroup } from '@mui/joy'
import Menu from './menu'
import { useEffect, useState } from 'react'
import useNavigation from '@/store/useNavigation';
import CreateEndpointDrawer from './createEndpointDrawer'
import { useRouter } from 'next/navigation'
import { AllGroupResponse } from '@/types/global'
import useDebounce from '@/helpers/useDebounce'
import CreateGroupDrawer from './createGroupDrawer';

export default function SidebarLayout() {
  const router = useRouter()
  const { groups: storeGroups, isGroupsLoaded, fetchGroups, getFilteredGroups } = useNavigation()
  const [groups, setGroups] = useState<AllGroupResponse>([])
  const [openCreatEndpointDrawer, setOpenCreateEndpointDrawer] = useState(false)
  const [openCreatGroupDrawer, setOpenCreateGroupDrawer] = useState(false)

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    setGroups(storeGroups)
  }, [storeGroups])

  useEffect(() => {
    setGroups(getFilteredGroups(debouncedKeyword))
  }, [debouncedKeyword, getFilteredGroups]);

  const renderMenu = () => {
    if (!groups.length && !isGroupsLoaded) return Array.from({ length: 5 }).map((_, index) => (
      <div className="w-full mt-4 h-[36px] rounded-lg relative" key={index}>
        <Skeleton loading animation="wave"/>
      </div>
    ))
    return groups?.map((group, index) => <Menu {...group} key={'menu-' + index} />)
  }

  return (
    <>
      <div id="sidebar" className="flex flex-col justify-between pb-9 relative !w-[360px] !min-w-[360px] px-4">
        <div>
          <div className='relative w-[150px] h-[80px] icon hover:cursor-pointer' onClick={() => router.push('/')}>
            <Logo />
          </div>
          <div className="searchbar">
            <Input
              placeholder="Search Endpoints"
              variant="soft"
              startDecorator={<CiSearch />}
              endDecorator={keyword ? <Cancel onClick={() => setKeyword('')} className="hover:cursor-pointer" /> : null}
              className="my-4"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <div className="menu max-h-[calc(100vh-280px)] overflow-y-auto">
            {renderMenu()}
          </div>
        </div>

        <div className="footer">
          <ButtonGroup>
            <Button
              color="neutral"
              onClick={() => setOpenCreateGroupDrawer(true)}
              variant="solid"
              className='w-full primary'
              startDecorator={<FolderIcon />}
            >
              New Group
            </Button>
            <Button
              color="neutral"
              onClick={() => setOpenCreateEndpointDrawer(true)}
              variant="solid"
              className='w-full primary'
              startDecorator={<APIIcon />}
            >
              New Endpoint
            </Button>
            
          </ButtonGroup>
          <div className="flex justify-center mt-3">
            <p className="text-xs">© 2025 Hubbusysyuhada</p>
          </div>
        </div>
      </div>

      <CreateEndpointDrawer open={openCreatEndpointDrawer} onClose={() => setOpenCreateEndpointDrawer(false)} />
      <CreateGroupDrawer open={openCreatGroupDrawer} onClose={() => setOpenCreateGroupDrawer(false)} />
    </>
  )
}