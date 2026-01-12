import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { DateRange, Input } from "src/components";
import SelectDropDown from "src/components/select";
import { PROJECTSTATUS } from "src/utils/enum";

interface ProjectDetailsProps {
  onValidate: (isValid: boolean, data?: any) => void; // Callback to inform parent about form validity and data
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-2 grow white-container">
      <div className="grid grid-cols-4 items-center">
        <p className="heading-3 mb-3 col-span-3">
          {t("labels.projectDetails")}
        </p>
        <div>
          <SelectDropDown
            name="status"
            removeBottomMargin
            size="large"
            options={Object.values(PROJECTSTATUS).map((i) => ({
              value: i,
              label: i,
            }))}
          />
        </div>
      </div>

      <p className="normal-text">
        {location.pathname.includes("update-project")
          ? t("project.updateProjectDesc")
          : t("project.createProjectDesc")}
      </p>

      <div className="flex flex-col gap-2">
        <Input
          label={t("labels.title")}
          name={"title"}
          size="middle"
          rules={[{ required: true, message: t("error.titleRequired") }]}
        />

        <Input
          label={t("labels.description")}
          name={"description"}
          size="large"
          padding={false}
          inputType="textArea"
          rules={[{ required: true, message: t("error.descriptionRequired") }]}
        />

        <DateRange
          label={t("labels.timeline")}
          name={"timeline"}
          size="large"
          disabledDate={(current) =>
            !!current && current.isBefore(dayjs().startOf("day"))
          }
          rules={[{ required: true, message: t("error.timeLineRequired") }]}
        />
      </div>
    </div>
  );
};
