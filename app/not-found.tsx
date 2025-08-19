import CenterLayout from "./components/center-layout";

export default function NotFound() {
  return (
    <CenterLayout>
      <p className="mr-5 pr-[23px] text-[24px] font-medium align-top leading-[49px] inline border-r-[1px] border-[#FFFFFF4d]">404</p>
      <p className="text-[14px] font-normal leading-[49px] m-0 inline">This page could not be found.</p>
    </CenterLayout>
  )
}