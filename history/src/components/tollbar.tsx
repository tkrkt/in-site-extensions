import * as React from "react";
import { MdSearch as SearchIcon, MdCancel as ClearIcon } from "react-icons/md";

interface SubdomainBoxProps {
  includesSubDomain: boolean;
  onSubdomainVisibillityChange: (payload: { visible: boolean }) => void;
}

type Props = SubdomainBoxProps;

const SubdomainBox = ({
  includesSubDomain,
  onSubdomainVisibillityChange
}: SubdomainBoxProps) => {
  const handleChange = React.useCallback(() => {
    onSubdomainVisibillityChange({ visible: !includesSubDomain });
  }, [includesSubDomain, onSubdomainVisibillityChange]);

  return (
    <label className="subdomain">
      <input
        className="subdomain__checkbox"
        type="checkbox"
        checked={includesSubDomain}
        onChange={handleChange}
      />
      {"includes subdomain"}
    </label>
  );
};

const Toolbar = (props: Props) => {
  return (
    <div className="toolbar">
      <SubdomainBox {...props} />
    </div>
  );
};

export default Toolbar;
