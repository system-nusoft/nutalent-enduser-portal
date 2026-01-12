import { Form, Spin, Tooltip } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchIconMini, UploadIcon, UploadMini } from "src/assets";
import { ROUTES } from "src/constants/navigation-routes";
import { elasticSearchLoading } from "src/store/selectors/features/elastic-search-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/utils/colors";
import Input from "../input";
import styles from "./styles.module.scss";

export const JDSearchInput: React.FC = () => {
  const [view, setView] = useState(0);
  const isLoading = useSelector(elasticSearchLoading);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const uploadRef = useRef<HTMLInputElement | null>(null); // using ref to upload jd file

  const handleOnClick = (query?: string) => {
    const searchVal = form.getFieldValue("jd");
    const state: { search: string } = { search: query || searchVal };
    navigate(ROUTES.HIRENOWRESOURCE + `?search=${state.search}`, {
      state: { data: state },
    }); //sending data in location param to reuse if needed
  };

  const onPressEnter = () => {
    // executing es search function on click
    const val = form.getFieldValue("jd");
    if (val && val?.length > 0) {
      // if search value exists
      handleOnClick(); // navigate to new resource with es data
    }
  };

  const onClickUploadJd = () => {
    uploadRef.current?.click();
  };

  const uploadFile = (val: FileList | null) => {
    if (val) {
      const file = val[0];
      const formData = new FormData();
      formData.append("file", file);

      dispatch(
        RequestAppAction.handlePostJDSearch({
          file: formData,
          cbSuccess: (res) => {
            if (uploadRef.current) uploadRef.current.value = ""; // clear state for 2nd use
            handleOnClick(res?.query); // navigate to new resource with es data
          },
          cbFailure: () => {
            if (uploadRef.current) uploadRef.current.value = ""; // clear state for 2nd use
          },
        })
      );
    }
  };
  return (
    <Form form={form}>
      <div className="bg-white rounded-xl p-2  border border-slate-200">
        <Input
          onPressEnter={onPressEnter}
          name="jd"
          suffix={
            <>
              {view === 0 ? (
                <>
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <span className="cursor-pointer" onClick={() => setView(1)}>
                      <UploadMini />
                    </span>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          }
          prefix={<SearchIconMini />}
          border={false}
          placeholder="Search talent or upload description"
        />
        {view === 1 && (
          <div
            className={`flex flex-col p-4 gap-4 justify-center items-center border border-slate-200 rounded-md ${
              styles.fade_in
            }  ${view === 1 ? styles.active : ""}`}
          >
            {isLoading ? (
              <div className="flex flex-col p-5 gap-4 justify-center items-center">
                <Spin size="large" />
                <span className={styles.desc_text}>
                  {t("labels.scanningDocument")}
                </span>
              </div>
            ) : (
              <>
                <input
                  style={{ display: "none" }}
                  className="hidden"
                  ref={uploadRef}
                  type="file"
                  multiple={false}
                  accept=".doc,.docx,.pdf, .txt"
                  onChange={(val) => {
                    const value = val.target.files;
                    uploadFile(value);
                  }}
                />
                <div
                  onClick={onClickUploadJd}
                  className=" border border-slate-200 rounded-md p-2 cursor-pointer shadow-md"
                >
                  <Tooltip color={colors.primary} title={t("labels.uploadJD")}>
                    <UploadIcon />
                  </Tooltip>
                </div>
                <div className={`w-1/2 text-center ${styles.desc_text}`}>
                  <span onClick={onClickUploadJd} className={styles.link_text}>
                    {t("labels.clickToUpload")}
                  </span>{" "}
                  {t("labels.orDragAndDrop")}
                  <br />
                  {t("labels.uploadTypes")}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Form>
  );
};
