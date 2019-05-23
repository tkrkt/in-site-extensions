import * as React from "react";
import { MdSearch as SearchIcon, MdCancel as ClearIcon } from "react-icons/md";

interface SubdomainBoxProps {
  includesSubDomain: boolean;
  onSubdomainVisibillityChange: (payload: { visible: boolean }) => void;
}

interface SearchProps {
  query: string;
  onChange: (payload: { query: string }) => void;
  onClear: () => void;
}

type Props = SubdomainBoxProps & SearchProps;

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

const SearchBox = ({ query, onChange, onClear }: SearchProps) => {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ query: e.currentTarget.value });
    },
    [onChange]
  );

  const handleClear = React.useCallback(() => {
    onClear();
  }, [onClear]);

  return (
    <div className="search">
      <SearchIcon className="search__icon search__icon--search" size="20" />
      <input
        className="search__input"
        placeholder="Find..."
        spellCheck={false}
        autoFocus={true}
        value={query}
        onChange={handleChange}
      />
      <ClearIcon
        className="search__icon search__icon--clear"
        size="20"
        onClick={handleClear}
      />
    </div>
  );
};

const Toolbar = (props: Props) => {
  return (
    <div className="toolbar">
      <SubdomainBox {...props} />
      <SearchBox {...props} />
    </div>
  );
};

export default Toolbar;
