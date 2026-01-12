import { Radio, Spin } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Magnify } from "src/assets";
import { colors } from "src/utils/colors";
import Input from "../input";

interface props {
  placeholder?: string;
  onSearch?: (val: string) => void;
  size?: "small" | "middle" | "large"; // New size prop
  loading?: boolean;
  filters?: {
    id: number;
    value: string;
    onClick: (val?: any) => void;
    label: string;
  }[];
  fullInputWidth?: boolean;
}

export const TableSearch = ({
  onSearch,
  placeholder,
  size,
  loading,
  filters,
  fullInputWidth,
}: props) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [initial, setInitial] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(0);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!initial) {
        if (onSearch) onSearch(searchValue);
      }
      setInitial(false);
    }, 800);
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchValue]);

  useEffect(() => {
    if (filters) {
      setSelectedFilter(0);
    }
  }, [window.location.hash]);

  return (
    <div className="bg-white p-2 rounded-xl">
      <div
        className={`grid grid-cols-4 gap-2 ${filters ? "justify-between" : ""}`}
      >
        <span className="col-span-3 flex items-center">
          {filters ? (
            <>
              <Radio.Group value={selectedFilter} size="large">
                {filters?.map(({ id, value, onClick, label }) => (
                  <Radio.Button
                    key={`${id}`}
                    onClick={() => (onClick(value), setSelectedFilter(id))}
                    style={{
                      color:
                        selectedFilter === id ? colors.white : colors.primary,
                    }}
                    value={id}
                  >
                    {label
                      ? label?.charAt(0)?.toUpperCase() +
                        label.split(label?.charAt(0))[1]?.toLowerCase()
                      : ""}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </>
          ) : (
            <></>
          )}
        </span>
        <span className={` ${fullInputWidth ? "col-span-12" : "col-span-1"}`}>
          <Input
            size={size}
            name="search"
            onChange={(val) => setSearchValue(val.target.value)}
            placeholder={placeholder ?? t("placeholder.search")}
            prefix={<Magnify />}
            suffix={loading ? <Spin /> : undefined}
          />
        </span>
      </div>
    </div>
  );
};
