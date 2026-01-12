import { Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton, Button, Step, Stepper } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import { projectLoading } from "src/store/selectors/features/project-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { PROJECTSTATUS } from "src/utils/enum";
import { ProjectDetails } from "./project-details";
import { ResourceAssignment } from "./resource-assignment";

interface Props {
  title: string;
}

export const CreateProject: React.FC<Props> = ({ title }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = useForm();
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState<null | string>(null);
  const isLoading = useSelector(projectLoading);
  const location = useLocation();
  const projectState = location.state?.data;

  useEffect(() => {
    if (projectState) {
      setProjectId(projectState?.id);
      form.setFieldsValue({
        timeline: [
          dayjs(projectState?.startDate),
          dayjs(projectState?.endDate),
        ],
        title: projectState?.name,
        description: projectState?.summary,
        status: projectState?.status,
      });
    } else {
      form.setFieldValue("status", PROJECTSTATUS.NOTSTARTED);
    }
  }, [projectState]);
  const [projectValues, setProjectValues] = useState<{
    timeline: any[];
    title: string;
    description: string;
    status?: PROJECTSTATUS;
  } | null>(null);
  // Steps management
  const [steps, setSteps] = useState<Step[]>([
    { title: "Project details", completed: false },
    { title: "Resource allocation (optional)", completed: false },
  ]);

  const [currentTab, setCurrentTab] = useState(0); // 0 = ProjectDetails, 1 = ResourceAssignment

  // Data state
  const [projectDetails, setProjectDetails] = useState(null);
  const [selectedResources, setSelectedResources] = useState<any>([]);

  // Mark step as complete
  const markStepComplete = (index: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: true } : step
      )
    );
  };

  // Handle project details validation and data from child component
  const handleProjectDetailsValidation = (isValid: boolean, data?: any) => {
    if (isValid) {
      setProjectDetails(data);
    }
  };

  // Move to the next step if project details are valid
  const handleContinue = () => {
    markStepComplete(0);
    setCurrentTab(1); // Move to ResourceAssignment
  };

  // Finalize project creation
  const handleCreateProject = () => {
    if (projectValues && !projectId) {
      const { timeline, title, description, status } = projectValues;

      dispatch(
        RequestAppAction.handleCreateProject({
          data: {
            endDate: timeline[1],
            name: title,
            summary: description,
            startDate: timeline[0],
            status: status,
            resourceEngagementIds: selectedResources?.map(
              (i: { engagementId: string }) => i.engagementId
            ),
          },
          cbSuccess: () => {
            navigate(ROUTES.PROJECT);
          },
        })
      );
    }
    if (projectId && projectValues) {
      const { timeline, title, description, status } = projectValues;
      dispatch(
        RequestAppAction.handleUpdateProject({
          id: projectId,
          data: {
            endDate: timeline[1],
            name: title,
            summary: description,
            startDate: timeline[0],
            status: status,
            resourceEngagementIds: selectedResources?.map(
              (i: { engagementId: string }) => i.engagementId
            ),
          },
          cbSuccess: () => {
            navigate(ROUTES.PROJECT);
          },
        })
      );
    }
  };

  const onFinish = (values: {
    timeline: any[];
    title: string;
    description: string;
    status: PROJECTSTATUS;
  }) => {
    if (currentTab === 0) {
      setProjectValues(values);
      handleContinue();
    } else {
      handleCreateProject();
    }
  };

  return (
    <Spin spinning={isLoading}>
      <PrivatePageTemplate
        title={title}
        description={
          projectState
            ? t("messages.updateProjectMessage")
            : t("messages.createNewProjectMessage")
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          name="createProject"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-row items-center justify-between mt-8">
            <BackButton
              onBack={() => {
                if (currentTab === 0) navigate(-1);
                else setCurrentTab(0);
              }}
            />
            <Button
              label={
                currentTab === 0
                  ? t("button.continue")
                  : projectId
                  ? t("button.updateProject")
                  : t("button.createProject")
              }
              btn_Type="submit"
            />
          </div>

          <div className="flex flex-row w-full gap-8">
            {/* Step 1: Project Details */}
            {currentTab === 0 && <ProjectDetails onValidate={handleContinue} />}

            {/* Step 2: Resource Assignment */}
            {currentTab === 1 && (
              <ResourceAssignment
                onFetchGetResources={() => {
                  setSelectedResources(projectState?.resources);
                }}
                selectionRows={selectedResources}
                onSelectionChange={(val: { engagementId: string }) => {
                  setSelectedResources((prev: any) => {
                    if (Array.isArray(prev) && prev?.length > 0) {
                      const exists = prev?.some(
                        (r: { engagementId: string }) =>
                          r?.engagementId === val?.engagementId
                      );
                      return exists
                        ? prev.filter(
                            (r: { engagementId: string }) =>
                              r?.engagementId !== val?.engagementId
                          )
                        : [...prev, { ...val }];
                    } else {
                      return [{ ...val }];
                    }
                  });
                }}
              />
            )}

            <div className="flex flex-col min-w-max max-h-min white-container">
              <Stepper currentStep={currentTab} steps={steps} />
            </div>
          </div>
        </Form>
      </PrivatePageTemplate>
    </Spin>
  );
};
