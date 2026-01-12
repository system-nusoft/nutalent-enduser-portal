import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Info, Magnify } from "src/assets";
import { Input, Table } from "src/components";
import {
  getResourcesData,
  resourcesLoading,
} from "src/store/selectors/features/resources-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/utils/colors";

interface ResourceAssignmentProps {
  onSelectionChange: (selectedResources: any) => void; // Callback for selected resources
  selectionRows: any[];
  onFetchGetResources: () => void;
}

export const ResourceAssignment: React.FC<ResourceAssignmentProps> = ({
  onSelectionChange,
  selectionRows,
  onFetchGetResources,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const data = useSelector(getResourcesData);
  const isLoading = useSelector(resourcesLoading);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!initial) {
        fetchResources();
      } else {
        setInitial(false);
      }
    }, 1000);
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchValue]);

  const dispatch = useDispatch();

  const fetchResources = () => {
    const query = {
      search: searchValue,
    };

    dispatch(
      RequestAppAction.handleGetResourceEngagment({
        query,
        cbSuccess: () => {
          if (initial) {
            onFetchGetResources && onFetchGetResources(); // function to run just after resrouces are fetched
            setInitial(false);
          }
        },
      })
    );
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const columns: any = [
    {
      title: "Name",
      key: "resourceFirstName",
      dataIndex: "resourceFirstName",
      render: (
        name: string,
        record: { profilePicture: string; resourceLastName: string }
      ) => (
        <span className="ms-5">{name + " " + record?.resourceLastName}</span>
      ),
    },
    {
      title: "Job title",
      key: "resourceJobTitle",
      dataIndex: "resourceJobTitle",
    },
  ];

  return (
    <div className="flex flex-col gap-2 white-container w-full">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2 ">
          <p className="heading-3 flex items-center gap-2 justify-start">
            {t("heading.projectResources")}
            <Tooltip
              color={colors.tooltip}
              title={t("messages.onlyHiredResources")}
            >
              <Info />
            </Tooltip>
          </p>
          <p className="normal-text">{t("messages.projectResources")}</p>
        </div>
        <Input
          name="search"
          onChange={(val) => setSearchValue(val.target.value)}
          placeholder={t("placeholder.search")}
          prefix={<Magnify />}
          value={searchValue}
        />
      </div>
      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={Array?.isArray(data) ? data : []}
          pagination={false}
          staticHeight
          loading={isLoading}
          heightAdjuster={26}
          selection={true} // Enable row selection
          selectionRows={selectionRows}
          onSelectionChange={(selectedRows) => {
            onSelectionChange(selectedRows); // Pass selected rows to parent
          }}
        />
      </div>
    </div>
  );
};
