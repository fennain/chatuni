import { NavBar as AntdNavBar } from "antd-mobile";

interface Props {
  backArrow?: boolean;
  onBack?: () => void;
}

const NavBar: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  backArrow = true,
  onBack,
}) => {
  return (
    <AntdNavBar
      className="desktop:hidden w-full h-[110px] text-[32px] font-bold bg-white shadow-md fixed top-0 left-0 z-50"
      backArrow={backArrow}
      onBack={onBack}
    >
      {children}
    </AntdNavBar>
  );
};

export default NavBar;
